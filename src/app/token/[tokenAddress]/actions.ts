"use server";
import prisma from "@/lib/prisma";
import { TokenVoteData, TokenVoteStatus } from "@/models/token";
import { TokenVote } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
  const comment = formData.get("comment") as string;

  await prisma.comment.create({
    data: {
      message: comment,
      author: userId,
      tokenId: tokenId,
    },
  });

  revalidatePath("/token");
};

export const addCommentLike = async (
  userId: string,
  commentId: string,
  status: string
) => {
  await prisma.commentLikes.create({
    data: {
      userId: userId,
      commentId: commentId,
      status: status,
    },
  });

  revalidatePath("/token");
};

export const removeCommentLike = async (commentLikeId: string) => {
  await prisma.commentLikes.delete({
    where: {
      id: commentLikeId,
    },
  });

  revalidatePath("/token");
};
