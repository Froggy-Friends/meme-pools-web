import { TokenHolderSol, TokenHolderData } from "@/types/token/types";
import * as Sentry from "@sentry/nextjs";
import { getHolderPercentage } from "./getHolderPercentage";

export const getTokenHoldersSol = async (
  mintAddress: string,
  count: number
): Promise<TokenHolderData[]> => {
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
    const formattedData: TokenHolderData[] = data.result.token_accounts.map(
      (holder: TokenHolderSol, index: number) => {
        holder.amount = holder.amount / 10 ** 6;
        return {
          rank: index + 1,
          owner: holder.owner,
          amount: holder.amount,
          percentage: getHolderPercentage(holder.amount),
        };
      }
    );
    const sortedData: TokenHolderData[] = formattedData.sort(
      (a: TokenHolderData, b: TokenHolderData) => b.amount - a.amount
    );

    return sortedData.slice(0, count);
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
};
