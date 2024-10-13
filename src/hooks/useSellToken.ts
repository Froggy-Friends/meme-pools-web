import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import { useState } from "react";
import { TxStatus } from "@/types/token/types";

export default function useSellToken(onSwapModalClose: () => void) {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, frogFunAbi, signer);
  const [sellTxStatus, setSellTxStatus] = useState<TxStatus>("idle");
  const [sellTxHash, setSellTxHash] = useState<string | null>(null);

  const sellToken = async (tokenAddress: string, amount: bigint) => {
    try {
      const tx = await contract.sellTokens(tokenAddress, amount);
      setSellTxHash(tx.hash);
      setSellTxStatus("pending");
      const receipt = await tx.wait();
      setSellTxStatus("completed");
      return receipt;
    } catch (error) {
      setSellTxStatus("error");
      toast.error("Sell token error");
      console.log(error);
      onSwapModalClose();
    } finally {
      setTimeout(() => {
        setSellTxStatus("idle");
        setSellTxHash(null);
        onSwapModalClose();
      }, 10000);
    }
  };

  return { sellToken, sellTxStatus, sellTxHash };
}
