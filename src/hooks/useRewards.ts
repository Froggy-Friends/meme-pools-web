import { mempoolsClaimsAbi } from "@/abi/mempoolsClaims";
import { Address } from "viem";
import { useEthersProvider } from "@/config/eth/wagmi-ethers";
import { ethers } from "ethers";
import { getFrogsByWallet } from "@/lib/getFrogsByWallet";
import useUser from "./useUser";
import { formatUnits } from "viem";
import { useState } from "react";
import { Chain } from "@/models/chain";
import { getClaimContractAddress } from "@/lib/chains";

export default function useRewards(chain: Chain) {
  const [pending, setPending] = useState(false);
  const { currentUser } = useUser();
  const provider = useEthersProvider();
  const claimContractAddress = getClaimContractAddress(chain);
  const contract = new ethers.Contract(
    claimContractAddress,
    mempoolsClaimsAbi,
    provider
  );

  const fetchRewards = async (tokenAddress: Address) => {
    setPending(true);
    if (!currentUser || !tokenAddress) return 0;

    const frogIds = await getFrogsByWallet(currentUser?.ethAddress as Address);
    const rewards = await contract.rewards(tokenAddress, frogIds);

    setPending(false);
    return formatUnits(rewards, 18);
  };

  return { fetchRewards, pending };
}
