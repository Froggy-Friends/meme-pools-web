"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { User, WagmiConnectionsValue } from "./types";
import { FETCH_USER_CACHE_KEY, FETCH_USER_CACHE_TAG } from "./constants";

export const fetchUser = unstable_cache(
  async (wallet: string) => {
    if (!wallet) {
      return;
    }

    const user = await prisma.user.findFirst({
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
    });

    return user;
  },
  [FETCH_USER_CACHE_KEY],
  { tags: [FETCH_USER_CACHE_TAG] }
);

export const fetchUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
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

export const getUserFromCookies = async (
  cookieStore: ReadonlyRequestCookies
) => {
  let wagmiCookies: Storage | null = null;
  let account = "";
  let userAddress = "";
  let user: User | null | undefined = null;
  const userCookies = cookieStore.get("wagmi.store");

  if (userCookies) {
    wagmiCookies = JSON.parse(userCookies.value!);
  }

  if (wagmiCookies) {
    account = wagmiCookies.state.connections.value
      .flat()
      .map((data: WagmiConnectionsValue) => {
        return data.accounts;
      });
  }

  if (account.length > 1) {
    userAddress = account[1].toString();
  }

  if (userAddress) {
    user = await fetchUser(userAddress);
  }

  return user;
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
