export function formatAddress(str: string) {
  if (!str) return null;

  return str.substring(str.length - 7, str.length);
}
