export function eventHours(event) {
  if (!event) return 0;
  return (
    event.Zeitspanne.endStunde -
    event.Zeitspanne.startStunde +
    (event.Zeitspanne.endMinute - event.Zeitspanne.startMinute) / 60
  );
}

export function eventsAtTheSameTime(event, events) {
  return events.filter(
    (e) =>
      !(
        e.Zeitspanne.endStunde < event.Zeitspanne.startStunde ||
        (e.Zeitspanne.endStunde == event.Zeitspanne.StartStunde &&
          e.Zeitspanne.endMinute < event.Zeitspanne.startMinute) ||
        e.Zeitspanne.startStunde > event.Zeitspanne.endStunde ||
        (e.Zeitspanne.startStunde == event.Zeitspanne.endStunde &&
          e.Zeitspanne.startMinute < event.Zeitspanne.endMinute)
      )
  ).length;
}

export function startHoursDifference(earlyEvent, lateEvent) {
  return (
    lateEvent.Zeitspanne.startStunde -
    earlyEvent.Zeitspanne.startStunde +
    (lateEvent.Zeitspanne.startMinute - earlyEvent.Zeitspanne.startMinute) / 60
  );
}

export function hoursBetween(earlyEvent, lateEvent) {
  if (earlyEvent.id == lateEvent.id) return 0;
  const earlyHour = earlyEvent.Zeitspanne.endStunde;
  const earlyMinute = earlyEvent.Zeitspanne.endMinute;
  const lateHour = lateEvent.Zeitspanne.startStunde;
  const lateMinute = lateEvent.Zeitspanne.startMinute;

  const result = lateHour - earlyHour + (lateMinute - earlyMinute) / 60;
  return result;
}

export function eventListToConcurringEventnumber(eventList) {
  return new Map(
    eventList.map((event) => [event.id, eventsAtTheSameTime(event, eventList)])
  );
}

export function fullDayHours(earliestEvent, latestEvent) {
  if (!earliestEvent || !latestEvent) return 0;
  const earlyHour = earliestEvent.Zeitspanne.startStunde;
  const earlyMinute = earliestEvent.Zeitspanne.startMinute;
  const lateHour = latestEvent.Zeitspanne.endStunde;
  const lateMinute = latestEvent.Zeitspanne.endMinute;

  return lateHour - earlyHour + (lateMinute - earlyMinute) / 60;
}

export function dateRowStart(event, earliestEvent) {
  return startHoursDifference(earliestEvent, event) * 4 + 2;
}

export function dateRowEnd(event, earliestEvent) {
  const result = dateRowStart(event, earliestEvent) + eventHours(event) * 4;
  return result;
}
