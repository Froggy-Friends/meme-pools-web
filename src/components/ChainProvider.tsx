"use client";

import { useState, FC, ReactNode } from "react";
import { ChainContext } from "@/context/chain";
import { Chain, ChainConfig } from "@/models/chain";

export const ChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chain, setChain] = useState<ChainConfig>({
    name: Chain.Eth,
    id: Number(process.env.NEXT_PUBLIC_ETH_CHAIN_ID),
  });

  return <ChainContext.Provider value={{ chain, setChain }}>{children}</ChainContext.Provider>;
};
