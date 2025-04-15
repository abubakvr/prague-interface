"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";

interface FormData {
  api_key: string;
  api_secret: string;
  bank_api_key: string;
}

const AddApiKey = () => {
  const [formData, setFormData] = useState<FormData>({
    api_key: "",
    api_secret: "",
    bank_api_key: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showApiSecret, setShowApiSecret] = useState<boolean>(false);
  const [showBankApiKey, setShowBankApiKey] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add API key");
      }

      setSuccess("API key added successfully!");
      setFormData({ api_key: "", api_secret: "", bank_api_key: "" });

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
    setShowBankApiKey(!showApiSecret);
  };

  setShowBankApiKey;

  return (
    <div className="min-h-screen flex pt-6 md:pt-16 justify-center bg-gray-100">
      <div className="max-w-md w-full h-fit p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Add API Key</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="api_key">
              API Key
            </label>
            <div className="relative">
              <input
                id="api_key"
                type={showApiKey ? "text" : "password"}
                name="api_key"
                value={formData.api_key}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your API key"
                required
              />
              <button
                type="button"
                onClick={toggleShowApiKey}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="api_secret">
              API Secret
            </label>
            <div className="relative">
              <input
                id="api_secret"
                type={showApiSecret ? "text" : "password"}
                name="api_secret"
                value={formData.api_secret}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your API secret"
                required
              />
              <button
                type="button"
                onClick={toggleShowApiSecret}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
              >
                {showApiSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="api_secret">
              Bank API Key
            </label>
            <div className="relative">
              <input
                id="bank_api_key"
                type={showBankApiKey ? "text" : "password"}
                name="bank_api_key"
                value={formData.bank_api_key}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your Bank API Key"
                required
              />
              <button
                type="button"
                onClick={toggleShowBankApiKey}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
              >
                {showBankApiKey ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add API Key"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AddApiKey;
