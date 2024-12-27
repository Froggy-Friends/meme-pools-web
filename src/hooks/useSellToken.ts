import { memepoolsAbi } from "@/abi/memepools";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import usePostTradeData from "./usePostTradeData";
import { SellToast } from "@/components/swap/SellToast";
import { Token } from "@prisma/client";
import * as Sentry from "@sentry/react";
import { useChain } from "@/context/chain";

export default function useSellToken(token: Token) {
  const signer = useEthersSigner();
  const contract = new Contract(token.platformAddress, memepoolsAbi, signer);
  const { getSellTokenDetails } = usePostTradeData();
  const { chain } = useChain();

  const sellToken = async (
    token: Token,
    amount: bigint,
    maxPayout: bigint,
    slippagePercent: number
  ) => {
    try {
      SellToast(
        token,
        maxPayout,
        amount,
        "",
        Infinity,
        false,
        "sell-toast",
        chain.name
      );

      const tx = await contract.sellTokens(
        token.tokenAddress,
        amount,
        maxPayout,
        slippagePercent
      );

      SellToast(
        token,
        maxPayout,
        amount,
        tx.hash,
        Infinity,
        false,
        "sell-toast",
        chain.name
      );

      const receipt = await tx.wait();

      const { payout, amount: finalAmount } = await getSellTokenDetails(
        receipt
      );

      SellToast(
        token,
        payout,
        finalAmount,
        tx.hash,
        15000,
        true,
        "sell-toast",
        chain.name
      );

      return receipt;
    } catch (error) {
      Sentry.captureException(error);
      toast.remove("sell-toast");
      if ((error as Error).message.includes("slippage")) {
        toast.error("Slippage reached");
      } else {
        toast.error("Sell token error");
      }
    }
  };

  return { sellToken };
}
