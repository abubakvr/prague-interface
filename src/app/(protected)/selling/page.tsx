"use client";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { getStatusBadgeColor, getStatusText } from "@/lib/helpers";
import {
  releaseDigitalAsset,
  useGetSellOrders,
} from "@/hooks/useGetSellOrders";
import { HiRefresh } from "react-icons/hi";
import { useTheme } from "@/context/ThemeContext";

export default function OrdersTable() {
  const { resolvedTheme } = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useGetSellOrders();
  const [openModal, setOpenModal] = useState(false);
  const [assetDetails, setAssetDetails] = useState({
    orderId: "",
    buyerName: "",
    amount: "",
  });
  const [isReleasing, setIsReleasing] = useState(false);

  const releaseCoin = async (orderId: string) => {
    setIsReleasing(true);
    try {
      const response = await releaseDigitalAsset(orderId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.ret_msg === "SUCCESS") {
        toast.success("Asset released successfully!");
        setAssetDetails({
          orderId: "",
          buyerName: "",
          amount: "",
        });
        setOpenModal(false);
        refetch();
      } else {
        toast.error("An error occurred");
      }
    } catch (error: any) {
      console.error("Error marking order as paid:", error);
      toast.error(`Error marking order as paid: ${error.message}`); // Use react-hot-toast
    } finally {
      setIsReleasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center mt-16">
        <div
          className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "border-blue-400" : "border-blue-600"
          }`}
        ></div>
        <p
          className={`font-medium transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
          }`}
        >
          Fetching orders. Please wait
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center">
        <p
          className={`font-medium transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          Error fetching orders: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className={`px-4 py-2 text-white rounded-md shadow-lg transition-all duration-300 ${
            resolvedTheme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/20"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/50"
          }`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 7000,
        }}
      />
      {openModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm`}
        >
          <div
            className={`p-6 rounded-lg shadow-lg border transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-blue-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-xl font-medium transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-red-400" : "text-red-500"
                }`}
              >
                Confirmation!!!
              </h3>
            </div>
            <p
              className={`mb-2 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
              }`}
            >
              Please confirm that you have received{" "}
              <span className="font-bold">
                {parseFloat(assetDetails.amount).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </span>{" "}
              from <span className="font-bold">{assetDetails.buyerName}</span>
            </p>
            <p
              className={`transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-200" : "text-gray-800"
              }`}
            >
              This action is irreversible. Are you sure you want to release the
              asset?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setOpenModal(false)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  resolvedTheme === "dark"
                    ? "bg-slate-600 text-slate-200 hover:bg-slate-500"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
                disabled={isReleasing}
              >
                Cancel
              </button>
              <button
                onClick={() => releaseCoin(assetDetails.orderId)}
                className={`px-4 py-2 text-white rounded-md shadow-md transition-all duration-300 ${
                  resolvedTheme === "dark"
                    ? "bg-blue-500 hover:bg-blue-600 hover:shadow-blue-300/20"
                    : "bg-blue-500 hover:bg-blue-700 hover:shadow-blue-300/50"
                }`}
                disabled={isReleasing}
              >
                {isReleasing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Releasing
                  </div>
                ) : (
                  "Release Asset"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {data && data.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 items-center">
              <div
                className={`text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-blue-300 bg-blue-900/50"
                    : "text-blue-700 bg-blue-100"
                }`}
              >
                Total Orders: {data.length}
              </div>
              <button
                onClick={() => refetch()}
                className={`px-4 py-2 text-white rounded-md transition-all duration-300 shadow-md flex items-center gap-2 ${
                  resolvedTheme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/20"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/50"
                }`}
              >
                <HiRefresh className="h-4 w-4" />
                Reload
              </button>
              {isRefetching && (
                <p
                  className={`transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-300"
                      : "text-gray-600"
                  }`}
                >
                  Refetching Orders
                </p>
              )}
            </div>
          </div>
          <div
            className={`overflow-hidden rounded-xl shadow-md backdrop-blur-sm border transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-slate-800/80 border-slate-600"
                : "bg-white/80 border-blue-200"
            }`}
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount/Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Counterparty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`text-sm divide-y transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "divide-slate-700"
                    : "divide-blue-100"
                }`}
              >
                {data.map((order: any) => (
                  <tr
                    key={order.id}
                    className={`transition-colors duration-150 ${
                      resolvedTheme === "dark"
                        ? "hover:bg-slate-700"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap font-medium">
                      <span
                        className={`font-medium transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-slate-100"
                            : "text-blue-900"
                        }`}
                      >
                        {order.side === 1
                          ? order.buyerRealName
                          : order.sellerRealName}
                      </span>
                      <span
                        className={`block text-xs transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-blue-400"
                            : "text-blue-500"
                        }`}
                      >
                        {order.side === 0 ? "Seller" : "Buyer"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={`transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-slate-200"
                            : "text-blue-800"
                        }`}
                      >
                        {order.amount} {order.currencyId}
                      </div>
                      <div
                        className={`transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      >
                        @ {order.price} {order.currencyId}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={`transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-slate-200"
                            : "text-blue-800"
                        }`}
                      >
                        {order.targetNickName}
                      </div>
                      <div
                        className={`text-xs transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      >
                        ID: {order.targetUserId}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-200"
                          : "text-blue-800"
                      }`}
                    >
                      {new Date(order.createDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 space-x-2 whitespace-nowrap">
                      <Link
                        href={`/orderdetails?orderId=${order.id}`}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white shadow-md transition-all duration-300 ${
                          resolvedTheme === "dark"
                            ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/20 focus:ring-blue-400"
                            : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/50 focus:ring-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        View Order
                      </Link>
                      <button
                        onClick={() => {
                          setOpenModal(true);
                          setAssetDetails({
                            orderId: order.id,
                            buyerName: order.buyerRealName,
                            amount: order.amount,
                          });
                        }}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white shadow-md transition-all duration-300 ${
                          resolvedTheme === "dark"
                            ? "bg-green-600 hover:bg-green-700 hover:shadow-green-300/20 focus:ring-green-400"
                            : "bg-green-600 hover:bg-green-700 hover:shadow-green-300/50 focus:ring-green-500"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        disabled={isReleasing}
                      >
                        {isReleasing ? "Releasing..." : "Release Coin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div
          className={`p-6 rounded-xl shadow-md text-center border transition-colors duration-200 ${
            resolvedTheme === "dark"
              ? "bg-slate-800 border-slate-600"
              : "bg-white border-blue-200"
          }`}
        >
          <p
            className={`transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
            }`}
          >
            No orders to process
          </p>
        </div>
      )}
    </div>
  );
}
