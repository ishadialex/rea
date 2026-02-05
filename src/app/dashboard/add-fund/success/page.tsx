"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method") as "bank" | "card" | "crypto" | null;

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
        return "Your bank transfer deposit request has been received. You'll receive an email with our bank account details to complete the transfer.";
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
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-800 dark:bg-black/20">
              <h3 className="mb-3 font-semibold text-black dark:text-white">
                Bank Account Details:
              </h3>
              <div className="space-y-2 text-sm text-body-color dark:text-body-color-dark">
                <p>
                  <strong>Bank Name:</strong> Alvarado Associates Bank
                </p>
                <p>
                  <strong>Account Name:</strong> Alvarado Associates Partners
                </p>
                <p>
                  <strong>Account Number:</strong> 1234567890
                </p>
                <p>
                  <strong>Routing Number:</strong> 021000021
                </p>
                <p>
                  <strong>SWIFT Code:</strong> ALVAUS33
                </p>
              </div>
              <div className="mt-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Please include your account email or ID as the transfer reference.
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 md:w-auto"
          >
            Return to Dashboard
          </button>
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
