"use client";

import { useEffect, useMemo, useState } from "react";
import { useUserXP } from "@/app/context/userXpContext";
import GameCard from "@/components/gameCard";
import type { Game } from "@/types/game";
import { XP_REWARDS } from "@/lib/xp/xpConfig";

type Props = {
    initialGames: Game[];
};

type SearchState = "idle" | "loading" | "error";

export default function HomeClient({ initialGames }: Props) {
    const { addXP, completedGameIds, markGameCompleted } = useUserXP();

    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<"popular" | "search">("popular");
    const [searchState, setSearchState] = useState<SearchState>("idle");
    const [searchError, setSearchError] = useState<string | null>(null);

    const [popularGames, setPopularGames] = useState(initialGames);
    const [searchGames, setSearchGames] = useState<Game[]>([]);

    const games = mode === "popular" ? popularGames : searchGames;

    // mark completed games in whichever list is currently displayed
    useEffect(() => {
        setPopularGames((prev) =>
            prev.map((g) => (completedGameIds.has(g.id) ? { ...g, completed: true } : g))
        );
        setSearchGames((prev) =>
            prev.map((g) => (completedGameIds.has(g.id) ? { ...g, completed: true } : g))
        );
    }, [completedGameIds]);

    async function handleComplete(game: Game) {
        if (completedGameIds.has(game.id)) return;

        // optimistic UI on both lists (safe and keeps UI consistent)
        setPopularGames((prev) =>
            prev.map((g) => (g.id === game.id ? { ...g, completed: true } : g))
        );
        setSearchGames((prev) =>
            prev.map((g) => (g.id === game.id ? { ...g, completed: true } : g))
        );

        markGameCompleted(game);

        addXP({
            amount: XP_REWARDS.COMPLETE_GAME,
            genres: game.genres,
            source: "Completed Game",
            gameTitle: game.title,
        });
    }

    async function runSearch() {
        const q = query.trim();
        if (q.length < 2) {
            setMode("popular");
            setSearchGames([]);
            setSearchState("idle");
            setSearchError(null);
            return;
        }

        setMode("search");
        setSearchState("loading");
        setSearchError(null);

        try {
            const res = await fetch(`/api/games/search?q=${encodeURIComponent(q)}`, {
                method: "GET",
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? `Search failed (${res.status})`);
            }

            const data: { games: Game[] } = await res.json();

            const normalized = (data.games ?? []).map((g) => ({
                ...g,
                completed: completedGameIds.has(g.id),
            }));

            setSearchGames(normalized);
            setSearchState("idle");
        } catch (e) {
            setSearchState("error");
            setSearchError(e instanceof Error ? e.message : "Search failed");
        }
    }

    function clearSearch() {
        setQuery("");
        setMode("popular");
        setSearchGames([]);
        setSearchState("idle");
        setSearchError(null);
    }

    const title = useMemo(() => {
        if (mode === "popular") return "Popular";
        return `Results for "${query.trim()}"`;
    }, [mode, query]);

    return (
        <main className="max-w-4xl mx-auto p-6 space-y-6">
            {/* home-only search strip */}
            <section className="space-y-2">
                <div className="flex gap-2">
                    <input
                        className="flex-1 p-2 rounded bg-zinc-800 text-white"
                        placeholder="Search RAWG games (press Enter)…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                runSearch();
                            }
                        }}
                    />

                    {mode === "search" ? (
                        <button
                            onClick={clearSearch}
                            className="px-4 rounded border border-zinc-700 text-white"
                        >
                            Clear
                        </button>
                    ) : (
                        <button
                            onClick={runSearch}
                            className="px-4 rounded bg-emerald-600 text-black"
                        >
                            Search
                        </button>
                    )}
                </div>

                {searchState === "loading" && (
                    <p className="text-sm text-zinc-400">Searching…</p>
                )}
                {searchState === "error" && searchError && (
                    <p className="text-sm text-red-400">{searchError}</p>
                )}
            </section>

            <h2 className="text-lg font-semibold text-white">{title}</h2>

            <section className="grid gap-4 sm:grid-cols-2">
                {games.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        onComplete={() => handleComplete(game)}
                    />
                ))}
            </section>

            {mode === "search" && searchState !== "loading" && games.length === 0 && (
                <p className="text-sm text-zinc-400">No results found.</p>
            )}
        </main>
    );
}
