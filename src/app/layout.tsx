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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="antialiased bg-black text-white overflow-x-hidden">
        <ClarityAnalytics />
        {children}
      </body>
    </html>
  );
}
