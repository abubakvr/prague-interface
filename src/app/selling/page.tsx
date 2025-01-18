"use client";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { getStatusBadgeColor, getStatusText } from "@/lib/helpers";
import {
  releaseDigitalAsset,
  useGetSellOrders,
} from "@/hooks/useGetSellOrders";

export default function OrdersTable() {
  const { data, isLoading, error, refetch } = useGetSellOrders();
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
      const rawData = await response.json();
      console.log(rawData);
      toast.success("Asset released successfully!");
      setAssetDetails({
        orderId: "",
        buyerName: "",
        amount: "",
      });
      setOpenModal(false);
      refetch();
    } catch (error: any) {
      console.error("Error marking order as paid:", error);
      toast.error(`Error marking order as paid: ${error.message}`); // Use react-hot-toast
    } finally {
      setIsReleasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
        <p>Fetching orders. Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center gap-4">
        <p className="text-red-600">Error fetching orders: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <Toaster />
      {openModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={isReleasing}
              >
                Cancel
              </button>
              <button
                onClick={() => releaseCoin(assetDetails.orderId)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                disabled={isReleasing}
              >
                {isReleasing ? "Releasing" : "Release Asset"}
              </button>
            </div>
          </div>
        </div>
      )}
      {data && data.length > 0 ? (
        <>
          <div className="flex space-x-4 items-center mb-2">
            <div className="text-sm text-gray-500">
              Total Orders: {data.length}
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reload
            </button>
          </div>
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount/Price
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counterparty
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm bg-white divide-y divide-gray-300">
              {data.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <span className="font-medium">
                      {order.side === 1
                        ? order.buyerRealName
                        : order.sellerRealName}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {order.side === 0 ? "Seller" : "Buyer"}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <div>
                      {order.amount} {order.currencyId}
                    </div>
                    <div className="text-gray-500">
                      @ {order.price} {order.currencyId}
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <div>{order.targetNickName}</div>
                    <div className="text-xs text-gray-500">
                      ID: {order.targetUserId}
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createDate).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap space-x-2 flex text-sm">
                    <Link
                      href={`/orderdetails?orderId=${order.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isReleasing} // Disable button while loading
                    >
                      {isReleasing ? "Releasing..." : "Release Coin"}
                      {/* Show loading indicator */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No orders to process</p>
      )}
    </div>
  );
}
