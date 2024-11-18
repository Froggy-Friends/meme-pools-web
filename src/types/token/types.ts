import { Chain } from "@/models/chain";
import { Trade } from "@/models/trade";
import { Claim, CommentLikes, Meme, Token, Trades, User } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";

export type CreateTokenParams = {
  reservedAmount: BigInt;
  name: string | FormDataEntryValue;
  symbol: string | FormDataEntryValue;
  autoLaunch: boolean;
};

export type TokenCreated = {
  tokenAddress: string;
  creator: string;
  name: string;
  symbol: string;
  reserved: number;
};

export type TokensBought = {
  tokenAddress: string;
  buyer: string;
  amount: number;
  price: number;
  cost: number;
};

export type TokensSold = {
  tokenAddress: string;
  seller: string;
  amount: number;
  price: number;
  payout: number;
};

export type TokenTradeEvent = {
  maker: string;
  tradeType: Trade;
  price: number;
  amount: number;
  nativeCost: number;
  usdCost: number;
  txHash: string;
};

export type CommentWithLikes = {
  id: string;
  message: string;
  author: string;
  tokenId: string;
  createdAt: Date;
  updatedAt: Date | null;
  commentLikes: CommentLikes[];
  commentLikeCount: number;
  commentDislikeCount: number;
  user: User;
  isNew?: boolean;
};

export type TokenWithVoteCount = Token & { _count: { TokenVote: number } };

export type TokenWithVotes = Token & { user: User } & {
  voteCount: { upVotes: number; downVotes: number };
};

export type TokenSearchResult = Token & { voteCount: number };

export type HandleDislike = UseMutationResult<
  void,
  Error,
  void,
  {
    initialLikesCount: number | undefined;
    initialDislikesCount: number | undefined;
    initialLikeData: unknown;
    initialDislikeData: unknown;
  }
>;

export type HandleLike = UseMutationResult<
  void,
  Error,
  void,
  {
    initialLikesCount: number | undefined;
    initialDislikesCount: number | undefined;
    initialLikeData: unknown;
    initialDislikeData: unknown;
  }
>;

export type CommentLikesWithUser = CommentLikes & { user: User };

export type TradeWithUserAndToken = Trades & { User: User } & { Token: Token };

export type MemeWithUser = Meme & { user: User };

export type FormattedTrade = {
  id: string;
  category: Trade;
  username: string;
  userAvatar: string | null;
  amount: number;
  tokenTicker: string;
  nativeCost: number;
  usdCost: number;
  chain: Chain;
  transactionHash: string;
  createdAt: Date;
  isNew?: boolean;
};

export type TxStatus = "idle" | "pending" | "completed" | "error";

export type TokenInfo = {
  tokenAddress: string;
  creator: string;
  totalSupply: number;
  availableSupply: number;
  marketcap: number;
  tokensSold: number;
  balance: bigint;
  price: bigint;
  name: string;
  symbol: string;
  readyForLp: boolean;
  liquidityPoolSeeded: boolean;
};

export type ClaimWithToken = Claim & { token: Token };

export type TokenHolderEth = {
  balance: string;
  balance_formatted: string;
  is_contract: boolean;
  owner_address: string;
  owner_address_label: string | null;
  entity: string | null;
  entity_logo: string | null;
  usd_value: number | null;
  percentage_relative_to_total_supply: number;
  rank: number;
};

export type TokenHolderSol = {
  address: string;
  mint: string;
  owner: string;
  amount: number;
  delegated_amount: number;
  frozen: boolean;
  rank: number;
};

export type TokenHolderData = {
  rank: number;
  owner: string;
  amount: number;
  percentage: number;
};
