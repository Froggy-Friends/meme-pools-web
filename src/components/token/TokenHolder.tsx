import { etherscanUrl, solanaExplorerUrl } from "@/config/env";
import { formatAddress } from "@/lib/formatAddress";
import { TokenHolderEth, TokenHolderSol } from "@/types/token/types";
import Link from "next/link";
import { isEthHolder } from "./TokenHolders";
import { getHolderPercentage } from "@/lib/getHolderPercentage";

type TokenHolderProps = {
  holder: TokenHolderEth | TokenHolderSol;
  isRefetching: boolean;
};

export default function TokenHolder({ holder, isRefetching }: TokenHolderProps) {
  return (
    <div
      className={`flex items-center justify-between bg-dark p-2 rounded-lg h-12  w-full laptop:w-1/2 ${
        isRefetching ? "animate-primaryPulse" : ""
      }`}
    >
      <p>{holder.rank}</p>
      <Link
        href={
          isEthHolder(holder)
            ? `${etherscanUrl}/address/${holder.owner_address}`
            : `${solanaExplorerUrl}/account/${holder.owner}`
        }
        className="text-primary hover:text-light-primary transition"
        target="_blank"
      >
        {isEthHolder(holder) ? formatAddress(holder.owner_address) : formatAddress(holder.owner)}
      </Link>
      <p>
        {isEthHolder(holder)
          ? holder.percentage_relative_to_total_supply.toFixed(2)
          : getHolderPercentage(holder).toFixed(2)}
        %
      </p>
    </div>
  );
}
