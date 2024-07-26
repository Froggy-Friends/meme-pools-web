"use server";

import { PrismaClient } from "@prisma/client";
import { UserParams } from "./types";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { simulateCreateToken } from "./utils";

const prisma = new PrismaClient();

export const launchCoin = async (
  formData: FormData,
  address: `0x${string}`
) => {
  const fetchUser = await prisma.user.findMany({
    where: {
      wallet: address,
    },
  });

  const user = fetchUser[0];

  const { tokenId, tokenAddress } = simulateCreateToken();

  const name = formData.get("name");

  const ticker = formData.get("ticker");

  const description = formData.get("description");

  const image = formData.get("image") as File;

  const twitter = formData.get("twitter");

  const telegram = formData.get("telegram");

  const website = formData.get("website");

  const blob = await put(image.name, image, {
    access: "public",
  });
  revalidatePath("/");

  const tokenNameExists = !!(await prisma.token.findFirst({
    where: {
      name: name as string,
    },
  }));

  const tokenTickerExists = !!(await prisma.token.findFirst({
    where: {
      ticker: ticker as string,
    },
  }));

  let errorMessage = "";

  try {
    if (tokenNameExists) {
      throw new Error("Token name already exists");
    } else if (tokenTickerExists) {
      throw new Error("Token ticker already exists");
    } else {
      await prisma.token.create({
        data: {
          tokenId: tokenId,
          ticker: ticker as string,
          description: description as string,
          image: blob.url,
          twitter: twitter as string,
          telegram: telegram as string,
          website: website as string,
          name: name as string,
          userId: user.id,
          tokenAddress: tokenAddress,
        },
      });
    }
  } catch (error) {
    errorMessage = (error as Error).message
  }

  return errorMessage
};

export const createUser = async ({
  name,
  wallet,
  imageUrl,
  email,
}: UserParams) => {
  const userExists = !!(await prisma.user.findFirst({
    where: {
      wallet: wallet,
    },
  }));

  if (!name) {
    name = wallet.toString().substring(0, 5);
  }

  if (!imageUrl) {
    imageUrl =
      "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/frog-fun-logo-X7w0iMo57guw2ad4fs9n659WfuyV3d.jpg";
  }

  if (!userExists) {
    await prisma.user.create({
      data: {
        name: name,
        wallet: wallet,
        imageUrl: imageUrl,
        email: email,
      },
    });
  }
};

export const fetchUserAvatar = async (wallet: `0x${string}`) => {
  const user = await prisma.user.findMany({
    where: {
      wallet: wallet,
    },
  });

  return user[0];
};

export async function updateUserData(
  formData: FormData,
  address: `0x${string}`
) {
  const fetchUser = await prisma.user.findMany({
    where: {
      wallet: address,
    },
  });

  const user = fetchUser[0];

  const name = formData.get("name") as string;

  const imageFile = formData.get("profileImage") as File;

  let imageUrl = "";

  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });
  revalidatePath("/");

  blob.pathname === "undefined"
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
  } else {
    return;
  }
}
