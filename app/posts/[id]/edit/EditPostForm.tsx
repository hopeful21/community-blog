"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePostAction } from "@/app/posts/actions";
import SubmitButton from "./SubmitButton";

type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
  };
};

const initialState = {
  error: "",
};

export default function EditPostForm({ post }: EditPostFormProps) {
  const [state, formAction] = useActionState(updatePostAction, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="postId" value={post.id} />

      <div>
        <label htmlFor="title" className="block text-sm text-gray-400 mb-3">
          Post Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          defaultValue={post.title}
          required
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

      <div>
        <label htmlFor="content" className="block text-sm text-gray-400 mb-3">
          Article Content
        </label>

        <textarea
          id="content"
          name="content"
          defaultValue={post.content}
          required
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

      {state.error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {state.error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />

        <Link
          href={`/posts/${post.id}`}
          className="
            border border-white/10
            px-8
            py-4
            rounded-2xl
            hover:bg-white/10
            transition
          "
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
