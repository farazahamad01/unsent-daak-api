import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind The Unsent Daak — a poetic sanctuary for words that never found an address.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <div className="py-20 px-6 text-center border-b border-beige">
          <p className="font-accent italic text-terracotta text-xl mb-2">The Story</p>
          <h1 className="font-serif text-5xl text-charcoal">About</h1>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* Opening quote */}
          <blockquote className="border-l-2 border-terracotta pl-6 mb-12">
            <p className="font-accent italic text-2xl text-charcoal leading-relaxed">
              "Daak" is the Urdu/Hindi word for mail, for letters, for things sent across distance.
              But this is the daak that never left.
            </p>
          </blockquote>

          <div className="space-y-8 font-body text-charcoal/80 leading-loose text-lg">
            <p>
              The Unsent Daak began as a private ritual — words written in the middle of the night, 
              in the margins of grief, in the aftermath of joy too large to hold alone. Letters 
              addressed to people, places, and versions of myself that could never truly receive them.
            </p>

            <p>
              Over time, it became clear that keeping these words private was its own kind of loss. 
              Not because they needed to be read, but because writing, by its nature, reaches for 
              another. Even silence has a recipient.
            </p>

            <h2 className="font-serif text-3xl text-charcoal pt-4">Why "The Unsent Daak"?</h2>

            <p>
              Because every poem is a letter you couldn't send. Every story is a feeling you couldn't 
              name in conversation. Every reflection is the thought you had at 2 AM that deserved more 
              than the darkness.
            </p>

            <p>
              This is a home for all of that — poems that breathe, letters that wander, stories that 
              fold reality just slightly, and reflections that sit with the difficult questions without 
              rushing toward answers.
            </p>

            <h2 className="font-serif text-3xl text-charcoal pt-4">What You'll Find Here</h2>

            <p>
              Original poetry, prose letters, short fiction, and personal reflections — all written 
              from a place of honesty rather than performance. Alongside the writings, a shelf of books: 
              my own published works, and books that have shaped how I see and write about the world.
            </p>

            <div className="bg-cream-dark border border-beige p-8 my-10">
              <p className="font-accent italic text-xl text-charcoal/70 leading-relaxed">
                "This is not a blog. It is a post office with no delivery address — 
                where every piece of mail arrives exactly where it was meant to."
              </p>
            </div>

            <p className="font-accent italic text-xl text-terracotta">
              Welcome to The Unsent Daak.
            </p>
          </div>

          {/* Contact / Social */}
          <div className="mt-16 pt-10 border-t border-beige">
            <h3 className="font-serif text-2xl text-charcoal mb-4">Find Me</h3>
            <p className="text-charcoal/60 mb-6">
              For collaborations, questions, or just to say hello — the daak is open.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Email", href: "mailto:hello@theunsentdaak.com" },
                { label: "Instagram", href: "https://instagram.com/theunsentdaak" },
                { label: "Twitter / X", href: "https://twitter.com/theunsentdaak" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !text-xs"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
