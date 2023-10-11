import React from "react";
// @ts-ignore
import Link from "next/link";
import CreatePost from "@/app/post/CreatePost";

async function getPosts() {
  const res = await fetch(
    "http://127.0.0.1:8090/api/collections/posts/records",
    { cache: "no-store" },
  );
  const data = await res.json();

  return data?.items as any;
}

async function PostPage() {
  const posts = await getPosts();
  console.log(posts);
  return (
    <div>
      <h1>Posts</h1>
      {posts?.map((post: any) => <PostItem key={post.id} post={post} />)}

      <CreatePost />
    </div>
  );
}

export default PostPage;

function PostItem({ post }: any) {
  const { id, title, created } = post || {};
  return (
    <Link href={`/post/${id}`}>
      <div>
        <h3>{title}</h3>
        <p>{created}</p>
      </div>
    </Link>
  );
}
