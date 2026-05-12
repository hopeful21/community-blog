"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="
        bg-cyan-400
        text-black
        px-8
        py-4
        rounded-2xl
        font-bold
        disabled:opacity-50
      "
    >
      {pending ? "Saving..." : "Update Post"}
    </button>
  );
}
