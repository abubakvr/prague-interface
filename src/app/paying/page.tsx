"use client";
import { useGetOrders } from "@/hooks/useGetBuyDetails";
import { markPaidOrder } from "@/hooks/useOrders";
import Link from "next/link";
import { useState } from "react";

export default function OrdersTable() {
  const { data, isLoading, error, refetch } = useGetOrders({
    page: 1,
    size: 30,
  });
  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  const markOrderAsPaid = async (
    orderId: string,
    paymentType: string,
    paymentId: string
  ) => {
    setIsMarkingPaid(true); // Set isLoading state to true
    setModal({ open: false, message: "", type: "" }); //Close any open modals
    setModal({ open: true, message: "Marking order as paid...", type: "info" }); // Update modal message

    try {
      const response = await markPaidOrder(orderId, paymentType, paymentId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      console.log(rawData);
      setModal({
        open: true,
        message: "Order marked as paid successfully!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error marking order as paid:", error);
      setModal({
        open: true,
        message: `Error marking order as paid: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsMarkingPaid(false); // Set isLoading state to false
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
      {modal.open && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${
            modal.type === "success"
              ? "text-green-500"
              : modal.type === "error"
              ? "text-red-500"
              : "text-blue-500"
          }`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>{modal.message}</p>
            <button
              onClick={() => setModal({ open: false, message: "", type: "" })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              OK
            </button>
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
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Real Name
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Name
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Branch
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account No
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm bg-white divide-y divide-gray-300">
              {data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap">
                    {order.side === 1
                      ? order.buyerRealName
                      : order.sellerRealName}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {order.paymentTermList[0]?.bankName || "N/A"}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {order.paymentTermList[0]?.branchName || "N/A"}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {order.paymentTermList[0]?.accountNo || "N/A"}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-lg font-semibold">
                    {parseFloat(
                      (Number(order.quantity) * Number(order.price)).toFixed(2)
                    ).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </td>
                  <td className="px-2 py-4 space-x-2 whitespace-nowrap">
                    <Link
                      href={`/user?userId=${order.targetUserId}&orderId=${order.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Pay
                    </Link>
                    <button
                      onClick={() =>
                        markOrderAsPaid(
                          order.id,
                          order.paymentTermList[0].paymentType.toString(),
                          order.paymentTermList[0].id
                        )
                      }
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isMarkingPaid} // Disable button while loading
                    >
                      {isMarkingPaid ? "Marking..." : "Mark Paid"}
                      {/* Show loading indicator */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No orders to pay</p>
      )}
    </div>
  );
}
