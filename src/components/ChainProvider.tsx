"use client";

import { useState, FC, ReactNode, useEffect } from "react";
import { ChainContext } from "@/context/chain";
import { Chain, ChainConfig } from "@/models/chain";
import { usePathname } from "next/navigation";
import { getChainConfig } from "@/lib/chains";
import { useSwitchChain } from "wagmi";

export const ChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { switchChain } = useSwitchChain();
  const pathname = usePathname();
  const chainConfig = getChainConfig(pathname);
  const [chain, setChain] = useState<ChainConfig>(chainConfig);

  useEffect(() => {
    if (chain.name === Chain.Eth || chain.name === Chain.Base) {
      switchChain({ chainId: chain.id });
    }
  }, [chain, chain.name, switchChain]);

  return <ChainContext.Provider value={{ chain, setChain }}>{children}</ChainContext.Provider>;
};
