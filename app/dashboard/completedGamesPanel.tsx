"use client";

import { useEffect, useState } from "react";
import GameCard from "@/components/gameCard";
import type { Game } from "@/types/game";

type CompletedGame = Game & { completedAt?: string | null };

export default function CompletedGamesPanel() {
  const [games, setGames] = useState<CompletedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/games/completed");
        if (!res.ok) throw new Error("Failed to load completed games");

        const data: { games: CompletedGame[] } = await res.json();
        setGames(data.games ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load completed games");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="text-sm text-zinc-400">Loading completed games…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (games.length === 0) return <p className="text-sm text-zinc-400">No completed games yet.</p>;

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {games.map((g) => (
        <GameCard key={g.id} game={g} />
      ))}
    </section>
  );
}
