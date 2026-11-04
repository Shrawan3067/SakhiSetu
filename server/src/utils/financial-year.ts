/**
 * Calculates Indian Financial Year (April 1 to March 31)
 * Example:
 * 2026-05-15 -> 2026-27
 * 2027-01-20 -> 2026-27
 * 2027-04-01 -> 2027-28
 */
export function getFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth(); // 0 is January, 3 is April
  const year = date.getFullYear();

  let startYear: number;
  let endYear: number;

  if (month >= 3) {
    // April to December
    startYear = year;
    endYear = year + 1;
  } else {
    // January to March
    startYear = year - 1;
    endYear = year;
  }

  const endYearShort = String(endYear).slice(-2);
  return `${startYear}-${endYearShort}`;
}
