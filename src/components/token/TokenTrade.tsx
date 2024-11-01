import { baseExplorerUrl, etherscanUrl, solanaExplorerUrl } from "@/config/env";
import { defaultProfileAvatarUrl } from "@/config/user";
import { formatAddress } from "@/lib/formatAddress";
import { getTimeDifference } from "@/lib/getTimeDifference";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { Chain } from "@/models/chain";
import { Trade } from "@/models/trade";
import { FormattedTrade } from "@/types/token/types";
import Image from "next/image";
import Link from "next/link";

type TokenTradeProps = {
  trade: FormattedTrade;
};

export default function TokenTrade({ trade }: TokenTradeProps) {
  return (
    <div
      className={`flex items-center justify-between w-full h-[70px] rounded-lg bg-dark px-4 mb-1 ${
        trade.isNew ? "animate-primaryPulse" : ""
      }`}
    >
      <div className="flex items-center gap-x-3 tablet:gap-x-4">
        <Image
          src={trade.userAvatar || defaultProfileAvatarUrl}
          alt="user-profile-picture"
          height={50}
          width={50}
          className="rounded-full"
        />

        <div className="flex flex-col">
          <div className="flex gap-x-2 tablet:gap-x-4">
            <Link
              href={`/profile/${trade.username}`}
              className="font-proximaSoftBold text-white/80 hover:text-white hover:underline transition"
            >
              {getUserDisplayName(trade.username)}
            </Link>
            <p className="text-xs mt-1 tablet:mt-0 text-gray tablet:text-base">{getTimeDifference(trade.createdAt)}</p>
          </div>

          <p className="text-sm laptop:text-base overflow-y-auto">
            <span className="text-white">
              {`${trade.category === Trade.Buy ? "Bought" : "Sold"}`}{" "}
              <span className={`${trade.category === Trade.Buy ? "text-green" : "text-red"}`}>
                {`$${trade.usdCost.toFixed(2)}`}
              </span>
            </span>{" "}
            of <span className="text-blue">${trade.tokenTicker}</span>
          </p>
        </div>
      </div>

      <Link
        className="text-sm tablet:text-base text-light-primary hover:text-cream transition ml-3"
        href={`${
          trade.chain === Chain.Eth
            ? `${etherscanUrl}/tx/${trade.transactionHash}`
            : trade.chain === Chain.Solana
            ? `${solanaExplorerUrl}/tx/${trade.transactionHash}`
            : `${baseExplorerUrl}/tx/${trade.transactionHash}`
        }`}
        target="_blank"
      >
        {formatAddress(trade.transactionHash)}
      </Link>
    </div>
  );
}
