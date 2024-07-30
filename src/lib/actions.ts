"use server";

import { PrismaClient } from "@prisma/client";
import { UserParams } from "./types";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { simulateCreateToken } from "./utils";

const prisma = new PrismaClient();

export const fetchUser = async (wallet: `0x${string}`) => {
  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet,
    },
  });

  return user;
};

export const fetchUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

export const checkUserExists = async (wallet: `0x${string}`) => {
  const userExists = !!(await prisma.user.findFirst({
    where: {
      wallet: wallet,
    },
  }));

  return userExists;
};

export const checkTokenNameExists = async (name: string) => {
  const exists = !!(await prisma.token.findFirst({
    where: {
      name: name as string,
    },
  }));

  return exists;
};

export const checkTokenTickerExists = async (ticker: string) => {
  const tokenTickerExists = !!(await prisma.token.findFirst({
    where: {
      ticker: ticker as string,
    },
  }));

  return tokenTickerExists;
};

export const launchCoin = async (
  formData: FormData,
  address: `0x${string}`
) => {
  const user = await fetchUser(address);

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

  const tokenNameExists = await checkTokenNameExists(name as string);

  const tokenTickerExists = await checkTokenTickerExists(ticker as string);

  let errorMessage = "";

  try {
    if (tokenNameExists) {
      throw new Error("Token name already exists");
    } else if (tokenTickerExists) {
      throw new Error("Token ticker already exists");
    } else {
      user &&
        (await prisma.token.create({
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
        }));
    }
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return errorMessage;
};

export const createUser = async ({
  name,
  wallet,
  imageUrl,
  email,
}: UserParams) => {
  if (!name) {
    name = wallet.toString().substring(0, 5);
  }

  imageUrl =
    "https://qojtn2d8pd7yjrch.public.blob.vercel-storage.com/Frog.fun_Default_PFP-nKVI2J7DIDPs8vFvCTnkVxG4aT6asQ.png";

  await prisma.user.create({
    data: {
      name: name,
      wallet: wallet,
      imageUrl: imageUrl,
      email: email,
    },
  });
};

export async function updateUserData(
  formData: FormData,
  address: `0x${string}`
) {
  const user = await fetchUser(address);

  const name = formData.get("name") as string;

  const imageFile = formData.get("profileImage") as File;

  let imageUrl = "";

  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });
  revalidatePath("/");

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
  } else {
    return;
  }
}

export const fetchTokens = async (take: number) => {
  const totalCount = await prisma.token.count();

  const tokens = await prisma.token.findMany({
    orderBy: {
      tokenId: "desc",
    },
    take: take,
  });

  return {
    tokens,
    totalCount,
  };
};

export const fetchPaginatedTokens = async (take: number, cursor: number) => {
  const tokens = await prisma.token.findMany({
    orderBy: {
      tokenId: "desc",
    },
    take: take,
    skip: 1,
    cursor: {
      tokenId: cursor,
    },
  });

  return tokens;
};

export const fetchTokenByAddress = async (tokenAddress: string) => {
  const token = await prisma.token.findUnique({
    where: {
      tokenAddress: tokenAddress
    },
  })

  return token
}
