"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CryptoDetails {
  cryptoType: string;
  amount: string;
}

const CryptoPaymentPage = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({
    cryptoType: "BTC",
    amount: "",
  });

  const minDeposit = 100;
  const maxDeposit = 10000000;

  const cryptoOptions = [
    { value: "BTC", label: "Bitcoin (BTC)", network: "Bitcoin Network" },
    { value: "ETH", label: "Ethereum (ETH)", network: "Ethereum Network" },
    { value: "USDT", label: "Tether (USDT)", network: "ERC20/TRC20" },
    { value: "USDC", label: "USD Coin (USDC)", network: "ERC20" },
  ];

  const selectedCrypto = cryptoOptions.find((opt) => opt.value === cryptoDetails.cryptoType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Navigate to success page with method parameter
    router.push("/dashboard/add-fund/success?method=crypto");
  };

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
            Cryptocurrency Deposit
          </h1>
          <p className="mt-1 text-sm text-body-color dark:text-body-color-dark md:text-base">
            Deposit using your preferred cryptocurrency
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <div className="space-y-4">
            {/* Cryptocurrency Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Select Cryptocurrency
              </label>
              <div className="relative">
                <select
                  value={cryptoDetails.cryptoType}
                  onChange={(e) => setCryptoDetails({ ...cryptoDetails, cryptoType: e.target.value })}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                >
                  {cryptoOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-white text-black dark:bg-gray-800 dark:text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Network: {selectedCrypto?.network}
              </p>
            </div>

            {/* Amount */}
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
                value={cryptoDetails.amount}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, amount: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Min: ${minDeposit.toLocaleString()} | Max: ${maxDeposit.toLocaleString()}
              </p>
            </div>

            {/* Instructions */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-300">
                How Cryptocurrency Deposit Works:
              </h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-400">
                <li>Submit your deposit request with the desired amount</li>
                <li>You'll receive a unique wallet address and QR code via email</li>
                <li>Send the cryptocurrency to the provided address</li>
                <li>Funds will be credited after network confirmations (10-30 minutes)</li>
              </ol>
            </div>

            {/* Network Warning */}
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                    Important: Network Selection
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Sending crypto on the wrong network will result in permanent loss of funds. Always verify the network before sending.
                  </p>
                </div>
              </div>
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
                  Fast processing (10-30 minutes)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Low network fees
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Privacy and security
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
            {isProcessing ? "Processing..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CryptoPaymentPage;
