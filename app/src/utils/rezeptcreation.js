import ConfigService from "@/services/ConfigService";
import PraxisService from "@/services/dbServices/PraxisService";
import { roundToMinutes } from "@/utils/dates";

const milliSecondsPerMinute = 1000 * 60;
const milliSecondsPerDay = milliSecondsPerMinute * 60 * 24;

/**
 * Function to create terminvorschläge
 * @Params
 * - Therapeuten: [{name, Heilmittels, Vertrag: {montagsZeit, ...}, ...}]
 * - RezeptHeilmittel: [{terminNumber, Heilmittel: {terminMinutes, abk, name, ...}}]
 * - dringend: Boolean
 * - ausstellungsDatum: Date
 * - Zeiten: { montag, dienstag, mittwoch, donnerstag, freitag }
 * - allowOutsideOpeningHours
 * - allowOutsideWorkHours
 * @Returns an object of arrays
 * {HeilmittelAbk: [
 *   {
 *     date: Date,
 *     Therapeut: Object,
 *     TherapeutId: String,
 *     Heilmittel: Object,
 *     HeilmittelId: String,
 *     selected: Boolean
 *   }
 * ]}
 */
export function generateVorschläge(
  therapeutList,
  rezeptHeilmittelList,
  dringend,
  ausstellungsdatum,
  { montag, dienstag, mittwoch, donnerstag, freitag } = {},
  allowOutsideOpeningHours,
  allowOutsideWorkHours
) {
  const praxisQuery = PraxisService.getOne(ConfigService.getPraxis(), {
    include: { all: true },
  });
  return Promise.all([praxisQuery]).then(([praxis]) => {
    const result = {};
    for (const rhm of rezeptHeilmittelList) {
      const tList = therapeutList.filter((t) =>
        t.Heilmittels.some((thm) => thm.id == rhm.HeilmittelId)
      );
      let heilmittelTerminList = [];
      if (!tList.length == 0) {
        heilmittelTerminList = vorschlägeForHeilmittel(
          rhm,
          therapeutList,
          dringend,
          ausstellungsdatum,
          { montag, dienstag, mittwoch, donnerstag, freitag },
          allowOutsideOpeningHours,
          praxis,
          allowOutsideWorkHours
        );
      }
      result[rhm.Heilmittel.abk] = heilmittelTerminList;
    }
    return result;
  });
}

const SearchMinuteStep = 5;
const MaxDatesPerDay = 4;

function vorschlägeForHeilmittel(
  rezeptHeilmittel,
  therapeutList,
  dringend,
  ausstellungsdatum,
  { montag, dienstag, mittwoch, donnerstag, freitag } = {},
  allowOutsideOpeningHours,
  openingHours,
  allowOutsideWorkHours
) {
  const vorschläge = {};

  const tList = therapeutList.filter((th) =>
    th.Heilmittels.some((thhm) => thhm.id == rezeptHeilmittel.HeilmittelId)
  );

  for (let therapeut of tList) {
    const workHours = therapeut.Vertrag;
    const terminList = therapeut.Termins;

    let currentSearchDate = new Date(
      Math.max(roundToMinutes(new Date(), 5), new Date(ausstellungsdatum))
    );

    const thTerminList = [];
    const terminNumberGoal = rezeptHeilmittel.terminNumber * MaxDatesPerDay;
    let terminJustFound = false;

    while (thTerminList.length < terminNumberGoal) {
      // console.count("while-loop vorschlägeForHeilmittel");

      const foundDate = searchNextPossibleDate(
        currentSearchDate,
        terminJustFound,
        workHours,
        openingHours,
        [...terminList, ...thTerminList],
        allowOutsideOpeningHours,
        allowOutsideWorkHours,
        thTerminList,
        rezeptHeilmittel.Heilmittel.terminMinutes,
        { montag, dienstag, mittwoch, donnerstag, freitag }
      );
      if (!foundDate) {
        console.log("Breaking because foundDate was", foundDate);
        break;
      } else {
        currentSearchDate = foundDate;
        const firstThatDay =
          thTerminList.filter((t) => {
            const tValue = t.date.valueOf();
            const t0 = new Date(tValue).setHours(0, 0, 0, 0).valueOf();
            const cValue = currentSearchDate.valueOf();
            const c0 = new Date(cValue).setHours(0, 0, 0, 0).valueOf();
            return t0 == c0;
          }).length == 0;
        const selectedNumberNotReached =
          thTerminList.filter((t) => t.selected).length <=
          rezeptHeilmittel.terminNumber;
        thTerminList.push({
          date: currentSearchDate,
          Therapeut: therapeut,
          TherapeutId: therapeut.id,
          Heilmittel: rezeptHeilmittel.Heilmittel,
          HeilmittelId: rezeptHeilmittel.HeilmittelId,
          selected: firstThatDay && selectedNumberNotReached,
        });
        terminJustFound = true;
      }
    }

    vorschläge[therapeut.name.split(" ")[0]] = {
      thSelected: tList.indexOf(therapeut) == 0,
      thTerminList,
    };
  }

  return vorschläge;
}

