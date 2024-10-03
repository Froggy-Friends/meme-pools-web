import { Trade } from "@/models/trade";
import { TradeWithUserAndToken } from "@/types/token/types";
import { Chain } from "@/models/chain";

export const formatTradesData = (trades: TradeWithUserAndToken[]) => {
  return trades.map((trade) => {
    return {
      id: trade.id,
      category: trade.category as Trade,
      username: trade.User.name,
      userAvatar: trade.User.imageUrl,
      amount: Number(trade.amount),
      tokenTicker: trade.Token.ticker,
      nativeCost: Number(trade.nativeCost),
      chain: trade.Token.chain as Chain,
      transactionHash: trade.transactionHash,
      createdAt: trade.createdAt,
    };
  });
};
