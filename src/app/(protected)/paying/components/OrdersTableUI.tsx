// OrdersTableUI.tsx
import { OrderDetails } from "@/types/order";
import { OrderRow } from "./OrderRow";
import { Bank, banks } from "@/lib/bankCodes";
import { handlePaySingleOrder, markOrderAsPaid } from "./OrderActions";
import { useState } from "react";
import { findBankCode } from "@/lib/findBankCode";

interface OrdersTableUIProps {
  orders: OrderDetails[];
  selectedBanks: { [orderId: string]: Bank | undefined };
  handleBankSelect: (orderId: string, bank: Bank) => void;
  markingPaidOrderId: string | null;
  setMarkingPaidOrderId: (id: string | null) => void;
  payingOrderId: string | null;
  setPayingOrderId: (id: string | null) => void;
  refetch: () => void;
}

export function OrdersTableUI({
  orders,
  selectedBanks,
  handleBankSelect,
  markingPaidOrderId,
  setMarkingPaidOrderId,
  payingOrderId,
  setPayingOrderId,
  refetch,
}: OrdersTableUIProps) {
  const [expandedMobileOrder, setExpandedMobileOrder] = useState<string | null>(
    null
  );

  const toggleMobileOrderExpand = (orderId: string) => {
    setExpandedMobileOrder(expandedMobileOrder === orderId ? null : orderId);
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-md bg-white/80 backdrop-blur-sm border">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                selectedBank={selectedBanks[order.id]}
                handleBankSelect={handleBankSelect}
                isMarkingPaid={markingPaidOrderId === order.id}
                markOrderAsPaid={(
                  orderId: string,
                  paymentType: string,
                  paymentId: string
                ) =>
                  markOrderAsPaid(
                    orderId,
                    paymentType,
                    paymentId,
                    setMarkingPaidOrderId,
                    refetch
                  )
                }
                isPaying={payingOrderId === order.id}
                handlePaySingleOrder={(order: OrderDetails) =>
                  handlePaySingleOrder(order, setPayingOrderId, refetch)
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-4 cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
              onClick={() => toggleMobileOrderExpand(order.id)}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-x-2 mb-1">
                  <span className="font-medium text-blue-900 text-base">
                    {order.side === 1
                      ? order.buyerRealName
                      : order.sellerRealName}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 text-sm text-blue-700">
                  <span className="font-semibold">
                    {parseFloat(
                      (
                        (Number(order.quantity) || 0) *
                        (Number(order.price) || 0)
                      ).toFixed(2)
                    ).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                  <div className="h-4 w-px bg-blue-200"></div>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      ></path>
                    </svg>
                    {order.paymentTermList?.[0]?.bankName || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {selectedBanks[order.id]?.BANK_CODE ||
                    findBankCode(order.paymentTermList?.[0]?.bankName || "Null")
                      ?.BANK_CODE ||
                    "N/A"}
                </span>
                <svg
                  className={`w-5 h-5 text-blue-600 transition-transform ${
                    expandedMobileOrder === order.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            {expandedMobileOrder === order.id && (
              <div className="p-4 border-t border-blue-100">
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col">
                      <span className="text-blue-500 text-xs font-medium mb-1">
                        Bank Name
                      </span>
                      <span className="font-medium">
                        {order.paymentTermList?.[0]?.bankName || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-blue-500 text-xs font-medium mb-1">
                        Bank Code
                      </span>
                      <span className="font-medium">
                        {selectedBanks[order.id]?.BANK_CODE ||
                          findBankCode(
                            order.paymentTermList?.[0]?.bankName || "Null"
                          )?.BANK_CODE ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-blue-500 text-xs font-medium mb-1">
                        Bank Branch
                      </span>
                      <span className="font-medium">
                        {order.paymentTermList?.[0]?.branchName || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-blue-500 text-xs font-medium mb-1">
                        Account No
                      </span>
                      <span className="font-medium">
                        {order.paymentTermList?.[0]?.accountNo || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Select Bank
                  </label>
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
                      className="block w-full bg-white border border-blue-300 hover:border-blue-500 px-4 py-3 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank.BANK_NAME} value={bank.BANK_NAME}>
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
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      handlePaySingleOrder(order, setPayingOrderId, refetch)
                    }
                    className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        Pay Order
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      markOrderAsPaid(
                        order.id,
                        order.paymentTermList[0].paymentType.toString(),
                        order.paymentTermList[0].id,
                        setMarkingPaidOrderId,
                        refetch
                      )
                    }
                    className="py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                    disabled={markingPaidOrderId === order.id}
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
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Mark Paid
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
