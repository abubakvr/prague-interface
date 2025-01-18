"use client";
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
    <nav className="fixed top-0 left-0 h-screen w-64 bg-gray-100 p-4">
      <h2 className="font-bold text-2xl mt-3">
        APE<span className="text-4xl">X</span>
      </h2>
      <ul className="space-y-2 mt-6">
        {navigationLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block p-2 rounded hover:bg-gray-300 ${
                pathname.startsWith(link.routeKey) ? "bg-gray-200" : ""
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
