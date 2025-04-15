"use client";
import { useState } from "react";
import { HiRefresh, HiExclamationCircle, HiEye } from "react-icons/hi";
import {
  useFilteredListedAds,
  MIN_AMOUNT_OPTIONS,
  SUCCESS_RATE_OPTIONS,
} from "@/hooks/useFilteredAds";
import { OrderSide } from "@/types/order";

// Define auth tag options
const AUTH_TAG_OPTIONS = [
  { value: "", label: "Any" },
  { value: "BA", label: "Block Advertiser" },
  { value: "GA", label: "General Advertiser" },
  { value: "VA", label: "Verified Advertiser" },
];

export default function ListedAdsPage() {
  const [currentSide, setCurrentSide] = useState<OrderSide>(OrderSide.SELL);
  const [selectedMinAmount, setSelectedMinAmount] = useState<number>(50000);
  const [selectedSuccessRate, setSelectedSuccessRate] = useState<number>(90);
  const [selectedAuthTag, setSelectedAuthTag] = useState<string>("");

  const {
    data: adsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFilteredListedAds({
    side: currentSide,
    minAmount: selectedMinAmount,
    minSuccessRate: selectedSuccessRate,
    pagesToFetch: 8,
    authTag: selectedAuthTag, // Pass the selected auth tag
  });

  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);

  const handleSideChange = (side: OrderSide) => {
    setCurrentSide(side);
  };

  const handleMinAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinAmount(Number(e.target.value));
  };

  const handleSuccessRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSuccessRate(Number(e.target.value));
  };

  const handleAuthTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthTag(e.target.value);
  };

  return (
    <div className="container mx-auto min-h-screen">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-6 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Side selector */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleSideChange(OrderSide.BUY)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  currentSide === OrderSide.BUY
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => handleSideChange(OrderSide.SELL)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  currentSide === OrderSide.SELL
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Sell
              </button>
            </div>

            {/* Min Amount Filter */}
            <div className="flex items-center">
              <label
                htmlFor="minAmount"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                Limit:
              </label>
              <select
                id="minAmount"
                value={selectedMinAmount}
                onChange={handleMinAmountChange}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MIN_AMOUNT_OPTIONS.map((amount) => (
                  <option key={amount} value={amount}>
                    {amount === 0 ? "Any" : `₦${amount.toLocaleString()}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Success Rate Filter */}
            <div className="flex items-center">
              <label
                htmlFor="successRate"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                Success Rate:
              </label>
              <select
                id="successRate"
                value={selectedSuccessRate}
                onChange={handleSuccessRateChange}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SUCCESS_RATE_OPTIONS.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate === 0 ? "Any" : `${rate}%+`}
                  </option>
                ))}
              </select>
            </div>
            {/* Auth Tag Filter */}
            <div className="flex items-center">
              <label
                htmlFor="authTag"
                className="mr-2 text-sm font-medium text-gray-700"
              >
                Auth Tag:
              </label>
              <select
                id="authTag"
                value={selectedAuthTag}
                onChange={handleAuthTagChange}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {AUTH_TAG_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh button */}
            <button
              onClick={() => refetch()}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 shadow-sm"
            >
              <HiRefresh className="mr-1" /> Refresh
            </button>
            {isRefetching && <p>Refetching...</p>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-md flex items-start">
          <HiExclamationCircle className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0 text-red-500" />
          <span className="font-medium">
            Error loading advertisements. Please try refreshing the page.
          </span>
        </div>
      ) : adsData && adsData.data?.items && adsData?.data?.items.length > 0 ? (
        <div className="overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Advertiser
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Limits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Success Rate
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adsData?.data?.items.map((ad: any, index: number) => (
                  <tr
                    key={`${ad.id}-${index}`}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {ad.nickName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {ad.nickName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Orders: {ad.orderNum} | Completed: {ad.finishNum}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₦{parseFloat(ad.price).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₦{parseFloat(ad.minAmount).toLocaleString()} - ₦
                        {parseFloat(ad.maxAmount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parseFloat(ad.lastQuantity).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        })}{" "}
                        USDT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ad.recentExecuteRate >= 98
                              ? "bg-green-100 text-green-800"
                              : ad.recentExecuteRate >= 95
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {ad.recentExecuteRate}%
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          setSelectedAdId(ad.id === selectedAdId ? null : ad.id)
                        }
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200 bg-blue-50 p-2 rounded-full"
                      >
                        <HiEye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-blue-200 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-blue-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-blue-800 font-medium text-lg">No ads available</p>
        </div>
      )}
    </div>
  );
}
