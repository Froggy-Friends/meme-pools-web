import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { useEthersSigner } from "@/config/eth/wagmi-ethers";
import { Contract } from "ethers";
import toast from "react-hot-toast";
import * as Sentry from "@sentry/react";
import { createClaimRecords } from "@/actions/token/actions";
import { formatTicker } from "@/lib/formatTicker";

export default function useLaunchCoin() {
  const signer = useEthersSigner();
  const contract = new Contract(contractAddress, memepoolsAbi, signer);

  const launchCoin = async (tokenAddress: string, tokenTicker: string) => {
    try {
      const tx = await contract.deployLp(tokenAddress);

      await toast.promise(tx.wait(), {
        loading: `Launching ${formatTicker(tokenTicker)}...`,
        success: `Coin successfully launched!`,
        error: "Launch coin error"
      });

      await createClaimRecords(tokenAddress); 
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Launch coin error");
    }
  };

  return { launchCoin };
}
