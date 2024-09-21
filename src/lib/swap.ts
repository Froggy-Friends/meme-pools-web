import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { Address } from "viem";

export const getBuyConfig = (tokenAddress: Address, amount: bigint, totalCost: bigint) => {
  const config = {
    abi: frogFunAbi,
    address: contractAddress,
    functionName: "buyTokens",
    args: [
      tokenAddress,
      amount,
    ],
    value: totalCost
  };
  return config;
}