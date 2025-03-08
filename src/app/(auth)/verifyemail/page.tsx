"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const router = useRouter();

  useEffect(() => {
    const verifyEmailToken = async () => {
      console.log("Verifying token");
      if (!token) {
        console.log("No token");
        setStatus("error");
        return;
      }
      console.log(token, "Token");

      try {
        const response = await fetch(
          `http://localhost:5005/api/auth/verifyemail?token=${token}`
        );

        console.log(response);

        setStatus("success");
        setTimeout(() => router.push("/login"), 5000); // Redirect to login after 5 seconds
      } catch (error) {
        console.log(error);
        setStatus("error");
      }
    };

    verifyEmailToken();
  }, [token, router]);

  let content;

  if (status === "verifying") {
    content = (
      <>
        <h1 className="text-2xl font-bold text-center mb-6">
          Verifying Your Email
        </h1>
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center">
          Please wait while we verify your email address...
        </p>
      </>
    );
  } else if (status === "success") {
    content = (
      <>
        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">
          Email Verified Successfully!
        </h1>
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
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
          <p className="mt-4">Your email has been verified successfully.</p>
          <p className="mt-2">
            You'll be redirected to the login page in a few seconds...
          </p>
        </div>
        <div className="text-center">
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            Click here to login now
          </Link>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
          Verification Failed
        </h1>
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
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
          <p className="mt-4">
            The verification link is invalid or has expired.
          </p>
          <p className="mt-2">Please request a new verification email.</p>
        </div>
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-700 mr-4"
          >
            Back to Login
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/email-sent"
            className="text-blue-500 hover:text-blue-700 ml-4"
          >
            Resend Verification
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {content}
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;
