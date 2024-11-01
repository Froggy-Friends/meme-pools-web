import { Chain } from "@/models/chain";
import { Trade } from "@/models/trade";
import { TradeWithUserAndToken } from "@/types/token/types";

export const formatTradeData = (trade: TradeWithUserAndToken) => {
  return {
    id: trade.id,
    category: trade.category as Trade,
    username: trade.User.name,
    userAvatar: trade.User.imageUrl,
    amount: Number(trade.amount),
    tokenTicker: trade.Token.ticker,
    nativeCost: Number(trade.nativeCost),
    usdCost: Number(trade.usdCost),
    chain: trade.Token.chain as Chain,
    transactionHash: trade.transactionHash,
    createdAt: trade.createdAt,
  };
};
