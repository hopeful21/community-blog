import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EditPostForm from "./EditPostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, user_id")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  if (post.user_id !== user.id) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-5xl font-black">Unauthorized</h1>

          <p className="text-gray-400 mt-4">
            Only the original author can edit this post.
          </p>

          <Link
            href={`/posts/${post.id}`}
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
            Back to Post
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="inline-block px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-sm mb-6">
            Edit Article
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Update Your Story
          </h1>

          <p className="text-gray-400 mt-6 text-lg max-w-2xl">
            Changes are checked against your account before they reach the database.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl shadow-2xl">
          <EditPostForm post={post} />
        </div>
      </div>
    </main>
  );
}
