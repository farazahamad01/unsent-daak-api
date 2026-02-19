import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostCard from "@/components/blog/PostCard";
import AdSlot from "@/components/ui/AdSlot";
import { Post, PageResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "Writings",
  description: "All poems, letters, stories, and reflections from The Unsent Daak.",
};

const categories = [
  { label: "All", value: "" },
  { label: "Poems", value: "poem" },
  { label: "Letters", value: "letter" },
  { label: "Stories", value: "story" },
  { label: "Reflections", value: "reflection" },
];

async function getPosts(page: number, category?: string): Promise<PageResponse<Post>> {
  try {
    const params = new URLSearchParams({ page: String(page), size: "9" });
    if (category) params.set("category", category);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?${params}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { content: [], totalElements: 0, totalPages: 0, number: 0, size: 9 };
    return res.json();
  } catch {
    return { content: [], totalElements: 0, totalPages: 0, number: 0, size: 9 };
  }
}

interface Props {
  searchParams: { category?: string; page?: string };
}

export default async function BlogPage({ searchParams }: Props) {
  const category = searchParams.category || "";
  const page = parseInt(searchParams.page || "0");
  const data = await getPosts(page, category);

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        {/* Header */}
        <div className="py-16 px-6 text-center border-b border-beige">
          <p className="font-accent italic text-terracotta text-xl mb-2">The Archive</p>
          <h1 className="font-serif text-5xl text-charcoal">Writings</h1>
        </div>

        {/* Category filter */}
        <div className="sticky top-16 z-40 bg-cream/95 backdrop-blur-sm border-b border-beige">
          <div className="max-w-6xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <a
                key={cat.value}
                href={cat.value ? `/blog?category=${cat.value}` : "/blog"}
                className={`whitespace-nowrap px-5 py-2 text-xs font-sans uppercase tracking-widest transition-all ${
                  category === cat.value
                    ? "bg-charcoal text-cream"
                    : "border border-parchment text-charcoal hover:border-terracotta hover:text-terracotta"
                }`}
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Ad slot */}
        <div className="max-w-6xl mx-auto px-6">
          <AdSlot placement="top" />
        </div>

        {/* Posts grid */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {data.content.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-accent italic text-charcoal/40 text-2xl">No writings yet.</p>
              <p className="text-charcoal/30 mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.content.map((post, i) => (
                <>
                  <PostCard key={post.id} post={post} />
                  {/* Mid-content ad every 6 posts */}
                  {i === 5 && (
                    <div key="ad" className="col-span-full">
                      <AdSlot placement="banner" />
                    </div>
                  )}
                </>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <a
                  key={i}
                  href={`/blog?${category ? `category=${category}&` : ""}page=${i}`}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-sans transition-all ${
                    i === page
                      ? "bg-charcoal text-cream"
                      : "border border-parchment text-charcoal hover:border-terracotta"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>

        <AdSlot placement="footer" className="max-w-6xl mx-auto px-6" />
      </main>
      <Footer />
    </>
  );
}
