import { useReadContracts } from "wagmi";
import { froggyFriendsAbi } from "@/abi/froggyFriends";
import { Abi, Address } from "viem";
import { baycAddress, maycAddress } from "@/config/env";

export default function useApesBalance(walletAddresses: Address[]) {
  const { data: baycBalances } = useReadContracts({
    contracts: walletAddresses.map((address) => ({
      address: baycAddress as Address,
      abi: froggyFriendsAbi as Abi,
      functionName: "balanceOf",
      args: [address],
    })),
  });

  const totalBaycBalance = baycBalances?.reduce(
    (sum, result) => sum + (Number(result.result) ?? 0),
    0
  );

  const { data: maycBalances } = useReadContracts({
    contracts: walletAddresses.map((address) => ({
      address: maycAddress as Address,
      abi: froggyFriendsAbi as Abi,
      functionName: "balanceOf",
      args: [address],
    })),
  });

  const totalMaycBalance = maycBalances?.reduce(
    (sum, result) => sum + (Number(result.result) ?? 0),
    0
  );

  return {
    baycBalance: totalBaycBalance,
    maycBalance: totalMaycBalance,
    totalApesBalance: (totalBaycBalance ?? 0) + (totalMaycBalance ?? 0),
  };
}
