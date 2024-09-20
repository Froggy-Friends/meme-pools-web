import { useAccount, useReadContracts } from 'wagmi';
import { frogFunTokenAbi } from '@/abi/frogFunToken';
import { Address } from 'viem';

export default function useTokenBalance(tokenAddress: Address, chainId: number) {
  const { address } = useAccount();

  const { data } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: frogFunTokenAbi,
        functionName: "balanceOf",
        chainId: chainId,
        args: [address]
      }
    ]
  });

  return data && data.length ? Number(data[0].result) : 0;
}