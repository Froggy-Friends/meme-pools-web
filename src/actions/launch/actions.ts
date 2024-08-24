"use server";

import { Address } from "@/lib/types";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getTokenInfo } from "../../lib/getTokenInfo";
import { fetchUser } from "@/queries/profile/queries";

export const launchCoin = async (
  formData: FormData,
  address: Address,
  tokenId: number,
  tokenAddress: string,
  tokenCreator: string
) => {
  const user = await fetchUser(address);

  const data = getTokenInfo(formData);

  const blob = await put(data.image.name, data.image, {
    access: "public",
  });
  revalidatePath("/");

  let errorMessage = "";

  try {
    user &&
      (await prisma.token.create({
        data: {
          tokenId: tokenId,
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
          marketCap: 100,
        },
      }));
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return errorMessage;
};
