export function formatAddress(str: string | null) {
  if (!str) return null;

  return str.substring(str.length - 7, str.length);
}
