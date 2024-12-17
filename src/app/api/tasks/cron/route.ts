import { memepoolsApi } from "@/config/env";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

const refreshConfig = {
  eth: ["trending", "transactions", "volume", "comments", "votes"],
  solana: ["trending", "transactions", "volume", "comments", "votes"],
  // Easy to add different endpoints per chain if needed
} as const;

export async function GET(request: Request) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    await Promise.all(
      Object.entries(refreshConfig).flatMap(([chain, endpoints]) =>
        endpoints.map((endpoint) =>
          fetch(`${memepoolsApi}/tasks/refresh/${chain}/${endpoint}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
          })
        )
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
