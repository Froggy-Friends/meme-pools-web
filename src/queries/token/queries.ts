"use server";

import { getVotesByTokenId } from "@/actions/token/actions";
import { memepoolsApi } from "@/config/env";
import prisma from "@/lib/prisma";
import { TokenWithCreator } from "@/lib/types";
import { Chain } from "@/models/chain";
import { TokenFilter, TokenVoteStatus } from "@/models/token";
import { TokenSearchResult, TokenWithVotes } from "@/types/token/types";

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
  tokenFilter: TokenFilter,
  page: number,
  chain: Chain
): Promise<TokenWithCreator[]> => {
  const response = await fetch(
    `${memepoolsApi}/token/${chain}/${tokenFilter}?page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    }
  );
  const tokens = await response.json();

  return tokens;
};

export const fetchTokenCount = async () => {
  const tokenCount = await prisma.token.count();

  return tokenCount;
};

export const fetchTokenById = async (tokenId: string) => {
  const token = await prisma.token.findUnique({
    where: {
      id: tokenId,
    },
  });

  return token;
};

export const fetchTokenByAddress = async (tokenAddress: string) => {
  const token = await prisma.token.findFirst({
    where: {
      tokenAddress: tokenAddress,
    },
    include: {
      _count: {
        select: {
          TokenVote: {
            where: {
              status: TokenVoteStatus.UPVOTE,
            },
          },
        },
      },
    },
  });

  return token;
};

export const fetchTopVotesTokens = async (chain: Chain) => {
  const response = await fetch(`${memepoolsApi}/token/${chain}/votes?page=1`, {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

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

export const searchTokens = async (search: string, chain: Chain) => {
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
        {
          tokenAddress: {
            equals: search,
            mode: "insensitive",
          },
        },
      ],
      chain: chain,
    },
    orderBy: {
      _relevance: {
        fields: ["name", "ticker"],
        search: search,
        sort: "desc",
      },
    },
  });

  return Promise.all(
    tokens.map(async (token) => {
      const voteCounts = await getVotesByTokenId(token.id);
      return {
        ...token,
        voteCount: voteCounts.upvotes - voteCounts.downvotes,
      };
    })
  );
};

export const fetchTrades = async (tokenId: string) => {
  const trades = await prisma.trades.findMany({
    where: {
      tokenId: tokenId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      User: true,
      Token: true,
    },
  });

  return trades;
};

export const fetchMemes = async (tokenId: string) => {
  const memes = await prisma.meme.findMany({
    where: {
      tokenId: tokenId,
    },
    include: {
      user: true,
    },
  });

  return memes;
};
