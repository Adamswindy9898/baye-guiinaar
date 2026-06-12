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
  title: "Baye Guiinaar - Marketplace Agricole du Senegal",
  description: "Achetez des poulets frais et produits agricoles au Senegal. Commande simple, paiement a la livraison. Baye Guiinaar, le maitre du poulailler.",
  manifest: "/manifest.json",
  themeColor: "#15803d",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baye Guiinaar",
  },
  openGraph: {
    title: "Baye Guiinaar - Produits Agricoles Frais",
    description: "Poulets frais, produits agricoles. Commandez en ligne, payez a la livraison. Partout au Senegal.",
    type: "website",
    locale: "fr_SN",
    siteName: "Baye Guiinaar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baye Guiinaar - Produits Agricoles Frais",
    description: "Poulets frais, produits agricoles. Commandez en ligne, payez a la livraison. Partout au Senegal.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192.png",
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
