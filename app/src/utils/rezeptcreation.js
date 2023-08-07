import ConfigService from "@/services/ConfigService";
import PraxisService from "@/services/dbServices/PraxisService";
import TerminService from "@/services/dbServices/TerminService";
import { roundToMinutes } from "@/utils/dates";

const milliSecondsPerMinute = 1000 * 60;
const milliSecondsPerDay = milliSecondsPerMinute * 60 * 24;

export function generateVorschläge(
  rezeptHeilmittel,
  preSelect,
  ausstellungsdatum,
  therapeutList,
  dringend
) {
  console.log({
    rezeptHeilmittel,
    preSelect,
    ausstellungsdatum,
    therapeutList,
    dringend,
  });
  // Query existing Termine and current praxis
  const terminQuery = TerminService.getAll().then((terminList) =>
    terminList.filter((t) => new Date(t.start) >= new Date())
  );

  const praxisQuery = PraxisService.getOne(ConfigService.getPraxis(), {
    include: { all: true },
  });

  return Promise.all([terminQuery, praxisQuery]).then(
    ([terminList, praxis]) => {
      let vorschlagDict = {};

      for (let rhm of rezeptHeilmittel) {
        console.log(rhm);
        let hmVorschlagList = [];

        let searchStartDate = new Date(
          Math.max(roundToMinutes(new Date(), 5), new Date(ausstellungsdatum))
        );

        const therapeutListHmFiltered = therapeutList.filter((t) =>
          t.Heilmittels.some((thm) => thm.id == rhm.Heilmittel.id)
        );

        if (therapeutListHmFiltered.length == 0) {
          vorschlagDict[rhm.Heilmittel.name] = [];
          continue;
        }

        while (
          hmVorschlagList.length <
          rhm.terminNumber * 2 * therapeutListHmFiltered.length
        ) {
          const dayOfTheWeek = searchStartDate.getDay();
          const week = [
            null, // Sunday
            praxis?.montagsZeit, // Monday
            praxis?.dienstagsZeit, // Tuesday
            praxis?.mittwochsZeit, // Wednesday
            praxis?.donnerstagsZeit, // Thursday
            praxis?.freitagsZeit, // Friday
            null, // Saturday
          ];
          const hours = week[dayOfTheWeek];
          const foundSlots = [];
          let searchStartDateIsWithinOpeningHours;
          if (hours == null) searchStartDateIsWithinOpeningHours = false;
          else {
            const msSearchStartDay = searchStartDate % milliSecondsPerDay;
            const msHoursStart = hours.start % milliSecondsPerDay;
            const msHoursEnd = hours.end % milliSecondsPerDay;
            /* eslint-disable prettier/prettier */
            searchStartDateIsWithinOpeningHours =
              msSearchStartDay - msHoursStart > -milliSecondsPerMinute &&
              msSearchStartDay +
              rhm.Heilmittel.terminMinutes * milliSecondsPerMinute -
              msHoursEnd <=
              0;
            /* eslint-enable prettier/prettier */
          }

          if (searchStartDateIsWithinOpeningHours) {
            for (let therapeut of therapeutListHmFiltered) {
              // if therapeut has an opening at the searchStartDate within the openingHours
              if (
                terminList.filter(
                  (t) =>
                    /* eslint-disable prettier/prettier */
                    t.TherapeutId == therapeut.id &&
                    Math.abs(new Date(t.start) - searchStartDate) <=
                    rhm.Heilmittel.terminMinutes * 1000 * 60
                  /* eslint-disable prettier/prettier */
                ).length == 0
              ) {
                foundSlots.push({
                  date: new Date(searchStartDate),
                  selected:
                    preSelect && hmVorschlagList.length < rhm.terminNumber,
                  Therapeut: therapeut,
                  TherapeutId: therapeut.id,
                  Heilmittel: rhm.Heilmittel,
                  HeilmittelId: rhm.Heilmittel.id,
                });
              }
            }
          }
          const minuteStep =
            foundSlots.length == 0 ? 5 : rhm.Heilmittel.terminMinutes;
          searchStartDate = new Date(
            searchStartDate.getTime() + minuteStep * 1000 * 60
          );
          hmVorschlagList.push(...foundSlots);
        }
        vorschlagDict[rhm.Heilmittel.name] = hmVorschlagList;
      }

      return vorschlagDict;
    }
  );
}
