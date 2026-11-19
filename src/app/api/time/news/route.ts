import { NextRequest, NextResponse } from "next/server";

const BASE = "https://api.spaceflightnewsapi.net/v4";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") || "articles"; // articles | blogs
  const search = searchParams.get("search") || "";
  const offset = searchParams.get("offset") || "0";
  const limit = type === "blogs" ? "10" : "30";

  const endpoint = type === "blogs" ? "blogs" : "articles";
  const url = new URL(`${BASE}/${endpoint}/`);
  url.searchParams.set("limit", limit);
  url.searchParams.set("offset", offset);
  if (search) url.searchParams.set("search", search);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
