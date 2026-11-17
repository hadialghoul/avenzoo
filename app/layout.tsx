import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Bodoni_Moda, Figtree } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Avenzo · Menswear, Tyre",
    template: "%s · Avenzo",
  },
  description:
    "Avenzo is everyday menswear from Tyre (Sour), South Lebanon. Shirts, trousers, outerwear, and accessories, ordered on WhatsApp and delivered across Lebanon.",
  openGraph: {
    title: "Avenzo · Menswear, Tyre",
    description: "Everyday menswear from Tyre. Order on WhatsApp. Delivered across Lebanon.",
    siteName: "Avenzo",
    locale: "en_LB",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: brand.name,
    telephone: brand.phoneTel,
    email: brand.email,
    hasMap: brand.mapUrl,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.269417,
      longitude: 35.198719,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tyre",
      addressRegion: "South Lebanon",
      addressCountry: "LB",
    },
    areaServed: "Lebanon",
  };

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-ivory antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
