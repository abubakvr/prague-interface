export interface UserProfile {
  nickName: string;
  defaultNickName: boolean;
  isOnline: boolean;
  kycLevel: string;
  email: string;
  mobile: string;
  lastLogoutTime: string;
  recentRate: string;
  totalFinishCount: number;
  totalFinishSellCount: number;
  totalFinishBuyCount: number;
  recentFinishCount: number;
  averageReleaseTime: string;
  averageTransferTime: string;
  accountCreateDays: number;
  firstTradeDays: number;
  realName: string;
  recentTradeAmount: string;
  totalTradeAmount: string;
  registerTime: string;
  authStatus: number;
  kycCountryCode: string;
  blocked: string;
  isActive: boolean;
  goodAppraiseRate: string;
  goodAppraiseCount: number;
  badAppraiseCount: number;
  vipLevel: number;
  userId: string;
  realNameEn?: string;
}

export enum PaymentType {
  BANK_TRANSFER = 1,
  ALIPAY = 2,
  WECHAT = 3,
}

export interface PaymentMethod {
  id: string;
  realName: string;
  paymentType: PaymentType;
  bankname?: string;
  branch_name?: string;
  account_no?: string;
  qrcode?: string;
  online: string;
}
