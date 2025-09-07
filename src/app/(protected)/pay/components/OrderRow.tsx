import { truncateText } from "@/lib/helpers";
import { findBankCode, findPaymentMethodByType } from "@/lib/findBankCode";
import { Bank, banks } from "@/lib/bankCodes";
import { OrderDetails } from "@/types/order";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface UserProfile {
  averageReleaseTime?: string;
  badAppraiseCount?: string;
  // Add other expected profile properties here if known
  [key: string]: any; // Allows for other properties if profile structure is dynamic
}

interface OrderRowProps {
  order: OrderDetails;
  selectedBank: Bank | undefined;
  handleBankSelect: (orderId: string, bank: Bank) => void;
  isMarkingPaid: boolean;
  markOrderAsPaid: (
    orderId: string,
    paymentType: string,
    paymentId: string
  ) => void;
  isPaying: boolean;
  handlePaySingleOrder: (order: OrderDetails) => void;
  profile: UserProfile;
}

export function OrderRow({
  order,
  selectedBank,
  handleBankSelect,
  isMarkingPaid,
  markOrderAsPaid,
  isPaying,
  handlePaySingleOrder,
  profile,
}: OrderRowProps) {
  const { resolvedTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely access payment term data with null checks
  const paymentList = order.paymentTermList || [];
  const paymentTerm = paymentList.length > 0 ? paymentList[0] : null;
  const userBank =
    selectedBank ||
    findBankCode(paymentTerm?.bankName) ||
    findBankCode(paymentTerm?.branchName) ||
    findPaymentMethodByType(paymentTerm?.paymentType);

  // Calculate amount
  const amount = parseFloat(
    ((Number(order.quantity) || 0) * (Number(order.price) || 0)).toFixed(2)
  ).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  // Button classes for transparent pop effect in dark mode, light trans blue in light mode, and extra pop
  const payButtonClass = `inline-flex items-center px-3 py-1.5 border border-blue-400 text-xs font-semibold rounded-md shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      resolvedTheme === "dark"
        ? "bg-blue-400/20 hover:bg-blue-400/30 text-blue-200 border-blue-400/60 hover:shadow-blue-400/40 focus:ring-blue-300"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white"
    }`;

  const markPaidButtonClass = `inline-flex items-center px-3 py-1.5 border border-green-400 text-xs font-semibold rounded-md shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      resolvedTheme === "dark"
        ? "bg-green-400/20 hover:bg-green-400/30 text-green-200 border-green-400/60 hover:shadow-green-400/40 focus:ring-green-300"
        : "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white"
    }`;

  // For mobile
  const payButtonMobileClass = `flex-1 inline-flex justify-center items-center px-3 py-2 border border-blue-400 text-xs font-semibold rounded-md shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      resolvedTheme === "dark"
        ? "bg-blue-400/20 hover:bg-blue-400/30 text-blue-200 border-blue-400/60 hover:shadow-blue-400/40 focus:ring-blue-300"
        : "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 hover:shadow-blue-400/40 focus:ring-blue-400"
    }`;

  const markPaidButtonMobileClass = `flex-1 inline-flex justify-center items-center px-3 py-2 border border-green-400 text-xs font-semibold rounded-md shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      resolvedTheme === "dark"
        ? "bg-green-400/20 hover:bg-green-400/30 text-green-200 border-green-400/60 hover:shadow-green-400/40 focus:ring-green-300"
        : "bg-green-100 hover:bg-green-200 text-green-800 border-green-300 hover:shadow-green-400/40 focus:ring-green-400"
    }`;

  return (
    <>
      {/* Desktop view */}
      <tr
        className={`hidden md:table-row transition-colors duration-150 ${
          resolvedTheme === "dark" ? "hover:bg-slate-700" : "hover:bg-blue-50"
        }`}
      >
        <td
          className={`px-4 py-4 whitespace-nowrap font-medium transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-200" : "text-blue-900"
          }`}
          title={order.side === 1 ? order.buyerRealName : order.sellerRealName}
        >
          {truncateText(
            order.side === 1 ? order.buyerRealName : order.sellerRealName,
            11
          )}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
          }`}
          title={userBank?.BANK_NAME || paymentTerm?.bankName || "N/A"}
        >
          {truncateText(paymentTerm?.bankName || userBank?.BANK_NAME, 11)}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
          }`}
          title={userBank?.BANK_CODE || "N/A"}
        >
          {truncateText(userBank?.BANK_CODE, 11)}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
          }`}
          title={paymentTerm?.branchName || "N/A"}
        >
          {truncateText(paymentTerm?.branchName, 11)}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-300" : "text-blue-800"
          }`}
          title={paymentTerm?.accountNo || "N/A"}
        >
          {truncateText(
            paymentTerm?.accountNo
              ? paymentTerm.accountNo.trim().replace(/\s+/g, "")
              : "N/A",
            11
          )}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap font-semibold transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-200" : "text-blue-900"
          }`}
        >
          {profile?.averageReleaseTime + " mins" || "N/A"}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap font-semibold transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-200" : "text-blue-900"
          }`}
        >
          {profile?.badAppraiseCount || "N/A"}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap font-semibold transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-200" : "text-blue-900"
          }`}
        >
          {truncateText(
            paymentTerm?.paymentType ? String(paymentTerm.paymentType) : "N/A",
            11
          )}
        </td>
        <td
          className={`px-4 py-4 whitespace-nowrap text-lg font-semibold transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-200" : "text-blue-900"
          }`}
        >
          {amount}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="relative">
            <select
              value={selectedBank ? selectedBank.BANK_NAME : ""}
              onChange={(e) => {
                const bank = banks.find((b) => b.BANK_NAME === e.target.value);
                if (bank) {
                  handleBankSelect(order.id, bank);
                }
              }}
              className={`block appearance-none w-full border px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-700 border-slate-600 text-slate-100 hover:border-slate-500"
                  : "bg-white border-blue-300 text-gray-900 hover:border-blue-500"
              }`}
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.BANK_NAME} value={bank.BANK_NAME}>
                  {bank.BANK_NAME}
                </option>
              ))}
            </select>
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-blue-400" : "text-blue-700"
              }`}
            >
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
            className={payButtonClass}
            disabled={isPaying}
          >
            {isPaying ? (
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
            className={markPaidButtonClass}
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

      {/* Mobile view */}
      <tr className="md:hidden hover:bg-blue-50 transition-colors duration-150">
        <td className="p-4" colSpan={8}>
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <div className="font-medium text-blue-900">
                {truncateText(
                  order.side === 1 ? order.buyerRealName : order.sellerRealName,
                  20
                )}
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {amount}
              </div>
            </div>

            <div className="flex justify-between text-sm text-blue-800">
              <div>
                Bank: {truncateText(paymentTerm?.bankName || "N/A", 15)}
              </div>
              <div>Code: {truncateText(userBank?.BANK_CODE || "N/A", 8)}</div>
            </div>
            <div className="text-sm text-blue-800">
              Avg. Release: {profile?.averageReleaseTime + " mins" || "N/A"}
            </div>
            <div className="text-sm text-blue-800">
              Avg. Bad Reviews: {profile?.badAppraiseCount?.toString() || "N/A"}
            </div>
            <div className="flex justify-between text-sm text-blue-800">
              <div>
                Account: {truncateText(paymentTerm?.accountNo || "N/A", 12)}
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 underline text-xs"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            </div>

            {isExpanded && (
              <div className="text-sm text-blue-800 pt-2 border-t border-blue-100">
                <div className="mb-2">
                  Branch: {paymentTerm?.branchName || "N/A"}
                </div>
                <div className="relative mb-3">
                  <select
                    value={selectedBank ? selectedBank.BANK_NAME : ""}
                    onChange={(e) => {
                      const bank = banks.find(
                        (b) => b.BANK_NAME === e.target.value
                      );
                      if (bank) {
                        handleBankSelect(order.id, bank);
                      }
                    }}
                    className="block appearance-none w-full bg-white border border-blue-300 hover:border-blue-500 px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
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
            )}

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => handlePaySingleOrder(order)}
                className={payButtonMobileClass}
                disabled={isPaying}
              >
                {isPaying ? (
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
                className={markPaidButtonMobileClass}
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
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
