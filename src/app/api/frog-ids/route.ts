import { getFroggyFriendsAddress } from "@/lib/getFroggyFriendsAddress";
import { getDelegations } from "@/lib/getDelegations";
import { NextResponse } from "next/server";
import { Chain } from "@/models/chain";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain");

  const froggyFriendsAddress = getFroggyFriendsAddress(chain as Chain);

  if (!address) {
    return NextResponse.json({ result: [] });
  }

  const delegations = await getDelegations(address as `0x${string}`);

  const fetchNfts = async (address: `0x${string}`) => {
    if (!process.env.ALCHEMY_API_KEY) {
      throw new Error("Alchemy API key is not set");
    }

    const response = await fetch(
      `https://${chain}-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&contractAddresses[]=${froggyFriendsAddress}&withMetadata=true&pageSize=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.json();
  };

  const mainWalletData = await fetchNfts(address as `0x${string}`);
  const mainWalletNfts = mainWalletData.ownedNfts;

  const delegatedWalletsData = await Promise.all(
    delegations.map((delegatedAddress) => fetchNfts(delegatedAddress))
  );
  const delegatedWalletsNfts = delegatedWalletsData.map(
    (data) => data.ownedNfts
  );

  const allResults = [mainWalletNfts, ...delegatedWalletsNfts].flatMap(
    (data) => data
  );

  return NextResponse.json({ result: allResults });
}
