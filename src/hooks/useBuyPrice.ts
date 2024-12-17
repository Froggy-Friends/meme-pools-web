import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { Contract } from "ethers";
import * as Sentry from "@sentry/react";
import { useEthersProvider } from "@/config/eth/wagmi-ethers";
import { Token } from "@prisma/client";

export default function useBuyPrice(token: Token) {
  const provider = useEthersProvider();
  const contract = new Contract(token.platformAddress, memepoolsAbi, provider);

  const buyPriceTokens = async (tokenAddress: string, amount: bigint) => {
    let totalCost: bigint = BigInt(0);

    try {
      const [price, cost, fee, total] = await contract.calculateBuyPrice(
        tokenAddress,
        amount
      );
      totalCost = total;
    } catch (error) {
      Sentry.captureException(error);
    }

    return totalCost;
  };

  const buyPriceEth = async (tokenAddress: string, amount: bigint) => {
    let totalTokens: bigint = BigInt(0);

    try {
      const tokens = await contract.calculateTokensForETH(
        amount,
        tokenAddress
      );

      totalTokens = tokens;
    } catch (error) {
      Sentry.captureException(error);
    }

    return totalTokens;
  };

  return { buyPriceTokens, buyPriceEth };
}
