import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import useUser from "./useUser";
import { getFrogsByWallet } from "@/lib/getFrogsByWallet";
import { Address } from "viem";
import toast from "react-hot-toast";
import * as Sentry from "@sentry/react";
import {
  updateClaimStatus,
  updateApeClaimStatus,
} from "@/actions/profile/actions";
import { formatTicker } from "@/lib/formatTicker";
import { Chain } from "@/models/chain";
import { getClaimContractAddress, getMemePoolsClaimsAbi } from "@/lib/chains";
import { ApeWalletData } from "@/types/claim/types";
import { getApesByWallet } from "@/lib/getApesByWallet";

export default function useClaimRewards(chain: Chain) {
  const { currentUser } = useUser();
  const signer = useEthersSigner();
  const claimContractAddress = getClaimContractAddress(chain);
  const abi = getMemePoolsClaimsAbi(chain);
  const contract = new Contract(claimContractAddress, abi, signer);

  const apeClaimBatch = async (tokenAddress: string, tokenTicker: string) => {
    const { baycIds, maycIds } = (await getApesByWallet(
      currentUser?.ethAddress as Address,
      chain
    )) as ApeWalletData;

    if (!baycIds.length && !maycIds.length) {
      return;
    }

    try {
      const tx = await contract.claimBatch(tokenAddress, baycIds, maycIds);

      await toast.promise(tx.wait(), {
        loading: `Claiming $${formatTicker(tokenTicker)}`,
        success: `Rewards claimed successfully!`,
        error: "Claim rewards error",
      });

      await updateApeClaimStatus(
        baycIds,
        maycIds,
        tokenAddress,
        currentUser?.ethAddress || ""
      );
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Claim rewards error");
    }
  };

  const frogClaimBatch = async (tokenAddress: string, tokenTicker: string) => {
    const frogIds = await getFrogsByWallet(
      currentUser?.ethAddress as Address,
      chain
    );

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

      await updateClaimStatus(
        frogIds,
        tokenAddress,
        currentUser?.ethAddress || ""
      );
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Claim rewards error");
    }
  };

  const claimBatch = async (tokenAddress: string, tokenTicker: string) => {
    if (chain === Chain.ApeChain) {
      await apeClaimBatch(tokenAddress, tokenTicker);
    } else {
      await frogClaimBatch(tokenAddress, tokenTicker);
    }
  };

  return { claimBatch };
}
