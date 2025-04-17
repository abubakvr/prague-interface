import { truncateText } from "@/lib/helpers";
import { findBankCode } from "@/lib/findBankCode";
import { Bank, banks } from "@/lib/bankCodes";
import { OrderDetails } from "@/types/order";

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
}

export function OrderRow({
  order,
  selectedBank,
  handleBankSelect,
  isMarkingPaid,
  markOrderAsPaid,
  isPaying,
  handlePaySingleOrder,
}: OrderRowProps) {
  // Safely access payment term data with null checks
  const paymentList = order.paymentTermList || [];
  const paymentTerm = paymentList.length > 0 ? paymentList[0] : null;
  const bankCode =
    selectedBank?.BANK_CODE || findBankCode(paymentTerm?.bankName)?.BANK_CODE;

  return (
    <tr className="hover:bg-blue-50 transition-colors duration-150">
      <td
        className="px-4 py-4 whitespace-nowrap font-medium text-blue-900"
        title={order.side === 1 ? order.buyerRealName : order.sellerRealName}
      >
        {truncateText(
          order.side === 1 ? order.buyerRealName : order.sellerRealName,
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
          ((Number(order.quantity) || 0) * (Number(order.price) || 0)).toFixed(
            2
          )
        ).toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="relative">
          <select
            value={selectedBank ? selectedBank.BANK_NAME : ""}
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
      </td>
      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        <button
          onClick={() => handlePaySingleOrder(order)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
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
  );
}
