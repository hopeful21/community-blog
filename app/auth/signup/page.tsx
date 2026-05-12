"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup() {

    setLoading(true);
    setMessage("");

   const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

if (!error && data.user) {

  await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      username: email.split("@")[0],
    });
}

    setLoading(false);
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
            "
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {message && (
            <div className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 p-4 rounded-2xl">
              {message}
            </div>
          )}

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-cyan-400"
            >
              Login
            </a>
          </p>

        </div>
      </div>

    </main>
  );
}