// Main Component
"use client";
import { useGetOrders } from "@/hooks/useGetBuyDetails";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  Modal,
} from "./components/LoadingState";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrdersTableUI } from "./components/OrdersTableUI";
import { findBankCode } from "@/lib/findBankCode";
import { OrderDetails } from "@/types/order";
import { Bank } from "@/lib/bankCodes";
import { handlePayAllOrders } from "./components/OrderActions";

interface ModalState {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "";
}

export default function OrdersTable() {
  const { data, isLoading, error, refetch } = useGetOrders({
    page: 1,
    size: 30,
  });

  const [modal, setModal] = useState<ModalState>({
    open: false,
    message: "",
    type: "",
  });
  const [markingPaidOrderId, setMarkingPaidOrderId] = useState<string | null>(
    null
  );
  const [selectedBanks, setSelectedBanks] = useState<{
    [orderId: string]: Bank | undefined;
  }>({});
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [exportableOrders, setExportableOrders] = useState<OrderDetails[]>([]);
  const [payAllLoading, setPayAllLoading] = useState<boolean>(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Clone the data to avoid direct mutation
      setOrders([...data]);
      // Initialize exportableOrders with the original data
      setExportableOrders(
        data.map((order) => {
          const paymentList = order.paymentTermList || [];
          const paymentTerm = paymentList.length > 0 ? paymentList[0] : null;
          return {
            ...order,
            bankCode: findBankCode(paymentTerm?.bankName)?.BANK_CODE || "N/A",
          };
        })
      );
    }
  }, [data]);

  const handleBankSelect = (orderId: string, selectedBank: Bank) => {
    // Implementation unchanged
    setSelectedBanks((prevSelectedBanks) => ({
      ...prevSelectedBanks,
      [orderId]: selectedBank,
    }));

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order };
          if (
            !updatedOrder.paymentTermList ||
            updatedOrder.paymentTermList.length === 0
          ) {
            updatedOrder.paymentTermList = updatedOrder.paymentTermList.map(
              (paymentTerm) => ({
                ...paymentTerm, // Keep all existing properties
                bankName: selectedBank.BANK_NAME,
              })
            );
          }
          return updatedOrder;
        }
        return order;
      })
    );

    setExportableOrders((prevExportableOrders) =>
      prevExportableOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            bankCode: selectedBank.BANK_CODE,
          };
        }
        return order;
      })
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} refetch={refetch} />;
  }

  return (
    <div className="rounded-xl shadow-lg">
      <Toaster />

      {modal.open && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ open: false, message: "", type: "" })}
        />
      )}

      {orders.length > 0 ? (
        <>
          <OrdersHeader
            ordersCount={orders.length}
            refetch={refetch}
            handlePayAllOrders={() =>
              handlePayAllOrders(exportableOrders, setPayAllLoading, refetch)
            }
            payAllLoading={payAllLoading}
          />

          <OrdersTableUI
            orders={orders}
            selectedBanks={selectedBanks}
            handleBankSelect={handleBankSelect}
            markingPaidOrderId={markingPaidOrderId}
            setMarkingPaidOrderId={setMarkingPaidOrderId}
            payingOrderId={payingOrderId}
            setPayingOrderId={setPayingOrderId}
            refetch={refetch}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
