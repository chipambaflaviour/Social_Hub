import React from "react";
import { useStore } from "../store/useStore";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function Home() {
  const posts = useStore((state) => state.posts);

  return (
    <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto space-y-md">
      <CreatePost />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
