import { IPaymentData } from "@/types/payment";
import { findBankCode } from "./findBankCode";
import { OrderDetails } from "@/types/order";

export const transformSingleOrderToPaymentData = (
  order: OrderDetails,
  accountNumber: string
): IPaymentData | undefined => {
  const term = order?.paymentTermList?.[0] || {};
  console.log(order?.bankCode);

  const bankCodeInfo =
    order?.bankCode || findBankCode(term?.bankName)?.BANK_CODE;

  if (!bankCodeInfo) {
    console.log("skipping", term.bankName);
    return; // Skip this order if no matching bank code is found
  }

  const amountInKobo = Math.round(Number(order?.amount) * 100);
  const remainder = amountInKobo % 100;
  const parsedAmount = amountInKobo + (remainder > 0 ? 100 - remainder : 0);

  const paymentData: IPaymentData = {
    orderInfo: {
      orderId: `${order?.id}`,
      paymentType: `${term.paymentType}`,
      paymentId: `${term?.id}`,
    },
    paymentData: {
      BeneficiaryAccount: (term?.accountNo || "").trim(),
      beneficiaryBankCode: bankCodeInfo?.trim(),
      amount: `${parsedAmount}`,
      ClientAccountNumber: accountNumber,
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
  orders: OrderDetails[],
  accountNumber: string
): IPaymentData[] => {
  return orders
    .map((order) => transformSingleOrderToPaymentData(order, accountNumber))
    .filter(Boolean) as IPaymentData[];
};
