import { TokenType } from "@/models/token";
import { Address } from "viem";
import { Chain } from "@/models/chain";

export const checkIsAHolder = async (
  tokenAddress: Address,
  address: Address,
  tokenType: TokenType,
  chain: Chain
) => {
  if (!process.env.MORALIS_API_KEY) {
    throw new Error("Moralis API key is not set");
  }

  if (tokenType === TokenType.ERC20) {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chain}&token_addresses%5B0%5D=${tokenAddress}`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.MORALIS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data.length > 0 ? true : false;
    
  } else {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=${chain}&format=decimal&token_addresses%5B0%5D=${tokenAddress}&media_items=false`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.MORALIS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data.result.length > 0 ? true : false;
  }
};
