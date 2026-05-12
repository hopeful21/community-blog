"use client";

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

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login success 🚀");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    }

    setLoading(false);
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-cyan-400"
            >
              Signup
            </a>
          </p>

        </div>
      </div>

    </main>
  );
}