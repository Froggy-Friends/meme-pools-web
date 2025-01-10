"use server";

import { getVotesByTokenId } from "@/actions/token/actions";
import { apeChainContractAddress, memepoolsApi } from "@/config/env";
import { maxTotalSupply } from "@/config/token";
import prisma from "@/lib/prisma";
import { TokenWithCreator } from "@/lib/types";
import { Chain } from "@/models/chain";
import { TokenFilter, TokenVoteStatus } from "@/models/token";
import {
  TokenHolderData,
  TokenSearchResult,
  TokenWithVotes,
} from "@/types/token/types";

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

export const fetchTokenByAddress = async (
  tokenAddress: string,
  chain: Chain
) => {
  const token = await prisma.token.findFirst({
    where: {
      tokenAddress: tokenAddress,
      chain: chain,
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

export const getTokenHoldersApechain = async (
  tokenId: string
): Promise<TokenHolderData[]> => {
  const holdings = await prisma.$queryRaw`
    WITH holder_balances AS (
      SELECT 
        u.id,
        u.name, 
        u."ethAddress" as owner,
        SUM(
          CASE 
            WHEN t.category = 'buy' THEN t.amount
            WHEN t.category = 'sell' THEN -t.amount
            ELSE 0
          END
        ) as amount
      FROM "Trades" t
      JOIN "User" u ON t."userId" = u.id
      WHERE t."tokenId" = ${tokenId}::uuid
      GROUP BY u.id, u.name, u."ethAddress"
      HAVING SUM(
        CASE 
          WHEN t.category = 'buy' THEN t.amount
          WHEN t.category = 'sell' THEN -t.amount
          ELSE 0
        END
      ) > 0
    )
    SELECT 
      ROW_NUMBER() OVER (ORDER BY amount DESC)::int as rank,
      COALESCE(owner, ${apeChainContractAddress}) as owner,
      COALESCE(amount, ${maxTotalSupply} - (SELECT COALESCE(SUM(amount), 0) FROM holder_balances))::float8 as amount,
      COALESCE(amount, ${maxTotalSupply} - (SELECT COALESCE(SUM(amount), 0) FROM holder_balances)) * 100.0 / ${maxTotalSupply}::float8 as percentage
    FROM (
      SELECT owner, amount FROM holder_balances
      UNION ALL
      SELECT 
        ${apeChainContractAddress}::text,
        ${maxTotalSupply} - (SELECT COALESCE(SUM(amount), 0) FROM holder_balances)::float8
      WHERE (SELECT COALESCE(SUM(amount), 0) FROM holder_balances) < ${maxTotalSupply}
    ) all_holders
    WHERE amount > 0
    ORDER BY amount DESC
    LIMIT 20
  `;

  return holdings as TokenHolderData[];
};
