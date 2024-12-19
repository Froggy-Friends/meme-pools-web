import { maxTotalSupply } from "@/config/token";

export const getHolderPercentage = (amount: number) => {
  return (amount / maxTotalSupply) * 100;
};
