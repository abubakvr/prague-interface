import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { QueryClientContextProvider } from "@/components/QueryProvider";
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
  title: "Apex Merchant",
  description: "Simplfiy your trading experience",
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
        <QueryClientContextProvider>
          <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 flex flex-col ml-64">
              {/* Top Navigation */}
              <TopBar />
              {/* Main Content */}
              <main className="flex-1 p-8 mt-16">{children}</main>
            </div>
          </div>
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
