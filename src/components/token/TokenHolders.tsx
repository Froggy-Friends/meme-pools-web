"use client";

import useTokenHolders from "@/hooks/useTokenHolders";
import TokenHolder from "./TokenHolder";
import { useChain } from "@/context/chain";
import useToken from "@/hooks/useToken";
import { useEffect } from "react";
import useTokenHoldersApechain from "@/hooks/useTokenHoldersApechain";
import { Chain } from "@/models/chain";

type TokenHoldersProps = {
  tokenAddress: string;
  tokenId: string;
};

export default function TokenHolders({ tokenAddress, tokenId }: TokenHoldersProps) {
  const { chain } = useChain();
  const { holders } = useTokenHolders(tokenAddress, chain.name, tokenId);
  const { holdersApechain } = useTokenHoldersApechain(tokenId, chain.name);
  const { token } = useToken(tokenId);

  return (
    <section className="bg-dark rounded-lg p-4 tablet:p-6 min-h-[310px] max-h-[580px] tablet:min-h-[580px] tablet:h-[580px] min-w-[340px] tablet:min-w-[430px] tablet:w-[430px]">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-[15%_19%_16%_29%_23%] w-full">
          <div className="text-left pb-4">Rank</div>
          <div className="text-left pb-4">Wallet</div>
          <div className="text-center -mb-1"></div>
          <div className="text-center pb-4">Balance</div>
          <div className="text-center pb-4">%Supply</div>
        </div>

        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {chain.name === Chain.ApeChain ? <div className="grid grid-cols-[15%_19%_16%_29%_23%] w-full">
            {holdersApechain?.map(holder => (
              <TokenHolder
                key={holder.owner}
                holder={holder}
                chain={chain.name}
                creator={token?.tokenCreator || null}
              />
            ))}
          </div> : <div className="grid grid-cols-[15%_19%_16%_29%_23%] w-full">
            {holders?.map(holder => (
              <TokenHolder
                key={holder.owner}
                holder={holder}
                chain={chain.name}
                creator={token?.tokenCreator || null}
              />
            ))}
          </div>}
        </div>
      </div>
    </section>
  );
}
