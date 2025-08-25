import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="shadow-sm py-4 px-6 flex justify-between items-center bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
      <div className="flex items-center space-x-1">
        {/* Logo */}
        <div className="w-8 h-8 relative">
          <Image
            src="/assets/logos/apex-logo.svg"
            alt="App Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* App Name */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">
          Boskify
        </h1>
      </div>

      {/* Contact Button */}
      <Link
        href="/contact"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
      >
        Contact Us
      </Link>
    </header>
  );
};

export default Header;
