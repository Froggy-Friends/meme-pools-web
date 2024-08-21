"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { Address } from "@/lib/types";
import { put } from "@vercel/blob";
import { defaultProfileAvatarUrl, fetchUserCacheTag } from "@/config/user";
import { UserParams } from "@/app/profile/[username]/types";
import { fetchFollow, fetchUser } from "@/queries/profile/queries";
import { cookies } from "next/headers";
import { User } from "@prisma/client";
import { FollowStatus } from "@/models/follow";
import toast from "react-hot-toast";
import { Cookie } from "@/models/cookie";

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
    name = wallet;
  }

  imageUrl = defaultProfileAvatarUrl;

  await prisma.user.create({
    data: {
      name: name!,
      solAddress: !wallet.includes("0x") ? wallet : null,
      ethAddress: wallet.includes("0x") ? wallet : null,
      imageUrl: imageUrl,
      email: email,
    },
  });

  revalidateTag(fetchUserCacheTag);
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

    revalidateTag(fetchUserCacheTag);
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
};

export const setUserCookies = async (user: User) => {
  const cookieStore = cookies();
  user.ethAddress && cookieStore.set(Cookie.EvmAddress, user.ethAddress);
  user.solAddress && cookieStore.set(Cookie.SolanaAddress, user.solAddress);
};

export const handleFollow = async (
  isFollowing: string,
  user: User,
  currentUser: User
) => {
  try {
    if (
      (isFollowing === FollowStatus.UNFOLLOW && currentUser) ||
      (!isFollowing && currentUser)
    ) {
      await followUser(user.id, currentUser.id);
    } else if (isFollowing === FollowStatus.FOLLOW && currentUser) {
      await unfollowUser(user.id, currentUser.id);
    }
    revalidatePath("/profile");
  } catch (error) {
    isFollowing === FollowStatus.UNFOLLOW &&
      toast.error("Failed to follow user");
    isFollowing === FollowStatus.FOLLOW &&
      toast.error("Failed to unfollow user");
  }
};
