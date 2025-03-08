"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", routeKey: "/dashboard" },
  { href: "/orders", label: "Orders", routeKey: "/order" },
  {
    href: "/pendingpayment",
    label: "Pending Payments",
    routeKey: "/pendingpayment",
  },
  { href: "/paying", label: "Pay Orders", routeKey: "/paying" },
  { href: "/selling", label: "Release Coins", routeKey: "/selling" },
  { href: "/ads", label: "My Ads", routeKey: "/ads" },
];

export const SideBar = () => {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-blue-900 p-4 text-white shadow-lg">
      <div className="flex items-center space-x-1 mt-3">
        <div className="w-8 h-8 relative">
          <Image
            src="/assets/logos/apex-logo@2x.png"
            alt="App Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-00">Apex Trader</h1>
      </div>
      <ul className="space-y-2 mt-8">
        {navigationLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block p-2 rounded transition-colors duration-200 hover:bg-blue-700 ${
                pathname.startsWith(link.routeKey)
                  ? "bg-blue-800 border-l-4 border-blue-300"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
