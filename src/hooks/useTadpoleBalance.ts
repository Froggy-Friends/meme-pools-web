import { tadpoleAddress } from "@/config/env";
import { tadpolesAbi } from "@/abi/tadpoles";
import { Abi, Address } from "viem";
import { useReadContracts } from "wagmi";

export default function useTadpoleBalance(walletAddresses: Address[]) {
  const { data: tadpoleBalances } = useReadContracts({
    contracts: walletAddresses.map((address) => ({
      address: tadpoleAddress,
      abi: tadpolesAbi as Abi,
      functionName: "balanceOf",
      args: [address],
    })),
  });

  const totalBalance = tadpoleBalances?.reduce(
    (sum, result) => sum + (Number(result.result) ?? 0),
    0
  );

  return totalBalance ?? 0;
}
