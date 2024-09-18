"use client";

import { useState, FC, ReactNode, useEffect } from "react";
import { ChainContext } from "@/context/chain";
import { ChainConfig } from "@/models/chain";
import { usePathname } from "next/navigation";
import { getChainConfig } from "@/lib/chains";
import { useSwitchChain, useAccount } from "wagmi";

export const ChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { switchChain } = useSwitchChain();
  const { chain: connectedChain, isConnected } = useAccount();
  const pathname = usePathname();
  const chainConfig = getChainConfig(pathname);
  const [chain, setChain] = useState<ChainConfig>(chainConfig);

  useEffect(() => {
    if (isConnected && connectedChain?.id !== chain.id) {
      switchChain({ chainId: chain.id });
    }
  }, [isConnected, connectedChain, chain, switchChain]);

  return <ChainContext.Provider value={{ chain, setChain }}>{children}</ChainContext.Provider>;
};
