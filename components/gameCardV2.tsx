"use client";

import Image from "next/image";
import { Game } from "@/types/game";
import { XP_REWARDS } from "@/lib/xp/xpConfig";

type Props = {
    game: Game;
    onComplete?: (gameId: string) => void;
};

export default function GameCard({ game, onComplete }: Props) {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="relative h-40 w-full bg-zinc-800">
                {game.image ? (
                    <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400">
                        No image
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
                        {game.title}
                    </h3>
                </div>

                {game.completed && (
                    <span className="absolute top-3 right-3 rounded-md bg-emerald-900/60 px-3 py-1 text-xs text-emerald-200 backdrop-blur">
                        Completed
                    </span>
                )}
            </div>

            <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                    {game.genres.map((genre) => (
                        <span
                            key={genre}
                            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                        >
                            {genre}
                        </span>
                    ))}
                </div>

                <div className="text-sm text-zinc-400">
                    XP on completion:{" "}
                    <span className="text-emerald-400 font-medium">
                        +{XP_REWARDS.COMPLETE_GAME} XP
                    </span>
                </div>

                <div>
                    {game.completed ? (
                        <span className="inline-block rounded-md bg-emerald-900/40 px-3 py-1 text-sm text-emerald-400">
                            Completed
                        </span>
                    ) : (
                        <button
                            onClick={() => onComplete?.(game.id)}
                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-500 transition"
                        >
                            Complete game
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
