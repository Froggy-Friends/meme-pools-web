import { baseExplorerUrl, ethercanUrl, solanaExplorerUrl } from "@/config/env";
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
        trade.isNew ? "animate-greenPulse" : ""
      }`}
    >
      <div className="flex items-center gap-x-4">
        <Image
          src={trade.userAvatar || defaultProfileAvatarUrl}
          alt="user-profile-picture"
          height={50}
          width={50}
          className="rounded-full"
        />

        <div className="flex flex-col">
          <div className="flex gap-x-4">
            <Link
              href={`/profile/${trade.username}`}
              className="font-proximaSoftBold text-white/80 hover:text-white hover:underline transition"
            >
              {getUserDisplayName(trade.username)}
            </Link>
            <p className="text-gray">{getTimeDifference(trade.createdAt)}</p>
          </div>

          <p>
            <span className={`${trade.category === Trade.Buy ? "text-light-green" : "text-rose"}`}>
              {`${trade.category === Trade.Buy ? "Bought" : "Sold"}`}
            </span>{" "}
            {trade.amount} <span className="text-blue">${trade.tokenTicker}</span> for $
            {Number(trade.nativeCost).toFixed(8)}{" "}
            <span className="text-[#CFB2F4]">{trade.chain === Chain.Solana ? "$SOL" : "$ETH"}</span>
          </p>
        </div>
      </div>

      <Link
        className="text-light-green hover:text-cream transition"
        href={`${
          trade.chain === Chain.Eth
            ? `${ethercanUrl}/tx/${trade.transactionHash}`
            : trade.chain === Chain.Solana
            ? `${solanaExplorerUrl}/tx/${trade.transactionHash}`
            : `${baseExplorerUrl}/tx/${trade.transactionHash}`
        }`}
        target="_blank"
      >
        {formatAddress(trade.transactionHash, 5)}
      </Link>
    </div>
  );
}
