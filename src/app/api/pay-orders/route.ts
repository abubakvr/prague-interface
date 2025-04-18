// app/api/generate-csv/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getOrdersServerSide } from "@/lib/server/getOrders";
import { BASE_URL } from "@/lib/constants";
import { transformOrderToPaymentData } from "@/lib/transformOrderToPaymentsData";

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
    const userPaymentData = transformOrderToPaymentData(orders, "");
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
