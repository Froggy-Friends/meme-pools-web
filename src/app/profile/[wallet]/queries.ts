"use server";

import prisma from "@/lib/prisma";
import { WalletAddress } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { User, WagmiConnectionsValue } from "./types";

export const fetchUser = unstable_cache(
  async (wallet: WalletAddress) => {
    if (!wallet) {
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        wallet: wallet,
      },
    });

    return user;
  },
  ["my-app-user"],
  { tags: ["user"] }
);

export const fetchUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  return user;
};

export const checkUserExists = async (wallet: WalletAddress) => {
  const userExists = !!(await prisma.user.findFirst({
    where: {
      wallet: wallet,
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
    user = await fetchUser(userAddress as WalletAddress);
  }

  return user;
};
