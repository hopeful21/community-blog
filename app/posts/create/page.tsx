"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCreatePost() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      user_id: user.id,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Post published successfully 🚀");
      setTitle("");
      setContent("");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-20">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">

          <div className="inline-block px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-sm mb-6">
            ✍️ Create New Article
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Start Writing Your Story
          </h1>

          <p className="text-gray-400 mt-6 text-lg max-w-2xl">
            Share your ideas, tutorials, experiences, and thoughts with the community in real-time.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl shadow-2xl">

          {/* Title */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-3">
              Post Title
            </label>

            <input
              type="text"
              placeholder="Enter your article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full
                bg-black/30
                border border-white/10
                rounded-2xl
                px-5
                py-4
                outline-none
                focus:border-cyan-400
                transition
                text-lg
              "
            />
          </div>

          {/* Content */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-3">
              Article Content
            </label>

            <textarea
              placeholder="Write your amazing content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="
                w-full
                h-[350px]
                bg-black/30
                border border-white/10
                rounded-2xl
                px-5
                py-4
                outline-none
                focus:border-cyan-400
                transition
                resize-none
                leading-relaxed
              "
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4">

            <button
              onClick={handleCreatePost}
              disabled={loading}
              className="
                bg-cyan-400
                text-black
                px-8
                py-4
                rounded-2xl
                font-bold
                hover:scale-105
                transition-transform
                shadow-2xl
                shadow-cyan-400/30
                disabled:opacity-50
              "
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>

            <a
              href="/"
              className="
                border border-white/10
                px-8
                py-4
                rounded-2xl
                hover:bg-white/10
                transition
              "
            >
              Back Home
            </a>

          </div>

          {/* Message */}
          {message && (
            <div className="mt-8 bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 p-4 rounded-2xl">
              {message}
            </div>
          )}

        </div>
      </div>

    </main>
  );
}