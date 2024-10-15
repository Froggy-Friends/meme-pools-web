"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { put, PutBlobResult } from "@vercel/blob";
import { defaultProfileAvatarUrl, fetchUserCacheTag } from "@/config/user";
import { UserParams } from "@/app/profile/[username]/types";
import { fetchFollow, fetchUser } from "@/queries/profile/queries";
import { cookies } from "next/headers";
import { Follow, User } from "@prisma/client";
import { FollowStatus } from "@/models/follow";
import { Cookie } from "@/models/cookie";
import { Chain } from "@/models/chain";
import { getPusher } from "@/config/pusher";
import { Channel } from "@/models/channel";
import { Address } from "viem";

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

  const name = formData.get("username") as string;

  const imageFile = formData.get("profile-picture") as File;

  const ethAddress = formData.get("ethereum-address") as string;

  const solAddress = formData.get("solana-address") as string;

  let imageUrl = "";
  let blob: PutBlobResult;

  if (imageFile) {
    blob = await put(imageFile.name, imageFile, {
      access: "public",
    });

    user && user.imageUrl && blob.pathname === "undefined"
      ? (imageUrl = user.imageUrl)
      : (imageUrl = blob.url);
  } else {
    imageUrl = defaultProfileAvatarUrl;
  }

  const email = formData.get("email") as string;

  if (user) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name || user.name,
        imageUrl: imageUrl,
        email: email || user.email,
        ethAddress: ethAddress || user.ethAddress,
        solAddress: solAddress || user.solAddress,
        updatedAt: new Date(Date.now()),
      },
    });

    revalidateTag(fetchUserCacheTag);
  } else {
    return;
  }
}

type FollowWithFollower = Follow & {
  followerUser: User;
  followingUser: User;
};

export const followUser = async (accountId: string, followerId: string) => {
  const existingFollow = await fetchFollow(accountId, followerId);
  let follow: FollowWithFollower | null = null;

  if (!existingFollow) {
    follow = await prisma.follow.create({
      data: {
        account: accountId,
        follower: followerId,
        status: "Follow",
        followedAt: new Date(Date.now()),
      },
      include: {
        followerUser: true,
        followingUser: true,
      },
    });
  } else {
    follow = await prisma.follow.update({
      where: {
        id: existingFollow.id,
      },
      data: {
        status: "Follow",
        followedAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      include: {
        followerUser: true,
        followingUser: true,
      },
    });
  }

  const pusher = getPusher();
  await pusher.trigger(Channel.Follow, accountId, {
    feedData: {
      user: follow.followerUser,
      date: follow.followedAt,
      value: follow.followingUser.name,
    },
  });
};

export const unfollowUser = async (accountId: string, followerId: string) => {
  const existingFollow = await fetchFollow(accountId, followerId);
  let follow: FollowWithFollower | null = null;
  if (!existingFollow) {
    follow = await prisma.follow.create({
      data: {
        account: accountId,
        follower: followerId,
        status: "Unfollow",
        unfollowedAt: new Date(Date.now()),
      },
      include: {
        followerUser: true,
        followingUser: true,
      },
    });
  } else {
    follow = await prisma.follow.update({
      where: {
        id: existingFollow.id,
      },
      data: {
        status: "Unfollow",
        unfollowedAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      include: {
        followerUser: true,
        followingUser: true,
      },
    });
  }

  const pusher = getPusher();
  await pusher.trigger(Channel.Unfollow, accountId, {
    feedData: {
      user: follow.followerUser,
      date: follow.unfollowedAt,
      value: follow.followingUser.name,
    },
  });
};

export const setUserCookies = async (user: User | null, chain?: Chain) => {
  const cookieStore = cookies();
  if (!user && chain === Chain.Eth) {
    cookieStore.set(Cookie.EvmAddress, "");
  } else if (!user && chain === Chain.Solana) {
    cookieStore.set(Cookie.SolanaAddress, "");
  } else if (user && user.ethAddress) {
    cookieStore.set(Cookie.EvmAddress, user.ethAddress);
  } else if (user && user.solAddress) {
    cookieStore.set(Cookie.SolanaAddress, user.solAddress);
  }
};

export const handleFollow = async (
  isFollowing: string,
  user: User,
  currentUser: User
) => {
  let errorMessage = "";

  try {
    if (
      (isFollowing === FollowStatus.UNFOLLOW && currentUser) ||
      (isFollowing === "false" && currentUser)
    ) {
      await followUser(user.id, currentUser.id);
    } else if (isFollowing === FollowStatus.FOLLOW && currentUser) {
      await unfollowUser(user.id, currentUser.id);
    }
    revalidatePath("/profile");
  } catch (error) {
    if (isFollowing === FollowStatus.UNFOLLOW) {
      errorMessage = "Failed to follow user";
    } else {
      errorMessage = "Failed to unfollow user";
    }
  }

  return errorMessage;
};
