export function toLocale(date, { locale = "de-DE", options = {} } = {}) {
  return new Date(date).toLocaleDateString(locale, options);
}

export function toLocaleTime(date, locale = "de-DE") {
  if (typeof date == "string") date = parseInt(date);
  return new Date(date).toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dateToAge(birthdate) {
  if (!birthdate) return birthdate;
  if (typeof birthdate == "string") birthdate = new Date(birthdate);
  const now = new Date();

  let years = now.getFullYear() - birthdate.getFullYear();
  const months = now.getMonth() - birthdate.getMonth();
  const days = now.getDate() - birthdate.getDate();

  if (months < 0 || (months == 0 && days < 0)) years--;

  return years;
}

export function YYYY_MM_DD_convert(date) {
  if (!date) return date;
  if (typeof date == "string") date = new Date(date);
  console.log(date);

  return `${date?.getFullYear()}-${new String(date?.getMonth() + 1).padStart(
    2,
    "0"
  )}-${new String(date?.getDate()).padStart(2, "0")}`;
}

const msPerMinute = 1000 * 60;
export function roundToMinutes(date, minutes) {
  const msInQuestion = minutes * msPerMinute;
  return new Date(
    date.valueOf() - (date.valueOf() % msInQuestion) + msInQuestion
  );
}
