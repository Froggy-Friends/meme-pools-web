"use server";

import prisma from "@/lib/prisma";
import { TokenWithCreator } from "@/lib/types";
import { TokenWithVotes } from "@/types/token/types";

export const checkTokenNameExists = async (name: string) => {
  const exists = !!(await prisma.token.findFirst({
    where: {
      name: name,
    },
  }));

  return exists;
};

export const checkTokenTickerExists = async (ticker: string) => {
  const tokenTickerExists = !!(await prisma.token.findFirst({
    where: {
      ticker: ticker,
    },
  }));

  return tokenTickerExists;
};

export const fetchTokens = async (
  tokenFilter: string,
  page: number
): Promise<TokenWithCreator[]> => {
  const response = await fetch(
    `${process.env.FROG_FUN_API_URL}/token/${tokenFilter}?page=${page}`
  );
  const tokens = await response.json();

  return tokens;
};

export const fetchTokenCount = async () => {
  const tokenCount = await prisma.token.count();

  return tokenCount;
};

export const fetchTokenByAddress = async (tokenAddress: string) => {
  const token = await prisma.token.findFirst({
    where: {
      tokenAddress: tokenAddress,
    },
  });

  return token;
};

export const fetchTopVotesTokens = async () => {
  const response = await fetch(
    `${process.env.FROG_FUN_API_URL}/token/votes?page=1`
  );

  const tokens: TokenWithVotes[] = await response.json();

  return tokens.slice(0, 3);
};

export const fetchComments = async (tokenId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      tokenId: tokenId,
    },
    include: {
      commentLikes: true,
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const commentsWithLikes = comments.map((comment) => {
    let commentLikeCount = 0;
    let commentDislikeCount = 0;
    comment.commentLikes.forEach((data) => {
      data.status === "like" && commentLikeCount++;
      data.status === "dislike" && commentDislikeCount++;
    });

    return {
      ...comment,
      commentLikeCount: commentLikeCount,
      commentDislikeCount: commentDislikeCount,
    };
  });

  return commentsWithLikes;
};

export const searchTokens = async (search: string) => {
  const tokens = await prisma.token.findMany({
    where: {
      OR: [
        {
          ticker: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      _relevance: {
        fields: ["name", "ticker"],
        search: search,
        sort: "asc",
      },
    },
    include: {
      _count: {
        select: {
          TokenVote: {
            where: {
              status: "upvote",
            },
          },
        },
      },
    },
  });

  return tokens;
};

export const searchTokensByCa = async (contractAddress: string) => {
  const token = await prisma.token.findFirst({
    where: {
      tokenAddress: contractAddress,
    },
    include: {
      _count: {
        select: {
          TokenVote: true,
        },
      },
    },
  });

  return token;
};
