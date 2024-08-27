export function formatAddress(str: string, chars: number) {
  if (!str) return null;

  const start = str.substring(0, chars);
  const end = str.substring(str.length-chars);
  return `${start}...${end}`;
}