import { memepoolsApi } from "@/config/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    await fetch(`${memepoolsApi}/tasks/refresh-trending`, {
      method: "POST",
    });

    await fetch(`${memepoolsApi}/tasks/refresh-transactions`, {
      method: "POST",
    });

    await fetch(`${memepoolsApi}/tasks/refresh-volume`, {
      method: "POST",
    });

    await fetch(`${memepoolsApi}/tasks/refresh-comments`, {
      method: "POST",
    });

    await fetch(`${memepoolsApi}/tasks/refresh-votes`, {
      method: "POST",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
