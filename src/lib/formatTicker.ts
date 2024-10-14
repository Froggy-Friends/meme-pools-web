export const formatTicker = (ticker: string) => {
  if (ticker.length > 7) {
    return ticker.substring(0, 7) + "...";
  }
  return ticker;
};
