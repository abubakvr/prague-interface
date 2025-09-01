"use client";
import { useState, useEffect, ChangeEvent, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { useTheme } from "@/context/ThemeContext";

interface FormValues {
  newPassword?: string;
  confirmPassword?: string;
}

interface Message {
  text: string;
  type: "success" | "error" | "";
}

interface Errors {
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPasswordContent = () => {
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState<FormValues>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ text: "", type: "" });
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}api/auth/validatereset?token=${token}`
        );

        if (response.data.valid === true) {
          setTokenValid(true);
        }
      } catch (error: any) {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors && errors[name as keyof Errors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof Errors];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/resetpassword`, {
        token,
        newPassword: formData.newPassword,
      });

      setMessage({
        text: (response.data as { message: string }).message,
        type: "success",
      });

      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      setMessage({
        text:
          error.response?.data?.error || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex pt-6 md:pt-16 justify-center bg-gray-100">
        <div className="max-w-md w-full h-fit p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p>Validating your reset link...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex pt-6 md:pt-16 justify-center bg-gray-100">
        <div className="max-w-md w-full h-fit p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
            Invalid Reset Link
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
              The password reset link is invalid or has expired.
            </p>
            <p className="mt-2">Please request a new password reset link.</p>
          </div>
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-blue-500 hover:text-blue-700"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex pt-6 md:pt-16 justify-center bg-gray-100">
      <div className="max-w-md w-full h-fit p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create New Password
        </h1>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                errors.newPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="Enter new password"
              required
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="Confirm new password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPassword = () => {
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
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;
