import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Caveat } from "next/font/google";
import { ClarityAnalytics } from "@/components/ClarityAnalytics";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-caveat',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'dark'
};

const baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : 'https://sideapps.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "SideApps",
  description: "Experienced iOS developer with 10+ years building apps for WashLoft, Capital One, and Chewy. Specializing in Swift, UIKit, and modern iOS development.",
  keywords: ["iOS developer", "Swift developer", "mobile app development", "iOS apps", "Swift programming", "SideApps", "Kevin Sullivan", "mobile developer", "app developer", "iOS engineer"],
  openGraph: {
    title: "SideApps | iOS Developer Portfolio",
    description: "Experienced iOS developer with 10+ years building apps for WashLoft, Capital One, and Chewy. Specializing in Swift, UIKit, and modern iOS development.",
    url: baseUrl,
    type: "website",
    locale: "en_US",
    siteName: "SideApps",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SideApps Portfolio"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SideApps | iOS Developer Portfolio",
    description: "Experienced iOS developer with 10+ years building apps for WashLoft, Capital One, and Chewy. Specializing in Swift, UIKit, and modern iOS development.",
    images: [{
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "SideApps Portfolio"
    }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "L9Aae9wFKDv8_lwqPzU08xWl09uKzEBcr-rhAMMF6GY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.className} ${caveat.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-black text-white overflow-x-hidden">
        <ClarityAnalytics />
        {children}
      </body>
    </html>
  );
}
