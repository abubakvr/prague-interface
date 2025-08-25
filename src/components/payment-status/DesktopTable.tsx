import { PaidOrder } from "@/hooks/usePaidOrders";
import { useFormatters } from "@/hooks/useFormatters";
import { useBankMapping } from "@/hooks/useBankMapping";
import { useTheme } from "@/context/ThemeContext";

interface DesktopTableProps {
  paidOrders: PaidOrder[];
  onCheckStatus: (order: PaidOrder) => void;
}

export function DesktopTable({ paidOrders, onCheckStatus }: DesktopTableProps) {
  const { resolvedTheme } = useTheme();
  const { formatCurrency, formatDate } = useFormatters();
  const { findBankNameByCode } = useBankMapping();

  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div
          className={`overflow-hidden shadow-lg rounded-lg transition-colors duration-200 ${
            resolvedTheme === "dark" ? "bg-slate-800" : "bg-white"
          }`}
        >
          <table
            className={`min-w-full divide-y transition-colors duration-200 ${
              resolvedTheme === "dark" ? "divide-slate-700" : "divide-blue-100"
            }`}
          >
            <thead>
              <tr
                className={`${
                  resolvedTheme === "dark"
                    ? "bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/20 text-slate-100"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                }`}
              >
                <th className="text-left p-4 font-semibold text-sm">Amount</th>
                <th className="text-left p-4 font-semibold text-sm">Seller</th>
                <th className="text-left p-4 font-semibold text-sm">
                  Bank Name
                </th>
                <th className="text-left p-4 font-semibold text-sm">
                  Transaction Ref
                </th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">
                  Payment Date
                </th>
                <th className="text-left p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y transition-colors duration-200 ${
                resolvedTheme === "dark"
                  ? "bg-slate-800 divide-slate-700"
                  : "bg-slate-50 divide-blue-50"
              }`}
            >
              {paidOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`transition-colors duration-150 ${
                    resolvedTheme === "dark"
                      ? "hover:bg-slate-700"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {formatCurrency(order.amount)}
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {order.seller_name}
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {findBankNameByCode(order.beneficiary_bank)}
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-1 rounded transition-colors duration-200 ${
                        resolvedTheme === "dark"
                          ? "bg-slate-700 text-slate-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.transaction_reference || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        order.status === true || order.status === "completed"
                          ? resolvedTheme === "dark"
                            ? "bg-green-900/50 text-green-300"
                            : "bg-green-100 text-green-800"
                          : resolvedTheme === "dark"
                          ? "bg-yellow-900/50 text-yellow-300"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === true ? "Completed" : "Not Completed"}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-sm transition-colors duration-200 ${
                      resolvedTheme === "dark"
                        ? "text-slate-200"
                        : "text-blue-900"
                    }`}
                  >
                    {formatDate(order.payment_time)}
                  </td>
                  <td className="p-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
