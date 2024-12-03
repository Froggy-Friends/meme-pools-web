import { froggyFriendsAddress, moralisEthChain } from "@/config/env";
import { getDelegations } from "@/lib/getDelegations";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ result: [] });
  }

  const delegations = await getDelegations(address as `0x${string}`);

  const fetchNfts = async (address: `0x${string}`) => {
    if (!process.env.MORALIS_API_KEY) {
      throw new Error("Moralis API key is not set");
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

    return response.json();
  };

  const mainWalletData = await fetchNfts(address as `0x${string}`);
  const delegatedWalletsData = await Promise.all(
    delegations.map((delegatedAddress) => fetchNfts(delegatedAddress))
  );

  const allResults = [mainWalletData, ...delegatedWalletsData].flatMap(
    (data) => data.result
  );

  return NextResponse.json({ result: allResults });
}
