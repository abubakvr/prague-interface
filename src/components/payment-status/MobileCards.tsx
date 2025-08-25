import { PaidOrder } from "@/hooks/usePaidOrders";
import { useFormatters } from "@/hooks/useFormatters";
import { useBankMapping } from "@/hooks/useBankMapping";
import { useTheme } from "@/context/ThemeContext";

interface MobileCardsProps {
  paidOrders: PaidOrder[];
  onCheckStatus: (order: PaidOrder) => void;
}

export function MobileCards({ paidOrders, onCheckStatus }: MobileCardsProps) {
  const { resolvedTheme } = useTheme();
  const { formatCurrency, formatDate } = useFormatters();
  const { findBankNameByCode } = useBankMapping();

  return (
    <div className="md:hidden space-y-3">
      {paidOrders.map((order) => (
        <div
          key={order.id}
          className={`rounded-lg shadow-md p-4 border transition-colors duration-200 ${
            resolvedTheme === "dark"
              ? "bg-slate-800 border-slate-600"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p
                className={`text-lg font-semibold transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-blue-300" : "text-blue-900"
                }`}
              >
                {formatCurrency(order.amount)}
              </p>
              <p
                className={`text-sm mt-1 transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-300" : "text-gray-600"
                }`}
              >
                {order.seller_name}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ml-2 transition-colors duration-200 ${
                order.status === true || order.status === "completed"
                  ? resolvedTheme === "dark"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-green-100 text-green-800"
                  : resolvedTheme === "dark"
                  ? "bg-yellow-900/50 text-yellow-300"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status === true ? "Completed" : "Not completed"}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Bank:
              </span>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-200" : "text-gray-700"
                }`}
              >
                {findBankNameByCode(order.beneficiary_bank)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs transition-colors duration-200 ${
                  resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Transaction Ref:
              </span>
              <span
                className={`text-xs font-mono px-2 py-1 rounded transition-colors duration-200 ${
                  resolvedTheme === "dark"
                    ? "text-slate-200 bg-slate-700"
                    : "text-gray-700 bg-gray-100"
                }`}
              >
                {order.transaction_reference || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={`text-xs transition-colors duration-200 ${
                resolvedTheme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {formatDate(order.payment_time)}
            </div>
            <button
              className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
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
