import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostCard from "@/components/blog/PostCard";
import BookCard from "@/components/books/BookCard";
import { Post, Book, PageResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Unsent Daak — Words That Were Never Meant to Arrive",
  description:
    "A poetic sanctuary of poems, letters, short stories, and reflections. Literary writings and books by The Unsent Daak.",
};

async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=0&size=3`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: PageResponse<Post> = await res.json();
    return data.content || [];
  } catch {
    return [];
  }
}

async function getFeaturedBooks(): Promise<Book[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/featured`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const categories = [
  { label: "Poems", icon: "🪶", slug: "poem", desc: "Verses distilled from silence" },
  { label: "Letters", icon: "✉️", slug: "letter", desc: "Words addressed to no one" },
  { label: "Stories", icon: "📖", slug: "story", desc: "Moments folded into fiction" },
  { label: "Reflections", icon: "🌿", slug: "reflection", desc: "Thoughts at the margin" },
];

export default async function HomePage() {
  const [posts, books] = await Promise.all([getFeaturedPosts(), getFeaturedBooks()]);

  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 bg-cream" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #D4C5B0 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8DDD0 0%, transparent 50%)",
            }}
          />

          {/* Content */}
          <div className="relative text-center max-w-3xl animate-fade-in">
            <p className="font-accent italic text-terracotta text-xl mb-6 tracking-wide">
              est. in longing
            </p>
            <h1 className="font-serif text-6xl md:text-8xl text-charcoal leading-none mb-6">
              The Unsent
              <br />
              <span className="text-terracotta">Daak</span>
            </h1>
            <p className="font-accent italic text-charcoal/60 text-2xl mb-10">
              Words that were never meant to arrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="btn-primary">
                Read My Words
              </Link>
              <Link href="/books" className="btn-dark">
                Visit the Shelf
              </Link>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-px h-12 bg-parchment mx-auto" />
          </div>
        </section>

        {/* ── Categories ──────────────────────────────────── */}
        <section className="py-20 px-6 bg-cream-dark">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="section-subtitle mb-2">Explore</p>
              <h2 className="section-title">What Lives Here</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className="group p-6 bg-cream border border-beige text-center hover:border-terracotta transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors mb-1">
                    {cat.label}
                  </h3>
                  <p className="font-accent italic text-charcoal/50 text-sm">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Posts ────────────────────────────────── */}
        {posts.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="section-subtitle mb-2">Fresh Ink</p>
                  <h2 className="section-title">Recent Writings</h2>
                </div>
                <Link
                  href="/blog"
                  className="font-sans text-sm uppercase tracking-widest text-terracotta hover:text-charcoal transition-colors hidden md:block"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <div className="text-center mt-10 md:hidden">
                <Link href="/blog" className="btn-primary">
                  View All Writings
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Quote ─────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-charcoal">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-accent italic text-cream text-3xl md:text-4xl leading-relaxed mb-6">
              "Some letters are written to be felt,
              <br />
              not to be sent."
            </p>
            <div className="w-12 h-px bg-terracotta mx-auto" />
          </div>
        </section>

        {/* ── Featured Books ────────────────────────────────── */}
        {books.length > 0 && (
          <section className="py-20 px-6 bg-cream-dark">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="section-subtitle mb-2">From the Shelf</p>
                  <h2 className="section-title">Books</h2>
                </div>
                <Link
                  href="/books"
                  className="font-sans text-sm uppercase tracking-widest text-terracotta hover:text-charcoal transition-colors hidden md:block"
                >
                  Full Shelf →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {books.slice(0, 3).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Newsletter ────────────────────────────────────── */}
        <section className="py-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-subtitle mb-2">Stay Connected</p>
            <h2 className="section-title mb-4">Letters to Your Inbox</h2>
            <p className="text-charcoal/60 mb-8">
              When new words find their way, you will be the first to receive them.
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 border border-parchment bg-transparent px-4 py-3 
                           outline-none focus:border-terracotta transition-colors 
                           placeholder-parchment font-body text-sm"
              />
              <button type="submit" className="btn-dark whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
