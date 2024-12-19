"use server";

import { put, PutBlobResult } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { getTokenInfo } from "../../lib/getTokenInfo";
import { fetchUser } from "@/queries/profile/queries";
import { Address } from "viem";
import { contractAddress } from "@/config/env";

export const createCoin = async (
  formData: FormData,
  address: Address,
  tokenAddress: string,
  tokenCreator: string,
  chain: string,
  blob: PutBlobResult | null,
  isNsfw: boolean
) => {
  const user = await fetchUser(address);

  const data = getTokenInfo(formData);

  if (!blob) {
    blob = await uploadImage(formData);
  }

  let errorMessage = "";

  try {
    if (user) {
      const token = await prisma.token.create({
        data: {
          ticker: data.ticker.toUpperCase(),
          description: data.description,
          image: blob.url,
          twitter: data.twitter,
          telegram: data.telegram,
          website: data.website,
          name: data.name,
          userId: user.id,
          tokenAddress: tokenAddress,
          tokenCreator: tokenCreator,
          chain: chain,
          marketCap: 100,
          isNsfw: isNsfw,
          platformAddress: contractAddress,
        },
      });
    }
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return errorMessage;
};

export async function uploadImage(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob;
}
