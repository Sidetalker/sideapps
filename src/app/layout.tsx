import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Caveat } from "next/font/google";
import { ClarityAnalytics } from "@/components/ClarityAnalytics";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
  : 'https://sideapps.dev';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "SideApps | iOS Developer Portfolio",
  description: "Experienced iOS developer with 10+ years building apps for WashLoft, Capital One, and Chewy. Specializing in Swift, UIKit, and modern iOS development.",
  applicationName: "SideApps Portfolio",
  authors: [{ name: "Kevin Sullivan", url: "https://sideapps.dev" }],
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
    url: "https://sideapps.dev",
    type: "website",
    locale: "en_US",
    siteName: "SideApps",
    images: [
      {
        url: "https://sideapps.dev/og-image.png",
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: "SideApps Portfolio"
      }
    ],
  },
  other: {
    'og:image': 'https://sideapps.dev/og-image.png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'SideApps Portfolio',
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
        url: "https://sideapps.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "SideApps Portfolio"
      }
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-24x24.png", type: "image/png", sizes: "24x24" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-64x64.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-128x128.png", type: "image/png", sizes: "128x128" },
      { url: "/favicon-256x256.png", type: "image/png", sizes: "256x256" }
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
        <ClarityAnalytics/>
        <Analytics/>
        <SpeedInsights/>
        {children}
      </body>
    </html>
  );
}
