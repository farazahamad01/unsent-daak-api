import Image from "next/image";
import { Book } from "@/lib/types";

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  return (
    <div className="group card flex flex-col">
      {/* Cover */}
      <div className="relative h-64 bg-beige overflow-hidden">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-beige to-parchment">
            <span className="font-serif text-4xl text-parchment">📖</span>
          </div>
        )}
        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-sans uppercase tracking-wider px-2 py-1 ${
            book.bookType === "own"
              ? "bg-terracotta text-cream"
              : "bg-charcoal text-cream"
          }`}>
            {book.bookType === "own" ? "My Book" : "Affiliate"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors mb-1">
          {book.title}
        </h3>
        {book.author && (
          <p className="font-accent italic text-charcoal/50 text-sm mb-3">{book.author}</p>
        )}
        {book.description && (
          <p className="text-sm text-charcoal/60 leading-relaxed line-clamp-2 mb-4 flex-1">
            {book.description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-beige">
          {book.price ? (
            <span className="font-serif text-terracotta text-lg">₹{book.price}</span>
          ) : (
            <span className="font-sans text-xs text-charcoal/40 uppercase tracking-wider">
              {book.bookType === "affiliate" ? "External Link" : ""}
            </span>
          )}
          <a
            href={book.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark !px-4 !py-2 text-xs"
          >
            Buy Now →
          </a>
        </div>
      </div>
    </div>
  );
}
