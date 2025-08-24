import { PaidOrder } from "@/hooks/usePaidOrders";
import { useFormatters } from "@/hooks/useFormatters";
import { useBankMapping } from "@/hooks/useBankMapping";

interface DesktopTableProps {
  paidOrders: PaidOrder[];
  onCheckStatus: (order: PaidOrder) => void;
}

export function DesktopTable({ paidOrders, onCheckStatus }: DesktopTableProps) {
  const { formatCurrency, formatDate } = useFormatters();
  const { findBankNameByCode } = useBankMapping();

  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-blue-100">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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
            <tbody className="bg-slate-50 divide-y divide-blue-50">
              {paidOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="p-4 text-blue-900 text-sm">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="p-4 text-blue-900 text-sm">
                    {order.seller_name}
                  </td>
                  <td className="p-4 text-blue-900 text-sm">
                    {findBankNameByCode(order.beneficiary_bank)}
                  </td>
                  <td className="p-4 text-blue-900 text-sm">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {order.transaction_reference || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === true || order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === true ? "Completed" : "Not Completed"}
                    </span>
                  </td>
                  <td className="p-4 text-blue-900 text-sm">
                    {formatDate(order.payment_time)}
                  </td>
                  <td className="p-4">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
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
