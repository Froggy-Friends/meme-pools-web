"use server";

import prisma from "@/lib/prisma";
import { TokenWithCreator } from "@/lib/types";

export const checkTokenNameExists = async (name: string) => {
  const exists = !!(await prisma.token.findFirst({
    where: {
      name: name,
    },
  }));

  return exists;
};

export const checkTokenTickerExists = async (ticker: string) => {
  const tokenTickerExists = !!(await prisma.token.findFirst({
    where: {
      ticker: ticker,
    },
  }));

  return tokenTickerExists;
};

export const fetchTokens = async (
  tokenFilter: string,
  page: number
): Promise<TokenWithCreator[]> => {
  const response = await fetch(
    `${process.env.FROG_FUN_API_URL}/token/${tokenFilter}?page=${page}`
  );
  const tokens = await response.json();

  return tokens;
};

export const fetchTokenCount = async () => {
  const tokenCount = await prisma.token.count();

  return tokenCount;
};

export const fetchTokenByAddress = async (tokenAddress: string) => {
  const token = await prisma.token.findFirst({
    where: {
      tokenAddress: tokenAddress,
    },
  });

  return token;
};
