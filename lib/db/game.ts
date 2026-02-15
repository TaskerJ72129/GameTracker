import { prisma } from "@/lib/prisma/client";

type CreateGameInput = {
  rawgId: number;
  title: string;
  genres: string[];
  image?: string | null;
  released?: string | null; // ISO date string
};

export async function markGameCompleted(userId: string, gameId: string) {
  return prisma.userGameProgress.upsert({
    where: { userId_gameId: { userId, gameId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, gameId, completed: true, completedAt: new Date() },
  });
}

export async function getOrCreateGame(input: CreateGameInput) {
  const existing = await prisma.game.findUnique({ where: { rawgId: input.rawgId } });
  if (existing) return existing;

  const releasedDate =
    input.released ? new Date(input.released) : null;

  return prisma.game.create({
    data: {
      id: input.rawgId.toString(),
      rawgId: input.rawgId,
      title: input.title,
      genres: input.genres,
      image: input.image ?? null,
      released: releasedDate,
    },
  });
}
