import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import { useState } from "react";
import { TxStatus } from "@/types/token/types";

export default function useSellToken(onSwapModalClose: () => void) {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, memepoolsAbi, signer);
  const [sellTxStatus, setSellTxStatus] = useState<TxStatus>("idle");
  const [sellTxHash, setSellTxHash] = useState<string | null>(null);

  const sellToken = async (
    tokenAddress: string,
    amount: bigint,
    maxPayout: bigint,
    slippagePercent: number
  ) => {
    setSellTxStatus("idle");
    setSellTxHash(null);
    try {
      const tx = await contract.sellTokens(
        tokenAddress,
        amount,
        maxPayout,
        slippagePercent
      );
      setSellTxHash(tx.hash);
      setSellTxStatus("pending");
      const receipt = await tx.wait();
      setSellTxStatus("completed");
      return receipt;
    } catch (error) {
      setSellTxStatus("error");
      if ((error as Error).message.includes("slippage")) {
        toast.error("Slippage reached");
      } else {
        toast.error("Sell token error");
      }
      onSwapModalClose();
    }
  };

  return { sellToken, sellTxStatus, sellTxHash, setSellTxHash };
}
