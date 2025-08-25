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
    <div className="flex min-h-screen bg-background transition-colors duration-200">
      <SideBar />
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Navigation */}
        <TopBar />
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 mt-16">{children}</main>
      </div>
    </div>
  );
}
