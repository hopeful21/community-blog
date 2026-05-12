import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export default async function PostsSection() {
  const { data: posts } = await supabaseServer
    .from("posts")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  return (
    <section
      id="posts"
      className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Latest Articles
          </p>

          <h2 className="mt-3 text-4xl font-black text-white md:text-5xl">
            Latest Posts
          </h2>

          <p className="mt-3 text-gray-400">
            Real-time posts from the community.
          </p>
        </div>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-8 text-center md:p-10">
          <h3 className="text-2xl font-bold text-white">
            No posts yet
          </h3>

          <p className="mt-3 text-gray-400">
            Be the first to publish.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-white/10
                bg-white/[0.055]
                transition
                hover:-translate-y-1
                hover:border-cyan-400/40
                hover:bg-white/[0.08]
              "
            >
              <div className="flex h-44 items-end bg-gradient-to-br from-cyan-400/25 via-blue-500/15 to-emerald-400/10 p-6 md:h-52">
                <div className="rounded-2xl bg-black/30 px-4 py-2 text-sm font-semibold text-cyan-200">
                  Community Article
                </div>
              </div>

              <div className="p-6 md:p-7">
                <h3 className="text-xl font-bold leading-snug text-white md:text-2xl">
                  {post.title}
                </h3>

                <p className="mt-4 line-clamp-3 text-gray-400">
                  {post.content}
                </p>

                <Link
                  href={`/posts/${post.id}`}
                  className="
                    mt-6
                    inline-block
                    font-semibold
                    text-cyan-400
                    transition
                    hover:text-cyan-300
                  "
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