/**
 * Function to find the best possible next search date
 * @Params
 * - (?) terminMinutes
 * - currentSearchDate
 * - workHours
 * - openingHours
 * - allTerminsInQuestion
 * - allowOutsideOpeningHours
 * - allowOutsideWorkHours
 * @Returns a date to continue the search
 */
export function searchNextPossibleDate(
  currentSearchDate,
  terminJustFound,
  workHours,
  openingHours,
  terminList,
  allowOutsideOpeningHours,
  allowOutsideWorkHours,
  foundDates,
  terminMinutes,
  { montag, dienstag, mittwoch, donnerstag, freitag } = {}
) {
  let currentSlotBlocked = true;
  let count = 0;
  while (currentSlotBlocked && count < 999) {
    count++;

    // console.count("while-loop searchNextPossibleDate");

    // Skip terminMinutes if termin was just found
    if (terminJustFound && count == 1) {
      currentSearchDate = new Date(
        currentSearchDate.valueOf() + terminMinutes * milliSecondsPerMinute
      );
    }
    // Add SearchMinuteStep minutes
    else {
      let addedMs = SearchMinuteStep * milliSecondsPerMinute;
      currentSearchDate = new Date(currentSearchDate.valueOf() + addedMs);
    }

    // Checking for allowOutsideOpeningHours and openingHours and skip to next day
    let relevantOpeningHours = getRelevantHoursPerDay(
      currentSearchDate,
      openingHours,
      { montag, dienstag, mittwoch, donnerstag, freitag }
    );

    if (!allowOutsideOpeningHours) {
      let skipToNextDay = false;
      let skipToOpen = false;
      if (relevantOpeningHours == null) skipToNextDay = true;
      else {
        relevantOpeningHours = {
          start: new Date(currentSearchDate.valueOf()).setHours(
            new Date(relevantOpeningHours.start).getHours(),
            new Date(relevantOpeningHours.start).getMinutes(),
            0,
            0
          ),
          end: new Date(currentSearchDate.valueOf()).setHours(
            new Date(relevantOpeningHours.end).getHours(),
            new Date(relevantOpeningHours.end).getMinutes(),
            0,
            0
          ),
        };

        const currentSearchDateBeforeOpeningHours =
          currentSearchDate < relevantOpeningHours?.start;
        const currentSearchDateAfterOpeningHours =
          new Date(
            currentSearchDate.valueOf() + terminMinutes * milliSecondsPerMinute
          ) > relevantOpeningHours?.end;

        if (currentSearchDateAfterOpeningHours) skipToNextDay = true;
        if (currentSearchDateBeforeOpeningHours) skipToOpen = true;
      }
      if (skipToNextDay || skipToOpen) {
        const tomorrow = new Date(
          currentSearchDate.valueOf() + (skipToOpen ? 0 : milliSecondsPerDay)
        );
        const openingHoursTomorrow = getRelevantHoursPerDay(
          tomorrow,
          openingHours,
          { montag, dienstag, mittwoch, donnerstag, freitag }
        );
        if (openingHoursTomorrow) {
          const openingTomorrow = new Date(openingHoursTomorrow.start);
          const currentSearchMs =
            tomorrow.setHours(
              openingTomorrow.getHours(),
              openingTomorrow.getMinutes(),
              0,
              0
            ) -
            SearchMinuteStep * milliSecondsPerMinute;

          currentSearchDate = new Date(currentSearchMs);
        } else {
          currentSearchDate = new Date(tomorrow.setHours(0, 0, 0, 0));
        }
        continue;
      }
    }

    // Checking for allowOutsideWorkHours and workHours and skip to next day
    let relevantWorkHours = getRelevantHoursPerDay(
      currentSearchDate,
      workHours,
      { montag, dienstag, mittwoch, donnerstag, freitag }
    );

    if (!allowOutsideWorkHours) {
      let skipToNextDay = false;
      let skipToOpen = false;
      if (relevantWorkHours == null) skipToNextDay = true;
      else {
        relevantWorkHours = {
          start: new Date(currentSearchDate.valueOf()).setHours(
            new Date(relevantWorkHours.start).getHours(),
            new Date(relevantWorkHours.start).getMinutes(),
            0,
            0
          ),
          end: new Date(currentSearchDate.valueOf()).setHours(
            new Date(relevantWorkHours.end).getHours(),
            new Date(relevantWorkHours.end).getMinutes(),
            0,
            0
          ),
        };

        const currentSearchDateBeforeWorkHours =
          currentSearchDate < relevantWorkHours?.start;
        const currentSearchDateAfterWorkHours =
          currentSearchDate + terminMinutes * milliSecondsPerMinute >
          relevantWorkHours?.end;

        if (currentSearchDateAfterWorkHours) skipToNextDay = true;
        if (currentSearchDateBeforeWorkHours) skipToOpen = true;
      }
      if (skipToNextDay || skipToOpen) {
        const tomorrow = new Date(
          currentSearchDate.valueOf() + (skipToOpen ? 0 : milliSecondsPerDay)
        );
        const workHoursTomorrow = getRelevantHoursPerDay(tomorrow, workHours, {
          montag,
          dienstag,
          mittwoch,
          donnerstag,
          freitag,
        });
        if (workHoursTomorrow) {
          const workingTomorrow = new Date(workHoursTomorrow.start);
          const currentSearchMs =
            tomorrow.setHours(
              workingTomorrow.getHours(),
              workingTomorrow.getMinutes(),
              0,
              0
            ) -
            SearchMinuteStep * milliSecondsPerMinute;

          currentSearchDate = new Date(currentSearchMs);
        } else {
          currentSearchDate = new Date(tomorrow.setHours(0, 0, 0, 0));
        }
        continue;
      }
    }

    // Skipping to tomorrow if MaxDatesPerDay is reached
    const numberOfNewDatesToday = foundDates.filter((t) => {
      const tValue = t.date.valueOf();
      const t0 = new Date(tValue).setHours(0, 0, 0, 0).valueOf();
      const cValue = currentSearchDate.valueOf();
      const c0 = new Date(cValue).setHours(0, 0, 0, 0).valueOf();
      return t0 == c0;
    }).length;
    if (numberOfNewDatesToday >= MaxDatesPerDay) {
      currentSearchDate = new Date(
        new Date(currentSearchDate.valueOf() + milliSecondsPerDay).setHours(
          0,
          0,
          0,
          0
        )
      );
      continue;
    }

    // return the currentStateDate if the current slot is not blocked
    currentSlotBlocked = terminList.some(
      (t) =>
        t.start <= currentSearchDate &&
        t.start + t.minutes * milliSecondsPerMinute >= currentSearchDate
    );

    if (!currentSlotBlocked) {
      break;
    }
  }

  return !currentSlotBlocked ? currentSearchDate : null;
}

