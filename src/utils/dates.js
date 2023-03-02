export function toLocale(date, locale = "de-DE") {
  return new Date(date).toLocaleDateString(locale);
}

export function toLocaleTime(date, locale = "de-DE") {
  return new Date(date).toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
