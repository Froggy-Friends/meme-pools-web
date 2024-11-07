"use client";

import { TokenHolderEth, TokenHolderSol } from "@/types/token/types";
import useTokenHolders from "@/hooks/useTokenHolders";
import TokenHolder from "./TokenHolder";
import { useChain } from "@/context/chain";
import useToken from "@/hooks/useToken";

type TokenHoldersProps = {
  tokenAddress: string;
  tokenId: string;
};

export const isEthHolder = (holder: TokenHolderEth | TokenHolderSol): holder is TokenHolderEth => {
  return "owner_address" in holder;
};

export default function TokenHolders({ tokenAddress, tokenId }: TokenHoldersProps) {
  const { chain } = useChain();
  const { holders } = useTokenHolders(tokenAddress, chain.name, tokenId);
  const { token } = useToken(tokenId);

  return (
    <section className="bg-dark rounded-lg p-4 tablet:p-6 min-h-[310px] max-h-[580px] tablet:min-h-[580px] tablet:h-[580px] min-w-[340px] tablet:min-w-[430px] tablet:w-[430px]">
      <table className="bg-dark rounded-lg w-full">
        <thead>
          <tr className="w-full">
            <th className="w-[21%] text-left font-normal pb-4">Rank</th>
            <th className="text-left w-[22%] font-normal pb-4">Wallet</th>
            <th className="w-[10%] text-center font-normal -mb-1"></th>
            <th className="w-[29%] text-center font-normal pb-4">Balance</th>
            <th className="w-[20%] text-center font-normal pb-4">%Supply</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {holders?.map(holder => (
            <tr key={holder.owner} className="w-full">
              <TokenHolder holder={holder} chain={chain.name} creator={token?.tokenCreator || null} />
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
