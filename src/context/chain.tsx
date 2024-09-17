import { Chain, ChainConfig } from "@/models/chain";
import { createContext, useContext } from "react";

export type ChainContextProps = {
  chain: ChainConfig;
  setChain: (chain: ChainConfig) => void;
};

export const ChainContext = createContext<ChainContextProps | undefined>(undefined);

export const useChain = () => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
};
