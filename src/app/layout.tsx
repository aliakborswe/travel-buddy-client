import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import Navbar from "@/components/layout/Navbar";
import { ToasterProvider } from "@/components/providers/ToasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelBuddy - Find Your Perfect Travel Companion",
  description: "Connect with travelers heading to the same destination. Plan trips, find buddies, and explore the world together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthInitializer>
            <Navbar />
            <main>{children}</main>
            <ToasterProvider />
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