export function getRelevantHoursPerDay(
  currentSearchDate,
  hours,
  { montag, dienstag, mittwoch, donnerstag, freitag }
) {
  const week = [
    null,
    selectRelevantTimes(currentSearchDate, hours.montagsZeit, montag),
    selectRelevantTimes(currentSearchDate, hours.dienstagsZeit, dienstag),
    selectRelevantTimes(currentSearchDate, hours.mittwochsZeit, mittwoch),
    selectRelevantTimes(currentSearchDate, hours.donnerstagsZeit, donnerstag),
    selectRelevantTimes(currentSearchDate, hours.freitagsZeit, freitag),
    null,
  ];
  return week[currentSearchDate.getDay()];
}

function selectRelevantTimes(currentSearchDate, hoursDay, timefilter) {
  if (timefilter == true) hoursDay;
  else if (timefilter == false) return null;
  else {
    const [startHours, startMinutes, startSeconds] =
      timefilter.start.split(":");
    const [endHours, endMinutes, endSeconds] = timefilter.end.split(":");
    return {
      start: new Date(currentSearchDate).setHours(
        startHours,
        startMinutes,
        startSeconds
      ),
      end: new Date(currentSearchDate).setHours(
        endHours,
        endMinutes,
        endSeconds
      ),
    };
  }
  return hoursDay;
}
