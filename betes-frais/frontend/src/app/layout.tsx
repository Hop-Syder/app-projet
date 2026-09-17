import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bêtes & Frais - Produits Animaux de Qualité au Bénin",
  description: "Commandez en ligne viande, volailles, poissons et produits animaux frais. Livraison rapide ou retrait en magasin.",
  keywords: ["viande", "bénin", "produits animaux", "livraison", "frais", "bœuf", "mouton", "volaille"],
  authors: [{ name: "Bêtes & Frais" }],
  manifest: "/manifest.json",
  themeColor: "#176B52",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
