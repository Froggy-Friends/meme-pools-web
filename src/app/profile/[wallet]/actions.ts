"use server";

import prisma from "@/lib/prisma";
import { UserParams } from "./types";
import { revalidateTag } from "next/cache";
import { Address } from "@/lib/types";
import { fetchUser } from "./queries";
import { put } from "@vercel/blob";
import { DEFAULT_PROFILE_AVATAR_URL, FETCH_USER_CACHE_TAG } from "./constants";

export const createUser = async ({
  name,
  wallet,
  imageUrl,
  email,
}: UserParams) => {
  if (!wallet) {
    return;
  }

  if (!name) {
    name = wallet.toString().substring(0, 5);
  }

  imageUrl = DEFAULT_PROFILE_AVATAR_URL;

  await prisma.user.create({
    data: {
      name: name!,
      solAddress: !wallet.includes("0x") ? wallet : null,
      ethAddress: wallet.includes("0x") ? wallet : null,
      imageUrl: imageUrl,
      email: email,
    },
  });

  revalidateTag(FETCH_USER_CACHE_TAG);
};

export async function updateUserData(formData: FormData, address: Address) {
  const user = await fetchUser(address);

  const name = formData.get("name") as string;

  const imageFile = formData.get("profileImage") as File;

  let imageUrl = "";

  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  user && blob.pathname === "undefined"
    ? (imageUrl = user.imageUrl!)
    : (imageUrl = blob.url);

  const email = formData.get("email") as string;

  if (user) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name ? name : user.name,
        imageUrl: imageUrl,
        email: email ? email : user.email,
      },
    });

    revalidateTag(FETCH_USER_CACHE_TAG);
  } else {
    return;
  }
}
