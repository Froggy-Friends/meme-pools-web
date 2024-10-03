import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import { useState } from "react";
import { TxStatus } from "@/types/token/types";

export default function useBuyToken(onSwapModalClose: () => void) {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  const buyToken = async (
    tokenAddress: string,
    amount: bigint,
    totalCost: bigint
  ) => {
    try {
      const tx = await contract.buyTokens(tokenAddress, amount, {
        value: totalCost,
      });
      setTxHash(tx.hash);
      setTxStatus("pending");
      const receipt = await tx.wait();
      setTxStatus("completed");
      return receipt;
    } catch (error) {
      setTxStatus("error");
      toast.error("Buy token error");
      onSwapModalClose();
    } finally {
      // Reset status after a delay
      setTimeout(() => {
        setTxStatus("idle");
        setTxHash(null);
        onSwapModalClose();
      }, 10000);
    }
  };

  return { buyToken, txStatus, txHash };
}
