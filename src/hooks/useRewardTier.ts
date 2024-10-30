import { useReadContract } from "wagmi";
import { Address } from "viem";
import { froggyFriendsAddress } from "@/config/eth/froggyFriends";
import { froggyFriendsAbi } from "@/abi/froggyFriends";

export default function useRewardTier(walletAddress: Address) {
  let rewardTier = "tier one";

  const { data: frogBalance } = useReadContract({
    address: froggyFriendsAddress,
    abi: froggyFriendsAbi,
    functionName: "balanceOf",
    args: [walletAddress],
    query: {
      enabled: !!walletAddress,
    },
  });

  if (frogBalance && Number(frogBalance) >= 5) {
    rewardTier = "tier three";
  } else if (frogBalance && Number(frogBalance) >= 1) {
    rewardTier = "tier two";
  }

  return rewardTier;
}
