import { getStatusBadgeColor, getStatusText } from "@/lib/helpers";
import { OrderItem } from "@/types/order";
import Link from "next/link";

interface OrderTableProps {
  orders: OrderItem[];
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl shadow-md border border-blue-200">
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-blue-50">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-blue-700">
              Order ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-blue-700">
              Amount/Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-blue-700">
              Counterparty
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-blue-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-blue-700">
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-blue-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-blue-100">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-blue-50 transition-colors duration-150"
            >
              <td className="px-4 py-4 whitespace-nowrap font-medium text-blue-900">
                <span className="font-medium">
                  {order.side === 1
                    ? order.buyerRealName
                    : order.sellerRealName}
                </span>
                <span className="block text-xs text-blue-500">
                  {order.side === 0 ? "Seller" : "Buyer"}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                <div>
                  {order.amount} {order.currencyId}
                </div>
                <div className="text-blue-600">
                  @ {order.price} {order.currencyId}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                <div>{order.targetNickName}</div>
                <div className="text-xs text-blue-600">
                  ID: {order.targetUserId}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-blue-800">
                {new Date(order.createDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 whitespace-nowrap space-x-2 flex">
                <Link
                  href={`/orderdetails?orderId=${order.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
                >
                  View Order
                </Link>
                <Link
                  href={`/user?userId=${order.targetUserId}&orderId=${order.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-blue-300/50 transition-all duration-300"
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
