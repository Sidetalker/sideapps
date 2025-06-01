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
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
  themeColor: '#000000'
};

const baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : 'https://sideapps.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "SideApps | iOS Developer Portfolio",
  description: "Experienced iOS developer with 10+ years building apps for WashLoft, Capital One, and Chewy. Specializing in Swift, UIKit, and modern iOS development.",
  applicationName: "SideApps Portfolio",
  authors: [{ name: "Kevin Sullivan", url: "https://sideapps.com" }],
  generator: "Next.js",
  keywords: ["iOS developer", "Swift developer", "mobile app development", "iOS apps", "Swift programming", "SideApps", "Kevin Sullivan", "mobile developer", "app developer", "iOS engineer"],
  referrer: "origin-when-cross-origin",
  creator: "Kevin Sullivan",
  publisher: "SideApps",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SideApps | iOS Developer Portfolio",
    description: "Experienced iOS developer with 10+ years building apps for WashLoft, Capital One, and Chewy. Specializing in Swift, UIKit, and modern iOS development.",
    url: "https://sideapps.com",
    type: "website",
    locale: "en_US",
    siteName: "SideApps",
    images: [
      {
        url: "https://sideapps.com/og-image-v1.png",
        width: 1200,
        height: 630,
        alt: "SideApps Portfolio"
      },
      {
        url: "https://sideapps.com/og-image-dark-v1.png",
        width: 1200,
        height: 630,
        alt: "SideApps Portfolio (Dark Mode)"
      }
    ],
  },
  other: {
    'og:image': 'https://sideapps.com/og-image-dark-v1.png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'SideApps Portfolio',
    'og:image:light': 'https://sideapps.com/og-image-v1.png',
    'og:image:dark': 'https://sideapps.com/og-image-dark-v1.png',
    'theme-color': '#000000',
    'color-scheme': 'dark',
  },
  twitter: {
    card: "summary_large_image",
    title: "SideApps | iOS Developer Portfolio",
    description: "Experienced iOS developer with 10+ years building apps for WashLoft, Capital One, and Chewy. Specializing in Swift, UIKit, and modern iOS development.",
    creator: "@sideapps",
    images: [
      {
        url: "https://sideapps.com/og-image-v1.png",
        width: 1200,
        height: 630,
        alt: "SideApps Portfolio"
      }
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" }
    ],
    shortcut: "/favicon.ico"
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
      <body className="antialiased bg-black text-white overflow-x-hidden">
        <ClarityAnalytics />
        {children}
      </body>
    </html>
  );
}
