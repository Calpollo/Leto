import ConfigService from "@/services/ConfigService";
import KundenService from "@/services/KundenService";
import RezeptService from "@/services/RezeptService";
import TerminService from "@/services/TerminService";
import TherapeutService from "@/services/TherapeutService";

const millisecondsPerHour = 3600000;
const millisecondsPerDay = millisecondsPerHour * 24;

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
  const { start, end } = openingHours.Zeitspanne;
  return Math.ceil((end - start) / millisecondsPerHour);
}

export function dateRowStart(event, openingHours) {
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

export async function createNewRezept(
  kunde,
  rezept,
  termine,
  createKunde = true,
  kundeId = null
) {
  // console.log(kunde, rezept);
  // console.log(termine);

  const { lastname, firstname, email, phone, address } = kunde;
  let createdKunde = null;
  let kundeSuccess = false;
  if (createKunde) {
    // eslint-disable-next-line no-unused-vars
    [createdKunde, kundeSuccess] = await KundenService.create(
      lastname,
      firstname,
      email,
      phone,
      address
    );
  } else {
    createdKunde = await KundenService.getOne(kundeId);
    // kundeSuccess = true;
  }
  // console.log(createdKunde, kundeSuccess);
  const { ausstellungsdatum, aussteller, Heilmittel } = rezept;
  // TODO: change to explicit therapeut choice not therapeutList[0]
  const tQuery = TherapeutService.getAll();
  const rQuery = RezeptService.create(
    ausstellungsdatum,
    aussteller,
    Heilmittel.id,
    createdKunde.id
  );

  return Promise.all([tQuery, rQuery]).then(
    // eslint-disable-next-line no-unused-vars
    ([therapeutList, [createdRezept, rezeptSuccess]]) => {
      // console.log(therapeutList[0], createdRezept, rezeptSuccess);
      const PraxisId = ConfigService.getPraxis();
      return TerminService.bulkCreate(
        termine.map((termin) => {
          return {
            start: termin,
            minutes: 20,
            PraxisId,
            RezeptId: createdRezept.id,
            TherapeutId: therapeutList[0].id,
          };
        })
      ).then((termine) => [termine, createdKunde, createdRezept]);
    }
  );
}

export function therapeutToColor(id) {
  let colors = ConfigService.getCalendar()?.therapeutColors;
  if (!colors) return "grey";
  else return colors[id];
}
