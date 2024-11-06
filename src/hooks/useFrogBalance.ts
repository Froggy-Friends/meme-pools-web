import { froggyFriendsAddress } from "@/config/eth/froggyFriends";
import { useReadContract } from "wagmi";
import { froggyFriendsAbi } from "@/abi/froggyFriends";
import { Address } from "viem";

export default function useFrogBalance(walletAddress: Address) {
  if (!walletAddress) return 0;

  const { data: frogBalance } = useReadContract({
    address: froggyFriendsAddress,
    abi: froggyFriendsAbi,
    functionName: "balanceOf",
    args: [walletAddress],
    query: {
      enabled: !!walletAddress,
    },
  });

  return Number(frogBalance) ?? 0;
}
