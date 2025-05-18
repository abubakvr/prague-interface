import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="shadow-sm py-4 px-6 flex justify-between items-center bg-white">
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
        <h1 className="text-xl font-bold text-gray-800">Boskify</h1>
      </div>

      {/* Contact Button */}
      <Link
        href="/contact"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Contact Us
      </Link>
    </header>
  );
};

export default Header;
