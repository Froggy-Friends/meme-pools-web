import { memepoolsAbi } from "@/abi/memepools";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import usePostTradeData from "./usePostTradeData";
import { Token } from "@prisma/client";
import { BuyToast } from "@/components/swap/BuyToast";
import * as Sentry from "@sentry/react";
import { useChain } from "@/context/chain";

export default function useBuyToken(token: Token) {
  const signer = useEthersSigner();
  const contract = new Contract(token.platformAddress, memepoolsAbi, signer);
  const { getBuyTokenDetails } = usePostTradeData();
  const { chain } = useChain();

  const buyToken = async (
    token: Token,
    amount: bigint,
    totalCost: bigint,
    slippagePercent: number
  ) => {
    try {
      BuyToast(
        token,
        totalCost,
        amount,
        "",
        Infinity,
        false,
        "buy-toast",
        chain.name
      );

      const tx = await contract.buyTokens(
        token.tokenAddress,
        amount,
        slippagePercent,
        {
          value: totalCost,
        }
      );

      BuyToast(
        token,
        totalCost,
        amount,
        tx.hash,
        Infinity,
        false,
        "buy-toast",
        chain.name
      );

      const receipt = await tx.wait();

      const { amount: finalAmount } = await getBuyTokenDetails(receipt);

      BuyToast(
        token,
        totalCost,
        finalAmount,
        tx.hash,
        15000,
        true,
        "buy-toast",
        chain.name
      );

      return receipt;
    } catch (error) {
      Sentry.captureException(error);
      toast.remove("buy-toast");
      if ((error as Error).message.includes("slippage")) {
        toast.error("Slippage reached");
      } else {
        toast.error("Buy token error");
      }
    }
  };

  return { buyToken };
}
