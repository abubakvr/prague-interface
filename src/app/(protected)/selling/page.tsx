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

export default function OrdersTable() {
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-blue-700 font-medium">
          Fetching orders. Please wait
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4 justify-center">
        <p className="text-red-600 font-medium">
          Error fetching orders: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-lg hover:shadow-blue-300/50 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg">
      <Toaster />
      {openModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-red-500">
                Confirmation!!!
              </h3>
            </div>
            <p className="mb-2">
              Please confirm that you have received{" "}
              <span className="font-bold">
                {parseFloat(assetDetails.amount).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </span>{" "}
              from <span className="font-bold">{assetDetails.buyerName}</span>
            </p>
            <p>
              This action is irreversible. Are you sure you want to release the
              asset?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300"
                disabled={isReleasing}
              >
                Cancel
              </button>
              <button
                onClick={() => releaseCoin(assetDetails.orderId)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
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
              <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                Total Orders: {data.length}
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-300/50 flex items-center gap-2"
              >
                <HiRefresh className="h-4 w-4" />
                Reload
              </button>
              {isRefetching && <p>Refetching Orders</p>}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl shadow-md bg-white/80 backdrop-blur-sm border border-blue-200">
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
              <tbody className="text-sm divide-y divide-blue-100">
                {data.map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-blue-900">
                      <span className="font-medium">
                        {order.side === 1
                          ? order.buyerRealName
                          : order.sellerRealName}
                      </span>
                      <span className="block text-xs text-blue-500">
                        {order.side === 0 ? "Seller" : "Buyer"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                      <div>
                        {order.amount} {order.currencyId}
                      </div>
                      <div className="text-blue-600">
                        @ {order.price} {order.currencyId}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                      <div>{order.targetNickName}</div>
                      <div className="text-xs text-blue-600">
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
                    <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                      {new Date(order.createDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 space-x-2 whitespace-nowrap">
                      <Link
                        href={`/orderdetails?orderId=${order.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
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
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md hover:shadow-green-300/50 transition-all duration-300"
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
        <div className="bg-white p-6 rounded-xl shadow-md text-center border border-blue-200">
          <p className="text-blue-700">No orders to process</p>
        </div>
      )}
    </div>
  );
}
