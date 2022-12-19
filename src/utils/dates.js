export function toLocale(date, locale = "de-DE") {
  return new Date(date).toLocaleDateString(locale);
}
