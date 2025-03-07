"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import "../globals.css";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
  }

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
