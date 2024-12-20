import { MAX_MARKET_CAP } from "@/config/token";

export const getMarketcapPercentage = (marketCap: number | undefined) => {
  if (!marketCap) return 0;
  return ((marketCap / MAX_MARKET_CAP) * 100).toFixed(2);
};
