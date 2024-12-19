import { mempoolsClaimsAbi } from "@/abi/mempoolsClaims";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import useUser from "./useUser";
import { getFrogsByWallet } from "@/lib/getFrogsByWallet";
import { Address } from "viem";
import toast from "react-hot-toast";
import * as Sentry from "@sentry/react";
import { updateClaimStatus } from "@/actions/profile/actions";
import { formatTicker } from "@/lib/formatTicker";
import { Chain } from "@/models/chain";
import { getClaimContractAddress } from "@/lib/chains";

export default function useClaimRewards(chain: Chain) {
  const { currentUser } = useUser();
  const signer = useEthersSigner();
  const claimContractAddress = getClaimContractAddress(chain);
  const contract = new Contract(
    claimContractAddress,
    mempoolsClaimsAbi,
    signer
  );

  const claimBatch = async (tokenAddress: string, tokenTicker: string) => {
    const frogIds = await getFrogsByWallet(currentUser?.ethAddress as Address, chain);

    if (!frogIds.length) {
      return;
    }

    try {
      const tx = await contract.claimBatch(tokenAddress, frogIds);

      await toast.promise(tx.wait(), {
        loading: `Claiming $${formatTicker(tokenTicker)}`,
        success: `Rewards claimed successfully!`,
        error: "Claim rewards error",
      });

      await updateClaimStatus(frogIds, tokenAddress);
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Claim rewards error");
    }
  };

  return { claimBatch };
}
