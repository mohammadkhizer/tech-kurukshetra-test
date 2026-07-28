import { NextResponse } from "next/server";
import { EVENTS } from "@/lib/dummy-data";
export async function GET() {
  return NextResponse.json({ success: true, data: EVENTS });
}
