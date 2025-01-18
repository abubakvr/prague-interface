export interface AdItem {
  id: string;
  accountId: string;
  userId: string;
  nickName: string;
  tokenId: string;
  currencyId: string;
  side: number;
  priceType: number;
  price: string;
  premium: string;
  lastQuantity: string;
  quantity: string;
  frozenQuantity: string;
  executedQuantity: string;
  minAmount: string;
  maxAmount: string;
  remark: string;
  status: number;
  createDate: string;
  payments: string[];
  tradingPerferenceSet: TradingPreferences;
  updateDate: string;
  feeRate: string;
  paymentPeriod: number;
  itemType: string;
  paymentTerms: PaymentTerm[];
}

export interface TradingPreferences {
  hasUnPostAd: string;
  isKyc: string;
  isEmail: string;
  isMobile: string;
  hasRegisterTime: string;
  registerTimeThreshold: string;
  orderFinishNumberDay30: string;
  completeRateDay30: string;
  nationalLimit: string;
  hasOrderFinishNumberDay30: string;
  hasCompleteRateDay30: string;
  hasNationalLimit: string;
}

export interface PaymentTerm {
  id: string;
  paymentType: string;
}

export interface AdsData {
  count: number;
  hiddenflag: boolean;
  items: AdItem[];
}
