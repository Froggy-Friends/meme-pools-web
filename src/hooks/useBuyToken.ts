import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import { useState } from "react";
import { TxStatus } from "@/types/token/types";

export default function useBuyToken(onSwapModalClose: () => void) {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, memepoolsAbi, signer);
  const [buyTxStatus, setBuyTxStatus] = useState<TxStatus>("idle");
  const [buyTxHash, setBuyTxHash] = useState<string | null>(null);

  const buyToken = async (
    tokenAddress: string,
    amount: bigint,
    totalCost: bigint
  ) => {
    setBuyTxStatus("idle");
    setBuyTxHash(null);

    try {
      const tx = await contract.buyTokens(tokenAddress, amount, {
        value: totalCost,
      });
      setBuyTxHash(tx.hash);
      setBuyTxStatus("pending");
      const receipt = await tx.wait();
      setBuyTxStatus("completed");
      return receipt;
    } catch (error) {
      setBuyTxStatus("error");
      toast.error("Buy token error");
      onSwapModalClose();
    }
  };

  return { buyToken, buyTxStatus, buyTxHash };
}
