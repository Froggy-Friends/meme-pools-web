import { Address } from "viem";

export const getFrogsByWallet = async (address: Address) => {
  if (!process.env.MORALIS_API_KEY) {
    throw new Error("Moralis API key is not set");
  }

  if (!address) {
    return [];
  }

  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=eth&format=decimal&token_addresses%5B0%5D=0x7ad05c1b87e93BE306A9Eadf80eA60d7648F1B6F&media_items=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.MORALIS_API_KEY,
      },
    }
  );
  const data = await response.json();

  return data.result.map((frog: any) => Number(frog.token_id));
};
