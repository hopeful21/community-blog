import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div>
        <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
          Modern Community Platform
        </div>

        <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
          Share Your Ideas With The World.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 md:mt-8 md:text-lg">
          A powerful community blogging platform built with Next.js,
          Supabase, TypeScript, and TailwindCSS.
        </p>

        <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap">
          <Link
            href="/posts/create"
            className="rounded-2xl bg-cyan-400 px-8 py-4 text-center font-bold text-black shadow-2xl shadow-cyan-400/25 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            Start Writing
          </Link>

          <Link
            href="#posts"
            className="rounded-2xl border border-white/20 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
          >
            Explore Posts
          </Link>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-cyan-400/15 p-4">
            <p className="text-2xl font-black text-cyan-300">24/7</p>
            <p className="mt-1 text-xs text-gray-400">Realtime</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-black text-white">Auth</p>
            <p className="mt-1 text-xs text-gray-400">Secure</p>
          </div>

          <div className="rounded-2xl bg-emerald-400/15 p-4">
            <p className="text-2xl font-black text-emerald-300">RLS</p>
            <p className="mt-1 text-xs text-gray-400">Protected</p>
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
          Community Driven Blogging
        </h2>

        <p className="leading-relaxed text-gray-300">
          Realtime posts, comments, authentication, and modern UI powered by Supabase.
        </p>
      </div>
    </section>
  );
}
