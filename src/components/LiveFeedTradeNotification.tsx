import { defaultProfileAvatarUrl } from "@/config/user";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { FormattedTrade } from "@/types/token/types";
import Image from "next/image";

export function LiveFeedTradeNotification({ trade, isAnimating }: { trade: FormattedTrade; isAnimating: boolean }) {
  return (
    <div
      className={`text-sm font-proximaSoft flex items-center gap-1 transition-all duration-500 ease-in-out ${
        isAnimating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <Image
        src={trade.userAvatar || defaultProfileAvatarUrl}
        alt="user-profile-picture"
        height={16}
        width={16}
        className="rounded-full mr-1"
      />
      <span>{getUserDisplayName(trade.username)}</span>
      <span className="text-green">bought</span>
      <span className="text-cream">{trade.amount}</span>
      <span className="text-light-green">${trade.tokenTicker}</span>
    </div>
  );
}
