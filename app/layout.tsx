import { UserXPProvider } from "@/app/context/userXpContext";
import { AuthProvider } from "@/app/context/authContext";
import UserHeader from "@/components/header";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import Footer from "@/components/footer";
import type { Metadata } from "next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gametracker-chi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "GameTracker — Track Games & Earn XP",
    template: "%s | GameTracker",
  },

  description: "Game completion tracker with XP progression",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "GameTracker",
    title: "GameTracker",
    description: "Game completion tracker with XP progression",
    images: [
      {
        url: "/GameTracker_Preview.png",
        width: 1200,
        height: 630,
        alt: "GameTracker preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GameTracker",
    description: "Game completion tracker with XP progression",
    images: ["/GameTracker_Preview.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "F1jx3iuDu944mDHYiDwNk_DCFAEMTRrWAxZyNLrtN1M",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <UserXPProvider>
            <UserHeader />
            <main className="flex-1">
              {children}
            </main>
          </UserXPProvider>
        </AuthProvider>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
