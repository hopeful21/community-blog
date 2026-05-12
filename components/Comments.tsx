"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type CommentProfile = {
  username: string | null;
  avatar_url: string | null;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string | null;
  profiles: CommentProfile | null;
  isOptimistic?: boolean;
};

type RawComment = Omit<Comment, "profiles">;

type ProfileRow = CommentProfile & {
  id: string;
};

const commentsSelect = `
  id,
  post_id,
  user_id,
  content,
  created_at
`;

function normalizeComment(
  comment: RawComment,
  profile: CommentProfile | null
): Comment {
  return {
    ...comment,
    profiles: profile,
    created_at: comment.created_at ?? null,
  };
}

function formatCommentDate(value: string | null) {
  if (!value) return "Just now";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleString();
}

export default function Comments({
  postId,
}: {
  postId: string;
}) {

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchComments = useCallback(async () => {

    const { data, error } = await supabase
      .from("comments")
      .select(commentsSelect)
      .eq("post_id", postId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const rows = (data || []) as RawComment[];
    const userIds = Array.from(new Set(rows.map((comment) => comment.user_id)));

    let profilesById = new Map<string, CommentProfile>();

    if (userIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (profilesError) {
        setErrorMessage(profilesError.message);
        return;
      }

      profilesById = new Map(
        ((profilesData || []) as ProfileRow[]).map((profile) => [
          profile.id,
          {
            username: profile.username,
            avatar_url: profile.avatar_url,
          },
        ])
      );
    }

    setComments(
      rows.map((comment) =>
        normalizeComment(comment, profilesById.get(comment.user_id) ?? null)
      )
    );
  }, [postId]);

  useEffect(() => {

    const fetchTimeout = window.setTimeout(() => {
      void fetchComments();
    }, 0);

    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      window.clearTimeout(fetchTimeout);
      supabase.removeChannel(channel);
    };

  }, [fetchComments, postId]);

  async function addComment() {

    if (!content.trim() || isSending) return;
    setErrorMessage("");
    setIsSending(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMessage("Please login first.");
      setIsSending(false);
      return;
    }

    const username =
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      `user_${user.id.slice(0, 8)}`;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          username,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        },
        {
          onConflict: "id",
        }
      )
      .select("username, avatar_url")
      .single();

    if (profileError) {
      setErrorMessage(profileError.message);
      setIsSending(false);
      return;
    }

    const profile = profileData ?? {
      username,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    };

    // Optimistic UI
    const optimisticId = `optimistic-${Date.now()}`;
    const currentContent = content.trim();
    const optimisticComment = {
      id: optimisticId,
      post_id: postId,
      user_id: user.id,
      content: currentContent,
      created_at: new Date().toISOString(),
      profiles: profile,
      isOptimistic: true,
    };

    setComments((prev) => [
      optimisticComment,
      ...prev,
    ]);

    setContent("");

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        content: currentContent,
        user_id: user.id,
      })
      .select(commentsSelect)
      .single();

    if (error) {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== optimisticId)
      );
      setContent(currentContent);
      setErrorMessage(error.message);
      setIsSending(false);
      return;
    }

    const savedComment = normalizeComment(data as RawComment, profile);

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === optimisticId ? savedComment : comment
      )
    );

    setIsSending(false);
    void fetchComments();
  }

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        Comments
      </h2>

      <div className="space-y-5">

     {comments.map((comment) => (

  <div
    key={comment.id}
    className="
      bg-white/5
      border border-white/10
      p-5
      rounded-2xl
    "
  >

    <div className="flex items-center gap-3 mb-4">

      {/* Avatar */}
      <div
        className="
          w-11
          h-11
          rounded-full
          bg-cyan-400
          text-black
          flex
          items-center
          justify-center
          font-bold
        "
      >
        {comment.profiles?.username?.charAt(0)?.toUpperCase()}
      </div>

      {/* User */}
      <div>

        <h4 className="font-semibold text-white">
          {comment.profiles?.username || "Anonymous"}
        </h4>

        <p className="text-xs text-gray-400">
          {formatCommentDate(comment.created_at)}
        </p>

      </div>

    </div>

    {/* Comment */}
    <p className="text-gray-300 leading-relaxed">
      {comment.content}
    </p>

  </div>

))}

      </div>

      <div className="mt-10 flex gap-4">

        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write comment..."
          className="
            flex-1
            p-4
            rounded-2xl
            bg-white/10
            border border-white/10
            outline-none
          "
        />

        <button
          onClick={addComment}
          disabled={isSending}
          className="
            bg-cyan-400
            text-black
            px-6
            rounded-2xl
            font-bold
            disabled:opacity-50
          "
        >
          {isSending ? "Sending..." : "Send"}
        </button>

      </div>

      {errorMessage && (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      {/* Back to Home */}
      <div className="mt-12">

        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            px-6
            py-3
            rounded-2xl
            border
            border-white/10
            bg-white/5
            hover:bg-white/10
            transition
          "
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}
