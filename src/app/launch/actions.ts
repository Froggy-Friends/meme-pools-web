"use server"

import { WalletAddress } from "@/lib/types";
import { fetchUser } from "../profile/[wallet]/queries";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const launchCoin = async (
    formData: FormData,
    address: WalletAddress,
    tokenId: number,
    tokenAddress: string,
    tokenCreator: string
  ) => {
    const user = await fetchUser(address);
  
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
  
    let errorMessage = "";
  
    try {
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
            tokenCreator: tokenCreator,
          },
        }));
    } catch (error) {
      errorMessage = (error as Error).message;
    }
  
    return errorMessage;
  };