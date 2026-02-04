# Document Passcode Configuration

This directory contains the configuration for document access passcodes.

## How to Change Passcodes

To update or change the document access passcodes:

1. Open the file: `src/config/document-passcodes.ts`

2. Edit the `DOCUMENT_PASSCODES` array:
   ```typescript
   export const DOCUMENT_PASSCODES = [
     "YOUR_CODE_1",
     "YOUR_CODE_2",
     "YOUR_CODE_3",
     // ... add up to 10 codes
   ];
   ```

3. Save the file. The changes will take effect immediately.

## Current Passcodes

The system currently supports 10 passcodes. Users can use any of these codes to access the documents.

**Default codes (CHANGE THESE!):**
- ACCESS2025
- ALVARADO123
- PROPERTY456
- INVEST789
- RENTAL2025
- ARBITRAGE99
- GOLDEN777
- UNITS2025
- DOCS4321
- SECURE888

## Support Contact Information

You can also update the support contact information that users see when they don't have an access code:

```typescript
export const SUPPORT_INFO = {
  email: "info@goldenunits.com",
  phone: "(424) 519-5003",
  message: "Please contact our support team to obtain an access code for our documents.",
};
```

## Security Features

- Passcodes are case-insensitive
- Access is verified and stored in the browser's session storage
- Verification expires after 24 hours
- Users must re-enter the passcode after their session expires
- The modal prevents direct access to PDFs without verification

## Testing

After updating passcodes, test by:
1. Clearing your browser's session storage (Developer Tools > Application > Session Storage > Clear)
2. Clicking on any PDF in the Documents menu
3. Entering one of your new passcodes
4. Verifying the document opens successfully
