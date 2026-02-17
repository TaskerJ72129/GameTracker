"use client";

import { useEffect, useState } from "react";
import XPProgressBar from "./xpProgressBar";
import Link from "next/link";
import { useUserXP } from "@/app/context/userXpContext";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

function NavLink({
    href,
    children,
    active,
}: {
    href: string;
    children: React.ReactNode;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`text-sm px-3 py-1.5 rounded border transition ${
                active
                    ? "text-white border-zinc-700 bg-zinc-900"
                    : "text-zinc-300 border-transparent hover:text-white hover:bg-zinc-900/60"
            }`}
        >
            {children}
        </Link>
    );
}

export default function UserHeader() {
    const { overallLevel } = useUserXP();
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    const email = session?.user.email ?? "";
    const usernameInitial = email ? email[0].toUpperCase() : "?";

    return (
        <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
                {/* left: brand + about */}
                <div className="flex items-center gap-4 min-w-[220px]">
                    <Link href="/home" className="text-lg font-bold text-white">
                        GameTracker
                    </Link>

                    <nav className="hidden sm:flex items-center gap-1">
                        <NavLink href="/" active={pathname === "/"}>
                            About
                        </NavLink>
                    </nav>
                </div>

                {/* center: xp bar (only when logged in) */}
                <div className="flex-1 flex justify-center">
                    {session ? (
                        <div className="w-64">
                            <XPProgressBar
                                level={overallLevel.level}
                                currentXP={overallLevel.currentXP}
                                nextLevelXP={overallLevel.nextLevelXP}
                            />
                        </div>
                    ) : (
                        <div className="w-64" />
                    )}
                </div>

                {/* right: auth / profile */}
                <div className="flex items-center gap-4 min-w-[220px] justify-end">
                    {!session ? (
                        <Link
                            href="/login"
                            className="text-sm text-zinc-300 hover:text-white border border-zinc-700 px-3 py-1.5 rounded"
                        >
                            Log in
                        </Link>
                    ) : (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-black">
                                    {usernameInitial}
                                </div>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-sm text-zinc-400 hover:text-white"
                            >
                                Log out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}