import { Token } from "@prisma/client";
import useTokenInfo from "./useTokenInfo";
import useBuyPrice from "./useBuyPrice";
import { formatEther, parseUnits } from "viem";
import { useQuery } from "@tanstack/react-query";

export default function useMaxBuy(token: Token) {
  const { tokenInfo } = useTokenInfo(token);
  const { buyPriceTokens } = useBuyPrice();

  const { data: maxBuyPrice } = useQuery({
    queryKey: ["maxBuyPrice", token.id, tokenInfo?.availableSupply],
    enabled: !!tokenInfo?.availableSupply,
    queryFn: async () => {
      const price = await buyPriceTokens(
        token.tokenAddress,
        parseUnits(tokenInfo?.availableSupply?.toString() || "0", 18)
      );
      return Number(formatEther(price)).toFixed(2);
    },
  });

  return { maxBuyPrice };
}
