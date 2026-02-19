"use client";

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="font-sans text-xs uppercase tracking-widest text-charcoal/40">
        Share:
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs border border-parchment px-4 py-2 hover:border-terracotta hover:text-terracotta transition-colors font-sans uppercase tracking-wider"
      >
        Twitter/X
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs border border-parchment px-4 py-2 hover:border-terracotta hover:text-terracotta transition-colors font-sans uppercase tracking-wider"
      >
        WhatsApp
      </a>
      <button
        onClick={copyLink}
        className="text-xs border border-parchment px-4 py-2 hover:border-terracotta hover:text-terracotta transition-colors font-sans uppercase tracking-wider"
      >
        Copy Link
      </button>
    </div>
  );
}
