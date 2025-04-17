export interface OrderPaymentInfo {
  orderId: string;
  paymentType: string;
  paymentId: string;
}

export interface TransferItem {
  BeneficiaryAccount: string;
  beneficiaryBankCode: string;
  amount: string;
  ClientAccountNumber: string;
  beneficiaryName: string;
  narration: string;
  ClientFeeCharge?: string;
  SenderName?: string;
}

export interface IPaymentData {
  orderInfo: OrderPaymentInfo;
  paymentData: TransferItem;
}
