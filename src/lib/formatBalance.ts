const oneMillion = 1000000;
const oneBillion = 1000000000;

export function formatBalance(num: number, eth?: boolean): string {
  if (eth && num !== 0) {
    return `${num.toFixed(4)}`;
  }
  if (num < 1000) return Math.round(num).toString();
  if (num < oneMillion) {
    const formatted = num / 1000;
    return `${formatted.toFixed(2)}K`;
  }
  if (num < oneBillion - 1) {
    const formatted = num / oneMillion;
    return `${formatted.toFixed(2)}M`;
  }
  const formatted = num / oneBillion;
  return `${formatted.toFixed(1)}B`;
}
