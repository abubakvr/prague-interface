"use client";
import { usePersonalAds } from "@/hooks/UseAds";
import { AdsData } from "@/types/ads";

const page = () => {
  const {
    data: ads,
    isLoading: adsLoading,
    error: adsError,
    refetch: fetchPersonalAds,
  } = usePersonalAds();

  if (adsLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
        <p>Loading Ads. Please wait</p>
      </div>
    );
  }

  if (adsError) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4">
        <p className="text-red-600">Error loading ads: {adsError?.message}</p>
        <button
          onClick={() => fetchPersonalAds()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full selection:bg-white border border-gray-200">
        <thead className="w-full">
          <tr className="bg-gray-50 text-sm font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-2 text-left py-2">Type</th>
            <th className="px-2 text-left py-2">Price</th>
            <th className="px-2 text-left py-2">Quantity</th>
            <th className="px-2 text-left py-2">Status</th>
            <th className="px-2 text-left py-2">Created Date</th>
            <th className="px-2 text-left py-2">Payment Period</th>
            <th className="px-2 text-left py-2">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(ads as AdsData).items.map((ad) => (
            <tr key={ad.id} className="hover:bg-gray-50">
              <td className="px-2 py-2">{ad.side === 0 ? "Buy" : "Sell"}</td>
              <td className="px-2 py-2">{ad.price}</td>
              <td className="px-2 py-2">{ad.quantity}</td>
              <td className="px-2 py-2">
                {ad.status === 10
                  ? "Online"
                  : ad.status
                  ? "Offline"
                  : "Completed"}
              </td>
              <td className="px-2 py-2">{ad.createDate}</td>
              <td className="px-2 py-2">{ad.paymentPeriod ?? 0} mins</td>
              <td className="px-2 py-2">
                <button
                  onClick={() => {}}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Ad
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default page;
