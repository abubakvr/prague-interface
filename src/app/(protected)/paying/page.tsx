"use client";
import Link from "next/link";
import { useGetOrders } from "@/hooks/useGetBuyDetails";
import { markPaidOrder } from "@/hooks/useOrders";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
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
    setIsMarkingPaid(true);
    try {
      const response = await markPaidOrder(orderId, paymentType, paymentId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      if (rawData.data.ret_msg === "SUCCESS") {
        toast.success("Order marked as paid successfully!");
      }
      refetch();
    } catch (error: any) {
      console.error("Error marking order as paid:", error);
      toast.error(`Error marking order as paid: ${error.message}`); // Use react-hot-toast
      setModal({
        open: true,
        message: `Error marking order as paid: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsMarkingPaid(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-y-5 h-screen items-center text-center justify-center">
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
    <div className=" rounded-xl shadow-lg">
      <Toaster />
      {modal.open && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm ${
            modal.type === "success"
              ? "text-green-500"
              : modal.type === "error"
              ? "text-red-500"
              : "text-blue-500"
          }`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
            <p>{modal.message}</p>
            <button
              onClick={() => setModal({ open: false, message: "", type: "" })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-300/50"
            >
              OK
            </button>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reload
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl shadow-md bg-white/80 backdrop-blur-sm border border-blue-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Real Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Bank Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Bank Branch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Account No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-blue-100">
                {data.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-blue-900">
                      {order.side === 1
                        ? order.buyerRealName
                        : order.sellerRealName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                      {order.paymentTermList[0]?.bankName || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                      {order.paymentTermList[0]?.branchName || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                      {order.paymentTermList[0]?.accountNo || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-lg font-semibold text-blue-900">
                      {parseFloat(
                        (Number(order.quantity) * Number(order.price)).toFixed(
                          2
                        )
                      ).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="px-4 py-4 space-x-2 whitespace-nowrap">
                      <Link
                        href={`/user?userId=${order.targetUserId}&orderId=${order.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
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
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md hover:shadow-green-300/50 transition-all duration-300"
                        disabled={isMarkingPaid}
                      >
                        {isMarkingPaid ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            Marking...
                          </>
                        ) : (
                          "Mark Paid"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
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
          <p className="text-blue-800 font-medium text-lg">No orders to pay</p>
        </div>
      )}
    </div>
  );
}
