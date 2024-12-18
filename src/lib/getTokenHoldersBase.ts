import { Address } from "viem";
import { moralisBaseChain } from "@/config/env";
import { TokenHolderEth, FormattedTokenHolderEth } from "@/types/token/types";
import * as Sentry from "@sentry/nextjs";
import { getHolderPercentage } from "./getHolderPercentage";

export const getTokenHoldersBase = async (
  tokenAddress: Address,
  count: number
): Promise<FormattedTokenHolderEth[]> => {
  if (!process.env.MORALIS_API_KEY) {
    throw new Error("Moralis API key is not set");
  }

  try {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/owners?chain=${moralisBaseChain}&order=DESC`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.MORALIS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const formattedData = data.result.map(
      (holder: TokenHolderEth, index: number) => ({
        rank: index + 1,
        owner: holder.owner_address,
        amount: Number(holder.balance_formatted),
        percentage: getHolderPercentage(Number(holder.balance_formatted)),
      })
    );

    return formattedData.slice(0, count);
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
};
