import { getAdminBalance, getAdminDetail } from "@/hooks/useAccount";

export default async function Home() {
  const adminDetail = await getAdminDetail();
  const adminBalance = await getAdminBalance();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Details Card */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Admin Details</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium">Name:</dt>
              <dd>{adminDetail?.nickName || "N/A"}</dd>
              <dt className="font-medium">ID:</dt>
              <dd>{adminDetail?.userId || "N/A"}</dd>
              <dt className="font-medium">Email:</dt>
              <dd>{adminDetail?.email || "N/A"}</dd>
              <dt className="font-medium">Real Name:</dt>
              <dd>{adminDetail?.realName || "N/A"}</dd>
              <dt className="font-medium">Account Age:</dt>
              <dd>{adminDetail?.accountCreateDays || "N/A"} days</dd>
              <dt className="font-medium">First Trade Days:</dt>
              <dd>{adminDetail?.firstTradeDays || "N/A"} days</dd>
              <dt className="font-medium">Blocked:</dt>
              <dd>{adminDetail?.blocked || "N/A"}</dd>
            </div>
            <div>
              <dt className="font-medium">Status:</dt>
              <dd>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    adminDetail?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {adminDetail?.isActive ? "Active" : "Inactive"}
                </span>
              </dd>
              <dt className="font-medium">Total Orders:</dt>
              <dd>{adminDetail?.totalFinishCount || "N/A"}</dd>
              <dt className="font-medium">Buy Orders:</dt>
              <dd>{adminDetail?.totalFinishBuyCount || "N/A"}</dd>
              <dt className="font-medium">Sell Orders:</dt>
              <dd>{adminDetail?.totalFinishSellCount || "N/A"}</dd>
              <dt className="font-medium">Recent Orders:</dt>
              <dd>{adminDetail?.recentFinishCount || "N/A"}</dd>
              <dt className="font-medium">Good Appraise Rate:</dt>
              <dd>{adminDetail?.goodAppraiseRate || "N/A"}%</dd>
              <dt className="font-medium">Completion Rate:</dt>
              <dd>{adminDetail?.recentRate || "N/A"}%</dd>
            </div>
          </dl>
          <div className="mt-4">
            <p className="font-medium">Recent Trade Amount:</p>
            <p>
              {adminDetail?.recentTradeAmount
                ? parseFloat(adminDetail.recentTradeAmount).toLocaleString(
                    "en-NG",
                    { style: "currency", currency: "NGN" }
                  )
                : "N/A"}
            </p>
            <p className="font-medium">Total Trade Amount:</p>
            <p>
              {adminDetail?.totalTradeAmount
                ? parseFloat(adminDetail.totalTradeAmount).toLocaleString(
                    "en-US",
                    { style: "currency", currency: "USD" }
                  )
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-medium mb-4">Current Balance</h2>
          <p className="text-3xl font-bold">
            {adminBalance?.walletBalance || "0.00"} {adminBalance?.coin}
          </p>
        </div>
      </div>
    </div>
  );
}
