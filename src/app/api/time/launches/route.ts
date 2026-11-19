export async function GET() {
  try {
    const res = await fetch(
      "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20&mode=detailed",
      {
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch launches" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to fetch launch data" },
      { status: 500 }
    );
  }
}
