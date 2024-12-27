"use server";

import { cookies } from "next/headers";
import { Chain } from "@/models/chain";
import { Cookie } from "@/models/cookie";

export const setChainCookie = async (chain: Chain) => {
  const cookieStore = cookies();
  cookieStore.set(Cookie.Chain, chain);
};

export const setPreviousChainCookie = async (chain: Chain) => {
  const cookieStore = cookies();
  cookieStore.set(Cookie.PreviousChain, chain);
};

