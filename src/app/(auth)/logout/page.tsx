"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear localStorage if you're also using that
    localStorage.removeItem("accessToken");

    // The middleware will handle the cookie clearing and redirect
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging out...</p>
    </div>
  );
}
