import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClientContextProvider } from "@/components/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

// Font definitions
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: "Prague",
  description: "Simplify your trading experience",
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
        suppressHydrationWarning={true}
      >
        <QueryClientContextProvider>{children}</QueryClientContextProvider>
      </body>
    </html>
  );
}
