import { useCallback } from "react";
import { banks } from "@/lib/bankCodes";

export function useBankMapping() {
  const findBankNameByCode = useCallback((bankCode: string): string => {
    if (!bankCode) return "N/A";

    const bank = banks.find((bank) => bank.BANK_CODE === bankCode);
    return bank ? bank.BANK_NAME : bankCode; // Return bank name if found, otherwise return the code
  }, []);

  return {
    findBankNameByCode,
  };
}
