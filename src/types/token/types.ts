import { CommentLikes, TokenVote, User } from "@prisma/client";

export type CreateTokenParams = {
  reservedAmount: BigInt;
  name: string | FormDataEntryValue;
  symbol: string | FormDataEntryValue;
};

export type TokenCreated = {
  creator: string;
  tokenId: number;
  reserved: number;
  tokenAddress: string;
};

export type Token = {
  id: string;
  tokenId: number;
  ticker: string;
  description: string;
  image: string;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  tokenAddress: string;
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
};

export type TokenWithVoteCount = Token & { _count: { TokenVote: number } };
