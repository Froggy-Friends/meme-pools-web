import { memepoolsTokenAbi } from "@/abi/memepoolsToken";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { maxTotalSupply } from "@/lib/constants";
import { TxStatus } from "@/types/token/types";
import { Contract } from "ethers";
import { useState } from "react";
import toast from "react-hot-toast";
import { parseUnits } from "viem";

export default function useApproveToken(
  tokenAddress: string,
  onSwapModalClose: () => void
) {
  const signer = useEthersSigner();
  const contract = new Contract(tokenAddress, memepoolsTokenAbi, signer);
  const [approveTxStatus, setApproveTxStatus] = useState<TxStatus>("idle");
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null);

  const approveToken = async () => {
    setApproveTxStatus("idle");

    try {
      setApproveTxStatus("pending");
      const tx = await contract.approve(
        contractAddress,
        parseUnits(maxTotalSupply.toString(), 18)
      );
      setApproveTxHash(tx.hash);
      await tx.wait();
      setApproveTxStatus("completed");
    } catch (error) {
      setApproveTxStatus("error");
      toast.error("Approve token error");
      onSwapModalClose();
    }
  };

  return { approveToken, approveTxStatus, approveTxHash };
}
