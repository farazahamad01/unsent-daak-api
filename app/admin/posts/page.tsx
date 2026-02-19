"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminPostsApi } from "@/lib/api";
import { Post } from "@/lib/types";
import { format } from "date-fns";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await adminPostsApi.getAll();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminPostsApi.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete post.");
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="font-accent italic text-charcoal/40 text-xl">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal mb-1">All Posts</h1>
          <p className="text-charcoal/50 text-sm">{posts.length} total</p>
        </div>
        <Link href="/admin/posts/new" className="btn-dark">+ New Post</Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-parchment bg-white px-4 py-2.5 text-sm 
                   outline-none focus:border-terracotta transition-colors mb-6 font-body"
      />

      {/* Table */}
      <div className="bg-white border border-beige overflow-hidden">
        <div className="grid grid-cols-12 text-xs font-sans uppercase tracking-widest text-charcoal/40 
                        px-5 py-3 border-b border-beige bg-cream-dark">
          <span className="col-span-5">Title</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-1">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <p className="p-6 text-charcoal/40 font-accent italic">No posts found.</p>
        ) : (
          <div className="divide-y divide-beige">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-12 items-center px-5 py-4 hover:bg-cream/50 transition-colors"
              >
                <div className="col-span-5 pr-4">
                  <p className="font-serif text-charcoal text-sm leading-tight truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-charcoal/30 mt-0.5 truncate">/{post.slug}</p>
                </div>
                <div className="col-span-2">
                  {post.category && (
                    <span className="category-pill !text-xs">{post.category}</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-sans uppercase tracking-wider ${
                    post.isPublished ? "text-sage" : "text-charcoal/40"
                  }`}>
                    {post.isPublished ? "● Published" : "○ Draft"}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-charcoal/40 font-sans">
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </div>
                <div className="col-span-1 flex gap-2">
                  <Link
                    href={`/admin/posts/edit/${post.id}`}
                    className="text-xs text-terracotta hover:text-charcoal transition-colors font-sans"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors font-sans"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
