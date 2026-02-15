// app/api/game/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/supabase/server";
import { markGameCompleted, getOrCreateGame } from "@/lib/db/game";
import { getUserCompletedGames } from "@/lib/db/userXP";

export async function GET() {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ completedGameIds: [] });

  const completedGameIds = await getUserCompletedGames(userId);
  return NextResponse.json({ completedGameIds });
}

export async function POST(req: NextRequest) {
  const { rawgGame } = await req.json();

  if (!rawgGame?.rawgId || !rawgGame?.title) {
    return NextResponse.json({ error: "Invalid game data" }, { status: 400 });
  }

  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const game = await getOrCreateGame({
    rawgId: rawgGame.rawgId,
    title: rawgGame.title,
    genres: rawgGame.genres ?? [],
    image: rawgGame.image ?? null,
    released: rawgGame.released ?? null,
  });

  await markGameCompleted(userId, game.id);

  return NextResponse.json({ success: true });
}