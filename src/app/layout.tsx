import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee For Noobs",
  description: "Honest gear recommendations, easy brewing guides and everything a beginner needs to make amazing coffee.",
};

import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { getCurrentUser } from "@/lib/auth/helpers";
import { getWishlistedIds } from "@/lib/queries/wishlist";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const wishlistedIds = user ? await getWishlistedIds() : [];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <WishlistProvider initialWishlistedIds={wishlistedIds} isLoggedIn={!!user}>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </WishlistProvider>
      </body>
    </html>
  );
}
