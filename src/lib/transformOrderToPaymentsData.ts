import { IPaymentData } from "@/types/payment";
import { findBankCode, findPaymentMethodByType } from "./findBankCode";
import { OrderDetails } from "@/types/order";
import { formatBankAccountNumber } from "./helpers";

export const transformSingleOrderToPaymentData = (
  order: OrderDetails,
  accountName: string,
  accountNumber: string
): IPaymentData | undefined => {
  const term = order?.paymentTermList?.[0] || {};
  const paymentTypeFromTerm = term?.paymentType;

  const bankCodeEntry = findPaymentMethodByType(paymentTypeFromTerm);
  const bankCodeInfo =
    order?.bankCode ||
    findBankCode(term?.bankName)?.BANK_CODE ||
    bankCodeEntry?.BANK_CODE;

  if (!bankCodeInfo) {
    console.log("skipping", term.bankName);
    return; // Skip this order if no matching bank code is found
  }

  if (term?.realName) {
    // Check for non-Latin alphabets (including Cyrillic used in Russian/Ukrainian)
    if (
      !/^[a-zA-Z\s]+$/.test(term.realName) ||
      /[\u0400-\u04FF]/.test(term.realName)
    ) {
      console.log(
        "skipping user with non-English or Cyrillic name",
        term?.realName
      );
      return;
    }
  }

  const amountInKobo = Math.floor(Number(order?.amount) * 100);
  const parsedAmount = amountInKobo - (amountInKobo % 100);

  const paymentData: IPaymentData = {
    orderInfo: {
      orderId: `${order?.id}`,
      paymentType: `${term.paymentType}`,
      paymentId: `${term?.id}`,
    },
    paymentData: {
      BeneficiaryAccount: formatBankAccountNumber(term?.accountNo),
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
      SenderName: accountName,
    },
  };
  return paymentData;
};

export const transformOrderToPaymentData = (
  orders: OrderDetails[],
  accountName: string,
  accountNumber: string
): IPaymentData[] => {
  return orders
    .map((order) =>
      transformSingleOrderToPaymentData(order, accountName, accountNumber)
    )
    .filter(Boolean) as IPaymentData[];
};
