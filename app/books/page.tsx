import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/books/BookCard";
import AdSlot from "@/components/ui/AdSlot";
import { Book } from "@/lib/types";

export const metadata: Metadata = {
  title: "Books",
  description: "My own books and curated reading recommendations from The Unsent Daak.",
};

async function getBooks(type?: string): Promise<Book[]> {
  try {
    const params = type ? `?type=${type}` : "";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books${params}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

interface Props {
  searchParams: { type?: string };
}

export default async function BooksPage({ searchParams }: Props) {
  const type = searchParams.type || "";
  const books = await getBooks(type);

  const ownBooks = books.filter((b) => b.bookType === "own");
  const affiliateBooks = books.filter((b) => b.bookType === "affiliate");

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        {/* Header */}
        <div className="py-16 px-6 text-center border-b border-beige">
          <p className="font-accent italic text-terracotta text-xl mb-2">The Shelf</p>
          <h1 className="font-serif text-5xl text-charcoal mb-4">Books</h1>
          <p className="text-charcoal/50 max-w-md mx-auto">
            Words between covers — my own works and the ones that shaped them.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="border-b border-beige">
          <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4">
            {[
              { label: "All Books", value: "" },
              { label: "My Books", value: "own" },
              { label: "Recommended", value: "affiliate" },
            ].map((tab) => (
              <a
                key={tab.value}
                href={tab.value ? `/books?type=${tab.value}` : "/books"}
                className={`px-5 py-2 text-xs font-sans uppercase tracking-widest transition-all ${
                  type === tab.value
                    ? "bg-charcoal text-cream"
                    : "border border-parchment text-charcoal hover:border-terracotta hover:text-terracotta"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <AdSlot placement="top" />

          {books.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-accent italic text-charcoal/40 text-2xl">
                The shelf is being arranged.
              </p>
            </div>
          ) : (
            <>
              {/* My Books section */}
              {(type === "" || type === "own") && ownBooks.length > 0 && (
                <div className="mb-16">
                  <div className="mb-8">
                    <p className="font-accent italic text-terracotta">Written by me</p>
                    <h2 className="font-serif text-3xl text-charcoal">My Books</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ownBooks.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              )}

              {/* Affiliate section */}
              {(type === "" || type === "affiliate") && affiliateBooks.length > 0 && (
                <div>
                  <div className="mb-8">
                    <p className="font-accent italic text-terracotta">Recommended reads</p>
                    <h2 className="font-serif text-3xl text-charcoal">From My Shelf</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {affiliateBooks.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                  <p className="text-xs text-charcoal/30 mt-6 font-sans">
                    * Affiliate links — I earn a small commission at no extra cost to you.
                  </p>
                </div>
              )}
            </>
          )}

          <AdSlot placement="footer" />
        </div>
      </main>
      <Footer />
    </>
  );
}
