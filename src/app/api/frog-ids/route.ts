import { froggyFriendsAddress, moralisEthChain } from "@/config/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!process.env.MORALIS_API_KEY) {
    throw new Error("Moralis API key is not set");
  }

  if (!address) {
    return NextResponse.json({ result: [] });
  }

  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=${moralisEthChain}&format=decimal&token_addresses%5B0%5D=${froggyFriendsAddress}&media_items=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.MORALIS_API_KEY,
      },
    }
  );
  const data = await response.json();

  return NextResponse.json({ result: data.result });
}