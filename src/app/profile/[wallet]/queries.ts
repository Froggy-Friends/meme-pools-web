"use server"

import prisma from "@/lib/prisma";
import { WalletAddress } from "@/lib/types";
import { unstable_cache } from "next/cache";

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