import { MAX_MARKET_CAP } from "@/lib/constants";

export const getMarketcapPercentage = (marketCap: number) => {
  return ((marketCap / MAX_MARKET_CAP) * 100).toFixed(2);
};
