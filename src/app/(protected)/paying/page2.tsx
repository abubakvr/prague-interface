"use client";
import { useGetOrders } from "@/hooks/useGetBuyDetails";
import { markPaidOrder, payAllOrders, paySingleOrder } from "@/hooks/useOrders";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { findBankCode } from "@/lib/findBankCode";
import { banks } from "@/lib/bankCodes";
import { truncateText } from "@/lib/helpers";
import { OrderDetails } from "@/types/order";

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
  const [markingPaidOrderId, setMarkingPaidOrderId] = useState<string | null>(
    null
  );
  const [selectedBanks, setSelectedBanks] = useState<{
    [orderId: string]: { BANK_NAME: string; BANK_CODE: string } | null;
  }>({});

  const [orders, setOrders] = useState<any[]>([]);
  const [exportableOrders, setExportableOrders] = useState<any[]>([]);
  const [payAllLoading, setPayAllLoading] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Clone the data to avoid direct mutation
      setOrders([...data]);
      // Initialize exportableOrders with the original data
      setExportableOrders(
        data.map((order) => {
          const paymentList = order.paymentTermList || [];
          const paymentTerm = paymentList.length > 0 ? paymentList[0] : null;
          return {
            ...order,
            bankCode: findBankCode(paymentTerm?.bankName)?.BANK_CODE || "N/A",
          };
        })
      );
    }
  }, [data]);

  const handleBankSelect = (
    orderId: string,
    selectedBank: { BANK_NAME: string; BANK_CODE: string }
  ) => {
    setSelectedBanks((prevSelectedBanks) => ({
      ...prevSelectedBanks,
      [orderId]: selectedBank,
    }));

    // Update the orders array with the selected bank
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          // Clone the order to avoid direct mutation
          const updatedOrder = { ...order };
          if (
            !updatedOrder.paymentTermList ||
            updatedOrder.paymentTermList.length === 0
          ) {
            updatedOrder.paymentTermList = [
              { bankName: selectedBank.BANK_NAME },
            ];
          } else {
            updatedOrder.paymentTermList = updatedOrder.paymentTermList.map(
              (paymentTerm: any) => ({
                ...paymentTerm,
                bankName: selectedBank.BANK_NAME,
              })
            );
          }
          return updatedOrder;
        }
        return order;
      })
    );

    // Update the exportableOrders array with the selected bank code
    setExportableOrders((prevExportableOrders) =>
      prevExportableOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            bankCode: selectedBank.BANK_CODE,
          };
        }
        return order;
      })
    );
  };

  const markOrderAsPaid = async (
    orderId: string,
    paymentType: string,
    paymentId: string
  ) => {
    setMarkingPaidOrderId(orderId);
    try {
      const response = await markPaidOrder(orderId, paymentType, paymentId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.ret_msg === "SUCCESS") {
        toast.success("Order marked as paid successfully!");
        refetch();
      } else {
        toast.error("An error occurred");
      }
    } catch (error: any) {
      console.error("Error marking order as paid:", error);
      toast.error(`Error marking order as paid: ${error.message}`); // Use react-hot-toast
    } finally {
      setMarkingPaidOrderId(null);
    }
  };

  const handlePayAllOrders = async () => {
    setPayAllLoading(true);
    try {
      const response = await payAllOrders(exportableOrders);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.success === true) {
        toast.success(`Paid all ${data.data.transferCount} orders`);
        refetch();
      } else {
        toast.error(`Payment failed for all orders`);
        console.error(data.message);
      }
    } catch (error: any) {
      console.error("Error paying order:", error);
      toast.error(`Error paying bulk orders: ${error.message}`);
    } finally {
      setPayAllLoading(false);
    }
  };

  const handlePaySingleOrder = async (order: OrderDetails) => {
    setPayingOrderId(order.id);
    try {
      const response = await paySingleOrder(order);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success === true) {
        toast.success(`Paid ${order.paymentTermList[0].realName}`);
        refetch();
      } else {
        toast.error(`Payment failed for all orders`);
        console.error(data.message);
      }
    } catch (error: any) {
      console.error("Error paying order:", error);
      toast.error(`Error paying bulk orders: ${error.message}`);
    } finally {
      setPayingOrderId(null);
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
    toast.error(`Error fetching orders: ${error.message}`);
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
      {orders.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 items-center">
              <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                Total Orders: {orders.length}
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
              <a
                href={`/api/export-orders?token=${localStorage.getItem(
                  "accessToken"
                )}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-300/50 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-2.25m-9-5.25v-3m3-3.018C18.833 2.369 5.167 2.369 3 11.582"
                  />
                </svg>
                Download CSV
              </a>
            </div>
            <button
              onClick={handlePayAllOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-blue-300/50 flex items-center gap-2"
              disabled={payAllLoading}
            >
              {payAllLoading ? (
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
                  Paying...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a8.25 8.25 0 0116.5 0m-16.5 0a8.25 8.25 0 0211.693 5.827m0 0l11.489-9.574M18.75 7.5a8.25 8.25 0 00-16.5 0m16.5 0a8.25 8.25 0 01-11.693 5.827m0 0l-11.489-9.574M9 9.75V15h6M3.75 21h16.5"
                    />
                  </svg>
                  Pay All
                </>
              )}
            </button>
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
                    Bank Code
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
                    Select Bank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-blue-100">
                {orders.map((order) => {
                  // Safely access payment term data with null checks
                  const paymentList = order.paymentTermList || [];
                  const paymentTerm =
                    paymentList.length > 0 ? paymentList[0] : null;
                  const bankCode =
                    selectedBanks[order.id]?.BANK_CODE ||
                    findBankCode(paymentTerm?.bankName)?.BANK_CODE;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td
                        className="px-4 py-4 whitespace-nowrap font-medium text-blue-900"
                        title={
                          order.side === 1
                            ? order.buyerRealName
                            : order.sellerRealName
                        }
                      >
                        {truncateText(
                          order.side === 1
                            ? order.buyerRealName
                            : order.sellerRealName,
                          11
                        )}
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-blue-800"
                        title={paymentTerm?.bankName || "N/A"}
                      >
                        {truncateText(paymentTerm?.bankName, 11)}
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-blue-800"
                        title={bankCode || "N/A"}
                      >
                        {truncateText(bankCode, 11)}
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-blue-800"
                        title={paymentTerm?.branchName || "N/A"}
                      >
                        {truncateText(paymentTerm?.branchName, 11)}
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-blue-800"
                        title={paymentTerm?.accountNo || "N/A"}
                      >
                        {truncateText(paymentTerm?.accountNo, 11)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-lg font-semibold text-blue-900">
                        {parseFloat(
                          (
                            (Number(order.quantity) || 0) *
                            (Number(order.price) || 0)
                          ).toFixed(2)
                        ).toLocaleString("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={
                              selectedBanks[order.id]
                                ? selectedBanks[order.id]?.BANK_NAME
                                : ""
                            }
                            onChange={(e) => {
                              const selectedBank = banks.find(
                                (bank) => bank.BANK_NAME === e.target.value
                              );
                              if (selectedBank) {
                                handleBankSelect(order.id, selectedBank);
                              }
                            }}
                            className="block appearance-none w-full bg-white border border-blue-300 hover:border-blue-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value="">Select Bank</option>
                            {banks.map((bank) => (
                              <option
                                key={bank.BANK_NAME}
                                value={bank.BANK_NAME}
                              >
                                {bank.BANK_NAME}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-700">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handlePaySingleOrder(order)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
                          disabled={payingOrderId === order.id}
                        >
                          {payingOrderId === order.id ? (
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
                              Paying...
                            </>
                          ) : (
                            "Pay"
                          )}
                        </button>
                        <button
                          onClick={() =>
                            markOrderAsPaid(
                              order.id,
                              paymentTerm?.paymentType?.toString() || "0",
                              paymentTerm?.id || ""
                            )
                          }
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md hover:shadow-green-300/50 transition-all duration-300"
                          disabled={markingPaidOrderId !== null}
                        >
                          {markingPaidOrderId === order.id ? (
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
                  );
                })}
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
