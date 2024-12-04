import { useAccount, useReadContracts } from "wagmi";
import { memepoolsTokenAbi } from "@/abi/memepoolsToken";
import { Address } from "viem";

export default function useTokenBalance(
  tokenAddress: Address,
  chainId: number
) {
  const { address } = useAccount();

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: memepoolsTokenAbi,
        functionName: "balanceOf",
        chainId: chainId,
        args: [address],
      },
    ],
  });

  return {
    tokenBalance:
      address && data && data.length
        ? data[0].result
        : BigInt(0),
    refetchBalance: refetch,
  };
}
