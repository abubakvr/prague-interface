"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/constants";
import { banks, Bank } from "@/lib/bankCodes";
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

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState<UserSettingsRequest>({
    max_payment_amount: undefined,
    excluded_banks: [],
    narration: "",
    bybit_message: "",
    pay_thirdparty: false,
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

  // Check if BASE_URL is configured
  useEffect(() => {
    if (!BASE_URL) {
      setError("API endpoint not configured. Please contact support.");
    }
  }, []);

  // Fetch existing settings when modal opens
  useEffect(() => {
    if (isOpen && BASE_URL) {
      fetchExistingSettings();
    }
  }, [isOpen]);

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

      const apiUrl = `${BASE_URL}/api/settings`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        // Validate that we have a proper settings object
        if (result.data.id && typeof result.data === "object") {
          setExistingSettings(result.data);

          // Convert excluded_banks array to Bank objects
          const excludedBanksData = result.data.excluded_banks || [];
          const bankObjects = excludedBanksData.map((bankCode) => {
            const bank = getUniqueBanks(banks).find(
              (b) => b.BANK_CODE === bankCode
            );
            return bank || { BANK_NAME: bankCode, BANK_CODE: bankCode };
          });
          setSelectedBanks(bankObjects);

          // Populate form with existing data
          setFormData({
            max_payment_amount: result.data.max_payment_amount || undefined,
            excluded_banks: excludedBanksData,
            narration: result.data.narration || "",
            bybit_message: result.data.bybit_message || "",
            pay_thirdparty: result.data.pay_thirdparty || false,
          });
        } else {
          setExistingSettings(null);
          setFormData({
            max_payment_amount: undefined,
            excluded_banks: [],
            narration: "",
            bybit_message: "",
            pay_thirdparty: false,
          });
          setSelectedBanks([]);
        }
      } else if (response.status === 404) {
        // No settings found, form will be blank for new creation
        setExistingSettings(null);
        setFormData({
          max_payment_amount: undefined,
          excluded_banks: [],
          narration: "",
          bybit_message: "",
          pay_thirdparty: false,
        });
        setSelectedBanks([]);
      } else {
        setError(result.message || "Failed to fetch settings");
      }
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        setError(
          `Network error: Unable to connect to ${
            BASE_URL || "the server"
          }. Please check your internet connection and try again.`
        );
      } else {
        setError(`Failed to fetch settings: ${err.message}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "max_payment_amount") {
      // Handle max payment amount as number
      const numValue = value === "" ? undefined : parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else if (type === "checkbox") {
      // Handle checkbox inputs
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  // Handle bank search input
  const handleBankSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBankSearchTerm(value);
    setShowBankDropdown(value.length > 0);
  };

  // Handle bank selection
  const handleBankSelect = (bank: Bank) => {
    // Ensure the bank is in our unique banks list
    const uniqueBanks = getUniqueBanks(banks);
    const foundBank = uniqueBanks.find((b) => b.BANK_CODE === bank.BANK_CODE);

    if (
      foundBank &&
      !selectedBanks.find((b) => b.BANK_CODE === bank.BANK_CODE)
    ) {
      const newSelectedBanks = [...selectedBanks, foundBank];
      setSelectedBanks(newSelectedBanks);

      // Update form data with bank codes
      const bankCodes = newSelectedBanks.map((b) => b.BANK_CODE);
      setFormData((prev) => ({
        ...prev,
        excluded_banks: bankCodes,
      }));
    }

    setBankSearchTerm("");
    setShowBankDropdown(false);
  };

  // Handle bank removal
  const handleBankRemove = (bankCode: string) => {
    const newSelectedBanks = selectedBanks.filter(
      (b) => b.BANK_CODE !== bankCode
    );
    setSelectedBanks(newSelectedBanks);

    // Update form data with bank codes
    const bankCodes = newSelectedBanks.map((b) => b.BANK_CODE);
    setFormData((prev) => ({
      ...prev,
      excluded_banks: bankCodes,
    }));
  };

  // Filter banks based on search term
  const filteredBanks = getUniqueBanks(banks).filter(
    (bank) =>
      bank.BANK_NAME.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
      bank.BANK_CODE.includes(bankSearchTerm)
  );

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest("#excluded_banks") &&
        !target.closest(".bank-dropdown")
      ) {
        setShowBankDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

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

      // Prepare request data
      const requestData: UserSettingsRequest = {
        max_payment_amount: formData.max_payment_amount,
        excluded_banks: formData.excluded_banks,
        narration: formData.narration,
        bybit_message: formData.bybit_message,
        pay_thirdparty: formData.pay_thirdparty,
      };

      // Debug: Log the form data being sent
      console.log("SettingsModal form data being sent:", requestData);

      // Use appropriate endpoint based on whether settings exist
      const apiUrl = `${BASE_URL}/api/settings`;

      let response;
      let methodUsed = "POST"; // Default to POST for safety

      // Only use PUT if we're confident settings exist
      if (existingSettings && existingSettings.id) {
        methodUsed = "PUT";
      }

      try {
        // Use PUT for updates, POST for new settings
        response = await fetch(apiUrl, {
          method: methodUsed,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });
      } catch (methodError: any) {
        // Fallback to PATCH (upsert) if the specific method fails
        try {
          response = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
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

          // Close modal after a short delay
          setTimeout(() => {
            onClose();
          }, 2000);
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
            const postResponse = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestData),
            });

            if (postResponse.ok) {
              const postResult: ApiResponse = await postResponse.json();
              if (postResult.success && postResult.data) {
                setExistingSettings(postResult.data);
                setSuccess("Settings updated successfully!");
                setTimeout(() => onClose(), 2000);
                return;
              }
            }

            // If POST also fails, throw the original error
            throw new Error(
              `POST fallback also failed: ${
                postResponse.status
              } - ${await postResponse.text()}`
            );
          } catch (postError: any) {
            throw new Error(
              `PUT failed (404), POST fallback also failed: ${postError.message}`
            );
          }
        }

        // For other errors, throw with details
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

  const handleClose = () => {
    setFormData({
      max_payment_amount: undefined,
      excluded_banks: [],
      narration: "",
      bybit_message: "",
      pay_thirdparty: false,
    });
    setError("");
    setSuccess("");
    setExistingSettings(null);
    setSelectedBanks([]);
    setBankSearchTerm("");
    setShowBankDropdown(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg shadow-xl max-w-2xl w-full mx-4 transition-colors duration-200 ${
          resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b transition-colors duration-200 ${
            resolvedTheme === "dark" ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-xl font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-100" : "text-gray-900"
                }`}
              >
                {existingSettings ? "Update Settings" : "Add New Settings"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className={`transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg
                className="w-6 h-6"
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
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {error && (
            <div
              className={`mb-4 p-3 rounded-md transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-red-900/20 text-red-400 border border-red-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className={`mb-4 p-3 rounded-md transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-green-900/20 text-green-400 border border-green-800"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {success}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-3">
                <svg
                  className={`animate-spin h-8 w-8 transition-colors duration-200 ${
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
                  className={`transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-400"
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
                  className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter maximum payment amount"
                  min="0"
                  step="100"
                />
                <p
                  className={`mt-1 text-xs transition-colors duration-200 ${
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
                  className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300"
                      : "text-gray-700"
                  }`}
                >
                  Excluded Banks
                </label>

                {/* Selected Banks Chips */}
                {selectedBanks.length > 0 ? (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedBanks.map((bank) => (
                        <div
                          key={`${bank.BANK_CODE}-${bank.BANK_NAME}`}
                          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          <span>{bank.BANK_NAME}</span>
                          <span className="text-blue-600 text-xs">
                            ({bank.BANK_CODE})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleBankRemove(bank.BANK_CODE)}
                            className="text-blue-600 hover:text-blue-800 ml-1"
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
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Clear All
                    </button>
                  </div>
                ) : (
                  <div
                    className={`mb-3 text-sm italic transition-colors duration-200 ${
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-400 focus:border-blue-400"
                        : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Type bank name or code to search and select banks to exclude..."
                  />

                  {/* Bank Dropdown */}
                  {showBankDropdown && bankSearchTerm && (
                    <div
                      className={`bank-dropdown absolute z-10 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto transition-colors duration-200 ${
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
                            className={`w-full text-left px-3 py-2 focus:outline-none transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "hover:bg-slate-600 focus:bg-slate-600"
                                : "hover:bg-blue-50 focus:bg-blue-50"
                            }`}
                          >
                            <div
                              className={`font-medium transition-colors duration-200 ${
                                resolvedTheme === "dark"
                                  ? "text-slate-100"
                                  : "text-gray-900"
                              }`}
                            >
                              {bank.BANK_NAME}
                            </div>
                            <div
                              className={`text-sm transition-colors duration-200 ${
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
                          className={`px-3 py-2 transition-colors duration-200 ${
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
                  className={`mt-1 text-xs transition-colors duration-200 ${
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
                  className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter default narration for payments"
                />
                <p
                  className={`mt-1 text-xs transition-colors duration-200 ${
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
                  className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-400 focus:border-blue-400"
                      : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter default message for Bybit orders"
                />
                <p
                  className={`mt-1 text-xs transition-colors duration-200 ${
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
                  className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300"
                      : "text-gray-700"
                  }`}
                >
                  Enable Third Party Payments
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pay_thirdparty"
                    name="pay_thirdparty"
                    checked={formData.pay_thirdparty || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="pay_thirdparty"
                    className={`text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-400"
                        : "text-gray-600"
                    }`}
                  >
                    Allow users to make payments to third-party accounts.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`flex justify-end space-x-3 pt-4 border-t transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "border-slate-700"
                    : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300 bg-slate-700 hover:bg-slate-600"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                  ) : existingSettings ? (
                    "Save Settings"
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
