"use server";

import prisma from "@/lib/prisma";

export const getPosts = async (tokenId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      tokenId: tokenId,
    },
    include: {
      memes: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
};
