// OrdersTableUI.tsx
import { OrderDetails } from "@/types/order";
import { OrderRow } from "./OrderRow";
import { Bank } from "@/lib/bankCodes";
import { handlePaySingleOrder, markOrderAsPaid } from "./OrderActions";

interface OrdersTableUIProps {
  orders: OrderDetails[];
  selectedBanks: { [orderId: string]: Bank | undefined };
  handleBankSelect: (orderId: string, bank: Bank) => void;
  markingPaidOrderId: string | null;
  setMarkingPaidOrderId: (id: string | null) => void;
  payingOrderId: string | null;
  setPayingOrderId: (id: string | null) => void;
  refetch: () => void;
}

export function OrdersTableUI({
  orders,
  selectedBanks,
  handleBankSelect,
  markingPaidOrderId,
  setMarkingPaidOrderId,
  payingOrderId,
  setPayingOrderId,
  refetch,
}: OrdersTableUIProps) {
  return (
    <div className="overflow-hidden rounded-xl shadow-md bg-white/80 backdrop-blur-sm border border-blue-200">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Real Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Bank Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Bank Code
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Bank Branch
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Account No
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Select Bank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-blue-100">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              selectedBank={selectedBanks[order.id]}
              handleBankSelect={handleBankSelect}
              isMarkingPaid={markingPaidOrderId === order.id}
              markOrderAsPaid={(
                orderId: string,
                paymentType: string,
                paymentId: string
              ) =>
                markOrderAsPaid(
                  orderId,
                  paymentType,
                  paymentId,
                  setMarkingPaidOrderId,
                  refetch
                )
              }
              isPaying={payingOrderId === order.id}
              handlePaySingleOrder={(order: OrderDetails) =>
                handlePaySingleOrder(order, setPayingOrderId, refetch)
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
