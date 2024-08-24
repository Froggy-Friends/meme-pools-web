import { Chain } from "@/models/chain";
import { createContext, useContext, ReactNode } from "react";


export type ChainContextProps = {
  chain: Chain;
  setChain: (chain: Chain) => void;
};

export const ChainContext = createContext<ChainContextProps | undefined>(undefined);

export const useChain = () => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
};