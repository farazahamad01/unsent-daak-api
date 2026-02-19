"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dashboardApi, adminPostsApi } from "@/lib/api";
import { Post, DashboardStats } from "@/lib/types";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, postsRes] = await Promise.all([
          dashboardApi.getStats(),
          adminPostsApi.getAll(),
        ]);
        setStats(statsRes.data);
        setRecentPosts(postsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-accent italic text-charcoal/40 text-xl">Loading...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Posts", value: stats?.totalPosts ?? 0, color: "bg-charcoal" },
    { label: "Published", value: stats?.publishedPosts ?? 0, color: "bg-sage" },
    { label: "Drafts", value: stats?.draftPosts ?? 0, color: "bg-terracotta" },
    { label: "Books", value: stats?.totalBooks ?? 0, color: "bg-parchment text-charcoal" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal mb-1">Dashboard</h1>
        <p className="font-accent italic text-charcoal/50">Welcome back to The Unsent Daak</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className={`${card.color} p-6 text-cream`}>
            <p className="text-4xl font-serif mb-1">{card.value}</p>
            <p className="text-xs uppercase tracking-widest font-sans opacity-75">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-4 mb-10">
        <Link href="/admin/posts/new" className="btn-dark">
          + New Post
        </Link>
        <Link href="/admin/books" className="btn-primary">
          Manage Books
        </Link>
      </div>

      {/* Recent posts */}
      <div className="bg-white border border-beige">
        <div className="p-5 border-b border-beige flex items-center justify-between">
          <h2 className="font-serif text-xl text-charcoal">Recent Posts</h2>
          <Link href="/admin/posts" className="text-xs font-sans uppercase tracking-widest text-terracotta hover:text-charcoal">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-beige">
          {recentPosts.length === 0 ? (
            <p className="p-6 text-charcoal/40 font-accent italic">No posts yet. Start writing!</p>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-charcoal truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-sans uppercase tracking-wider ${
                      post.isPublished ? "text-sage" : "text-charcoal/40"
                    }`}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                    {post.category && (
                      <span className="text-xs text-charcoal/40">{post.category}</span>
                    )}
                    <span className="text-xs text-charcoal/30">
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/posts/edit/${post.id}`}
                  className="text-xs border border-parchment px-3 py-1.5 hover:border-terracotta hover:text-terracotta transition-colors whitespace-nowrap font-sans"
                >
                  Edit
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
