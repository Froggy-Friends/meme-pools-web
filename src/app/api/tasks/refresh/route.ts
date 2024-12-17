import { memepoolsApi } from "@/config/env";
import { NextResponse } from "next/server";

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
    console.error("Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}