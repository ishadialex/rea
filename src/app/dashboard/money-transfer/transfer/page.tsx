"use client";

import { useState } from "react";
// import Toast from "@/components/Toast";

interface TransferDetails {
  email: string;
  amount: string;
  note: string;
}

const MoneyTransferPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({
    email: "",
    amount: "",
    note: "",
  });

  // Mock available balance
  const availableBalance = 25000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!transferDetails.email || !transferDetails.amount) {
      setToastMessage("Please fill in all required fields");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const amount = parseFloat(transferDetails.amount);
    if (amount <= 0) {
      setToastMessage("Amount must be greater than 0");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (amount > availableBalance) {
      setToastMessage("Insufficient balance");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);

    // Show success toast
    setToastMessage(`Successfully transferred $${amount.toLocaleString()} to ${transferDetails.email}`);
    setToastType("success");
    setShowToast(true);

    // Reset form
    setTransferDetails({
      email: "",
      amount: "",
      note: "",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
          Transfer Money
        </h1>
        <p className="mt-2 text-sm text-body-color dark:text-body-color-dark md:text-base">
          Send money to other users instantly via email
        </p>
      </div>

      {/* Available Balance */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-gradient-to-br from-primary/5 to-primary/10 p-4 dark:border-gray-800 dark:from-primary/10 dark:to-primary/20 md:mb-8 md:p-6">
        <p className="mb-1 text-sm text-body-color dark:text-body-color-dark">
          Available Balance
        </p>
        <p className="text-3xl font-bold text-black dark:text-white md:text-4xl">
          ${availableBalance.toLocaleString()}
        </p>
      </div>

      {/* Transfer Form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <div className="space-y-4">
            {/* Recipient Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Recipient Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={transferDetails.email}
                onChange={(e) => setTransferDetails({ ...transferDetails, email: e.target.value })}
                placeholder="recipient@example.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Enter the email address of the recipient
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0.01"
                max={availableBalance}
                step="0.01"
                value={transferDetails.amount}
                onChange={(e) => setTransferDetails({ ...transferDetails, amount: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Available: ${availableBalance.toLocaleString()}
              </p>
            </div>

            {/* Note (Optional) */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Note (Optional)
              </label>
              <textarea
                value={transferDetails.note}
                onChange={(e) => setTransferDetails({ ...transferDetails, note: e.target.value })}
                placeholder="Add a note for the recipient..."
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Add an optional message for the recipient
              </p>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
                Transfer Information:
              </h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instant transfer - funds available immediately
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No transfer fees
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Recipient will be notified via email
                </li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="mt-6 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? "Processing Transfer..." : "Transfer Money"}
          </button>
        </div>
      </form>

      {/* Recent Transfers */}
      <div className="mx-auto mt-8 max-w-2xl">
        <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
          Recent Transfers
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-dark">
          <div className="p-6 text-center">
            <svg
              className="mx-auto mb-3 h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <p className="text-sm text-body-color dark:text-body-color-dark">
              No recent transfers
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {/* {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )} */}
    </div>
  );
};

export default MoneyTransferPage;
