import { memepoolsAbi } from "@/abi/memepools";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import * as Sentry from "@sentry/react";
import {
  createClaimRecords,
  updateTokenIsClaimable,
} from "@/actions/token/actions";
import { formatTicker } from "@/lib/formatTicker";
import { Token } from "@prisma/client";
import { Chain } from "@/models/chain";

export default function useLaunchCoin(token: Token) {
  const signer = useEthersSigner();
  const contract = new Contract(token.platformAddress, memepoolsAbi, signer);

  const launchCoin = async (
    tokenAddress: string,
    tokenTicker: string,
    tokenId: string
  ) => {
    try {
      const tx = await contract.deployLp(tokenAddress);

      await toast.promise(tx.wait(), {
        loading: `Launching ${formatTicker(tokenTicker)}...`,
        success: `Coin successfully launched!`,
        error: "Launch coin error",
      });

      await updateTokenIsClaimable(tokenId);
      await createClaimRecords(tokenAddress, token.chain as Chain);
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Launch coin error");
    }
  };

  return { launchCoin };
}
