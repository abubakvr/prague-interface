import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SideBar } from "@/components/SideBar";

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
        <div className="flex min-h-screen">
          <SideBar />
          <div className="flex-1 flex flex-col ml-64">
            {/* Top Navigation */}
            <header className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold">Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">John Doe</span>
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm">JD</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 mt-16">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
