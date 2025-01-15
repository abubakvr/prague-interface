import crypto from "node:crypto";
import axios from "axios";
import "dotenv/config";

const apiKey = process.env.BYBIT_API_KEY;
const secret = process.env.BYBIT_SECRET_KEY;
const recvWindow = 5000;

if (!apiKey || !secret) {
  throw new Error(
    "Missing BYBIT_API_KEY or BYBIT_SECRET_KEY in environment variables"
  );
}

interface BalanceResponse {
  ret_code: number;
  ret_msg: string;
  result: {
    [coin: string]: {
      available: string;
      frozen: string;
    };
  };
  ext_code?: string;
  ext_info?: string;
  time_now?: string;
}

function generateSignature(
  secret: string,
  timestamp: string,
  parameters: string
): string {
  return crypto
    .createHmac("sha256", secret)
    .update(timestamp + apiKey + recvWindow + parameters)
    .digest("hex");
}

export async function GET() {
  try {
    const endpoint = "/v5/asset/transfer/query-account-coins-balance";
    const queryParams = new URLSearchParams({
      accountType: "FUND",
      coin: "USDT",
    }).toString();
    const timestamp = Date.now().toString();
    const url = `https://api.bybit.com${endpoint}?${queryParams}`;
    const sign = generateSignature(secret!, timestamp, queryParams);
    const headers = {
      "X-BAPI-SIGN-TYPE": "2",
      "X-BAPI-SIGN": sign,
      "X-BAPI-API-KEY": apiKey!,
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recvWindow.toString(),
    };

    const response = await axios.get(url, { headers });

    if (!response.data) {
      console.error(`Error response: ${JSON.stringify(response)}`);
      return new Response(JSON.stringify({ error: "API request failed" }), {
        status: response.status || 500,
      });
    }

    const data: BalanceResponse = response.data;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching balance:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
