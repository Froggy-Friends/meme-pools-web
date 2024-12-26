import { maxTotalSupply } from "@/config/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get("chain");
  const contractAddress = searchParams.get("contractAddress");

  if (!process.env.MORALIS_API_KEY) {
    throw new Error("MORALIS_API_KEY is not set");
  }

  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/erc20/${contractAddress}/price?chain=${chain}&exchange=uniswapv3`,
    {
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();

  if (data.usdPriceFormatted) {
    const usdPrice = data.usdPriceFormatted;
    const marketcap = (usdPrice * maxTotalSupply).toFixed(2);

    return NextResponse.json({ marketcap });
  } else {
    return NextResponse.json({ marketcap: null });
  }
}
