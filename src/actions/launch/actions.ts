"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { getTokenInfo } from "../../lib/getTokenInfo";
import { fetchUser } from "@/queries/profile/queries";
import { Address } from "viem";

export const launchCoin = async (
  formData: FormData,
  address: Address,
  tokenAddress: string,
  tokenCreator: string,
  chain: string
) => {
  const user = await fetchUser(address);

  const data = getTokenInfo(formData);

  const image = data.image as File;

  const blob = await put(image.name, image, {
    access: "public",
  });

  let errorMessage = "";

  try {
    user &&
      (await prisma.token.create({
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
        },
      }));
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return errorMessage;
};
