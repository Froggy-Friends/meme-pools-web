import { memepoolsTokenAbi } from "@/abi/memepoolsToken";
import { Address, formatUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { contractAddress } from "@/config/env";
import { useState } from "react";
import { useEffect } from "react";
import useTokenBalance from "./useTokenBalance";

export default function useAllowance(tokenAddress: Address, chainId: number) {
  const { address } = useAccount();
  const { tokenBalance } = useTokenBalance(tokenAddress, chainId);
  const [isApproved, setIsApproved] = useState(false);

  const { data, refetch: refetchAllowance } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: memepoolsTokenAbi,
        functionName: "allowance",
        chainId: chainId,
        args: [address, contractAddress],
      },
    ],
  });

  const formattedAllowance =
    address && data && data.length
      ? Number(formatUnits(data[0].result as bigint, 18))
      : 0;

  useEffect(() => {
    if (formattedAllowance >= tokenBalance && formattedAllowance > 0) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  }, [tokenBalance, formattedAllowance]);

  return {
    allowance: formattedAllowance,
    isApproved,
    refetchAllowance,
  };
}
