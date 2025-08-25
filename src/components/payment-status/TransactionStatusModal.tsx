import { HiX, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { PaidOrder } from "@/hooks/usePaidOrders";
import { useFormatters } from "@/hooks/useFormatters";
import { useBankMapping } from "@/hooks/useBankMapping";
import { useTheme } from "@/context/ThemeContext";

interface TransactionStatusResponse {
  success: boolean;
  message: string;
  data?: {
    responseCode: string;
    sessionID: string;
    status: boolean;
    message: string;
    data: any;
  };
  error?: string;
}

interface TransactionStatusModalProps {
  isOpen: boolean;
  selectedTransaction: PaidOrder | null;
  transactionStatus: TransactionStatusResponse | null;
  isCheckingStatus: boolean;
  onClose: () => void;
}

export function TransactionStatusModal({
  isOpen,
  selectedTransaction,
  transactionStatus,
  isCheckingStatus,
  onClose,
}: TransactionStatusModalProps) {
  const { formatCurrency } = useFormatters();
  const { findBankNameByCode } = useBankMapping();
  const { resolvedTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 md:p-4 z-50">
      <div
        className={`rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors duration-200 ${
          resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 md:p-6 border-b transition-colors duration-200 ${
            resolvedTheme === "dark" ? "border-slate-600" : "border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-semibold transition-colors duration-200 ${
              resolvedTheme === "dark" ? "text-slate-100" : "text-gray-900"
            }`}
          >
            Transaction Status
          </h3>
          <button
            onClick={onClose}
            className={`transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-6">
          {selectedTransaction && (
            <div className="space-y-4">
              {/* Transaction Details */}
              <div
                className={`p-4 rounded-lg transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "bg-slate-700" : "bg-gray-50"
                }`}
              >
                <h4
                  className={`font-medium mb-3 transition-colors duration-200 ${
                    resolvedTheme === "dark"
                      ? "text-slate-100"
                      : "text-gray-900"
                  }`}
                >
                  Transaction Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span
                      className={`transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-300"
                          : "text-gray-600"
                      }`}
                    >
                      Amount:
                    </span>
                    <span
                      className={`font-medium transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-100"
                          : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(selectedTransaction.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-300"
                          : "text-gray-600"
                      }`}
                    >
                      Seller:
                    </span>
                    <span
                      className={`font-medium transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-100"
                          : "text-gray-900"
                      }`}
                    >
                      {selectedTransaction.seller_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-300"
                          : "text-gray-600"
                      }`}
                    >
                      Bank:
                    </span>
                    <span
                      className={`font-medium transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-100"
                          : "text-gray-900"
                      }`}
                    >
                      {findBankNameByCode(selectedTransaction.beneficiary_bank)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-300"
                          : "text-gray-600"
                      }`}
                    >
                      Reference:
                    </span>
                    <span
                      className={`font-mono text-xs px-2 py-1 rounded transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "bg-slate-600 text-slate-200"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {selectedTransaction.transaction_reference}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {isCheckingStatus && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <svg
                      className={`animate-spin h-8 w-8 transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-blue-400"
                          : "text-blue-600"
                      }`}
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
                    <p
                      className={`transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "text-slate-300"
                          : "text-gray-600"
                      }`}
                    >
                      Checking transaction status...
                    </p>
                  </div>
                </div>
              )}

              {/* Transaction Status Result */}
              {!isCheckingStatus && transactionStatus && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg border transition-colors duration-200 ${
                      transactionStatus.success &&
                      transactionStatus.data?.status
                        ? resolvedTheme === "dark"
                          ? "bg-green-900/20 border-green-700"
                          : "bg-green-50 border-green-200"
                        : resolvedTheme === "dark"
                        ? "bg-red-900/20 border-red-700"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {transactionStatus.success &&
                      transactionStatus.data?.status ? (
                        <HiCheckCircle
                          className={`h-5 w-5 transition-colors duration-200 ${
                            resolvedTheme === "dark"
                              ? "text-green-400"
                              : "text-green-600"
                          }`}
                        />
                      ) : (
                        <HiExclamationCircle
                          className={`h-5 w-5 transition-colors duration-200 ${
                            resolvedTheme === "dark"
                              ? "text-red-400"
                              : "text-red-600"
                          }`}
                        />
                      )}
                      <h4
                        className={`font-medium transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-slate-100"
                            : "text-gray-900"
                        }`}
                      >
                        {transactionStatus.success
                          ? "Status Retrieved"
                          : "Error"}
                      </h4>
                    </div>

                    {transactionStatus.success && transactionStatus.data ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span
                            className={`transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-300"
                                : "text-gray-600"
                            }`}
                          >
                            Response Code:
                          </span>
                          <span
                            className={`font-mono px-2 py-1 rounded text-xs transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "bg-slate-600 text-slate-200"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {transactionStatus.data.responseCode}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            className={`transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-300"
                                : "text-gray-600"
                            }`}
                          >
                            Session ID:
                          </span>
                          <span
                            className={`font-mono px-2 py-1 rounded text-xs transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "bg-slate-600 text-slate-200"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {transactionStatus.data.sessionID}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            className={`transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-300"
                                : "text-gray-600"
                            }`}
                          >
                            Status:
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                              transactionStatus.data.status
                                ? resolvedTheme === "dark"
                                  ? "bg-green-900/50 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : resolvedTheme === "dark"
                                ? "bg-red-900/50 text-red-300"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transactionStatus.data.status
                              ? "Successful"
                              : "Failed"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            className={`transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-300"
                                : "text-gray-600"
                            }`}
                          >
                            Message:
                          </span>
                          <span
                            className={`font-medium max-w-xs text-right transition-colors duration-200 ${
                              resolvedTheme === "dark"
                                ? "text-slate-100"
                                : "text-gray-900"
                            }`}
                          >
                            {transactionStatus.data.message}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`text-sm transition-colors duration-200 ${
                          resolvedTheme === "dark"
                            ? "text-red-400"
                            : "text-red-600"
                        }`}
                      >
                        {transactionStatus.error || transactionStatus.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`flex justify-end p-4 md:p-6 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "border-slate-600" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              resolvedTheme === "dark"
                ? "bg-slate-600 text-slate-100 hover:bg-slate-500"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
