"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { QueryClientContextProvider } from "@/components/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import "../globals.css";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

// Font definitions
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeader = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 h-full`}
        suppressHydrationWarning={true}
      >
        <QueryClientContextProvider>
          <AuthProvider>
            {!hideHeader && <Header />}
            {children}
          </AuthProvider>
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
