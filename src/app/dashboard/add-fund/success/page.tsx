"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method") as "bank" | "card" | "crypto" | null;
  const amount = searchParams.get("amount");
  const email = searchParams.get("email");

  const getMethodTitle = () => {
    switch (method) {
      case "bank":
        return "Bank Transfer Deposit Submitted!";
      case "card":
        return "Card Payment Successful!";
      case "crypto":
        return "Cryptocurrency Deposit Submitted!";
      default:
        return "Deposit Submitted!";
    }
  };

  const getMethodDescription = () => {
    switch (method) {
      case "bank":
        return `Your bank transfer deposit request for $${amount ? parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"} has been received. Bank account details have been sent to ${email || "your email"}.`;
      case "card":
        return "Your card payment has been processed successfully. Your funds are now available in your account.";
      case "crypto":
        return "Your cryptocurrency deposit request has been received. You'll receive an email with the wallet address and QR code to complete the deposit.";
      default:
        return "Your deposit request has been submitted successfully.";
    }
  };

  const getProcessingInfo = () => {
    switch (method) {
      case "bank":
        return "Bank transfers typically take 1-3 business days to process. You'll receive a confirmation email once we receive your transfer.";
      case "card":
        return "Card payments are processed instantly. Your funds are now available in your account.";
      case "crypto":
        return "Cryptocurrency deposits are confirmed after the required network confirmations (usually 10-30 minutes). We'll notify you once complete.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg dark:border-gray-800 dark:bg-gray-dark md:p-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white md:text-3xl">
            {getMethodTitle()}
          </h2>
          <p className="mb-6 text-body-color dark:text-body-color-dark">
            {getMethodDescription()}
          </p>

          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Processing Time:</strong> {getProcessingInfo()}
            </p>
          </div>

          {method === "bank" && (
            <>
              {/* Request Summary */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-800 dark:bg-black/20">
                <h3 className="mb-3 font-semibold text-black dark:text-white">
                  Request Summary:
                </h3>
                <div className="space-y-2 text-sm text-body-color dark:text-body-color-dark">
                  <div className="flex justify-between">
                    <span>Deposit Amount:</span>
                    <span className="font-semibold text-black dark:text-white">
                      ${amount ? parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-semibold text-black dark:text-white">
                      {email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-black dark:text-white">
                      Bank Transfer
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      Pending Transfer
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-left dark:border-green-800 dark:bg-green-900/20">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-800 dark:text-green-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Next Steps:
                </h3>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-green-700 dark:text-green-400">
                  <li>Check your email ({email}) for the invoice with bank account details</li>
                  <li>Transfer exactly ${amount ? parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"} to the bank account in the invoice</li>
                  <li>Include your reference number from the email in the transfer description</li>
                  <li>Wait 1-3 business days for funds to be credited</li>
                </ol>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Return to Dashboard
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/transaction")}
              className="w-full rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:w-auto"
            >
              View Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-body-color dark:text-body-color-dark">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
