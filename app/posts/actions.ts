"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PostMutationResult = {
  error?: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updatePostAction(
  _previousState: PostMutationResult,
  formData: FormData
): Promise<PostMutationResult> {
  const postId = getStringValue(formData, "postId");
  const title = getStringValue(formData, "title");
  const content = getStringValue(formData, "content");

  if (!postId || !title || !content) {
    return {
      error: "Title and content are required.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    return {
      error: "Post not found.",
    };
  }

  if (post.user_id !== user.id) {
    return {
      error: "Unauthorized.",
    };
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
    })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePostAction(formData: FormData) {
  const postId = getStringValue(formData, "postId");

  if (!postId) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    redirect("/");
  }

  if (post.user_id !== user.id) {
    redirect(`/posts/${postId}`);
  }

  await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  revalidatePath("/");
  redirect("/");
}
