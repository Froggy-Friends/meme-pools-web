"use server";

import prisma from "@/lib/prisma";
import { UserParams } from "./types";
import { revalidateTag } from "next/cache";
import { WalletAddress } from "@/lib/types";
import { fetchUser } from "./queries";
import { put } from "@vercel/blob";

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

  revalidateTag("user");
};

export async function updateUserData(
  formData: FormData,
  address: WalletAddress
) {
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

    revalidateTag("user");
  } else {
    return;
  }
}
