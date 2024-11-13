import { Address } from "viem";
import { getTokenHoldersEth } from "@/lib/getTokenHoldersEth";
import { getTokenHoldersSol } from "@/lib/getTokenHoldersSol";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get("address");
  const chain = searchParams.get("chain");

  const holders =
    chain === "eth"
      ? await getTokenHoldersEth(tokenAddress as Address, 20)
      : await getTokenHoldersSol(tokenAddress as string, 20);
  return Response.json(holders);
}
