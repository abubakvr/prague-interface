import { PaidOrder } from "@/hooks/usePaidOrders";
import { useFormatters } from "@/hooks/useFormatters";
import { useBankMapping } from "@/hooks/useBankMapping";

interface MobileCardsProps {
  paidOrders: PaidOrder[];
  onCheckStatus: (order: PaidOrder) => void;
}

export function MobileCards({ paidOrders, onCheckStatus }: MobileCardsProps) {
  const { formatCurrency, formatDate } = useFormatters();
  const { findBankNameByCode } = useBankMapping();

  return (
    <div className="md:hidden space-y-3">
      {paidOrders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="text-lg font-semibold text-blue-900">
                {formatCurrency(order.amount)}
              </p>
              <p className="text-sm text-gray-600 mt-1">{order.seller_name}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                order.status === true || order.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status === true ? "Completed" : "Not completed"}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Bank:</span>
              <span className="text-sm text-gray-700 font-medium">
                {findBankNameByCode(order.beneficiary_bank)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Transaction Ref:</span>
              <span className="text-xs text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                {order.transaction_reference || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {formatDate(order.payment_time)}
            </div>
            <button
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
              onClick={() => onCheckStatus(order)}
            >
              Check Status
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
