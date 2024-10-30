export function formatMarketcap(num: number): string {
  if (num < 1000) return Math.round(num).toString();

  const formatted = num / 1000;
  return `${formatted.toFixed(1)}K`;
}
