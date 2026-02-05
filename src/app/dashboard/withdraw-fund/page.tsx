"use client";

import { useState, useCallback, useEffect } from "react";

type WithdrawalMethod = "bank" | "crypto" | null;

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  swiftCode: string;
  amount: string;
}

interface CryptoDetails {
  cryptoType: string;
  walletAddress: string;
  network: string;
  amount: string;
}

const WithdrawFundPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedMethod, setCompletedMethod] = useState<WithdrawalMethod>(null);

  // Available balance (in a real app, this would come from backend)
  const availableBalance = 25000;

  // Bank transfer state
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
    swiftCode: "",
    amount: "",
  });

  // Crypto transfer state
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({
    cryptoType: "BTC",
    walletAddress: "",
    network: "Bitcoin",
    amount: "",
  });

  const cryptoOptions = [
    { value: "BTC", label: "Bitcoin (BTC)", networks: ["Bitcoin", "Lightning Network"] },
    { value: "ETH", label: "Ethereum (ETH)", networks: ["Ethereum", "Arbitrum", "Polygon"] },
    { value: "USDT", label: "Tether (USDT)", networks: ["Ethereum (ERC20)", "Tron (TRC20)", "BSC (BEP20)"] },
    { value: "USDC", label: "USD Coin (USDC)", networks: ["Ethereum (ERC20)", "Polygon", "Solana"] },
  ];

  const selectedCrypto = cryptoOptions.find((opt) => opt.value === cryptoDetails.cryptoType);

  // Scroll to top when success screen is shown
  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSuccess]);

  const handleBankSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setCompletedMethod("bank");
    setShowSuccess(true);
  }, []);

  const handleCryptoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setCompletedMethod("crypto");
    setShowSuccess(true);
  }, []);

  const resetForm = () => {
    setSelectedMethod(null);
    setShowSuccess(false);
    setCompletedMethod(null);
    setBankDetails({
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      swiftCode: "",
      amount: "",
    });
    setCryptoDetails({
      cryptoType: "BTC",
      walletAddress: "",
      network: "Bitcoin",
      amount: "",
    });
  };

  if (showSuccess) {
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

            <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
              {completedMethod === "bank"
                ? "Bank Transfer Withdrawal Submitted!"
                : "Cryptocurrency Withdrawal Submitted!"}
            </h2>
            <p className="mb-6 text-body-color dark:text-body-color-dark">
              {completedMethod === "bank"
                ? "Your bank transfer withdrawal request has been received and is being processed. The funds will be transferred to your bank account."
                : "Your cryptocurrency withdrawal request has been received and is being processed. The funds will be sent to your wallet address."}
            </p>

            <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Processing Time:</strong> {completedMethod === "bank"
                  ? "Bank transfers typically take 3-5 business days to complete. You will receive an email notification once the transfer is processed."
                  : "Cryptocurrency withdrawals are usually processed within 24 hours. Please check your wallet for the incoming transaction."}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                resetForm();
              }}
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 md:w-auto"
            >
              Make Another Withdrawal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedMethod) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Withdraw Funds
          </h1>
          <p className="mt-2 text-sm text-body-color dark:text-body-color-dark md:text-base">
            Choose your preferred withdrawal method
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

        {/* Withdrawal Methods */}
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
          {/* Bank Transfer */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSelectedMethod("bank");
            }}
            className="group rounded-xl border border-gray-200 bg-white p-6 text-left shadow-lg transition-all hover:border-primary hover:shadow-xl dark:border-gray-800 dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/20 transition-colors group-hover:from-primary/10 group-hover:to-primary/20">
              <svg
                className="h-7 w-7 text-blue-500 group-hover:text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
              Bank Transfer
            </h3>
            <p className="text-sm text-body-color dark:text-body-color-dark">
              Withdraw directly to your bank account. Processing time: 3-5 business days.
            </p>
          </button>

          {/* Cryptocurrency */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSelectedMethod("crypto");
            }}
            className="group rounded-xl border border-gray-200 bg-white p-6 text-left shadow-lg transition-all hover:border-primary hover:shadow-xl dark:border-gray-800 dark:bg-gray-dark"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/20 transition-colors group-hover:from-primary/10 group-hover:to-primary/20">
              <svg
                className="h-7 w-7 text-orange-500 group-hover:text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
              Cryptocurrency
            </h3>
            <p className="text-sm text-body-color dark:text-body-color-dark">
              Withdraw to your crypto wallet. Processing time: Usually within 24 hours.
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (selectedMethod === "bank") {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 md:mb-8">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSelectedMethod(null);
            }}
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
          </button>
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
              Bank Transfer Withdrawal
            </h1>
            <p className="mt-1 text-sm text-body-color dark:text-body-color-dark md:text-base">
              Enter your bank account details
            </p>
          </div>
        </div>

        <form onSubmit={handleBankSubmit} className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-dark md:p-6">
            <div className="space-y-4">
              {/* Account Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="Chase Bank"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  placeholder="1234567890"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Routing Number */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Routing Number
                </label>
                <input
                  type="text"
                  required
                  value={bankDetails.routingNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                  placeholder="021000021"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* SWIFT Code */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  SWIFT/BIC Code (Optional)
                </label>
                <input
                  type="text"
                  value={bankDetails.swiftCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value })}
                  placeholder="CHASUS33"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Withdrawal Amount ($)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={availableBalance}
                  step="0.01"
                  value={bankDetails.amount}
                  onChange={(e) => setBankDetails({ ...bankDetails, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                  Available: ${availableBalance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Submit Withdrawal Request"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Crypto withdrawal form
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4 md:mb-8">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSelectedMethod(null);
          }}
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
        </button>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Cryptocurrency Withdrawal
          </h1>
          <p className="mt-1 text-sm text-body-color dark:text-body-color-dark md:text-base">
            Withdraw to your crypto wallet
          </p>
        </div>
      </div>

      <form onSubmit={handleCryptoSubmit} className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <div className="space-y-4">
            {/* Cryptocurrency Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Cryptocurrency
              </label>
              <select
                value={cryptoDetails.cryptoType}
                onChange={(e) => {
                  const newCrypto = cryptoOptions.find((opt) => opt.value === e.target.value);
                  setCryptoDetails({
                    ...cryptoDetails,
                    cryptoType: e.target.value,
                    network: newCrypto?.networks[0] || "",
                  });
                }}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              >
                {cryptoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Network */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Network
              </label>
              <select
                value={cryptoDetails.network}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, network: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              >
                {selectedCrypto?.networks.map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Address */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Wallet Address
              </label>
              <input
                type="text"
                required
                value={cryptoDetails.walletAddress}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, walletAddress: e.target.value })}
                placeholder="Enter your wallet address"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-sm text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Please double-check your wallet address. Transactions cannot be reversed.
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Withdrawal Amount ($)
              </label>
              <input
                type="number"
                required
                min="1"
                max={availableBalance}
                step="0.01"
                value={cryptoDetails.amount}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, amount: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Available: ${availableBalance.toLocaleString()}
              </p>
            </div>

            {/* Warning */}
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
                    Important: Verify all details
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Cryptocurrency transactions are irreversible. Please ensure the wallet address and network are correct.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Submit Withdrawal Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithdrawFundPage;
