import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { useEthersProvider } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import * as Sentry from "@sentry/react";
import { Token } from "@prisma/client";

export default function useSellPrice(token: Token) {
  const provider = useEthersProvider();
  const contract = new Contract(token.platformAddress, memepoolsAbi, provider);

  const getSellPrice = async (tokenAddress: string, amount: bigint) => {
    let totalPayout: bigint = BigInt(0);

    try {
      const [price, cost, fee, payout] = await contract.calculateSellPrice(
        tokenAddress,
        amount
      );

      totalPayout = payout;
    } catch (error) {
      Sentry.captureException(error);
    }

    return totalPayout;
  };

  return getSellPrice;
}
