import { timeStringToDate } from "./events";

export function toLocale(date, { locale = "de-DE", options = {} } = {}) {
  return new Date(date).toLocaleDateString(locale, options);
}

export function toLocaleTime(date, locale = "de-DE") {
  if (typeof date == "string") date = timeStringToDate(date);
  return new Date(date).toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
