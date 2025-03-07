import { getStatusBadgeColor, getStatusText } from "@/lib/helpers";
import { OrderItem } from "@/types/order";
import Link from "next/link";

interface OrderTableProps {
  orders: OrderItem[];
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="w-full">
      <table className="w-full selection:bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount/Price
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Counterparty
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-2 py-4 whitespace-nowrap text-sm">
                <span className="font-medium">
                  {order.side === 1
                    ? order.buyerRealName
                    : order.sellerRealName}
                </span>
                <span className="block text-xs text-gray-500">
                  {order.side === 0 ? "Seller" : "Buyer"}
                </span>
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm">
                <div>
                  {order.amount} {order.currencyId}
                </div>
                <div className="text-gray-500">
                  @ {order.price} {order.currencyId}
                </div>
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm">
                <div>{order.targetNickName}</div>
                <div className="text-xs text-gray-500">
                  ID: {order.targetUserId}
                </div>
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.createDate).toLocaleDateString()}
              </td>
              <td className="px-2 py-4 whitespace-nowrap space-x-2 flex text-sm">
                <Link
                  href={`/orderdetails?orderId=${order.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Order
                </Link>
                <Link
                  href={`/user?userId=${order.targetUserId}&orderId=${order.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Profile
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
