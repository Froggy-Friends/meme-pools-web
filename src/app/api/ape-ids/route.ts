import { NextResponse } from "next/server";
import { baycAddress, maycAddress } from "@/config/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ result: [] });
  }

  if (!process.env.ALCHEMY_API_KEY) {
    throw new Error("Alchemy API key is not set");
  }

  const response = await fetch(
    `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&contractAddresses[]=${baycAddress}&contractAddresses[]=${maycAddress}&withMetadata=true&pageSize=100`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const walletData = await response.json();
  const walletNfts = walletData.ownedNfts;

  return NextResponse.json({ result: walletNfts });
}
