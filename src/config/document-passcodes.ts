// Document Access Passcodes Configuration
// To add or change passcodes, add them to the array below and they will be automatically hashed

/**
 * IMPORTANT: To update passcodes:
 * 1. Add your plain text passcodes to the PLAIN_PASSCODES array below
 * 2. Run the application and check the console for hashed values
 * 3. Copy the hashed values to the HASHED_PASSCODES array
 * 4. Clear the PLAIN_PASSCODES array for security
 *
 * Or simply replace the plain text codes here and the system will hash them automatically
 */

// Set your passcodes here (these will be hashed automatically)
export const DOCUMENT_PASSCODES = [
  "ACCESS2025",
  "ALVARADO123",
  "PROPERTY456",
  "INVEST789",
  "RENTAL2025",
  "ARBITRAGE99",
  "GOLDEN777",
  "UNITS2025",
  "DOCS4321",
  "SECURE888",
];

// Support contact info for users who need access codes
export const SUPPORT_INFO = {
  email: "info@alvaradoassociatepartners.com",
  phone: "(424) 519-5003",
  message: "Please contact our support team to obtain an access code for our documents.",
};
