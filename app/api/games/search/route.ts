import { NextResponse, type NextRequest } from "next/server";

const RAWG_BASE_URL = "https://api.rawg.io/api/games";

export async function GET(req: NextRequest) {
    const apiKey = process.env.RAWG_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "RAWG API key not configured" }, { status: 500 });
    }

    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    const page = req.nextUrl.searchParams.get("page") ?? "1";

    if (q.length < 2) {
        return NextResponse.json({ error: "Query too short" }, { status: 400 });
    }

    const url =
        `${RAWG_BASE_URL}?key=${apiKey}` +
        `&search=${encodeURIComponent(q)}` +
        `&page=${encodeURIComponent(page)}` +
        `&page_size=20`;

    const res = await fetch(url, {
        // Cache search results briefly; good compromise for cost vs freshness
        next: { revalidate: 600 }, // 10 minutes
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to search RAWG" }, { status: res.status });
    }

    const data = await res.json();

    const games = (data.results ?? []).map((game: any) => ({
        id: String(game.id),
        rawgId: game.id,
        title: game.name,
        genres: (game.genres ?? []).map((g: any) => g.name),
        completed: false,
        image: game.background_image ?? null,
        released: game.released ?? null,
    }));

    return NextResponse.json({ games });
}
