import { useState } from "react";
import { BASE_URL } from "@/lib/constants";

interface PaidOrder {
  id: number;
  order_id: string;
  user_id: string;
  amount: string | number;
  seller_name: string;
  status: boolean | string;
  payment_time: string;
  updated_at: string;
  user_email: string;
  user_name: string;
  transaction_reference: string;
  beneficiary_bank: string;
}

interface TransactionStatusResponse {
  success: boolean;
  message: string;
  data?: {
    responseCode: string;
    sessionID: string;
    status: boolean;
    message: string;
    data: any;
  };
  error?: string;
}

export function useTransactionStatus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaidOrder | null>(null);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatusResponse | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const checkTransactionStatus = async (order: PaidOrder) => {
    if (!order.transaction_reference) {
      alert("No transaction reference available for this order");
      return;
    }

    setSelectedTransaction(order);
    setIsModalOpen(true);
    setIsCheckingStatus(true);
    setTransactionStatus(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${BASE_URL}/api/payment/transaction-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isThirdPartyBankTransfer: false, // Assuming intra-bank for now
            transactionRequestReference: order.transaction_reference,
          }),
        }
      );

      const result: TransactionStatusResponse = await response.json();
      setTransactionStatus(result);
    } catch (err: any) {
      setTransactionStatus({
        success: false,
        message: "Failed to check transaction status",
        error: err.message || "Network error occurred",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setTransactionStatus(null);
    setIsCheckingStatus(false);
  };

  return {
    isModalOpen,
    selectedTransaction,
    transactionStatus,
    isCheckingStatus,
    checkTransactionStatus,
    closeModal,
  };
}
