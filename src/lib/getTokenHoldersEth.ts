import { Address } from "viem";
import { moralisEthChain } from "@/config/env";
import { TokenHolderEth } from "@/types/token/types";
import * as Sentry from "@sentry/nextjs";

export const getTokenHoldersEth = async (
  tokenAddress: Address
): Promise<TokenHolderEth[]> => {
  if (!process.env.MORALIS_API_KEY) {
    throw new Error("Moralis API key is not set");
  }

  try {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/owners?chain=${moralisEthChain}&order=DESC`,
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
        percentage: holder.percentage_relative_to_total_supply,
      })
    );

    return formattedData.slice(0, 20);
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
};
