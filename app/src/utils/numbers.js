export function roundToDecimals(number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(number * factor) / factor;
}
