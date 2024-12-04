import { memepoolsTokenAbi } from "@/abi/memepoolsToken";
import { ApproveToast } from "@/components/swap/ApproveToast";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { maxTotalSupply } from "@/lib/constants";
import { Token } from "@prisma/client";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import { parseUnits } from "viem";

export default function useApproveToken(token: Token) {
  const signer = useEthersSigner();
  const contract = new Contract(token.tokenAddress, memepoolsTokenAbi, signer);

  const approveToken = async () => {
    try {
      ApproveToast(token, "", Infinity, false, "approve-toast");

      const tx = await contract.approve(
        contractAddress,
        parseUnits(maxTotalSupply.toString(), 18)
      );

      ApproveToast(token, tx.hash, Infinity, false, "approve-toast");

      await tx.wait();

      ApproveToast(token, tx.hash, 10000, true, "approve-toast");
    } catch (error) {
      toast.remove("approve-toast");
      toast.error("Approve token error");
    }
  };

  return {
    approveToken,
  };
}
