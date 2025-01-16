"use client";
import { useAdminBalance, useAdminDetails } from "@/hooks/useAccount";

export default function Home() {
  const {
    data: adminDetails,
    isLoading: adminDetailLoading,
    error: adminDetailError,
    refetch: fetchAdminDetails,
  } = useAdminDetails();
  const {
    data: adminBalance,
    isLoading: adminBalanceLoading,
    error: adminBalanceError,
    refetch: fetchAdminBalance,
  } = useAdminBalance();

  const refetchPageData = () => {
    fetchAdminBalance();
    fetchAdminDetails();
  };

  if (adminDetailLoading || adminBalanceLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
        <p>Loading dashboard. Please wait</p>
      </div>
    );
  }

  if (adminDetailError || adminBalanceError) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4">
        <p className="text-red-600">
          Error loading dashboard: {adminDetailError?.message}
        </p>
        <button
          onClick={refetchPageData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Admin Details Cards */}
        <div className="p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Admin Info</h2>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="font-medium">Name:</p>
              <p>{adminDetails?.nickName || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">ID:</p>
              <p>{adminDetails?.userId || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>{adminDetails?.email || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Account Status</h2>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="font-medium">Status:</p>
              <p
                className={`${
                  adminDetails?.isActive ? "text-green-800" : "text-red-800"
                }`}
              >
                {adminDetails?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="font-medium">Account Age:</p>
              <p>{adminDetails?.accountCreateDays || "N/A"} days</p>
            </div>
            <div>
              <p className="font-medium">Blocked:</p>
              <p>{adminDetails?.blocked || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Trade Summary</h2>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="font-medium">Total Orders:</p>
              <p>{adminDetails?.totalFinishCount || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Recent Orders:</p>
              <p>{adminDetails?.recentFinishCount || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Completion Rate:</p>
              <p>{adminDetails?.recentRate || "N/A"}%</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="font-medium">Recent Trade Amount:</p>
              <p>
                {adminDetails?.recentTradeAmount
                  ? parseFloat(adminDetails.recentTradeAmount).toLocaleString(
                      "en-NG",
                      {
                        style: "currency",
                        currency: "NGN",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="font-medium">Total Trade Amount:</p>
              <p>
                {adminDetails?.totalTradeAmount
                  ? parseFloat(adminDetails.totalTradeAmount).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Current Balance</h2>
          <p className="text-3xl font-bold">
            {adminBalance?.walletBalance || "0.00"} {adminBalance?.coin}
          </p>
        </div>
      </div>
    </div>
  );
}
