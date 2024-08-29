import { CommentLikes, Token, User } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";

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

export type TokenWithVotes = Token & { user: User } & {
  voteCount: { upVotes: number; downVotes: number };
};

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
