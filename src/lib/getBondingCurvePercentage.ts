import { tokenLaunchBuffer } from "@/config/token";
import { maxTradeableSupply } from "./constants";

export const getBondingCurvePercentage = (tokensSold: number | undefined) => {
  if (!tokensSold) return 0;
  const percentage =
    (tokensSold / (maxTradeableSupply - tokenLaunchBuffer)) * 100;

  return percentage === 100 ? 100 : Math.floor(Number(percentage));
};
