import { memepoolsDomain } from "@/config/env";
import { Address } from "viem";
import { Chain } from "@/models/chain";

export const getFrogsByWallet = async (address: Address, chain: Chain) => {
  if (!address) {
    return [];
  }

  const response = await fetch(
    `${memepoolsDomain}/api/frog-ids?address=${address}&chain=${chain}`
  );
  const data = await response.json();

  return data.result.map((frog: any) => Number(frog.token_id));
};
