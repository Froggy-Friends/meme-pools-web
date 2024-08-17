"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const postComment = async (
  formData: FormData,
  userId: string,
  tokenId: string
) => {
  const comment = formData.get("comment") as string;

  await prisma.comment.create({
    data: {
      message: comment,
      author: userId,
      tokenId: tokenId,
    },
  });

  revalidatePath("/token");
};
