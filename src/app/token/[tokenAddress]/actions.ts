"use server";
import prisma from "@/lib/prisma";
import { TokenVoteData, VoteStatus } from "@/lib/types";

export async function getVotesByTokenId(tokenId: string): Promise<TokenVoteData> {
  const voteCounts = await prisma.vote.findMany({
    where: {
      tokenId,
    },
  });

  const result = {
    upvotes: 0,
    downvotes: 0,
    total: voteCounts.length,
  };

  voteCounts.forEach((voteCount) => {
    if (voteCount.status === "upvote") result["upvotes"] += 1;
    else if (voteCount.status === "downvote") result["downvotes"] += 1;
  });

  return result;
}

export async function getUserVote(tokenId: string, userId: string): Promise<VoteStatus> {
  const vote = await prisma.vote.findFirst({
    where: {
      tokenId,
      userId,
    },
  });

  return vote?.status as VoteStatus ?? null;
}

export async function updateVote(
  tokenId: string,
  userId: string,
  status: string | null
) {
  const existingVote = await prisma.vote.findFirst({
    where: {
      tokenId,
      userId,
    },
  });

  if (existingVote) {
    await prisma.vote.update({
      where: {
        id: existingVote.id,
      },
      data: {
        status,
      },
    });
  } else {
    await prisma.vote.create({
      data: {
        tokenId,
        userId,
        status,
      },
    });
  }
}
