"use client";

import useTokenHolders from "@/hooks/useTokenHolders";
import TokenHolder from "./TokenHolder";
import { useChain } from "@/context/chain";
import useToken from "@/hooks/useToken";

type TokenHoldersProps = {
  tokenAddress: string;
  tokenId: string;
};


export default function TokenHolders({ tokenAddress, tokenId }: TokenHoldersProps) {
  const { chain } = useChain();
  const { holders } = useTokenHolders(tokenAddress, chain.name, tokenId);
  const { token } = useToken(tokenId);

  return (
    <section className="bg-dark rounded-lg p-4 tablet:p-6 min-h-[310px] max-h-[580px] tablet:min-h-[580px] tablet:h-[580px] min-w-[340px] tablet:min-w-[430px] tablet:w-[430px]">
      <div className="grid grid-cols-[15%_19%_16%_29%_23%] w-full">
        <div className="text-left pb-4">Rank</div>
        <div className="text-left pb-4">Wallet</div>
        <div className="text-center -mb-1"></div>
        <div className="text-center pb-4">Balance</div>
        <div className="text-center pb-4">%Supply</div>

        {holders?.map(holder => (
          <TokenHolder key={holder.owner} holder={holder} chain={chain.name} creator={token?.tokenCreator || null} />
        ))}
      </div>
    </section>
  );
}
