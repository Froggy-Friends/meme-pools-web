"use server";

import prisma from "@/lib/prisma";
import { UserParams } from "./types";
import { revalidatePath, revalidateTag } from "next/cache";
import { Address } from "@/lib/types";
import { fetchFollow, fetchUser } from "./queries";
import { put } from "@vercel/blob";
import { DEFAULT_PROFILE_AVATAR_URL, FETCH_USER_CACHE_TAG } from "@/config/user";

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
        updatedAt: new Date(Date.now()),
      },
    });

    revalidateTag(FETCH_USER_CACHE_TAG);
  } else {
    return;
  }
}

export const followUser = async (accountId: string, followerId: string) => {
  const follow = await fetchFollow(accountId, followerId);

  if (!follow) {
    await prisma.follow.create({
      data: {
        account: accountId,
        follower: followerId,
        status: "Follow",
        followedAt: new Date(Date.now()),
      },
    });
  } else {
    await prisma.follow.update({
      where: {
        id: follow.id,
      },
      data: {
        status: "Follow",
        followedAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
    });
  }
  revalidatePath("/profile");
};

export const unfollowUser = async (accountId: string, followerId: string) => {
  const follow = await fetchFollow(accountId, followerId);

  if (!follow) {
    await prisma.follow.create({
      data: {
        account: accountId,
        follower: followerId,
        status: "Unfollow",
        unfollowedAt: new Date(Date.now()),
      },
    });
  } else {
    await prisma.follow.update({
      where: {
        id: follow.id,
      },
      data: {
        status: "Unfollow",
        unfollowedAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
    });
  }
  revalidatePath("/profile");
};
