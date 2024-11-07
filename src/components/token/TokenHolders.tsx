"use client";

import { TokenHolderEth, TokenHolderSol } from "@/types/token/types";
import useTokenHolders from "@/hooks/useTokenHolders";
import TokenHolder from "./TokenHolder";
import { useChain } from "@/context/chain";

type TokenHoldersProps = {
  tokenAddress: string;
  tokenId: string;
};

export const isEthHolder = (holder: TokenHolderEth | TokenHolderSol): holder is TokenHolderEth => {
  return "owner_address" in holder;
};

export default function TokenHolders({ tokenAddress, tokenId }: TokenHoldersProps) {
  const { chain } = useChain();
  const { holders, isLoading, isRefetching } = useTokenHolders(tokenAddress, chain.name, tokenId );

  return (
    <section className="flex flex-col gap-y-2">
      {holders?.map(holder => (
        <TokenHolder key={isEthHolder(holder) ? holder.owner_address : holder.owner} holder={holder} isRefetching={isRefetching} />
      ))}
    </section>
  );
}
