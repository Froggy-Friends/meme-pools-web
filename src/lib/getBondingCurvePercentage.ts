import { maxTradeableSupply } from "@/lib/constants";

export const getBondingCurvePercentage = (tokensSold: number | undefined) => {
  if (!tokensSold) return 0;
  return Number(((tokensSold / maxTradeableSupply) * 100).toFixed(2));
};
