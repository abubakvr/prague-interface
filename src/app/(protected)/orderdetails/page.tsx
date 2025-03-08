"use client";

import { getOrderDetails } from "@/hooks/useOrders";
import { getStatusText } from "@/lib/helpers";
import { OrderDetails } from "@/types/order";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineCreditCard,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineClock,
} from "react-icons/hi";

export default function Page() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (orderId) {
        setLoading(true);
        try {
          const data = await getOrderDetails(orderId);
          setOrderDetails(data);
        } catch (error) {
          console.error("Error fetching order details:", error);
          // Handle error appropriately, maybe set an error state
        } finally {
          setLoading(false);
        }
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (loading || !orderDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-3"></div>
          <div className="text-blue-600 font-medium">
            Loading order details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl shadow-sm">
        <Link
          href="/orders"
          className="p-2 bg-white rounded-full hover:bg-blue-200 transition-all duration-300 shadow-sm hover:shadow-md mr-4"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-blue-700" />
        </Link>
        <h1 className="text-2xl font-bold text-blue-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
          Order Details
        </h1>
        <div className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-200">
          ID: {orderDetails.id.substring(0, 8)}...
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {orderDetails.paymentTermList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center">
              <HiOutlineCreditCard className="w-7 h-7 text-white mr-3" />
              <h2 className="text-xl font-bold text-white">
                Payment Information
              </h2>
            </div>
            <div className="p-5 space-y-5">
              {orderDetails.paymentTermList.map((term, index) => (
                <div
                  key={term.id}
                  className="border border-blue-200 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                >
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                      {index + 1}
                    </span>
                    Payment Method
                  </h3>
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
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center">
            <HiOutlineCurrencyDollar className="w-7 h-7 text-white mr-3" />
            <h2 className="text-xl font-bold text-white">Trade Details</h2>
          </div>
          <div className="p-5 space-y-3 bg-gradient-to-b from-blue-50 to-white">
            <InfoItem
              label="Token"
              value={`${orderDetails.quantity} ${orderDetails.tokenId}`}
              highlight
            />
            <InfoItem
              label="Price"
              value={`${orderDetails.price} ${orderDetails.currencyId}`}
              highlight
            />
            <InfoItem
              label="Amount"
              value={`${orderDetails.amount} ${orderDetails.currencyId}`}
              highlight
            />
            <InfoItem label="Maker Fee" value={orderDetails.makerFee} />
            <InfoItem label="Taker Fee" value={orderDetails.takerFee} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center">
            <HiOutlineUserGroup className="w-7 h-7 text-white mr-3" />
            <h2 className="text-xl font-bold text-white">User Information</h2>
          </div>
          <div className="p-5 space-y-3 bg-gradient-to-b from-blue-50 to-white">
            <InfoItem label="Buyer" value={orderDetails.buyerRealName} />
            <InfoItem label="Seller" value={orderDetails.sellerRealName} />
            <InfoItem
              label="Target User Type"
              value={orderDetails.targetUserType}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center">
            <HiOutlineDocumentText className="w-7 h-7 text-white mr-3" />
            <h2 className="text-xl font-bold text-white">Order Information</h2>
          </div>
          <div className="p-5 space-y-3 bg-gradient-to-b from-blue-50 to-white">
            <InfoItem label="Order ID" value={orderDetails.id} />
            <InfoItem
              label="Type"
              value={orderDetails.side === 0 ? "BUY" : "SELL"}
            />
            <InfoItem
              label="Status"
              value={getStatusText(orderDetails.status)}
              statusHighlight
              status={orderDetails.status}
            />
            <InfoItem label="Order Type" value={orderDetails.orderType} />
            <InfoItem label="Created" value={orderDetails.createDate} />
            {orderDetails.transferDate && (
              <InfoItem
                label="Transfer Date"
                value={orderDetails.transferDate}
              />
            )}
          </div>
        </div>

        {orderDetails.extension && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 md:col-span-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex items-center">
              <HiOutlineClock className="w-7 h-7 text-white mr-3" />
              <h2 className="text-xl font-bold text-white">
                Extension Information
              </h2>
            </div>
            <div className="p-5 space-y-3 bg-gradient-to-b from-blue-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  highlight = false,
  statusHighlight = false,
  status,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  statusHighlight?: boolean;
  status?: number;
}) {
  const getStatusColor = (status: number) => {
    switch (status) {
      case 50:
        return "text-green-600 bg-green-100"; // Completed
      case 40:
        return "text-red-600 bg-red-100"; // Cancelled
      case 10:
        return "text-yellow-600 bg-yellow-100"; // Waiting for Payment
      case 20:
        return "text-blue-600 bg-blue-100"; // Waiting for Seller Release
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col mb-3">
      <span className="text-sm text-blue-600 font-medium mb-1">{label}</span>
      {statusHighlight && status ? (
        <span
          className={`font-semibold px-3 py-1 rounded-full inline-block ${getStatusColor(
            status
          )}`}
        >
          {value}
        </span>
      ) : highlight ? (
        <span className="font-bold text-blue-900 text-lg">{value}</span>
      ) : (
        <span className="font-medium text-blue-800">{value}</span>
      )}
    </div>
  );
}
