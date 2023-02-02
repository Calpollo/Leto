const millisecondsPerHour = 3600000;

export function eventHours(event) {
  if (!event) return 0;
  return event.minutes / 60;
}

export function eventsAtTheSameTime(event, events) {
  const eventStart = new Date(event.start).valueOf();
  const eventEnd = new Date(event.start).setMinutes(
    new Date(eventStart).getMinutes() + event.minutes
  );
  return events.filter((e) => {
    const eStart = new Date(e.start).valueOf();
    const eEnd = new Date(e.start).setMinutes(
      new Date(eStart).getMinutes() + e.minutes
    );
    return (
      eStart == eventStart ||
      eEnd == eventEnd ||
      (eventStart <= eEnd && eventEnd >= eEnd) ||
      (eventStart <= eStart && eventEnd >= eStart)
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
  const timeDiff =
    new Date(event.start) - new Date(openingHours.Zeitspanne.start);
  const millisecondsPerHour = 3600000;
  return Math.round((timeDiff / millisecondsPerHour) * 4 + 2);
}

export function dateRowEnd(event, openingHours) {
  const timeDiff =
    new Date(event.start).setMinutes(
      new Date(event.start).getMinutes() + event.minutes
    ) - new Date(openingHours.Zeitspanne.start);
  return Math.round((timeDiff / millisecondsPerHour) * 4);
}
