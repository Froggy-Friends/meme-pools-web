import { Address } from "viem";
import { useEthersProvider } from "@/config/eth/wagmi-ethers";
import { ethers } from "ethers";
import { getFrogsByWallet } from "@/lib/getFrogsByWallet";
import useUser from "./useUser";
import { formatUnits } from "viem";
import { useState } from "react";
import { Chain } from "@/models/chain";
import { getClaimContractAddress, getMemePoolsClaimsAbi } from "@/lib/chains";
import { getApesByWallet } from "@/lib/getApesByWallet";
import { ApeWalletData } from "@/types/claim/types";

export default function useRewards(chain: Chain) {
  const [pending, setPending] = useState(false);
  const { currentUser } = useUser();
  const provider = useEthersProvider();
  const claimContractAddress = getClaimContractAddress(chain);
  const abi = getMemePoolsClaimsAbi(chain);
  const contract = new ethers.Contract(claimContractAddress, abi, provider);

  const fetchRewards = async (tokenAddress: Address) => {
    setPending(true);
    if (!currentUser || !tokenAddress) return 0;

    let rewards = BigInt(0);

    if (chain === Chain.ApeChain) {
      const { baycIds, maycIds } = (await getApesByWallet(
        currentUser?.ethAddress as Address,
        chain
      )) as ApeWalletData;

      rewards = await contract.rewards(tokenAddress, baycIds, maycIds);
    } else {
      const frogIds = await getFrogsByWallet(
        currentUser?.ethAddress as Address,
        chain
      );

      rewards = await contract.rewards(tokenAddress, frogIds);
    }

    setPending(false);
    return formatUnits(rewards, 18);
  };

  return { fetchRewards, pending };
}
