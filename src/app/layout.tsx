import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://sudoku2026.vercel.app";

export const metadata: Metadata = {
  title: "Sudoku — Free Online Puzzle Game | Play Sudoku 2026",
  description:
    "Play Sudoku online for free — a modern, clean number puzzle game with 4 difficulty levels (Easy, Medium, Hard, Expert), scoring system, hints, notes, dark mode, and multi-language support. No download needed. Works on mobile and desktop.",
  keywords: [
    "sudoku",
    "sudoku online",
    "free sudoku",
    "play sudoku",
    "sudoku game",
    "sudoku puzzle",
    "number puzzle",
    "logic puzzle",
    "brain game",
    "brain teaser",
    "sudoku free online",
    "sudoku easy",
    "sudoku medium",
    "sudoku hard",
    "sudoku expert",
    "sudoku with hints",
    "sudoku with notes",
    "sudoku dark mode",
    "sudoku mobile",
    "sudoku no download",
    "sudoku no ads",
    "sudoku 9x9",
    "sudoku solver",
    "daily sudoku",
    "sudoku challenge",
    "sudoku 2026",
    "math puzzle",
    "number game",
    "puzzle game online",
    "free puzzle game",
    "судоку",
    "sudoku en ligne",
    "sudoku kostenlos",
    "数独",
    "ナンプレ",
  ],
  authors: [{ name: "Sudoku 2026" }],
  creator: "Sudoku 2026",
  publisher: "Sudoku 2026",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "ru": SITE_URL,
      "de": SITE_URL,
      "ja": SITE_URL,
      "fr": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Sudoku — Free Online Puzzle Game",
    description:
      "Play the classic 9×9 Sudoku puzzle online for free. 4 difficulty levels, scoring, hints, notes mode, beautiful themes, and multi-language support. No ads, no downloads.",
    siteName: "Sudoku 2026",
    locale: "en_GB",
    alternateLocale: ["ru_RU", "de_DE", "ja_JP", "fr_FR"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoku — Free Online Puzzle Game",
    description:
      "Play the classic number puzzle online for free. 4 difficulty levels, scoring, hints, dark mode & more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "Games",
  classification: "Puzzle Game",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Sudoku",
    "application-name": "Sudoku 2026",
  },
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('sudoku-theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sudoku 2026",
  url: SITE_URL,
  description:
    "Free online Sudoku puzzle game with 4 difficulty levels, scoring system, hints, notes, dark mode, and multi-language support.",
  applicationCategory: "GameApplication",
  genre: "Puzzle",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: ["en", "ru", "de", "ja", "fr"],
  aggregateRating: undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={SITE_URL} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
