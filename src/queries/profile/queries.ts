"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { fetchUserCacheKey, fetchUserCacheTag } from "@/config/user";
import { User } from "@prisma/client";
import { TokenWithCreator } from "@/lib/types";

export const fetchUser = unstable_cache(
  async (wallet: string | undefined) => {
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
  },
  [fetchUserCacheKey],
  { tags: [fetchUserCacheTag] }
);

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
  userId: string
): Promise<TokenWithCreator[]> => {
  const tokens = await prisma.token.findMany({
    where: {
      userId: userId,
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
