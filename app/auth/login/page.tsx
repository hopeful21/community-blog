"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Login success.");
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-3">
            Login to continue writing and exploring.
          </p>
        </div>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="
              w-full
              bg-black/30
              border border-white/10
              rounded-2xl
              px-5
              py-4
              outline-none
              focus:border-cyan-400
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="
              w-full
              bg-black/30
              border border-white/10
              rounded-2xl
              px-5
              py-4
              outline-none
              focus:border-cyan-400
            "
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              bg-cyan-400
              text-black
              py-4
              rounded-2xl
              font-bold
              hover:scale-[1.02]
              transition-transform
              disabled:opacity-50
            "
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {message && (
            <div className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 p-4 rounded-2xl">
              {message}
            </div>
          )}

          <p className="text-center text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-cyan-400"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
