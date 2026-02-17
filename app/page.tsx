import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] max-w-5xl mx-auto px-6 py-16 space-y-14">
      {/* hero */}
      <section className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
          Deployed full-stack app
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Track games. Earn XP. Level up your profile.
        </h1>

        <p className="text-zinc-400 text-lg max-w-2xl">
          GameTracker is a real deployed web app that lets you search games via the RAWG API,
          mark them completed, and earn XP + genre XP through a gamified progression system.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-500 transition"
          >
            Create account
          </Link>

          <Link
            href="/login"
            className="rounded-md border border-zinc-700 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-900 transition"
          >
            Log in
          </Link>

          <Link
            href="/login"
            className="rounded-md border border-emerald-500 px-5 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition"
          >
            Try demo
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Feature
          title="Game discovery + search"
          body="Search RAWG for games and browse a curated popular list."
        />
        <Feature
          title="Completion tracking"
          body="Mark games completed and view your completed library later."
        />
        <Feature
          title="XP + genre progression"
          body="Earn XP and genre XP, with level thresholds and a progression dashboard."
        />
        <Feature
          title="Auth + server-truth persistence"
          body="Supabase authentication with Prisma/Postgres persistence and API routes."
        />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-white">Tech stack</h2>
        <p className="text-sm text-zinc-400">
          Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase Auth, PostgreSQL, Prisma ORM, RAWG API, Vercel.
        </p>
      </section>

      <section className="text-xs text-zinc-500">
        Built as a portfolio-quality, production-style web application with secure server/client separation.
      </section>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-2">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-sm text-zinc-400">{body}</p>
    </div>
  );
}
