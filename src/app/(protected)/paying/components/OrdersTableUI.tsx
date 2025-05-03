// OrdersTableUI.tsx
import { OrderDetails } from "@/types/order";
import { OrderRow } from "./OrderRow";
import { Bank, banks } from "@/lib/bankCodes";
import { handlePaySingleOrder, markOrderAsPaid } from "./OrderActions";
import { useState } from "react";

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
    <div className="overflow-hidden rounded-xl shadow-md bg-white/80 backdrop-blur-sm border border-blue-200">
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
      <div className="md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="border-b border-blue-100 p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleMobileOrderExpand(order.id)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-blue-900">
                  {order.side === 1
                    ? order.buyerRealName
                    : order.sellerRealName}
                </span>
                <span className="text-blue-700 text-sm">
                  {parseFloat(
                    (
                      (Number(order.quantity) || 0) * (Number(order.price) || 0)
                    ).toFixed(2)
                  ).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </span>
              </div>
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

            {expandedMobileOrder === order.id && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-blue-600">Bank Name:</div>
                  <div>{order.paymentTermList?.[0]?.bankName || "N/A"}</div>

                  <div className="text-blue-600">Bank Code:</div>
                  <div>{selectedBanks[order.id]?.BANK_CODE || "N/A"}</div>

                  <div className="text-blue-600">Bank Branch:</div>
                  <div>{order.paymentTermList?.[0]?.branchName || "N/A"}</div>

                  <div className="text-blue-600">Account No:</div>
                  <div>{order.paymentTermList?.[0]?.accountNo || "N/A"}</div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Select Bank
                  </label>
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
                    className="block w-full bg-white border border-blue-300 hover:border-blue-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.BANK_NAME} value={bank.BANK_NAME}>
                        {bank.BANK_NAME}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() =>
                      handlePaySingleOrder(order, setPayingOrderId, refetch)
                    }
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
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
                      "Pay Order"
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
