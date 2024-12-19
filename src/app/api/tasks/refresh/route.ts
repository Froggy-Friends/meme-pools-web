import { memepoolsApi } from "@/config/env";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: Request) {
  const endpoint = new URL(request.url).searchParams.get('endpoint');
  const chain = new URL(request.url).searchParams.get('chain');

  try {
    await fetch(`${memepoolsApi}/tasks/refresh/${chain}/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}