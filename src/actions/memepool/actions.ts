"use server";

import { getPusher } from "@/config/pusher";
import prisma from "@/lib/prisma";
import { Channel } from "@/models/channel";
import { uploadImage } from "../create/actions";

export const addMeme = async (
  tokenId: string,
  userId: string | undefined,
  formData: FormData,
  postId: string
) => {
  if (!userId) {
    return;
  }

  const blob = await uploadImage(formData);

  const meme = await prisma.meme.create({
    data: {
      tokenId: tokenId,
      userId: userId,
      imageUrl: blob.url,
      postId: postId,
    },
    include: {
      user: true,
    },
  });
};

export const addPost = async (tokenId: string, userId: string | undefined) => {
  if (!userId) {
    return;
  }

  const post = await prisma.post.create({
    data: {
      tokenId: tokenId,
      userId: userId,
    },
  });

  return post;
};
