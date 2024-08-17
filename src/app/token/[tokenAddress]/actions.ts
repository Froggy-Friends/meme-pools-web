"use server";
import prisma from "@/lib/prisma";
import { TokenVoteData, VoteStatus } from "@/lib/types";
import { Vote } from "@prisma/client";

export async function getVotesByTokenId(
  tokenId: string
): Promise<TokenVoteData> {
  const result = await prisma.vote.groupBy({
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
    if (item.status === "upvote") {
      voteCounts.upvotes = item._count.status;
    } else if (item.status === "downvote") {
      voteCounts.downvotes = item._count.status;
    }
    voteCounts.total += item._count.status;
  });

  return voteCounts;
}

export async function getUserVote(
  tokenId: string,
  userId: string
): Promise<Vote | null> {
  const vote = await prisma.vote.findFirst({
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
  await prisma.vote.upsert({
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
