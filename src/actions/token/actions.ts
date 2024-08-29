"use server";
import { pusher } from "@/config/pusher";
import prisma from "@/lib/prisma";
import { Channel } from "@/models/channel";
import { TokenVoteData, TokenVoteStatus } from "@/models/token";
import { CommentLikes, TokenVote } from "@prisma/client";

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

  pusher.trigger(Channel.Votes, tokenId, voteCounts);
  
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
  await prisma.tokenVote.upsert({
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
  });
}

export const postComment = async (
  formData: FormData,
  userId: string,
  tokenId: string
) => {
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

  pusher.trigger(Channel.Comment, tokenId, comment);
};

export const addCommentLike = async (
  userId: string,
  commentId: string,
  status: string,
  prevCommentLikeId?: string
) => {
  let remove: CommentLikes | null = null;

  const result = await prisma.commentLikes.create({
    data: {
      userId: userId,
      commentId: commentId,
      status: status,
    },
    include: {
      User: true,
    },
  });

  if (prevCommentLikeId) {
    const result = await prisma.commentLikes.delete({
      where: {
        id: prevCommentLikeId,
      },
      include: {
        User: true,
      },
    });

    remove = result;
  }

  pusher.trigger(Channel.CommentLikes, commentId, {
    add: result,
    remove: remove,
  });

  return result;
};

export const removeCommentLike = async (
  commentLikeId: string,
  commentId: string
) => {
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
