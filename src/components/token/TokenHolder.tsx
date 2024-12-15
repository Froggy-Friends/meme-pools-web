import { contractAddress, etherscanUrl, solanaExplorerUrl } from "@/config/env";
import { formatAddress } from "@/lib/formatAddress";
import { TokenHolderData } from "@/types/token/types";
import Link from "next/link";
import { Chain } from "@/models/chain";
import { formatBalance } from "@/lib/formatBalance";

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
      <div className="pr-3 tablet:pr-6 pb-1 text-center text-sm tablet:text-base">{holder.rank}</div>
      <div className="pb-1 text-sm tablet:text-base">
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
      </div>
      <div className="pb-1 text-center -mt-[3px] tablet:-mt-[1px]">
        {isMemepoolsEth && (
          <span className="bg-cream rounded-3xl px-[0.625rem] text-center text-sm text-black font-bold">MP</span>
        )}
        {isCreator && (
          <span className="bg-cream rounded-3xl px-2 text-center text-sm text-black font-extrabold">Dev</span>
        )}
      </div>
      <div className="text-center pb-1 text-sm tablet:text-base">{formatBalance(holder.amount)}</div>
      <div className="text-center pb-1 text-sm tablet:text-base">{holder?.percentage?.toFixed(1) || 0}%</div>
    </>
  );
}
