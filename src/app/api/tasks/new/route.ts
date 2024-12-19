import { memepoolsApi } from "@/config/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    await fetch(`${memepoolsApi}/tasks/refresh/eth/newest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    await fetch(`${memepoolsApi}/tasks/refresh/base/newest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
