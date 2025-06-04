"use client";
import { usePersonalAds } from "@/hooks/useAds";
import { AdsData } from "@/types/ads";
import { HiPencilAlt, HiRefresh, HiExclamationCircle } from "react-icons/hi";

const page = () => {
  const {
    data: ads,
    isLoading: adsLoading,
    error: adsError,
    refetch: fetchPersonalAds,
  } = usePersonalAds();

  if (adsLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center  mt-16 p-4">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-blue-800 font-medium">
          Loading your ads. Please wait...
        </p>
      </div>
    );
  }

  if (adsError) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center p-4">
        <HiExclamationCircle className="text-red-600 text-4xl sm:text-5xl" />
        <p className="text-red-600 text-sm sm:text-base">
          Error loading ads: {adsError?.message}
        </p>
        <button
          onClick={() => fetchPersonalAds()}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <HiRefresh className="text-lg sm:text-xl" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            Total Ads: {(ads as AdsData)?.items?.length || 0}
          </div>
        </div>
        <button
          onClick={() => fetchPersonalAds()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-300/50 flex items-center gap-2"
        >
          <HiRefresh className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Table Section */}
      <div className="mt-4 md::mt-6 overflow-x-auto rounded-xl shadow-md bg-white/80 backdrop-blur-sm border border-blue-200">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Payment Period
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-blue-100">
            {(ads as AdsData)?.items?.map((ad) => (
              <tr
                key={ad.id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ad.side === 0
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ad.side === 0 ? "Buy" : "Sell"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-medium text-blue-900">
                  {parseFloat(ad.price).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                  {ad.quantity} "USDT"
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ad.status === 10
                        ? "bg-green-100 text-green-800"
                        : ad.status
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {ad.status === 10
                      ? "Online"
                      : ad.status
                      ? "Offline"
                      : "Completed"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                  {ad.createDate}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                  {ad.paymentPeriod ?? 0} mins
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {}}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
                  >
                    <HiPencilAlt className="mr-1" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
