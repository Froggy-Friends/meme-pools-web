"use client";

import useTokenInfo from "@/hooks/useTokenInfo";
import { Token } from "@prisma/client";

type LiquidityPoolBannerProps = {
  token: Token;
};

export default function LiquidityPoolBanner({ token }: LiquidityPoolBannerProps) {
  const { tokenInfo } = useTokenInfo(token);

  return (
    <>
      {tokenInfo?.readyForLp && (
        <section className="w-full h-12 tablet:h-20 mb-8 tablet:mb-12 flex items-center justify-center bg-primary rounded-lg tablet:text-3xl">
          <p className="text-black">All coins sold, liquidity pool coming soon!</p>
        </section>
      )}
    </>
  );
}
