import { NextResponse } from "next/server";
import { fetchSoccerEvents } from "@/lib/polymarket";

export const revalidate = 60;

export async function GET() {
  try {
    const events = await fetchSoccerEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch soccer events:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
