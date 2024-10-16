import { frogFunTokenAbi } from "@/abi/frogFunToken";
import { Address, formatUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { contractAddress } from "@/config/env";
import { maxTotalSupply } from "@/lib/constants";

export default function useAllowance(
  tokenAddress: Address,
  chainId: number
) {
  const { address } = useAccount();

  const { data } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: frogFunTokenAbi,
        functionName: "allowance",
        chainId: chainId,
        args: [address, contractAddress],
      },
    ],
  });

  const formattedAllowance =
    data && data.length ? Number(formatUnits(data[0].result as bigint, 18)) : 0;

  return {
    isApproved: formattedAllowance === maxTotalSupply ? true : false,
  };
}
