import { Token } from "./types";

export type TokenFilter = "new" | "trending" | "volume" | "transactions";

export default async function fetchTokens(filter?: TokenFilter, page?: number) {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_FROG_FUN_API_URL}/token/${filter ?? "new"}`
  );
  url.searchParams.set("page", (page ?? 0).toString());

  const response = await fetch(url.toString());
  const data = await response.json();
  return data as Token[];
}
