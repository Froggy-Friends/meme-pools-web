"use server";
import { getPusher } from "@/config/pusher";
import prisma from "@/lib/prisma";
import { Channel } from "@/models/channel";
import { CommentLikeStatus } from "@/models/comment";
import { TokenVoteData, TokenVoteStatus } from "@/models/token";
import { fetchUser } from "@/queries/profile/queries";
import { fetchTokenByAddress } from "@/queries/token/queries";
import { CommentLikes, Prisma, TokenVote } from "@prisma/client";
import { formatUnits } from "viem";

export async function getVotesByTokenId(
  tokenId: string
): Promise<TokenVoteData> {
  const result = await prisma.tokenVote.groupBy({
    by: ["status"],
    where: {
      tokenId,
    },
    _count: {
      status: true,
    },
  });

  const voteCounts = {
    upvotes: 0,
    downvotes: 0,
    total: 0,
  };

  result.forEach((item) => {
    if (item.status === TokenVoteStatus.UPVOTE) {
      voteCounts.upvotes = item._count.status;
    } else if (item.status === TokenVoteStatus.DOWNVOTE) {
      voteCounts.downvotes = item._count.status;
    }
    voteCounts.total += item._count.status;
  });

  return voteCounts;
}

export async function getUserVote(
  tokenId: string,
  userId: string
): Promise<TokenVote | null> {
  const vote = await prisma.tokenVote.findFirst({
    where: {
      tokenId,
      userId,
    },
  });

  return vote;
}

export async function updateVote(
  tokenId: string,
  userId: string,
  status: string | null
) {
  const pusher = getPusher();
  const vote = await prisma.tokenVote.upsert({
    where: {
      tokenId_userId: {
        tokenId,
        userId,
      },
    },
    update: {
      status,
    },
    create: {
      tokenId,
      userId,
      status,
    },
    include: {
      User: {
        select: {
          name: true,
        },
      },
      Token: {
        select: {
          ticker: true,
        },
      },
    },
  });

  const voteCounts = await getVotesByTokenId(tokenId);
  const channel =
    status === TokenVoteStatus.UPVOTE ? Channel.Upvotes : Channel.Downvotes;
  pusher.trigger(channel, tokenId, {
    voteCounts,
    feedData:
      vote && vote.status !== null
        ? {
            user: vote.User,
            date: new Date().toISOString(),
            value: vote.Token.ticker,
          }
        : null,
  });
}

export const postComment = async (
  formData: FormData,
  userId: string,
  tokenId: string
) => {
  const pusher = getPusher();
  const message = formData.get("comment") as string;

  const comment = await prisma.comment.create({
    data: {
      message: message,
      author: userId,
      tokenId: tokenId,
    },
    include: {
      commentLikes: true,
      user: true,
    },
  });

  pusher.trigger(Channel.Comment, tokenId, {
    comment,
    feedData: {
      user: comment.user,
      date: comment.createdAt,
      value: comment.message,
    },
  });
};

export const addCommentLike = async (
  userId: string,
  commentId: string,
  status: string,
  prevCommentLikeId?: string
) => {
  const pusher = getPusher();
  let remove: CommentLikes | null = null;

  const result = await prisma.commentLikes.create({
    data: {
      userId: userId,
      commentId: commentId,
      status: status,
    },
    include: {
      User: true,
      Comment: {
        select: {
          message: true,
        },
      },
    },
  });

  if (prevCommentLikeId) {
    const result = await prisma.commentLikes.delete({
      where: {
        id: prevCommentLikeId,
      },
      include: {
        User: true,
        Comment: {
          select: {
            message: true,
          },
        },
      },
    });

    remove = result;
  }

  let channel =
    status === CommentLikeStatus.LIKE
      ? Channel.CommentLikes
      : Channel.CommentDislikes;

  pusher.trigger(channel, commentId, {
    add: result,
    remove: remove,
    feedData: {
      user: result.User,
      date: result.createdAt,
      value: result.Comment.message,
    },
  });

  return result;
};

export const removeCommentLike = async (
  commentLikeId: string,
  commentId: string
) => {
  const pusher = getPusher();
  const result = await prisma.commentLikes.delete({
    where: {
      id: commentLikeId,
    },
    include: {
      User: true,
    },
  });

  pusher.trigger(Channel.CommentLikes, commentId, {
    add: null,
    remove: result,
  });
};

export const addTrade = async (
  tokenAddress: string,
  userAddress: string,
  category: string,
  price: number,
  amount: number,
  cost: number,
  nativeToken: string,
  chain: string,
) => {
  const token = await fetchTokenByAddress(tokenAddress);
  const user = await fetchUser(userAddress);
  if (!token || !user) {
    return;
  }

  const trade = await prisma.trades.create({
    data: {
      tokenId: token.id,
      userId: user.id ,
      category,
      price: new Prisma.Decimal(formatUnits(BigInt(price), 18)),
      amount: Number(formatUnits(BigInt(amount), 18)),
      cost: new Prisma.Decimal(cost),
      nativeToken,
      chain,
    },
  });
};
