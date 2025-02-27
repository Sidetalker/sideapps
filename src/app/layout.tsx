import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClarityAnalytics } from "@/components/ClarityAnalytics";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SideApps - Personal Website",
  description: "Personal website and portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.className} dark`}>
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="antialiased bg-black text-white">
        <ClarityAnalytics />
        {children}
      </body>
    </html>
  );
}
