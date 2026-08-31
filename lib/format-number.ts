export function formatNumber(
  value: number | null | undefined
): string {
  if (value === null || value === undefined) {
    return "0";
  }

  return new Intl.NumberFormat().format(value);
}