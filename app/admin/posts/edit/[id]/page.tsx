"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminPostsApi } from "@/lib/api";
import PostEditor from "@/components/admin/PostEditor";
import { Post } from "@/lib/types";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminPostsApi
      .getById(parseInt(id))
      .then((res) => setPost(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="font-accent italic text-charcoal/40 text-xl">Loading post...</p>;
  }

  if (!post) {
    return <p className="font-accent italic text-red-400 text-xl">Post not found.</p>;
  }

  return <PostEditor post={post} />;
}
