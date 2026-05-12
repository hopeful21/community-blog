import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Comments from "@/components/Comments";
import { deletePostAction } from "@/app/posts/actions";

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-5xl font-black">
            Post not found
          </h1>

          <p className="text-gray-400 mt-4">
            The article may have been deleted.
          </p>

          <Link
            href="/"
            className="
              inline-block
              mt-8
              bg-cyan-400
              text-black
              px-8
              py-4
              rounded-2xl
              font-bold
            "
          >
            Back Home
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-20">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">

          <div className="inline-block px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-sm mb-6">
            📰 Community Article
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            {post.title}
          </h1>

        </div>

        {/* Content */}
        <div
          className="
            bg-white/5
            border border-white/10
            rounded-[32px]
            p-8
            backdrop-blur-xl
          "
        >

          <div className="prose prose-invert max-w-none">

            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

          </div>

        </div>

        {/* Actions */}
        {user?.id === post.user_id && (
          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href={`/posts/${post.id}/edit`}
              className="
                bg-cyan-400
                text-black
                px-6
                py-3
                rounded-2xl
                font-bold
              "
            >
              Edit Post
            </Link>

            <form action={deletePostAction}>
              <input type="hidden" name="postId" value={post.id} />

              <button
                type="submit"
                className="
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-300
                  px-6
                  py-3
                  rounded-2xl
                  font-bold
                  hover:bg-red-500/20
                  transition
                "
              >
                Delete Post
              </button>
            </form>

          </div>
        )}

        {/* Comments */}
        <Comments postId={post.id} />

      </div>

    </main>
  );
}
