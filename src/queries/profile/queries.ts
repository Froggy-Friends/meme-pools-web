"use server";

import prisma from "@/lib/prisma";
import { Token, User } from "@prisma/client";
import { TokenWithCreator } from "@/lib/types";
import {
  ApeClaimWithToken,
  ClaimWithToken,
  TokenWithBalance,
} from "@/types/token/types";
import { Chain } from "@/models/chain";
import { ApeData } from "@/types/claim/types";

export const fetchUser = async (wallet: string | undefined) => {
  if (!wallet) {
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          name: wallet,
        },
        {
          solAddress: wallet,
        },
        {
          ethAddress: wallet,
        },
      ],
    },
  });

  return user;
};

export const fetchUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  return user;
};

export const fetchUserByName = async (name: string) => {
  const user = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });

  return user;
};

export const checkUserExists = async (wallet: string) => {
  const userExists = !!(await prisma.user.findFirst({
    where: {
      OR: [
        {
          solAddress: wallet,
        },
        {
          ethAddress: wallet,
        },
      ],
    },
  }));

  return userExists;
};

export const fetchFollow = async (accountId: string, followerId: string) => {
  const follow = await prisma.follow.findFirst({
    where: {
      account: accountId,
      follower: followerId,
    },
  });

  return follow;
};

export const fetchFollowers = async (accountId: string): Promise<User[]> => {
  const results = await prisma.follow.findMany({
    where: {
      account: accountId,
      status: "Follow",
    },
    include: {
      followerUser: true,
    },
    orderBy: {
      followedAt: "desc",
    },
  });

  return results.map((result) => result.followerUser);
};

export const fetchFollowing = async (followerId: string): Promise<User[]> => {
  const results = await prisma.follow.findMany({
    where: {
      follower: followerId,
      status: "Follow",
    },
    include: {
      followingUser: true,
    },
    orderBy: {
      followedAt: "desc",
    },
  });

  return results.map((result) => result.followingUser);
};

export const fetchCreatedTokens = async (
  userId: string,
  chain: Chain
): Promise<TokenWithCreator[]> => {
  const tokens = await prisma.token.findMany({
    where: {
      userId: userId,
      chain: chain,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tokens;
};

export const fetchFrogClaimableTokens = async (
  frogIds: number[],
  chain: Chain
): Promise<ClaimWithToken[]> => {
  const claims = await prisma.claim.findMany({
    where: {
      isClaimed: false,
      frogId: {
        in: frogIds,
      },
      token: {
        chain: chain,
      },
    },
    include: {
      token: true,
    },
  });

  const uniqueClaims = claims.reduce((acc, claim) => {
    return acc.some((c) => c.token.id === claim.token.id)
      ? acc
      : [...acc, claim];
  }, [] as ClaimWithToken[]);

  return uniqueClaims;
};

export const fetchApeClaimableTokens = async (
  apes: ApeData[]
): Promise<ApeClaimWithToken[]> => {
  const claims = await prisma.apeClaim.findMany({
    where: {
      isClaimed: false,
      OR: apes.map((ape) => ({
        nftId: parseInt(ape.apeId),
        collection: ape.collection,
      })),
      token: { chain: Chain.ApeChain },
    },
    include: { token: true },
  });

  const uniqueClaims = claims.reduce((acc, claim) => {
    return acc.some((c) => c.token.id === claim.token.id)
      ? acc
      : [...acc, claim];
  }, [] as ApeClaimWithToken[]);

  return uniqueClaims;
};

export const fetchUserHoldings = async (
  userId: string,
  chain: Chain
): Promise<TokenWithBalance[]> => {
  const holdings = await prisma.token.findMany({
    where: {
      Trades: {
        some: {
          userId: userId,
        },
      },
      chain: chain,
    },
    include: {
      Trades: {
        where: {
          userId: userId,
        },
        select: {
          category: true,
          amount: true,
        },
      },
    },
  });

  return holdings
    .map((token) => {
      const balance = token.Trades.reduce(
        (sum, trade) =>
          sum +
          (trade.category === "buy"
            ? Number(trade.amount)
            : -Number(trade.amount)),
        0
      );
      return {
        ...token,
        Trades: token.Trades.map((trade) => ({
          ...trade,
          amount: Number(trade.amount),
        })),
        balance,
      };
    })
    .filter((token) => token.balance > 0);
};
