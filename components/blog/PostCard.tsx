import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { format } from "date-fns";

interface Props {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block card">
      {/* Cover image */}
      {post.coverImage && (
        <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/0 transition-colors" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {post.category && (
          <span className="category-pill mb-3 inline-block">{post.category}</span>
        )}

        {/* Title */}
        <h2 className={`font-serif text-charcoal group-hover:text-terracotta transition-colors leading-snug mb-3 ${
          featured ? "text-2xl" : "text-xl"
        }`}>
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-charcoal/60 text-sm leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-charcoal/40 font-sans">
          <time>{format(new Date(post.createdAt), "MMMM d, yyyy")}</time>
          {post.readTime && <span>{post.readTime} min read</span>}
        </div>
      </div>
    </Link>
  );
}
