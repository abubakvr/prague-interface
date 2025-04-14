// src/hooks/useBankMatcher.ts
import Fuse, { FuseResult } from "fuse.js";
import stringSimilarity from "string-similarity";
import { bankAliases, banks } from "./bankCodes";

// Define Bank type
interface Bank {
  BANK_NAME: string;
  BANK_CODE?: string;
}

// Helper: Normalize strings consistently
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

// Build a set of valid prefixes from bank names and aliases
const validPrefixes = new Set<string>();
const specialCases = new Map<string, Bank>();

// Create normalized bank name mapping for quick lookup
const normalizedBankNames = new Map<string, Bank>();

// Process banks for prefixes and create normalized name mappings
banks.forEach((bank: Bank) => {
  if (bank.BANK_NAME) {
    const normalized = normalize(bank.BANK_NAME);
    normalizedBankNames.set(normalized, bank);

    if (normalized.length >= 3) {
      validPrefixes.add(normalized.substring(0, 3));
    }
  }
});

// Process aliases for prefixes
Object.keys(bankAliases).forEach((alias: string) => {
  const normalized = normalize(alias);
  if (normalized.length >= 3) {
    validPrefixes.add(normalized.substring(0, 3));
  }
});

// Add additional known prefixes
validPrefixes.add("ace"); // For ACES bank
validPrefixes.add("gua"); // For Guaranty Trust Bank

// Setup Fuse.js for fuzzy search with strict options
const fuse = new Fuse(banks, {
  keys: ["name", "BANK_NAME"],
  threshold: 0.5, // Very strict threshold for high precision
  ignoreLocation: true,
  minMatchCharLength: 4, // Require longer matches
  distance: 100, // Consider the entire string
  useExtendedSearch: true,
  includeScore: true, // Ensure scores are included in results
});

// Collect all bank identifiers for similarity checking
const allBankIdentifiers: string[] = banks.map((bank: Bank) =>
  normalize(bank.BANK_NAME)
);
Object.keys(bankAliases).forEach((alias: string) => {
  allBankIdentifiers.push(normalize(alias));
});

/**
 * Match user input to a bank with high precision (99%)
 * @param {string} userInput - The user's input to match against bank names
 * @returns {Bank | null} - The matched bank or null if no clear match
 */
export function matchBank(userInput: string | undefined): Bank | null {
  // Handle empty inputs
  if (!userInput || userInput.trim() === "") {
    return null;
  }

  // Normalize the user input
  const normalizedInput = normalize(userInput);

  // Quick exact match check
  if (normalizedBankNames.has(normalizedInput)) {
    return normalizedBankNames.get(normalizedInput) || null;
  }

  // Check for special cases first
  if (specialCases.has(normalizedInput)) {
    return specialCases.get(normalizedInput) || null;
  }

  // Exact match with aliases
  const aliasMatch = Object.keys(bankAliases).find(
    (alias) => normalize(alias) === normalizedInput
  );
  if (aliasMatch) {
    const bankName =
      bankAliases[aliasMatch as keyof typeof bankAliases].BANK_NAME;
    return banks.find((bank) => bank.BANK_NAME === bankName) || null;
  }

  // Check if the first 3 letters are valid
  if (normalizedInput.length >= 3) {
    const firstThree = normalizedInput.substring(0, 3);
    if (!validPrefixes.has(firstThree)) {
      return null;
    }
  }

  // Exclude generic terms that might trigger false matches
  const genericTerms = ["bank", "banking", "ban", "banks", "banc", "bnk"];
  if (genericTerms.includes(normalizedInput)) {
    return null;
  }

  // Check for ambiguity using string similarity
  const similarityResults: { bankId: string; similarity: number }[] = [];
  for (const bankId of allBankIdentifiers) {
    // Skip comparing with itself
    if (bankId === normalizedInput) continue;

    const similarity = stringSimilarity.compareTwoStrings(
      normalizedInput,
      bankId
    );
    if (similarity > 0.7) {
      // High similarity threshold
      similarityResults.push({ bankId, similarity });
    }
  }

  // If we have multiple similar banks, consider it ambiguous
  if (similarityResults.length > 1) {
    // Sort by similarity score in descending order
    similarityResults.sort((a, b) => b.similarity - a.similarity);

    // If top matches are very close (within 0.05), consider it ambiguous
    if (
      similarityResults[0].similarity - similarityResults[1].similarity <
      0.05
    ) {
      return null; // Ambiguous match
    }

    // If the best match is below our precision threshold
    if (similarityResults[0].similarity < 0.99) {
      return null; // Not precise enough
    }
  }

  // Fuzzy search with strict settings
  const fuzzyResults = fuse.search(userInput) as FuseResult<Bank>[];

  // If no results, return null
  if (fuzzyResults.length === 0) {
    return null;
  }

  // Handle multiple results with strict confidence requirements
  if (fuzzyResults.length > 0) {
    // Calculate confidence based on score difference (lower score is better in Fuse.js)
    const scoreDifference =
      fuzzyResults.length > 1
        ? (fuzzyResults[1].score || 0) - (fuzzyResults[0].score || 0)
        : 0;

    // If scores are very close or first score isn't excellent, return null
    if (
      (fuzzyResults[0].score || 1) > 0.05 ||
      (fuzzyResults.length > 1 && scoreDifference < 0.3)
    ) {
      return null; // Not confident enough in the match
    }
  }

  // Double-check the top result with string similarity
  const topResult: Bank = fuzzyResults[0].item;
  const topName = normalize(topResult.BANK_NAME);
  const exactMatch = stringSimilarity.compareTwoStrings(
    normalizedInput,
    topName
  );

  // Only return match if similarity is very high (99% precision)
  if (exactMatch >= 0.99) {
    return topResult;
  }

  // One more check - if input is fully contained in bank name and the input is sufficiently long
  if (topName.includes(normalizedInput) && normalizedInput.length >= 5) {
    return topResult;
  }

  // Not precise enough, return null
  return null;
}
