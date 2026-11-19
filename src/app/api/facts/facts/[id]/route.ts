import { NextRequest, NextResponse } from "next/server";
import { getFactById } from "../../../../../lib/facts";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const fact = getFactById(id);

  if (!fact) {
    return NextResponse.json({ error: "Fact not found" }, { status: 404 });
  }

  return NextResponse.json({ fact });
}
