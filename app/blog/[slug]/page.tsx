import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostCard from "@/components/blog/PostCard";
import AdSlot from "@/components/ui/AdSlot";
import ShareButtons from "@/components/blog/ShareButtons";
import { Post } from "@/lib/types";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelated(slug: string): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}/related`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const [post, related] = await Promise.all([
    getPost(params.slug),
    getRelated(params.slug),
  ]);

  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt,
              author: { "@type": "Person", name: "The Unsent Daak" },
              datePublished: post.createdAt,
              dateModified: post.updatedAt,
              image: post.coverImage,
              url: postUrl,
            }),
          }}
        />

        {/* Top ad */}
        <div className="max-w-3xl mx-auto px-6">
          <AdSlot placement="top" />
        </div>

        {/* Article header */}
        <div className="max-w-3xl mx-auto px-6 pb-10">
          {/* Category + meta */}
          <div className="flex items-center gap-4 mb-6 text-sm">
            {post.category && (
              <span className="category-pill">{post.category}</span>
            )}
            <time className="text-charcoal/40 font-sans text-xs">
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>
            {post.readTime && (
              <span className="text-charcoal/40 font-sans text-xs">
                {post.readTime} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-accent italic text-xl text-charcoal/60 border-l-2 border-terracotta pl-4 mb-8">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-6 mb-12">
            <div className="relative h-64 md:h-96 w-full overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article content */}
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Mid-article ad */}
          <AdSlot placement="mid-article" />

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-beige">
              {post.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-sans uppercase tracking-widest text-charcoal/50 
                             border border-parchment px-3 py-1"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Author note */}
          <div className="mt-10 p-6 bg-cream-dark border border-beige">
            <p className="font-accent italic text-charcoal/50 text-sm">
              Written by
            </p>
            <p className="font-serif text-lg text-charcoal">The Unsent Daak</p>
          </div>

          {/* Share */}
          <ShareButtons url={postUrl} title={post.title} />

          {/* End ad */}
          <AdSlot placement="footer" />
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="bg-cream-dark py-16 mt-10">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-serif text-3xl text-charcoal mb-8 text-center">
                More Writings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((r) => (
                  <PostCard key={r.id} post={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
