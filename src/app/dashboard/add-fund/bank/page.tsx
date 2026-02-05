"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "amount" | "email" | "confirm";

const BankTransferPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("amount");
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  const minDeposit = 100;
  const maxDeposit = 10000000;

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount >= minDeposit && numAmount <= maxDeposit) {
      setCurrentStep("email");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setCurrentStep("confirm");
    }
  };

  const handleFinalSubmit = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Navigate to success page with parameters
    router.push(
      `/dashboard/add-fund/success?method=bank&amount=${amount}&email=${encodeURIComponent(email)}`
    );
  };

  const goBack = () => {
    if (currentStep === "email") {
      setCurrentStep("amount");
    } else if (currentStep === "confirm") {
      setCurrentStep("email");
    }
  };

  const steps = [
    { key: "amount", label: "Amount" },
    { key: "email", label: "Email" },
    { key: "confirm", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4 md:mb-8">
        <Link
          href="/dashboard/add-fund"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
        >
          <svg
            className="h-5 w-5 text-black dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Bank Transfer Deposit
          </h1>
          <p className="mt-1 text-sm text-body-color dark:text-body-color-dark md:text-base">
            {currentStep === "amount" && "Enter the amount you wish to deposit"}
            {currentStep === "email" && "Enter your email to receive bank details"}
            {currentStep === "confirm" && "Review and confirm your deposit request"}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                    index <= currentStepIndex
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    index <= currentStepIndex
                      ? "text-primary"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-1 flex-1 rounded ${
                    index < currentStepIndex
                      ? "bg-primary"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-dark md:p-6">
          {/* Step 1: Amount */}
          {currentStep === "amount" && (
            <form onSubmit={handleAmountSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                    Deposit Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    min={minDeposit}
                    max={maxDeposit}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                    Min: ${minDeposit.toLocaleString()} | Max: ${maxDeposit.toLocaleString()}
                  </p>
                </div>

                {/* Info Box */}
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
                    How Bank Transfer Works:
                  </h3>
                  <ol className="list-decimal space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-400">
                    <li>Submit your deposit request with the desired amount</li>
                    <li>You&apos;ll receive an email with our bank account details</li>
                    <li>Transfer the exact amount from your bank account</li>
                    <li>Funds will be credited within 1-3 business days</li>
                  </ol>
                </div>

                {/* Benefits */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black/20">
                  <h3 className="mb-2 text-sm font-semibold text-black dark:text-white">
                    Benefits:
                  </h3>
                  <ul className="space-y-1 text-sm text-body-color dark:text-body-color-dark">
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      No processing fees
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Secure and verified transactions
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Higher deposit limits
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Email */}
          {currentStep === "email" && (
            <form onSubmit={handleEmailSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                    We&apos;ll send the bank account details to this email address
                  </p>
                </div>

                {/* Info Box */}
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                        What you&apos;ll receive:
                      </h3>
                      <ul className="mt-1 space-y-1 text-sm text-blue-800 dark:text-blue-400">
                        <li>• Complete bank account details</li>
                        <li>• Transfer instructions</li>
                        <li>• Your unique reference number</li>
                        <li>• Deposit confirmation once received</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Confirm */}
          {currentStep === "confirm" && (
            <div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Review Your Deposit Request
                </h3>

                {/* Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body-color dark:text-body-color-dark">
                        Deposit Amount
                      </span>
                      <span className="text-lg font-bold text-black dark:text-white">
                        ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body-color dark:text-body-color-dark">
                        Email Address
                      </span>
                      <span className="font-medium text-black dark:text-white">
                        {email}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body-color dark:text-body-color-dark">
                        Payment Method
                      </span>
                      <span className="font-medium text-black dark:text-white">
                        Bank Transfer
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body-color dark:text-body-color-dark">
                        Processing Fee
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        Free
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body-color dark:text-body-color-dark">
                        Processing Time
                      </span>
                      <span className="font-medium text-black dark:text-white">
                        1-3 Business Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                        Important
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                        Please ensure you transfer the exact amount. Include your reference number in the transfer description to avoid delays.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isProcessing}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isProcessing}
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankTransferPage;
