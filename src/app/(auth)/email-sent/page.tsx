"use client";

import Link from "next/link";
import axios from "axios";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL } from "@/lib/constants";

// Component that uses useSearchParams
const EmailContent = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleResendVerification = async () => {
    if (!email) {
      setResendMessage("Email address is missing. Please go back to login.");
      return;
    }

    setIsResending(true);
    setResendMessage("");

    try {
      const response = await axios.post(`${BASE_URL}5/api/auth/resendemail`, {
        email,
      });
      setResendMessage(response.data.message);
    } catch (error) {
      setResendMessage(
        "Failed to resend verification email. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Verify Your Email</h1>

      <div className="mb-6 text-center">
        <p className="mb-4">
          We've sent a verification email to:
          <br />
          <span className="font-semibold">{email || "your email address"}</span>
        </p>
        <p className="mb-4">
          Please check your inbox and click the verification link to activate
          your account.
        </p>

        {resendMessage && (
          <div className="my-4 p-3 bg-blue-100 text-blue-700 rounded">
            {resendMessage}
          </div>
        )}

        <button
          onClick={handleResendVerification}
          disabled={isResending || !email}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 mt-4"
        >
          {isResending ? "Resending..." : "Resend Verification Email"}
        </button>
      </div>

      <div className="text-center">
        <Link href="/login" className="text-blue-500 hover:text-blue-700">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

// Loading fallback component
const EmailContentLoading = () => (
  <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
    <h1 className="text-2xl font-bold text-center mb-6">Loading...</h1>
  </div>
);

// Main page component with Suspense boundary
const EmailSentPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<EmailContentLoading />}>
        <EmailContent />
      </Suspense>
    </div>
  );
};

export default EmailSentPage;
