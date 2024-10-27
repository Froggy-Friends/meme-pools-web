import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { Address } from "viem";

export const getBuyConfig = (
  tokenAddress: Address,
  amount: bigint,
  totalCost: bigint
) => {
  const config = {
    abi: memepoolsAbi,
    address: contractAddress,
    functionName: "buyTokens",
    args: [tokenAddress, amount],
    value: totalCost,
  };
  return config;
};
