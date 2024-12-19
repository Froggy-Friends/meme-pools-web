"use client";

import { useState, FC, ReactNode, useEffect } from "react";
import { ChainContext } from "@/context/chain";
import { ChainConfig } from "@/models/chain";
import { useSwitchChain, useAccount } from "wagmi";

export const ChainProvider: FC<{ children: ReactNode, initialChain: ChainConfig }> = ({ children, initialChain }) => {
  const { switchChain } = useSwitchChain();
  const { chain: connectedChain, isConnected } = useAccount();
  const [chain, setChain] = useState<ChainConfig>(initialChain);

  useEffect(() => {
    if (isConnected && connectedChain?.id !== chain.id) {
      switchChain({ chainId: chain.id });
    }
  }, [isConnected, connectedChain, chain, switchChain]);

  return <ChainContext.Provider value={{ chain, setChain }}>{children}</ChainContext.Provider>;
};
