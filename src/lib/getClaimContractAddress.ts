import { baseClaimContractAddress } from "@/config/env";
import { claimContractAddress } from "@/config/env";
import { Chain } from "@/models/chain";

export const getClaimContractAddress = (chain: Chain) => {
  return chain === Chain.Eth ? claimContractAddress : baseClaimContractAddress;
};
