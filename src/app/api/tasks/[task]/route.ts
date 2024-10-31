import { memepoolsApi } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { task: string } }
) {
  try {
    await fetch(`${memepoolsApi}/tasks/${params.task}`, {
      method: "POST",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
