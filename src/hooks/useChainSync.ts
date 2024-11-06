import { useChain } from "@/context/chain";
import { getWalletType } from "@/lib/wallet";
import { chainConfigs } from "@/config/chains";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Chain } from "@/models/chain";

type UseChainSyncProps = {
  isConnected: boolean;
  address: string | null | undefined;
  chain: Chain;
}

export function useChainSync({
  isConnected,
  address,
  chain,
}: UseChainSyncProps) {
  const router = useRouter();
  const { setChain } = useChain();

  const { mutate: syncChain } = useMutation({
    mutationKey: ["chainSync", isConnected, address, chain],
    mutationFn: async () => {
      if (isConnected && address) {
        const walletType = getWalletType(address);

        if (chain !== walletType) {
          await Promise.resolve(
            setChain(
              walletType === "solana" ? chainConfigs.solana : chainConfigs.eth
            )
          );
          router.push(`/${walletType}`);
        }
      }
    },
  });

  useEffect(() => {
    syncChain();
  }, [isConnected, address, chain, syncChain]);
}
