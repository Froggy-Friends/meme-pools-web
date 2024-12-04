import { useAccount, useBalance } from "wagmi";

export default function useEthBalance(chainId: number) {
  const { address } = useAccount();

  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: address,
    chainId: chainId,
  });

  return { ethBalance, refetchEthBalance };
}
