import type { Metadata } from "next";
import { Playfair_Display, Lora, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Unsent Daak",
    template: "%s | The Unsent Daak",
  },
  description:
    "Words that were never meant to arrive. A poetic sanctuary of poems, letters, stories, and reflections.",
  keywords: ["poetry", "literature", "poems", "letters", "short stories", "The Unsent Daak"],
  openGraph: {
    type: "website",
    siteName: "The Unsent Daak",
    title: "The Unsent Daak",
    description: "Words that were never meant to arrive.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Unsent Daak",
    description: "Words that were never meant to arrive.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lora.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body className="bg-cream text-charcoal font-body antialiased">
        {children}
      </body>
    </html>
  );
}
