export enum OrderStatus {
  WAITING_FOR_CHAIN = 5,
  WAITING_FOR_BUY_PAY = 10,
  WAITING_FOR_SELLER_RELEASE = 20,
  APPEALING = 30,
  CANCEL_ORDER = 40,
  FINISH_ORDER = 50,
  PAYING = 60,
  PAY_FAIL = 70,
  EXCEPTION_CANCELED = 80,
  WAITING_BUYER_SELECT_TOKEN = 90,
  OBJECTING = 100,
  WAITING_FOR_OBJECTION = 110,
}

export enum OrderType {
  ORIGIN = "ORIGIN",
  SMALL_COIN = "SMALL_COIN",
  WEB3 = "WEB3",
}

export interface OrderExtension {
  isDelayWithdraw: boolean;
  delayTime: string;
  startTime: string;
}

export interface OrderItem {
  id: string;
  side: number;
  tokenId: string;
  orderType: OrderType;
  amount: string;
  currencyId: string;
  price: string;
  fee: string;
  targetNickName: string;
  targetUserId: string;
  status: OrderStatus;
  createDate: string;
  transferLastSeconds: string;
  userId: string;
  sellerRealName: string;
  buyerRealName: string;
  extension: OrderExtension;
}

export interface OrderListResponse {
  count: number;
  items: OrderItem[];
}
