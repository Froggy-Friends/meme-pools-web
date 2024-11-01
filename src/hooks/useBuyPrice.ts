import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress, rpcUrl } from "@/config/env";
import { Contract, parseEther } from "ethers";
import * as Sentry from "@sentry/react";
import { ethers } from "ethers";

export default function useBuyPrice() {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new Contract(contractAddress, memepoolsAbi, provider);

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

  const buyPriceEth = async (tokenAddress: string, amount: string) => {
    let totalTokens: bigint = BigInt(0);

    try {
      const tokens = await contract.calculateTokensForETH(
        parseEther(amount),
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
