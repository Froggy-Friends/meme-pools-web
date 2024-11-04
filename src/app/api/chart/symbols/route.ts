import { memepoolsApi } from "@/config/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");
  const response = await fetch(`${memepoolsApi}/trade/symbols?symbol=${symbol}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    }
  );
  const data = await response.json();
  return NextResponse.json(data);
}
