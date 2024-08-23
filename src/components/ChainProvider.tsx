"use client"

import { useState, FC, ReactNode } from "react";
import { ChainContext } from "@/context/chain";
import { Chain } from "@/models/chain";

export const ChainProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chain, setChain] = useState<Chain>(Chain.Base);

  return (
    <ChainContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainContext.Provider>
  );
};