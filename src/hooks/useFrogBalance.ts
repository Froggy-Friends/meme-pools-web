import { useReadContracts } from "wagmi";
import { froggyFriendsAbi } from "@/abi/froggyFriends";
import { Abi, Address } from "viem";
import { Chain } from "@/models/chain";
import { getFroggyFriendsAddress } from "@/lib/getFroggyFriendsAddress";

export default function useFrogBalance(walletAddresses: Address[], chain: Chain) {
  const froggyFriendsAddress = getFroggyFriendsAddress(chain);

  const { data: frogBalances } = useReadContracts({
    contracts: walletAddresses.map((address) => ({
      address: froggyFriendsAddress,
      abi: froggyFriendsAbi as Abi,
      functionName: "balanceOf",
      args: [address],
    })),
  });

  const totalBalance = frogBalances?.reduce(
    (sum, result) => sum + (Number(result.result) ?? 0),
    0
  );

  return totalBalance ?? 0;
}
