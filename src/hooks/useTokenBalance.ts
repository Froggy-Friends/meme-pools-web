import { useAccount, useReadContracts } from "wagmi";
import { frogFunTokenAbi } from "@/abi/frogFunToken";
import { Address, formatUnits } from "viem";

export default function useTokenBalance(
  tokenAddress: Address,
  chainId: number
) {
  const { address } = useAccount();

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: frogFunTokenAbi,
        functionName: "balanceOf",
        chainId: chainId,
        args: [address],
      },
    ],
  });

  return {
    tokenBalance:
      address && data && data.length
        ? Number(formatUnits(data[0].result as bigint, 18))
        : 0,
    refetchBalance: refetch,
  };
}
