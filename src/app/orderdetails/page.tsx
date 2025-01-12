import { getOrderDetails } from "@/hooks/useOrders";
import { getStatusText } from "@/lib/helpers";
import { OrderDetails } from "@/types/order";

export default async function Page({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  // Await the entire searchParams object
  searchParams = await searchParams;

  const orderId = await searchParams.orderId;

  const orderDetails: OrderDetails = await getOrderDetails(orderId!);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Order Information</h2>
          <InfoItem label="Order ID" value={orderDetails.id} />
          <InfoItem
            label="Type"
            value={orderDetails.side === 0 ? "BUY" : "SELL"}
          />
          <InfoItem label="Status" value={getStatusText(orderDetails.status)} />
          <InfoItem label="Order Type" value={orderDetails.orderType} />
          <InfoItem label="Created" value={orderDetails.createDate} />
          {orderDetails.transferDate && (
            <InfoItem label="Transfer Date" value={orderDetails.transferDate} />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Trade Details</h2>
          <InfoItem
            label="Token"
            value={`${orderDetails.quantity} ${orderDetails.tokenId}`}
          />
          <InfoItem
            label="Price"
            value={`${orderDetails.price} ${orderDetails.currencyId}`}
          />
          <InfoItem
            label="Amount"
            value={`${orderDetails.amount} ${orderDetails.currencyId}`}
          />
          <InfoItem label="Maker Fee" value={orderDetails.makerFee} />
          <InfoItem label="Taker Fee" value={orderDetails.takerFee} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">User Information</h2>
          <InfoItem label="Buyer" value={orderDetails.buyerRealName} />
          <InfoItem label="Seller" value={orderDetails.sellerRealName} />
          <InfoItem
            label="Target User Type"
            value={orderDetails.targetUserType}
          />
        </div>

        {orderDetails.paymentTermList.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Information</h2>
            {orderDetails.paymentTermList.map((term, index) => (
              <div key={term.id} className="border p-3 rounded">
                <h3 className="font-medium">Payment Method {index + 1}</h3>
                <InfoItem label="Name" value={term.realName} />
                <InfoItem
                  label="Payment Type"
                  value={term.paymentType.toString()}
                />
                {term.bankName && (
                  <InfoItem label="Bank" value={term.bankName} />
                )}
                {term.accountNo && (
                  <InfoItem label="Account" value={term.accountNo} />
                )}
              </div>
            ))}
          </div>
        )}

        {orderDetails.extension && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Extension Information</h2>
            <InfoItem
              label="Delayed Withdrawal"
              value={orderDetails.extension.isDelayWithdraw ? "Yes" : "No"}
            />
            <InfoItem
              label="Delay Time"
              value={orderDetails.extension.delayTime}
            />
            <InfoItem
              label="Start Time"
              value={orderDetails.extension.startTime}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
