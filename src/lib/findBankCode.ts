import { banks, Bank, paymentMethods } from "./bankCodes";

function findBanksStartingWith(userInput: string): Bank[] {
  const normalizedInput = normalize(userInput);
  return banks.filter((bank: Bank) => {
    const normalizedName = normalize(bank.BANK_NAME);
    return normalizedName.startsWith(normalizedInput);
  });
}

// Normalize text
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Get initials like "gtb"
function getInitials(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toLowerCase();
}

// Create aliases
function buildAliasMap(bank: Bank): string[] {
  const fullNameNorm = normalize(bank.BANK_NAME);
  const noSuffix = normalize(
    bank.BANK_NAME.replace(/(bank|plc|limited|ltd)/gi, "")
  );
  const initials = getInitials(bank.BANK_NAME);
  const words = bank.BANK_NAME.split(/\s+/).map(normalize);

  return Array.from(new Set([fullNameNorm, noSuffix, initials, ...words]));
}

function matchByAlias(input: string): Bank | null {
  const normalizedInput = normalize(input);
  const matches: Bank[] = [];

  for (let i = 0; i < banks.length; i++) {
    const bank = banks[i];
    const aliases = buildAliasMap(bank);
    if (aliases.includes(normalizedInput)) {
      matches.push(bank);
    }
  }

  return matches.length === 1 ? matches[0] : null;
}

// Main function
export function findBankCode(userInput: string | undefined): Bank | null {
  if (!userInput || userInput.trim() === "") return null;

  const words = userInput.trim().split(/\s+/);
  const firstKeyword = words[0];
  const fullPhrase = words.join(" ");

  // Step 1: Match using first keyword
  const matchFirst = findBanksStartingWith(firstKeyword);
  if (matchFirst.length === 1) {
    return matchFirst[0];
  }

  // Step 2: Match using full phrase
  const matchFull = findBanksStartingWith(fullPhrase);
  if (matchFull.length === 1) {
    return matchFull[0];
  }

  // Step 3: Alias fallback
  const matchAlias = matchByAlias(fullPhrase);
  if (matchAlias) return matchAlias;

  // ✅ Step 4: Remove "bank" from input and try alias match again
  const cleanedInput = userInput.replace(/(bank|plc|limited|ltd)/gi, "").trim();
  if (cleanedInput) {
    const aliasMatchCleaned = matchByAlias(cleanedInput);
    if (aliasMatchCleaned) {
      return aliasMatchCleaned;
    }
  }

  return null;
}

export const findPaymentMethodByType = (paymentType: number | undefined) => {
  if (!paymentType) {
    return;
  }
  return paymentMethods.find((method) => method.PAYMENT_TYPE === paymentType);
};
