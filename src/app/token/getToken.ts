import prisma from "@/lib/prisma";
import { Token } from "@prisma/client";

export default async function getToken(tokenAddress: string) {
  return (await prisma.token.findFirstOrThrow({
    where: {
      tokenAddress,
    },
  })) as Token;
}
