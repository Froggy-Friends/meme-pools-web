import { memepoolsApi } from "@/config/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");
  const resolution = request.nextUrl.searchParams.get("resolution");
  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  const response = await fetch(
    `${memepoolsApi}/trade/history?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    }
  );
  const data = await response.json();
  return NextResponse.json(data);
}
