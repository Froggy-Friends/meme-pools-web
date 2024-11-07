import { TokenHolderSol } from "@/types/token/types";
import { maxTotalSupply } from "./constants";

export const getHolderPercentage = (holder: TokenHolderSol) => {
  return (holder.amount / maxTotalSupply) * 100;
};
