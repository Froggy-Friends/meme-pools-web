import { useAccount, useBalance } from "wagmi";

export default function useEthBalance(chainId: number) {
  const { address } = useAccount();

  // native token balance (eth)
  const { data } = useBalance({
    address: address,
    chainId: chainId,
  });

  return data;
}