import { TokenHolderSol } from "@/types/token/types";
import * as Sentry from "@sentry/nextjs";

export const getTokenHoldersSol = async (
  mintAddress: string
): Promise<TokenHolderSol[]> => {
  if (!process.env.HELIUS_RPC_URL) {
    throw new Error("HELIUS_RPC_URL is not defined");
  }

  try {
    const response = await fetch(process.env.HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "meme-pools",
        method: "getTokenAccounts",
        params: {
          page: 1,
          limit: 1000,
          displayOptions: {},
          mint: mintAddress,
        },
      }),
    });

    const data = await response.json();
    const formattedData: TokenHolderSol[] = data.result.token_accounts.map(
      (holder: TokenHolderSol, index: number) => {
        holder.amount = holder.amount / 10 ** 6;
        return { ...holder, rank: index + 1 };
      }
    );
    const sortedData: TokenHolderSol[] = formattedData.sort(
      (a: TokenHolderSol, b: TokenHolderSol) => b.amount - a.amount
    );

    return sortedData;
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
};
