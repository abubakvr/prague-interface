// app/api/generate-csv/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getOrdersServerSide } from "@/lib/server/getOrders";
import { BASE_URL } from "@/lib/constants";
import { findBankCode } from "@/lib/findBankCode";

// Function to transform order data into payment data
const transformOrderToPaymentData = (orders: any[]) => {
  return orders
    .map((order) => {
      const term = order?.result?.paymentTermList?.[0] || {};
      const bankCodeInfo = findBankCode(term?.bankName);

      if (!bankCodeInfo) {
        return null; // Skip this order if no matching bank code is found
      }

      return {
        orderInfo: {
          orderId: order?.result?.id,
          paymentId: term?.id,
          paymentType: `${term.paymentType}`,
        },
        paymentData: {
          BeneficiaryAccount: term?.accountNo,
          beneficiaryBankCode: bankCodeInfo?.BANK_CODE,
          amount: Number(order?.result?.amount) * 100,
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
          ClientFeeCharge: "10", //  hardcoded value
          SenderName: "Abubakar Ibrahim", //  hardcoded value
        },
      };
    })
    .filter(Boolean);
};

// Function to make a bulk payment
const makeBulkPayment = async (
  paymentDataArray: any[],
  token: string
): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/api/payment/make-bulk-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentDataArray }),
    });
    if (!response.ok) {
      console.error("Payment API error:", response);
      throw new Error(
        `Payment API failed with status: ${response.status} and message: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error("Payment API error:", error);
    throw new Error(`Failed to make bulk payment: ${error.message}`);
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return new NextResponse("Missing token", { status: 400 });
    }

    const orders = await getOrdersServerSide({ token });
    console.log(orders);
    const userPaymentData = transformOrderToPaymentData(orders);
    console.log(userPaymentData);

    try {
      const paymentResponse = await makeBulkPayment(userPaymentData, token);
      return NextResponse.json({ data: paymentResponse }, { status: 200 });
    } catch (paymentError: any) {
      return NextResponse.json(
        { error: paymentError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("CSV generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV: " + error.message },
      { status: 500 }
    );
  }
}
