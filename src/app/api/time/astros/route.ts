import { NextResponse } from "next/server";


export async function GET() {
  try {
    const res = await fetch("http://api.open-notify.org/astros.json", {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch astronaut data" },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch astronaut data" },
      { status: 500 }
    );
  }
}
