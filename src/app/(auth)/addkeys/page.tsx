"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";
import { useTheme } from "@/context/ThemeContext";

interface FormData {
  api_key: string;
  api_secret: string;
  bank_api_key: string;
  bank_account: string;
  bank_email: string;
}

interface ValidationErrors {
  api_key?: string;
  api_secret?: string;
  bank_api_key?: string;
  bank_account?: string;
  bank_email?: string;
}

const AddApiKey = () => {
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    api_key: "",
    api_secret: "",
    bank_api_key: "",
    bank_account: "",
    bank_email: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showApiSecret, setShowApiSecret] = useState<boolean>(false);
  const [showBankApiKey, setShowBankApiKey] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const router = useRouter();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Bank account validation function
  const validateBankAccount = (account: string): boolean => {
    // Nigerian bank account numbers are typically 10 digits
    const accountRegex = /^\d{10}$/;
    return accountRegex.test(account);
  };

  // Validate individual field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "bank_email":
        if (!value.trim()) {
          return "Bank email is required";
        }
        if (!validateEmail(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "bank_account":
        if (!value.trim()) {
          return "Bank account number is required";
        }
        if (!validateBankAccount(value)) {
          return "Bank account number must be 10 digits";
        }
        return "";

      case "api_key":
        if (!value.trim()) {
          return "API key is required";
        }
        if (value.length < 10) {
          return "API key must be at least 10 characters";
        }
        return "";

      case "api_secret":
        if (!value.trim()) {
          return "API secret is required";
        }
        if (value.length < 10) {
          return "API secret must be at least 10 characters";
        }
        return "";

      case "bank_api_key":
        if (!value.trim()) {
          return "Bank API key is required";
        }
        if (value.length < 10) {
          return "Bank API key must be at least 10 characters";
        }
        return "";

      default:
        return "";
    }
  };

  // Handle field blur (when user leaves a field)
  const handleBlur = (name: string) => {
    setTouchedFields((prev) => new Set(prev).add(name));
    const value = formData[name as keyof FormData];
    const fieldError = validateField(name, value as string);

    setValidationErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }

    // Clear validation error for this field when user types
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Real-time validation for email field
    if (name === "bank_email" && touchedFields.has(name)) {
      const fieldError = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(key, formData[key as keyof FormData]);
      if (fieldError) {
        errors[key as keyof ValidationErrors] = fieldError;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/keys/api_keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          api_key: formData.api_key,
          api_secret: formData.api_secret,
          bank_api_key: formData.bank_api_key,
          bank_account: formData.bank_account,
          bank_email: formData.bank_email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add API key");
      }

      setSuccess("API key added successfully!");
      setFormData({
        api_key: "",
        api_secret: "",
        bank_api_key: "",
        bank_account: "",
        bank_email: "",
      });
      setValidationErrors({});
      setTouchedFields(new Set());

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error: any) {
      console.error("API key error:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const toggleShowApiSecret = () => {
    setShowApiSecret(!showApiSecret);
  };

  const toggleShowBankApiKey = () => {
    setShowBankApiKey(!showBankApiKey);
  };

  // Helper function to get field error and styling
  const getFieldError = (name: string) => {
    const error = validationErrors[name as keyof ValidationErrors];
    const isTouched = touchedFields.has(name);
    return {
      hasError: error && isTouched,
      errorMessage: error,
      inputClass: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring transition-colors duration-200 ${
        error && isTouched
          ? resolvedTheme === "dark"
            ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-slate-700 text-slate-100 placeholder-slate-400"
            : "border-red-500 focus:border-red-500 focus:ring-red-200"
          : resolvedTheme === "dark"
          ? "border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 focus:ring-blue-400"
          : "border-gray-300 focus:border-blue-300"
      }`,
    };
  };

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
        <h1
          className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-100" : "text-gray-900"
          }`}
        >
          Add API Keys
        </h1>

        {error && (
          <div
            className={`mb-4 p-3 rounded transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-red-900/50 text-red-300 border border-red-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className={`mb-4 p-3 rounded transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-green-900/50 text-green-300 border border-green-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block mb-2 text-sm md:text-base transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-700"
              }`}
              htmlFor="api_key"
            >
              Bybit API Key
            </label>
            <div className="relative">
              <input
                id="api_key"
                type={showApiKey ? "text" : "password"}
                name="api_key"
                value={formData.api_key}
                onChange={handleChange}
                onBlur={() => handleBlur("api_key")}
                className={getFieldError("api_key").inputClass}
                placeholder="Enter your API key"
                required
              />
              <button
                type="button"
                onClick={toggleShowApiKey}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
            {getFieldError("api_key").hasError && (
              <p
                className={`mt-1 text-sm transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {getFieldError("api_key").errorMessage}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className={`block mb-2 text-sm md:text-base transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-700"
              }`}
              htmlFor="api_secret"
            >
              Bybit API Secret
            </label>
            <div className="relative">
              <input
                id="api_secret"
                type={showApiSecret ? "text" : "password"}
                name="api_secret"
                value={formData.api_secret}
                onChange={handleChange}
                onBlur={() => handleBlur("api_secret")}
                className={getFieldError("api_secret").inputClass}
                placeholder="Enter your API secret"
                required
              />
              <button
                type="button"
                onClick={toggleShowApiSecret}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showApiSecret ? "Hide" : "Show"}
              </button>
            </div>
            {getFieldError("api_secret").hasError && (
              <p
                className={`mt-1 text-sm transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {getFieldError("api_secret").errorMessage}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className={`block mb-2 text-sm md:text-base transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-700"
              }`}
              htmlFor="bank_api_key"
            >
              Kuda API Key
            </label>
            <div className="relative">
              <input
                id="bank_api_key"
                type={showBankApiKey ? "text" : "password"}
                name="bank_api_key"
                value={formData.bank_api_key}
                onChange={handleChange}
                onBlur={() => handleBlur("bank_api_key")}
                className={getFieldError("bank_api_key").inputClass}
                placeholder="Enter your Bank API Key"
                required
              />
              <button
                type="button"
                onClick={toggleShowBankApiKey}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showBankApiKey ? "Hide" : "Show"}
              </button>
            </div>
            {getFieldError("bank_api_key").hasError && (
              <p
                className={`mt-1 text-sm transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {getFieldError("bank_api_key").errorMessage}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className={`block mb-2 text-sm md:text-base transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-700"
              }`}
              htmlFor="bank_account"
            >
              Bank Account Number
            </label>
            <input
              id="bank_account"
              type="text"
              name="bank_account"
              value={formData.bank_account}
              onChange={handleChange}
              onBlur={() => handleBlur("bank_account")}
              className={getFieldError("bank_account").inputClass}
              placeholder="Enter your Bank Account Number"
              maxLength={10}
              required
            />
            {getFieldError("bank_account").hasError && (
              <p
                className={`mt-1 text-sm transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {getFieldError("bank_account").errorMessage}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className={`block mb-2 text-sm md:text-base transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-300" : "text-gray-700"
              }`}
              htmlFor="bank_email"
            >
              Bank Email
            </label>
            <input
              id="bank_email"
              type="email"
              name="bank_email"
              value={formData.bank_email}
              onChange={handleChange}
              onBlur={() => handleBlur("bank_email")}
              className={getFieldError("bank_email").inputClass}
              placeholder="Enter your Bank Email"
              required
            />
            {getFieldError("bank_email").hasError && (
              <p
                className={`mt-1 text-sm transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {getFieldError("bank_email").errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-200 text-sm md:text-base ${
              resolvedTheme === "dark"
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add API Keys"}
          </button>
        </form>

        <p
          className={`mt-4 text-center text-sm md:text-base transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
          }`}
        >
          <Link
            href="/dashboard"
            className={`font-medium transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-500 hover:text-blue-700"
            }`}
          >
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AddApiKey;
