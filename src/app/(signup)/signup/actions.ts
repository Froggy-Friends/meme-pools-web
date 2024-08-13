"use server";

import prisma from "@/lib/prisma";

type CreateUser = {
  wallet: string;
  email: string;
  name: string;
};

export async function createUser(user: CreateUser) {
  const createdUser = await prisma.user.create({
    data: {
      wallet: user.wallet,
      email: user.email,
      name: user.name,
    },
  });

  return createdUser;
}
