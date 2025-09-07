"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/constants";
import { banks, Bank } from "@/lib/bankCodes";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useTheme } from "@/context/ThemeContext";

// Get unique banks by bank code (keep first occurrence)
const getUniqueBanks = (banksList: Bank[]): Bank[] => {
  const seen = new Set<string>();
  const uniqueBanks = banksList.filter((bank) => {
    if (seen.has(bank.BANK_CODE)) {
      return false;
    }
    seen.add(bank.BANK_CODE);
    return true;
  });

  return uniqueBanks;
};

interface UserSettings {
  id?: number;
  user_id: string;
  max_payment_amount?: number;
  excluded_banks?: string[];
  narration?: string;
  bybit_message?: string;
  pay_thirdparty?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface UserSettingsRequest {
  max_payment_amount?: number;
  excluded_banks?: string[];
  narration?: string;
  bybit_message?: string;
  pay_thirdparty?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: UserSettings;
  error?: string;
}

export default function SettingsPage() {
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState<UserSettingsRequest>({
    max_payment_amount: undefined,
    excluded_banks: [],
    narration: "",
    bybit_message: "",
    pay_thirdparty: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingSettings, setExistingSettings] = useState<UserSettings | null>(
    null
  );
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<Bank[]>([]);

  const uniqueBanks = getUniqueBanks(banks);
  const filteredBanks = uniqueBanks.filter(
    (bank) =>
      bank.BANK_NAME.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
      bank.BANK_CODE.toLowerCase().includes(bankSearchTerm.toLowerCase())
  );

  // Check if BASE_URL is configured
  useEffect(() => {
    if (!BASE_URL) {
      setError("API endpoint not configured. Please contact support.");
    }
  }, []);

  // Fetch existing settings when page loads
  useEffect(() => {
    if (BASE_URL) {
      fetchExistingSettings();
    }
  }, []);

  // Fetch existing user settings
  const fetchExistingSettings = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Check if BASE_URL is configured
      if (!BASE_URL) {
        setError("API endpoint not configured. Please contact support.");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.success && result.data) {
          setExistingSettings(result.data);
          setFormData({
            max_payment_amount: result.data.max_payment_amount,
            excluded_banks: result.data.excluded_banks || [],
            narration: result.data.narration || "",
            bybit_message: result.data.bybit_message || "",
            pay_thirdparty:
              result.data.pay_thirdparty !== undefined
                ? result.data.pay_thirdparty
                : true,
          });

          // Set selected banks for display
          if (
            result.data.excluded_banks &&
            result.data.excluded_banks.length > 0
          ) {
            const excludedBankObjects = uniqueBanks.filter((bank) =>
              result.data?.excluded_banks?.includes(bank.BANK_CODE)
            );
            setSelectedBanks(excludedBankObjects);
          }
        }
      } else if (response.status === 404) {
        // No settings found, this is normal for new users
        setExistingSettings(null);
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (err: any) {
      let errorMessage = "Failed to fetch settings";

      if (err.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.message.includes("HTTP 401")) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err.message.includes("HTTP 403")) {
        errorMessage =
          "Access denied. You don't have permission to view settings.";
      } else if (err.message.includes("HTTP 500")) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = err.message || "An unexpected error occurred";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "max_payment_amount"
          ? Number(value) || undefined
          : value,
    }));
  };

  const handleBankSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBankSearchTerm(value);
    setShowBankDropdown(value.length > 0);
  };

  const handleBankSelect = (bank: Bank) => {
    if (!selectedBanks.find((b) => b.BANK_CODE === bank.BANK_CODE)) {
      const newSelectedBanks = [...selectedBanks, bank];
      setSelectedBanks(newSelectedBanks);
      setFormData((prev) => ({
        ...prev,
        excluded_banks: newSelectedBanks.map((b) => b.BANK_CODE),
      }));
    }
    setBankSearchTerm("");
    setShowBankDropdown(false);
  };

  const handleBankRemove = (bankCode: string) => {
    const newSelectedBanks = selectedBanks.filter(
      (bank) => bank.BANK_CODE !== bankCode
    );
    setSelectedBanks(newSelectedBanks);
    setFormData((prev) => ({
      ...prev,
      excluded_banks: newSelectedBanks.map((b) => b.BANK_CODE),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Check if BASE_URL is configured
      if (!BASE_URL) {
        setError("API endpoint not configured. Please contact support.");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      // Debug: Log the form data being sent
      console.log("Form data being sent:", formData);

      const method = existingSettings ? "PUT" : "POST";
      const url = `${BASE_URL}/api/settings`;

      let response;
      let methodUsed = method; // Track which method was used

      try {
        // Use PUT for updates, POST for new settings
        response = await fetch(url, {
          method: methodUsed,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } catch (methodError: any) {
        // Fallback to PATCH (upsert) if the specific method fails
        try {
          response = await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          });
          methodUsed = "PATCH";
        } catch (patchError: any) {
          throw new Error(
            `${methodUsed} failed: ${methodError.message}, PATCH fallback also failed: ${patchError.message}`
          );
        }
      }

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.success && result.data) {
          setExistingSettings(result.data);
          setSuccess(`Settings updated successfully!`);

          // Refresh the settings
          await fetchExistingSettings();
        } else {
          throw new Error(result.message || "Failed to save settings");
        }
      } else {
        // Handle specific error cases
        const errorText = await response.text();

        // If PUT fails with 404 and suggests POST, try POST instead
        if (
          response.status === 404 &&
          methodUsed === "PUT" &&
          errorText.includes("Use POST to create instead")
        ) {
          try {
            const postResponse = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formData),
            });

            if (postResponse.ok) {
              const postResult: ApiResponse = await postResponse.json();
              if (postResult.success && postResult.data) {
                setExistingSettings(postResult.data);
                setSuccess("Settings updated successfully!");
                await fetchExistingSettings();
                return;
              }
            }

            // If POST also fails, throw the original error
            throw new Error(
              `POST fallback also failed: ${postResponse.status}`
            );
          } catch (postError: any) {
            throw new Error(`POST fallback failed: ${postError.message}`);
          }
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (err: any) {
      let errorMessage = "Failed to save settings";

      if (
        err.message.includes("HTTP 404") &&
        err.message.includes("Use POST to create instead")
      ) {
        errorMessage =
          "Settings not found. The system will automatically try to create new settings.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.message.includes("HTTP 401")) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err.message.includes("HTTP 403")) {
        errorMessage =
          "Access denied. You don't have permission to modify settings.";
      } else if (err.message.includes("HTTP 500")) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = err.message || "An unexpected error occurred";
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl md:px-4 md:py-6">
      {/* Header */}
      <div
        className={`flex items-center mb-4 p-2 rounded-2xl shadow-sm transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "bg-gradient-to-r from-slate-700 to-slate-600"
            : "bg-gradient-to-r from-blue-50 to-blue-100"
        }`}
      >
        <Link
          href="/dashboard"
          className={`p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md mr-4 ${
            resolvedTheme === "dark"
              ? "bg-slate-600 hover:bg-slate-500"
              : "bg-white hover:bg-blue-200"
          }`}
        >
          <HiOutlineArrowLeft
            className={`w-4 h-4 transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-200" : "text-blue-700"
            }`}
          />
        </Link>
        <h1
          className={`text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 transition-colors duration-200 dark:text-slate-300 ${
            resolvedTheme === "dark" ? "text-slate-100" : "text-slate-100"
          }`}
        >
          {existingSettings ? "Update Settings" : "Add New Settings"}
        </h1>
      </div>

      {/* Main Content */}
      <div
        className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "bg-slate-800 border-slate-600"
            : "bg-white border-blue-100"
        }`}
      >
        <div className="p-4 md:p-8">
          {error && (
            <div
              className={`mb-6 p-4 rounded-lg border transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-red-900/50 text-red-300 border-red-700"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className={`mb-6 p-4 rounded-lg border transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-green-900/50 text-green-300 border-green-700"
                  : "bg-green-100 text-green-700 border-green-200"
              }`}
            >
              {success}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <svg
                  className={`animate-spin h-10 w-10 transition-colors duration-200 ${
                    resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p
                  className={`text-lg transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300"
                      : "text-gray-600"
                  }`}
                >
                  Loading settings...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Max Payment Amount */}
              <div>
                <label
                  htmlFor="max_payment_amount"
                  className={`block text-sm md:text-base font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-700"
                  }`}
                >
                  Max Payment Amount (₦)
                </label>
                <input
                  type="number"
                  id="max_payment_amount"
                  name="max_payment_amount"
                  value={formData.max_payment_amount || ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-3 md:py-2 border rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Enter maximum payment amount"
                  min="0"
                  step="100"
                />
                <p
                  className={`mt-2 text-xs md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-400"
                      : "text-gray-500"
                  }`}
                >
                  Maximum amount allowed for a single payment transaction (leave
                  blank for no limit)
                </p>
              </div>

              {/* Excluded Banks */}
              <div>
                <label
                  htmlFor="excluded_banks"
                  className={`block text-sm md:text-base font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-700"
                  }`}
                >
                  Excluded Banks
                </label>

                {/* Selected Banks Chips */}
                {selectedBanks.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedBanks.map((bank) => (
                        <div
                          key={`${bank.BANK_CODE}-${bank.BANK_NAME}`}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                            resolvedTheme === "dark"
                              ? "bg-blue-900/50 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <span className="text-xs md:text-sm">
                            {bank.BANK_NAME}
                          </span>
                          <span
                            className={`text-xs transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-blue-300"
                                : "text-blue-600"
                            }`}
                          >
                            ({bank.BANK_CODE})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleBankRemove(bank.BANK_CODE)}
                            className={`ml-1 transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-blue-300 hover:text-blue-100"
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBanks([]);
                        setFormData((prev) => ({
                          ...prev,
                          excluded_banks: [],
                        }));
                      }}
                      className={`text-sm underline transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                ) : (
                  <div
                    className={`mb-4 text-sm italic transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-400"
                        : "text-gray-500"
                    }`}
                  >
                    No banks selected for exclusion
                  </div>
                )}

                {/* Bank Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    id="excluded_banks"
                    name="excluded_banks"
                    value={bankSearchTerm}
                    onChange={handleBankSearchChange}
                    onFocus={() => {
                      if (bankSearchTerm) {
                        setShowBankDropdown(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setShowBankDropdown(false);
                        setBankSearchTerm("");
                      }
                    }}
                    className={`w-full px-3 py-3 md:py-2 border rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="Type bank name or code to search and select banks to exclude..."
                  />

                  {/* Bank Dropdown */}
                  {showBankDropdown && bankSearchTerm && (
                    <div
                      className={`bank-dropdown absolute z-10 w-full mt-1 border rounded-lg md:rounded-md shadow-lg max-h-60 overflow-auto transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "bg-slate-700 border-slate-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank) => (
                          <button
                            key={`${bank.BANK_CODE}-${bank.BANK_NAME}`}
                            type="button"
                            onClick={() => handleBankSelect(bank)}
                            className={`w-full text-left px-3 py-3 md:py-2 focus:outline-none transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "hover:bg-slate-600 focus:bg-slate-600"
                                : "hover:bg-blue-50 focus:bg-blue-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm md:text-base transition-colors duration-200 ${
                                resolvedTheme === "dark"
                                  ? "text-slate-100"
                                  : "text-gray-900"
                              }`}
                            >
                              {bank.BANK_NAME}
                            </div>
                            <div
                              className={`text-xs md:text-sm transition-colors duration-200 ${
                                resolvedTheme === "dark"
                                  ? "text-slate-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {bank.BANK_CODE}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div
                          className={`px-3 py-3 md:py-2 text-sm md:text-base transition-colors duration-200 ${
                            resolvedTheme === "dark"
                              ? "text-slate-400"
                              : "text-gray-500"
                          }`}
                        >
                          No banks found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p
                  className={`mt-2 text-xs md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-400"
                      : "text-gray-500"
                  }`}
                >
                  Search and select banks to exclude from payments. Selected
                  banks will appear as chips above.
                </p>
              </div>

              {/* Narration */}
              <div>
                <label
                  htmlFor="narration"
                  className={`block text-sm md:text-base font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-700"
                  }`}
                >
                  Narration
                </label>
                <textarea
                  id="narration"
                  name="narration"
                  value={formData.narration || ""}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-3 md:py-2 border rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Enter default narration for payments"
                />
                <p
                  className={`mt-2 text-xs md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-400"
                      : "text-gray-500"
                  }`}
                >
                  Default narration that will appear on bank statements
                </p>
              </div>

              {/* Bybit Message */}
              <div>
                <label
                  htmlFor="bybit_message"
                  className={`block text-sm md:text-base font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-700"
                  }`}
                >
                  Bybit Message
                </label>
                <textarea
                  id="bybit_message"
                  name="bybit_message"
                  value={formData.bybit_message || ""}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-3 md:py-2 border rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Enter default message for Bybit orders"
                />
                <p
                  className={`mt-2 text-xs md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-400"
                      : "text-gray-500"
                  }`}
                >
                  Default message that will be sent with Bybit orders
                </p>
              </div>

              {/* Third Party Payments */}
              <div>
                <label
                  htmlFor="pay_thirdparty"
                  className={`block text-sm md:text-base font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-200"
                      : "text-gray-700"
                  }`}
                >
                  Disable Third Party Payments
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="pay_thirdparty"
                    name="pay_thirdparty"
                    checked={!formData.pay_thirdparty}
                    onChange={(e) => {
                      const newValue = !e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        pay_thirdparty: newValue,
                      }));
                    }}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label
                    htmlFor="pay_thirdparty"
                    className={`text-sm md:text-base transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-300"
                        : "text-gray-600"
                    }`}
                  >
                    Disable third-party payments
                  </label>
                </div>
                <p
                  className={`mt-2 text-xs md:text-sm transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-400"
                      : "text-gray-500"
                  }`}
                >
                  When checked, users cannot transfer funds to accounts not
                  registered in the system
                </p>
              </div>

              {/* Action Buttons */}
              <div
                className={`flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "border-slate-600"
                    : "border-gray-200"
                }`}
              >
                <Link
                  href="/dashboard"
                  className={`px-6 py-3 md:py-2 rounded-lg md:rounded-md transition-colors duration-200 text-center text-base md:text-sm ${
                    resolvedTheme === "dark"
                      ? "text-slate-200 bg-slate-600 hover:bg-slate-500"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 md:py-2 text-white rounded-lg md:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-base md:text-sm ${
                    resolvedTheme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-400"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>
                        {existingSettings ? "Updating..." : "Creating..."}
                      </span>
                    </div>
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
