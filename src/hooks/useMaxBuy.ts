import { Token } from "@prisma/client";
import useTokenInfo from "./useTokenInfo";
import useBuyPrice from "./useBuyPrice";
import { formatEther, parseUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";

export default function useMaxBuy(token: Token) {
  const { tokenInfo } = useTokenInfo(token);
  const { buyPriceTokens } = useBuyPrice();

  const { data: maxBuyPrice } = useQuery({
    queryKey: ["maxBuyPrice", token.id, tokenInfo?.availableSupply],
    enabled: !!tokenInfo?.availableSupply && tokenInfo.availableSupply > 0,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    queryFn: async () => {
      try {
        if (!tokenInfo?.availableSupply) return "0.0";

        const availableSupply = tokenInfo.availableSupply.toString();
        const totalCost = await buyPriceTokens(
          token.tokenAddress,
          parseUnits(availableSupply, 18)
        );

        return totalCost > 0 ? totalCost : "0.0";
      } catch (err) {
        Sentry.captureException(err);
        return "0.0";
      }
    },
  });

  return { maxBuyPrice };
}
