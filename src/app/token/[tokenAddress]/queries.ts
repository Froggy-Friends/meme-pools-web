"use server"

import prisma from "@/lib/prisma";

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
  const token = await prisma.token.findFirst({
    where: {
      tokenAddress: tokenAddress,
    },
  });

  return token;
};
