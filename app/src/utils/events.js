import ConfigService from "@/services/ConfigService";
import KundenService from "@/services/dbServices/KundenService";
import RezeptHeilmittelService from "@/services/dbServices/RezeptHeilmittelService";
import RezeptService from "@/services/dbServices/RezeptService";
import TerminService from "@/services/dbServices/TerminService";

const millisecondsPerHour = 3600000;
const millisecondsPerDay = millisecondsPerHour * 24;

// export function timeStringToDate(str, dateString = null) {
//   const d = dateString ? new Date(dateString) : new Date();
//   let [hours, minutes, seconds] = str.split(":");
//   return d.setHours(hours, minutes, seconds);
// }

export function eventHours(event) {
  if (!event) return 0;
  return event.minutes / 60;
}

export function eventsAtTheSameTime(event, events) {
  const eventStart = new Date(event.start).valueOf();
  const eventEnd = new Date(event.start)
    .setMinutes(new Date(eventStart).getMinutes() + event.minutes)
    .valueOf();
  return events.filter((e) => {
    const eStart = new Date(e.start).valueOf();
    const eEnd = new Date(e.start)
      .setMinutes(new Date(eStart).getMinutes() + e.minutes)
      .valueOf();

    // console.table({
    //   eStart: eStart - 1670000000000,
    //   eventStart: eventStart - 1670000000000,
    //   eEnd: eEnd - 1670000000000,
    //   eventEnd: eventEnd - 1670000000000,
    //   startEndOverlapA: eventEnd == eStart,
    //   startEndOverlapB: eEnd == eventStart,
    //   inbetweenA: eventStart < eEnd && eventEnd >= eEnd,
    //   inbetweenB: eventStart <= eStart && eventEnd > eStart,
    // });
    return (
      eStart == eventStart ||
      eEnd == eventEnd ||
      (eventStart < eEnd && eventEnd >= eEnd) ||
      (eventStart <= eStart && eventEnd > eStart)
    );
  }).length;
}

export function startHoursDifference(earlyEvent, lateEvent) {
  const result = lateEvent.start - earlyEvent.start;
  return result;
}

export function eventListToConcurringEventnumber(eventList) {
  return new Map(
    eventList.map((event) => [event.id, eventsAtTheSameTime(event, eventList)])
  );
}

export function fullDayHours(openingHours) {
  let { start, end } = openingHours.Zeitspanne;
  return Math.ceil((end - start) / millisecondsPerHour);
}

export function dateRowStart(event, openingHours) {
  // if (typeof event.start == "string")
  //   event.start = timeStringToDate(
  //     event.start.split("T")[1].substring(0, 9),
  //     event.start
  //   );
  // if (typeof openingHours.Zeitspanne.start == "string")
  //   openingHours.Zeitspanne.start = timeStringToDate(
  //     openingHours.Zeitspanne.start
  //   );

  let timeDiff =
    new Date(event.start) - new Date(openingHours.Zeitspanne.start);
  timeDiff = timeDiff % millisecondsPerDay;
  return Math.round((timeDiff / millisecondsPerHour) * 4 + 2);
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
    return Promise.all([rezeptHeilmittelCreation, termincreation]).then(
      () => createdRezept
    );
  });
}
