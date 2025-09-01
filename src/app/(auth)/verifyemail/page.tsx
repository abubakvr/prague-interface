"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { useTheme } from "@/context/ThemeContext";

const VerifyEmailContent = () => {
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const router = useRouter();

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/api/auth/verifyemail?token=${token}`
        );

        if (response.ok) {
          setStatus("success");
          setTimeout(() => router.push("/login"), 3000); // Redirect to login after 5 seconds
        } else {
          console.error("Email verification failed:", response.status);
          setStatus("error");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
      }
    };

    verifyEmailToken();
  }, [token, router]);

  let content;

  if (status === "verifying") {
    content = (
      <>
        <h1
          className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-100" : "text-gray-900"
          }`}
        >
          Verifying Your Email
        </h1>
        <div className="flex justify-center mb-4">
          <div
            className={`animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 transition-colors duration-200 ${
              resolvedTheme === "dark" ? "border-blue-400" : "border-blue-500"
            }`}
          ></div>
        </div>
        <p
          className={`text-center text-sm md:text-base transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-300" : "text-gray-600"
          }`}
        >
          Please wait while we verify your email address...
        </p>
      </>
    );
  } else if (status === "success") {
    content = (
      <>
        <h1
          className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        >
          Email Verified Successfully!
        </h1>
        <div className="text-center mb-4 md:mb-6">
          <svg
            className={`mx-auto h-12 w-12 md:h-16 md:w-16 transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-green-400" : "text-green-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p
            className={`mt-3 md:mt-4 text-sm md:text-base transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-300" : "text-gray-600"
            }`}
          >
            Your email has been verified successfully.
          </p>
          <p
            className={`mt-2 text-sm md:text-base transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
            }`}
          >
            You'll be redirected to the login page in a few seconds...
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/login"
            className={`text-sm md:text-base font-medium transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-500 hover:text-blue-700"
            }`}
          >
            Click here to login now
          </Link>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <h1
          className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          Verification Failed
        </h1>
        <div className="text-center mb-4 md:mb-6">
          <svg
            className={`mx-auto h-12 w-12 md:h-16 md:w-16 transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-red-400" : "text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p
            className={`mt-3 md:mt-4 text-sm md:text-base transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-300" : "text-gray-600"
            }`}
          >
            The verification link is invalid or has expired.
          </p>
          <p
            className={`mt-2 text-sm md:text-base transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Please request a new verification email.
          </p>
        </div>
        <div className="text-center mt-4 md:mt-6 space-y-2 md:space-y-0">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center md:space-x-4 space-y-2 md:space-y-0">
            <Link
              href="/login"
              className={`text-sm md:text-base font-medium transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-500 hover:text-blue-700"
              }`}
            >
              Back to Login
            </Link>
            <span
              className={`hidden md:inline transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-500" : "text-gray-400"
              }`}
            >
              |
            </span>
            <Link
              href="/email-sent"
              className={`text-sm md:text-base font-medium transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-500 hover:text-blue-700"
              }`}
            >
              Resend Verification
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`min-h-screen flex pt-4 md:pt-16 px-4 md:px-0 justify-center transition-colors duration-200 ${
        resolvedTheme === "dark" ? "bg-slate-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`max-w-md w-full h-fit p-4 md:p-6 rounded-lg shadow-lg transition-colors duration-200 ${
          resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  const { resolvedTheme } = useTheme();
  return (
    <Suspense
      fallback={
        <div
          className={`min-h-screen flex pt-4 md:pt-16 px-4 md:px-0 justify-center transition-colors duration-200 ${
            resolvedTheme === "dark" ? "bg-slate-900" : "bg-gray-100"
          }`}
        >
          <div
            className={`max-w-md w-full h-fit p-4 md:p-6 rounded-lg shadow-lg text-center transition-colors duration-200 ${
              resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "border-blue-400"
                    : "border-blue-500"
                }`}
              ></div>
            </div>
            <p
              className={`text-sm md:text-base transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-600"
              }`}
            >
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;
