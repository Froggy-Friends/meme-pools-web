import { contractAddress, baseContractAddress } from "@/config/env";
import { Chain } from "@/models/chain";

export const getContractAddress = (chain: Chain) => {
  return chain === Chain.Eth ? contractAddress : baseContractAddress;
};
    
