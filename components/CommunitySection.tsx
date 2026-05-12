"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function CommunitySection() {
  const { user, loading } = useAuth();

  return (
    <section
      id="community"
      className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"
    >
      <div className="rounded-[30px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-white/[0.04] to-emerald-500/10 p-7 text-center shadow-2xl shadow-black/20 md:rounded-[40px] md:p-12">

        <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
          Connect and Grow Together
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:mt-8 md:text-lg">
          Join developers, creators, and tech enthusiasts sharing ideas everyday.
        </p>

        {!loading && !user && (
          <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap sm:justify-center">

            <Link
              href="/auth/signup"
              className="rounded-2xl bg-cyan-400 px-8 py-4 text-center font-bold text-black transition hover:bg-cyan-300"
            >
              Create Account
            </Link>

            <Link
              href="/auth/login"
              className="rounded-2xl border border-white/20 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>

          </div>
        )}
      </div>
    </section>
  );
}
