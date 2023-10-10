"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function CreatePost() {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:8090/api/collections/posts/records", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        title,
      }),
    });
    setTitle("");
    // 해당 페이지를 새로 고침하면서 fetch 는 다시 하지만, 현재 state 손실이 발생하지 않음
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type={"text"}
        placeholder={"Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type={"submit"}>Create Post</button>
    </form>
  );
}

export default CreatePost;
