import { memepoolsTokenAbi } from "@/abi/memepoolsToken";
import { ApproveToast } from "@/components/swap/ApproveToast";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { maxTotalSupply } from "@/config/token";
import { useChain } from "@/context/chain";
import { Token } from "@prisma/client";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import { parseUnits } from "viem";

export default function useApproveToken(token: Token) {
  const signer = useEthersSigner();
  const contract = new Contract(token.tokenAddress, memepoolsTokenAbi, signer);
  const { chain } = useChain();

  const approveToken = async () => {
    try {
      ApproveToast(token, "", Infinity, false, "approve-toast", chain.name);

      const tx = await contract.approve(
        token.platformAddress,
        parseUnits(maxTotalSupply.toString(), 18)
      );

      ApproveToast(
        token,
        tx.hash,
        Infinity,
        false,
        "approve-toast",
        chain.name
      );

      await tx.wait();

      ApproveToast(token, tx.hash, 10000, true, "approve-toast", chain.name);
    } catch (error) {
      toast.remove("approve-toast");
      toast.error("Approve token error");
    }
  };

  return {
    approveToken,
  };
}
