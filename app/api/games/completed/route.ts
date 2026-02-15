import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getUserIdFromSession } from "@/lib/supabase/server";

export async function GET() {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ games: [] }, { status: 401 });

  const rows = await prisma.userGameProgress.findMany({
    where: { userId, completed: true },
    orderBy: { completedAt: "desc" },
    include: { game: true },
  });

  const games = rows.map((row) => ({
    id: row.game.id,
    rawgId: row.game.rawgId,
    title: row.game.title,
    genres: row.game.genres,
    image: row.game.image,
    released: row.game.released ? row.game.released.toISOString().slice(0, 10) : null,
    completed: true,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
  }));

  return NextResponse.json({ games });
}
