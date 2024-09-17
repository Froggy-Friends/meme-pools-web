"use client";

import { useState, FC, ReactNode } from "react";
import { ChainContext } from "@/context/chain";
import { ChainConfig } from "@/models/chain";
import { usePathname } from "next/navigation";
import { getChainConfig } from "@/lib/chains";

export const ChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const chainConfig = getChainConfig(pathname);
  const [chain, setChain] = useState<ChainConfig>(chainConfig);

  return <ChainContext.Provider value={{ chain, setChain }}>{children}</ChainContext.Provider>;
};
