import { HiX, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { PaidOrder } from "@/hooks/usePaidOrders";
import { useFormatters } from "@/hooks/useFormatters";
import { useBankMapping } from "@/hooks/useBankMapping";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction Status
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {selectedTransaction && (
            <div className="space-y-4">
              {/* Transaction Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Transaction Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedTransaction.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seller:</span>
                    <span className="font-medium">
                      {selectedTransaction.seller_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">
                      {findBankNameByCode(selectedTransaction.beneficiary_bank)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
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
                      className="animate-spin h-8 w-8 text-blue-600"
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
                    <p className="text-gray-600">
                      Checking transaction status...
                    </p>
                  </div>
                </div>
              )}

              {/* Transaction Status Result */}
              {!isCheckingStatus && transactionStatus && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${
                      transactionStatus.success &&
                      transactionStatus.data?.status
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {transactionStatus.success &&
                      transactionStatus.data?.status ? (
                        <HiCheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <HiExclamationCircle className="h-5 w-5 text-red-600" />
                      )}
                      <h4 className="font-medium text-gray-900">
                        {transactionStatus.success
                          ? "Status Retrieved"
                          : "Error"}
                      </h4>
                    </div>

                    {transactionStatus.success && transactionStatus.data ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Code:</span>
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                            {transactionStatus.data.responseCode}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Session ID:</span>
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
                            {transactionStatus.data.sessionID}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transactionStatus.data.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transactionStatus.data.status
                              ? "Successful"
                              : "Failed"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Message:</span>
                          <span className="font-medium text-gray-900 max-w-xs text-right">
                            {transactionStatus.data.message}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-600 text-sm">
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
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
