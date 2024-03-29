import ConfigService from "@/services/ConfigService";
import KundenService from "@/services/dbServices/KundenService";
import RezeptHeilmittelService from "@/services/dbServices/RezeptHeilmittelService";
import RezeptService from "@/services/dbServices/RezeptService";
import TerminService from "@/services/dbServices/TerminService";
import { roundToMinutes } from "@/utils/dates";

export const millisecondsPerHour = 3600000;
export const millisecondsPerDay = millisecondsPerHour * 24;

export function eventHours(event) {
  if (!event) return 0;
  return event.minutes / 60;
}

export function eventsAtTheSameTime(event, events) {
  const eventStart = roundToMinutes(new Date(event.start)).valueOf();
  const eventEnd = roundToMinutes(
    new Date(event.start).setMinutes(
      new Date(eventStart).getMinutes() + event.minutes
    )
  ).valueOf();
  return events.filter((e) => {
    const eStart = roundToMinutes(new Date(e.start)).valueOf();
    const eEnd = roundToMinutes(
      new Date(e.start).setMinutes(new Date(eStart).getMinutes() + e.minutes)
    ).valueOf();

    return (
      eStart == eventStart ||
      eEnd == eventEnd ||
      // eventEnd lies within eStart and eEnd
      (eventEnd < eEnd && eventEnd > eStart) ||
      // eventStart lies within eStart and eEnd
      (eventStart > eStart && eventStart < eEnd)
    );
  }).length;
}

export function startHoursDifference(earlyEvent, lateEvent) {
  const result = lateEvent.start - earlyEvent.start;
  return result;
}

export function eventListToConcurringEventnumber(eventList) {
  return new Map(
    eventList.map((event) => [
      event.id || "showHoverEvent",
      eventsAtTheSameTime(event, eventList),
    ])
  );
}

export function fullDayHours(openingHours) {
  let { start, end } = openingHours.Zeitspanne;
  return Math.ceil((end - start) / (millisecondsPerHour / 2)) / 2;
}

export function dateRowStart(event, openingHours) {
  let timeDiff =
    new Date(event.start) - new Date(openingHours.Zeitspanne.start);
  timeDiff = timeDiff % millisecondsPerDay;
  return Math.floor((timeDiff / millisecondsPerHour) * 4 + 2);
}

export function dateRowEnd(event, openingHours) {
  let timeDiff =
    new Date(event.start).setMinutes(
      new Date(event.start).getMinutes() + event.minutes
    ) - new Date(openingHours.Zeitspanne.start);
  timeDiff = timeDiff % millisecondsPerDay;

  return Math.round((timeDiff / millisecondsPerHour) * 4 + 2);
}

export async function createNewRezept(rezept, termine, { kunde = null } = {}) {
  // console.log(termine, rezept);
  // console.log(kunde);

  let createdKunde = null;
  if (!kunde || kunde.id) {
    createdKunde = await KundenService.getOne(kunde?.id || rezept.Kunde.id);
  } else {
    const {
      lastname,
      firstname,
      email,
      phone,
      address,
      geburtstag,
      versichertenstatus,
      versichertennummer,
    } = kunde;
    createdKunde = await KundenService.create(
      lastname,
      firstname,
      email,
      phone,
      address,
      geburtstag,
      versichertenstatus,
      versichertennummer
    );
  }

  const {
    ausstellungsdatum,
    RezeptHeilmittels,
    ArztLanr,
    hausbesuch,
    therapieBericht,
    icd10codeId,
    indikation,
    beschreibung,
  } = rezept;

  return RezeptService.create(
    ausstellungsdatum,
    createdKunde.id,
    ArztLanr,
    hausbesuch,
    therapieBericht,
    icd10codeId,
    indikation,
    beschreibung
  ).then((createdRezept) => {
    const PraxisId = ConfigService.getPraxis();

    const rezeptHeilmittelCreation = RezeptHeilmittelService.bulkCreate(
      RezeptHeilmittels.map((rhm) => {
        return {
          terminNumber: rhm.terminNumber,
          HeilmittelId: rhm.HeilmittelId,
          RezeptId: createdRezept.id,
        };
      })
    );

    const termincreation = TerminService.bulkCreate(
      termine.map((termin) => {
        return {
          start: termin.date,
          minutes: 20,
          PraxisId,
          RezeptId: createdRezept.id,
          TherapeutId: termin.TherapeutId,
        };
      })
    ).then((termine) => {
      return Promise.all(
        termine.map((t) => {
          t.Heilmittels = RezeptHeilmittels.map((rhm) => rhm.HeilmittelId);
          return TerminService.update(t);
        })
      ).then(() => termine);
    });
    return Promise.all([rezeptHeilmittelCreation, termincreation]).then(() =>
      RezeptService.getOne(createdRezept.id)
    );
  });
}
