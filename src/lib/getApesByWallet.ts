import { memepoolsDomain } from "@/config/env";
import { Address } from "viem";
import { Chain } from "@/models/chain";
import { ApeData } from "@/types/claim/types";

export const getApesByWallet = async (address: Address, chain: Chain) => {
  if (!address || chain !== Chain.ApeChain) {
    return [];
  }

  const response = await fetch(
    `http://localhost:3000/api/ape-ids?address=${address}`
  );
  const data = await response.json();

  const apes: ApeData[] = data.result.map((ape: any) => {
    return {
      apeId: ape.tokenId,
      collection: ape.contract.symbol.toLowerCase(),
    };
  });

  const baycIds = apes.filter((ape: any) => ape.collection === "bayc").map((ape: any) => ape.apeId);
  const maycIds = apes.filter((ape: any) => ape.collection === "mayc").map((ape: any) => ape.apeId);

  return { apes, baycIds, maycIds };
};

