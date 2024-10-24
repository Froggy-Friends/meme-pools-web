import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract, parseEther } from "ethers";
import * as Sentry from "@sentry/react";

export default function useBuyPrice() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);

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
