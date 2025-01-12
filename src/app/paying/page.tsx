import { getOrders } from "@/hooks/useGetBuyDetails";
import Link from "next/link";

export default async function OrdersTable() {
  const orders = await getOrders({ page: 1, size: 30 });

  return (
    <div className="">
      <table className=" bg-white border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Real Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bank Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Account No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {orders!.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {order.side === 1 ? order.buyerRealName : order.sellerRealName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.paymentTermList[0]?.bankName || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.paymentTermList[0]?.accountNo || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.price}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {(Number(order.quantity) * Number(order.price)).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/user?userId=${order.targetUserId}&orderId=${order.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Pay
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
