import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baye Guiinaar - Poulets Frais & Produits Agricoles au Senegal",
  description: "Commandez des poulets de chair, oeufs frais et aliments de betail au Senegal. Prix direct producteur, livraison rapide a Thies, Dakar, Mbour. Paiement a la livraison.",
  keywords: ["poulet frais senegal", "achat poulet dakar", "oeufs frais thies", "aliment betail senegal", "elevage poulet", "baye guiinaar", "marketplace agricole senegal", "livraison poulet"],
  manifest: "/manifest.json",
  themeColor: "#15803d",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baye Guiinaar",
  },
  openGraph: {
    title: "Baye Guiinaar - Poulets Frais Livres Chez Vous au Senegal",
    description: "Prix direct producteur. Poulets de chair, oeufs, aliments de betail. Commandez sur WhatsApp, payez a la livraison. Thies, Dakar, Mbour, Touba.",
    type: "website",
    locale: "fr_SN",
    siteName: "Baye Guiinaar",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Baye Guiinaar - Poulets frais et produits agricoles au Senegal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baye Guiinaar - Poulets Frais au Senegal",
    description: "Prix direct producteur. Commandez sur WhatsApp, livraison rapide partout au Senegal.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
