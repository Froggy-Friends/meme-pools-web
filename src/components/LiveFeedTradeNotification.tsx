import { defaultProfileAvatarUrl } from "@/config/user";
import { FormattedTrade } from "@/types/token/types";
import Image from "next/image";

type LiveFeedTradeNotificationProps = {
  trade: FormattedTrade;
  isAnimating: boolean;
  spotlight?: boolean;
};

export function LiveFeedTradeNotification({ trade, isAnimating, spotlight = false }: LiveFeedTradeNotificationProps) {
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

      {spotlight && <span className="text-green">${trade.usdCost.toFixed(2)}</span>}
      {!spotlight && <span className="text-light-green">${trade.tokenTicker}</span>}
      {spotlight && <span>Buy</span>}
    </div>
  );
}
