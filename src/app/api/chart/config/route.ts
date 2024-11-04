import { memepoolsApi } from "@/config/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = await fetch(`${memepoolsApi}/trade/config`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
