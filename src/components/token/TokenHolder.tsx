import { contractAddress, etherscanUrl, solanaExplorerUrl } from "@/config/env";
import { formatAddress } from "@/lib/formatAddress";
import { TokenHolderData } from "@/types/token/types";
import Link from "next/link";
import { Chain } from "@/models/chain";
import { formatBalance } from "@/lib/formatBalance";
import { useEffect } from "react";

type TokenHolderProps = {
  holder: TokenHolderData;
  chain: Chain;
  creator: string | null;
};

export default function TokenHolder({ holder, chain, creator }: TokenHolderProps) {
  const isMemepoolsEth = holder.owner.toLowerCase() === contractAddress.toLowerCase();
  const isCreator = creator && holder.owner.toLowerCase() === creator.toLowerCase();

  return (
    <>
      <td className="w-[20%] pl-4 pb-1 text-sm tablet:text-base">{holder.rank}</td>
      <td className="w-[21%] pb-1 text-sm tablet:text-base">
        <Link
          href={
            chain === Chain.Eth
              ? `${etherscanUrl}/address/${holder.owner}`
              : `${solanaExplorerUrl}/account/${holder.owner}`
          }
          className="text-left text-primary hover:text-light-primary transition"
          target="_blank"
        >
          {formatAddress(holder.owner)}
        </Link>
      </td>
      <td className="w-[10%] pb-1">
        {isMemepoolsEth && (
          <span className="bg-cream rounded-3xl px-[0.625rem] text-center text-sm text-black font-bold">MP</span>
        )}
        {isCreator && (
          <span className="bg-cream rounded-3xl px-2  text-center text-sm text-black font-extrabold">Dev</span>
        )}
      </td>
      <td className="w-[29%] text-center pb-1 text-sm tablet:text-base">{formatBalance(holder.amount)}</td>
      <td className="w-[20%] text-center pb-1 text-sm tablet:text-base">{holder.percentage.toFixed(1)}%</td>
    </>
  );
}
