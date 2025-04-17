import { IPaymentData } from "@/types/payment";
import { findBankCode } from "./findBankCode";
import { OrderDetails } from "@/types/order";

export const transformSingleOrderToPaymentData = (
  order: OrderDetails
): IPaymentData | undefined => {
  const term = order?.paymentTermList?.[0] || {};
  const bankCodeInfo =
    order?.bankCode || findBankCode(term?.bankName)?.BANK_CODE;

  if (!bankCodeInfo) {
    console.log("skipping", term.bankName);
    return; // Skip this order if no matching bank code is found
  }

  const parsedAmount = Math.ceil(Number(order?.amount) * 100);

  const paymentData: IPaymentData = {
    orderInfo: {
      orderId: order?.id,
      paymentId: term?.id,
      paymentType: `${term.paymentType}`,
    },
    paymentData: {
      BeneficiaryAccount: (term?.accountNo || "").trim(),
      beneficiaryBankCode: bankCodeInfo?.trim(),
      amount: `${parsedAmount}`,
      ClientAccountNumber: "3002466436",
      beneficiaryName: term?.realName,
      narration: `Payment for goods on ${new Date().toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )}`,
      ClientFeeCharge: "0", //  hardcoded value
      SenderName: "Abubakar Ibrahim", //  hardcoded value
    },
  };
  return paymentData;
};

export const transformOrderToPaymentData = (
  orders: OrderDetails[]
): IPaymentData[] => {
  return orders
    .map((order) => transformSingleOrderToPaymentData(order))
    .filter(Boolean) as IPaymentData[];
};
