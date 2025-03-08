"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import "../globals.css";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render the protected layout with navigation components
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation */}
        <TopBar />
        {/* Main Content */}
        <main className="flex-1 p-8 mt-16">{children}</main>
      </div>
    </div>
  );
}
