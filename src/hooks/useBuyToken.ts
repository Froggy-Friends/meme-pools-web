import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import usePostTradeData from "./usePostTradeData";
import { Token } from "@prisma/client";
import { BuyToast } from "@/components/swap/BuyToast";

export default function useBuyToken(token: Token) {
  const signer = useEthersSigner();
  const contract = new Contract(token.platformAddress, memepoolsAbi, signer);
  const { getBuyTokenDetails } = usePostTradeData();

  const buyToken = async (
    token: Token,
    amount: bigint,
    totalCost: bigint,
    slippagePercent: number
  ) => {
    try {
      BuyToast(token, totalCost, amount, "", Infinity, false, "buy-toast");

      const tx = await contract.buyTokens(
        token.tokenAddress,
        amount,
        slippagePercent,
        {
          value: totalCost,
        }
      );

      BuyToast(token, totalCost, amount, tx.hash, Infinity, false, "buy-toast");

      const receipt = await tx.wait();

      const { amount: finalAmount } = await getBuyTokenDetails(receipt);

      BuyToast(
        token,
        totalCost,
        finalAmount,
        tx.hash,
        15000,
        true,
        "buy-toast"
      );

      return receipt;
    } catch (error) {
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
