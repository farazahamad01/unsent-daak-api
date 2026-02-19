import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/70 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-cream mb-3">The Unsent Daak</h3>
            <p className="font-accent italic text-terracotta-light text-lg mb-4">
              Words that were never meant to arrive.
            </p>
            <p className="text-sm leading-relaxed">
              A poetic sanctuary where letters find no address, 
              but every word finds a heart.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/50 mb-4">Navigate</h4>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/blog", label: "Writings" },
                { href: "/blog?category=poem", label: "Poems" },
                { href: "/blog?category=letter", label: "Letters" },
                { href: "/books", label: "Books" },
                { href: "/about", label: "About" },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm hover:text-terracotta transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/50 mb-4">Letters to Your Inbox</h4>
            <p className="text-sm mb-4">Receive new writings when the wind is right.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-charcoal border border-cream/20 px-4 py-2 text-sm 
                           text-cream placeholder-cream/30 outline-none 
                           focus:border-terracotta transition-colors"
              />
              <button
                type="submit"
                className="bg-terracotta text-cream px-4 py-2 text-sm hover:bg-terracotta-light transition-colors"
              >
                →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} The Unsent Daak. All rights reserved.
          </p>
          <p className="font-accent italic text-cream/30 text-sm">
            est. in longing
          </p>
        </div>
      </div>
    </footer>
  );
}
