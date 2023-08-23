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
 * - options: {
 *    nTermine: overwrite how many Termine are generated (default: null)
 * }
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
  allowOutsideWorkHours,
  { nTermine = null, preSelect = true } = {}
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
          allowOutsideWorkHours,
          { nTermine, preSelect }
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
  allowOutsideWorkHours,
  options
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
    const terminNumberGoal =
      options.nTermine ||
      rezeptHeilmittel.terminNumber * MaxDatesPerDay * (dringend ? 4 : 1);
    let terminJustFound = false;

    while (thTerminList.length < terminNumberGoal) {
      // console.count("while-loop vorschlägeForHeilmittel");

      const [foundDate, metaData] = searchNextPossibleDate(
        currentSearchDate,
        terminJustFound,
        workHours,
        openingHours,
        [...terminList, ...thTerminList],
        allowOutsideOpeningHours,
        allowOutsideWorkHours,
        thTerminList,
        rezeptHeilmittel.Heilmittel.terminMinutes,
        !options.preSelect && thTerminList.length == 0,
        dringend,
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
          thTerminList.filter((t) => t.selected).length <
          rezeptHeilmittel.terminNumber;
        thTerminList.push(
          Object.assign(
            {
              date: currentSearchDate,
              Therapeut: therapeut,
              TherapeutId: therapeut.id,
              Heilmittel: rezeptHeilmittel.Heilmittel,
              HeilmittelId: rezeptHeilmittel.HeilmittelId,
              selected:
                options.preSelect && firstThatDay && selectedNumberNotReached,
            },
            metaData
          )
        );
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
 * - foundDates
 * - terminMinutes
 * - skipToNextDay
 * - dringend
 * - timerFilters
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
  skipToNextDay,
  dringend,
  { montag, dienstag, mittwoch, donnerstag, freitag } = {}
) {
  let currentSlotBlocked = true;
  let count = 0;
  let options = {};
  const skipFactor = dringend ? 1 : 4;
  const MaxDatesPerDayHere = MaxDatesPerDay * (dringend ? 4 : 1);

  while (currentSlotBlocked && count < 9999) {
    if (count == 1) skipToNextDay = false;
    count++;
    options = {
      outsideOpeningHours: false,
      outsideWorkHours: false,
    };

    // console.count("while-loop searchNextPossibleDate");

    // Skip terminMinutes if termin was just found
    if (terminJustFound && count == 1) {
      const addMs = skipFactor * terminMinutes * milliSecondsPerMinute;
      currentSearchDate = new Date(currentSearchDate.valueOf() + addMs);
    }
    // Add SearchMinuteStep minutes
    else {
      let addedMs = SearchMinuteStep * milliSecondsPerMinute;
      currentSearchDate = new Date(currentSearchDate.valueOf() + addedMs);
    }

    // Checking for the filterTimes
    let isOutsideFilter = false;
    let foundNewSlot = null;
    // eslint-disable-next-line no-unused-vars
    [foundNewSlot, isOutsideFilter] = skipToNextTimeslot(
      currentSearchDate,
      filterHoursToSchedule({
        montag,
        dienstag,
        mittwoch,
        donnerstag,
        freitag,
      }),
      terminMinutes
    );
    if (isOutsideFilter) {
      // console.log(
      //   "Skipping (isOutsideFilter)",
      //   foundNewSlot.toLocaleString("de")
      // );
      currentSearchDate = foundNewSlot;
      continue;
    }

    // Checking for allowOutsideOpeningHours and openingHours and skip to next day
    let isOutsideOpeningHours = false;
    foundNewSlot = null;
    [foundNewSlot, isOutsideOpeningHours] = skipToNextTimeslot(
      currentSearchDate,
      openingHours,
      terminMinutes
    );
    if (!allowOutsideOpeningHours) {
      if (isOutsideOpeningHours) {
        // console.log(
        //   "Skipping (isOutsideOpeningHours)",
        //   foundNewSlot.toLocaleString("de")
        // );
        currentSearchDate = foundNewSlot;
        continue;
      }
    } else if (isOutsideOpeningHours) options.outsideOpeningHours = true;

    // Checking for allowOutsideWorkHours and workHours and skip to next day
    let isOutsideWorkHours = false;
    foundNewSlot = null;
    [foundNewSlot, isOutsideWorkHours] = skipToNextTimeslot(
      currentSearchDate,
      workHours,
      terminMinutes
    );
    if (!allowOutsideWorkHours) {
      if (isOutsideWorkHours) {
        // console.log(
        //   "Skipping (isOutsideWorkHours)",
        //   foundNewSlot.toLocaleString("de")
        // );
        currentSearchDate = foundNewSlot;
        continue;
      }
    } else if (isOutsideWorkHours) options.outsideWorkHours = true;

    // Skipping to tomorrow if MaxDatesPerDay is reached
    const numberOfNewDatesToday = foundDates.filter((t) => {
      const tValue = t.date.valueOf();
      const t0 = new Date(tValue).setHours(0, 0, 0, 0).valueOf();
      const cValue = currentSearchDate.valueOf();
      const c0 = new Date(cValue).setHours(0, 0, 0, 0).valueOf();
      return t0 == c0;
    }).length;
    if (numberOfNewDatesToday >= MaxDatesPerDayHere || skipToNextDay) {
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

  return [!currentSlotBlocked ? currentSearchDate : null, options];
}

export function getRelevantHoursPerDay(currentSearchDate, hours) {
  const week = [
    null,
    hours.montagsZeit,
    hours.dienstagsZeit,
    hours.mittwochsZeit,
    hours.donnerstagsZeit,
    hours.freitagsZeit,
    null,
  ];
  return week[currentSearchDate.getDay()];
}

function filterHoursToSchedule({
  montag,
  dienstag,
  mittwoch,
  donnerstag,
  freitag,
}) {
  return {
    montagsZeit: filterDayToZeitspanne(montag),
    dienstagsZeit: filterDayToZeitspanne(dienstag),
    mittwochsZeit: filterDayToZeitspanne(mittwoch),
    donnerstagsZeit: filterDayToZeitspanne(donnerstag),
    freitagsZeit: filterDayToZeitspanne(freitag),
  };
}

function filterDayToZeitspanne(timefilter) {
  if (timefilter == true)
    return {
      start: new Date().setHours(0, 0, 0, 0),
      end: new Date().setHours(23, 59, 59, 999),
    };
  else if (timefilter == false) return null;
  else return timefilter;
}

export function skipToNextTimeslot(currentSearchDate, hours, terminMinutes) {
  let skipped = false;

  let relevantHours = getRelevantHoursPerDay(currentSearchDate, hours);

  let skipToNextDay = false;
  let skipToOpen = false;
  if (relevantHours == null) skipToNextDay = true;
  else {
    relevantHours = {
      start: new Date(currentSearchDate.valueOf()).setHours(
        new Date(relevantHours.start).getHours(),
        new Date(relevantHours.start).getMinutes(),
        0,
        0
      ),
      end: new Date(currentSearchDate.valueOf()).setHours(
        new Date(relevantHours.end).getHours(),
        new Date(relevantHours.end).getMinutes(),
        0,
        0
      ),
    };

    skipToOpen = currentSearchDate < relevantHours?.start;
    skipToNextDay =
      new Date(
        currentSearchDate.valueOf() + terminMinutes * milliSecondsPerMinute
      ) > relevantHours?.end;
  }

  if (skipToNextDay || skipToOpen) {
    const tomorrow = new Date(
      currentSearchDate.valueOf() + (skipToOpen ? 0 : milliSecondsPerDay)
    );
    const relevantHoursTomorrow = getRelevantHoursPerDay(tomorrow, hours);
    if (relevantHoursTomorrow) {
      const hoursTomorrow = new Date(relevantHoursTomorrow.start);
      const currentSearchMs =
        tomorrow.setHours(
          hoursTomorrow.getHours(),
          hoursTomorrow.getMinutes(),
          0,
          0
        ) -
        SearchMinuteStep * milliSecondsPerMinute;

      currentSearchDate = new Date(currentSearchMs);
    } else {
      currentSearchDate = new Date(tomorrow.setHours(0, 0, 0, 0));
    }
    skipped = true;
  }

  return [currentSearchDate, skipped];
}
