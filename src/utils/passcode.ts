import { DOCUMENT_PASSCODES } from "@/config/document-passcodes";

/**
 * Verifies if the provided passcode matches any of the valid passcodes
 * @param passcode - The passcode to verify
 * @returns boolean - True if passcode is valid, false otherwise
 */
export function verifyPasscode(passcode: string): boolean {
  if (!passcode) return false;

  // Convert to uppercase for case-insensitive comparison
  const normalizedPasscode = passcode.trim().toUpperCase();

  // Check if the passcode matches any of the valid passcodes
  return DOCUMENT_PASSCODES.some(
    (validCode) => validCode.toUpperCase() === normalizedPasscode
  );
}

/**
 * Stores the verified passcode in session storage
 * This allows access during the current browser session
 */
export function storeVerifiedAccess(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("document_access_verified", "true");
    sessionStorage.setItem("document_access_time", Date.now().toString());
  }
}

/**
 * Checks if the user has been verified in the current session
 * Verification expires after 24 hours
 */
export function hasVerifiedAccess(): boolean {
  if (typeof window === "undefined") return false;

  const verified = sessionStorage.getItem("document_access_verified");
  const verifiedTime = sessionStorage.getItem("document_access_time");

  if (!verified || !verifiedTime) return false;

  // Check if verification is still valid (24 hours)
  const timeElapsed = Date.now() - parseInt(verifiedTime);
  const twentyFourHours = 24 * 60 * 60 * 1000;

  if (timeElapsed > twentyFourHours) {
    // Clear expired verification
    sessionStorage.removeItem("document_access_verified");
    sessionStorage.removeItem("document_access_time");
    return false;
  }

  return true;
}

/**
 * Clears the verified access (logout)
 */
export function clearVerifiedAccess(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("document_access_verified");
    sessionStorage.removeItem("document_access_time");
  }
}
