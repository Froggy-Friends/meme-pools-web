import { tokenLaunchBuffer } from "@/config/token";
import { Chain } from "@/models/chain";
import { getMaxTradeableSupply } from "./chains";

export const getBondingCurvePercentage = (
  tokensSold: number | undefined,
  chain: Chain
) => {
  const maxTradeableSupply = getMaxTradeableSupply(chain);

  if (!tokensSold) return 0;
  const percentage =
    (tokensSold / (maxTradeableSupply - tokenLaunchBuffer)) * 100;

  return percentage === 100 ? 100 : Math.floor(Number(percentage));
};
