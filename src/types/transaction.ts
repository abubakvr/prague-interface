export interface TransactionHistory {
  entryCode: string;
  referenceNumber: string;
  reversalReferenceNumber: string | null;
  accountNumber: string;
  linkedAccountNumber: string | null;
  realDate: string;
  amount: number;
  openingBalance: number;
  balanceAfter: number;
  narration: string;
  instrumentNumber: string;
  postingRecordType: number;
  postedBy: string;
  financialDate: string;
  financialDateToBackdate: string | null;
  ipAddress: string | null;
  merchant: string;
  recipientName: string | null;
  senderName: string | null;
  recipientBank: string | null;
  senderBank: string | null;
  userID: string | null;
  hasCOTWaiver: boolean;
  forceDebit: boolean;
  transactionType: string;
  postingType: number;
  transactionMethod: number;
  sessionId: string | null;
  charge: number;
  beneficiaryName: string;
  allowChangeCategory: boolean;
  categoryId: number;
  categorySet: boolean;
  tagId: number;
  beneficiaryReference: string;
  goalTitle: string | null;
  phoneNumberRecharged: string | null;
  billId: string | null;
  tier0Waiver: boolean;
  detailOfClosure: string | null;
  reasonForClosure: string | null;
  closedBy: string | null;
  metaData: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  message: string;
  data: {
    postingsHistory: TransactionHistory[];
    message: string | null;
    statusCode: string;
    totalRecordInStore: number;
    totalDebit: number;
    totalCredit: number;
  };
}

export interface TransactionHistoryParams {
  pageSize?: string;
  pageNumber?: string;
}
