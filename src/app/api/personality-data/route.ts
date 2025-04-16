// app/api/personality-data/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://career360.s3.us-east-1.amazonaws.com/PersonalityData.json";

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
