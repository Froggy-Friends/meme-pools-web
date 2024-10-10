import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress, ethChain, rpcUrl } from "@/config/env";
import getEthPrice from "@/lib/getEthPrice";
import { useCallback } from "react";
import { createPublicClient, formatUnits, http } from "viem";

export default function useTokenMarketcap() {
  const publicClient = createPublicClient({
    chain: ethChain,
    transport: http(rpcUrl),
  });

  const getTokenMarketcap = useCallback(
    async (tokenAddress: string) => {
      const ethPrice = await getEthPrice();
      const marketcap = await publicClient.readContract({
        address: contractAddress,
        abi: frogFunAbi,
        functionName: "getTokenMarketcap",
        args: [tokenAddress],
      });
      return Number(formatUnits(marketcap as unknown as bigint, 18)) * ethPrice;
    },
    [publicClient]
  );

  return {
    getTokenMarketcap,
  };
}
