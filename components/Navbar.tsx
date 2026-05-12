"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {

  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {

    await supabase.auth.signOut();

    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
    <nav
      className="
        fixed
        top-0
        left-0
        right-0
        border-b
        border-white/10
        backdrop-blur-xl
        z-50
        bg-black/75
      "
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 md:py-5">

      {/* Logo */}
      <Link href="/" onClick={closeMenu}>
        <h1 className="text-xl font-black text-white md:text-2xl">
          Community
          <span className="text-cyan-400">
            Blog
          </span>
        </h1>
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-8 text-gray-300">

        <Link
          href="/"
          className="hover:text-cyan-400 transition"
        >
          Home
        </Link>

        <Link
          href="/posts/create"
          className="hover:text-cyan-400 transition"
        >
          Write
        </Link>

      </div>

      {/* Auth */}
      <div className="hidden items-center gap-4 md:flex">

        {loading ? (

          <div className="text-gray-400 text-sm">
            Loading...
          </div>

        ) : user ? (

          <>
            {/* User Card */}
            <div
              className="
                hidden md:flex
                items-center
                gap-3
                bg-white/5
                border
                border-white/10
                px-4
                py-2
                rounded-2xl
              "
            >

              {/* Avatar */}
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-cyan-400
                  text-black
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>

              {/* Email */}
              <div className="max-w-[180px]">

                <p className="text-xs text-gray-400">
                  Logged in as
                </p>

                <p className="text-sm font-semibold text-white truncate">
                  {user.email}
                </p>

              </div>

            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                bg-red-500/10
                border
                border-red-500/20
                text-red-400
                px-5
                py-2
                rounded-full
                hover:bg-red-500/20
                transition
              "
            >
              Logout
            </button>

          </>

        ) : (

          <>
            <Link
              href="/auth/login"
              className="
                border
                border-white/10
                text-white
                px-5
                py-2
                rounded-full
              "
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="
                bg-cyan-400
                text-black
                px-5
                py-2
                rounded-full
                font-bold
              "
            >
              Join Now
            </Link>
          </>

        )}

      </div>

      <button
        type="button"
        onClick={() => setIsMenuOpen((value) => !value)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        className="
          inline-flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/5
          text-white
          transition
          hover:bg-white/10
          md:hidden
        "
      >
        <span className="relative h-4 w-5">
          <span
            className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition ${
              isMenuOpen ? "top-2 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition ${
              isMenuOpen ? "top-2 -rotate-45" : "top-4"
            }`}
          />
        </span>
      </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-black/95 px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-gray-200 transition hover:bg-white/10 hover:text-cyan-300"
            >
              Home
            </Link>

            <Link
              href="/#posts"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-gray-200 transition hover:bg-white/10 hover:text-cyan-300"
            >
              Posts
            </Link>

            <Link
              href="/posts/create"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-gray-200 transition hover:bg-white/10 hover:text-cyan-300"
            >
              Write
            </Link>

            <div className="mt-3 border-t border-white/10 pt-4">
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-400">
                  Loading...
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-black">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Logged in as
                      </p>
                      <p className="truncate text-sm font-semibold text-white">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-red-500/20
                      bg-red-500/10
                      px-4
                      py-3
                      text-left
                      font-semibold
                      text-red-300
                      transition
                      hover:bg-red-500/20
                    "
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="rounded-2xl border border-white/10 px-4 py-3 text-center font-semibold text-white"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signup"
                    onClick={closeMenu}
                    className="rounded-2xl bg-cyan-400 px-4 py-3 text-center font-bold text-black"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </nav>
    <div className="h-[73px] md:h-[81px]" aria-hidden="true" />
    </>
  );
}
