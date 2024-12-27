import { memepoolsTokenAbi } from "@/abi/memepoolsToken";
import { Address, formatEther } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { contractAddress } from "@/config/env";
import { useState } from "react";
import { useEffect } from "react";
import useTokenBalance from "./useTokenBalance";
import { Token } from "@prisma/client";

export default function useAllowance(token: Token, chainId: number) {
  const { address } = useAccount();
  const { tokenBalance } = useTokenBalance(token.tokenAddress as Address, chainId);
  const [isApproved, setIsApproved] = useState(false);

  const { data, refetch: refetchAllowance } = useReadContracts({
    contracts: [
      {
        address: token.tokenAddress as Address,
        abi: memepoolsTokenAbi,
        functionName: "allowance",
        chainId: chainId,
        args: [address, token.platformAddress],
      },
    ],
  });

  const formattedAllowance =
    address && data && data.length && data[0].result
      ? Number(formatEther(data[0].result as bigint))
      : 0;

  useEffect(() => {
    if (
      tokenBalance &&
      formattedAllowance >= Number(formatEther(tokenBalance as bigint)) &&
      formattedAllowance > 0
    ) {
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
