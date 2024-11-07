import { maxTotalSupply } from "./constants";

export const getHolderPercentage = (amount: number) => {
  return (amount / maxTotalSupply) * 100;
};
