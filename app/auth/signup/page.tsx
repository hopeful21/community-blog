"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSignup() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setIsError(true);
      setMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          username: normalizedEmail.split("@")[0],
        },
      },
    });

    if (error) {
      setIsError(true);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage("Account created. Check your email to confirm before logging in.");
      setLoading(false);
      return;
    }

    setMessage("Account created successfully.");
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black">
            Create Account
          </h1>

          <p className="text-gray-400 mt-3">
            Join the community and start publishing posts.
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
            autoComplete="new-password"
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
            onClick={handleSignup}
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
            {loading ? "Creating..." : "Create Account"}
          </button>

          {message && (
            <div
              className={`rounded-2xl border p-4 ${
                isError
                  ? "border-red-400/20 bg-red-400/10 text-red-200"
                  : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-cyan-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
