"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "transfer" | "referral";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  reference: string;
}

// --- Skeleton Components ---

const FilterSkeleton = () => (
  <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-dark md:p-6">
    <div className="flex flex-col gap-4">
      <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-200 dark:border-gray-800">
    <td className="px-6 py-4"><div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>
    <td className="px-6 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>
    <td className="px-6 py-4"><div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" /></td>
    <td className="px-6 py-4"><div className="mx-auto h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></td>
  </tr>
);

const MobileCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-dark">
    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black/20">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div>
          <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="p-4">
      <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="text-right">
          <div className="mb-1 h-3 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-dark">
    <div className="mb-1 h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    <div className="mt-1 h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
  </div>
);

// --- Mock API ---

const fetchTransactions = async (): Promise<Transaction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [
    {
      id: "TXN001",
      type: "deposit",
      amount: 5000,
      status: "completed",
      date: "2026-02-05",
      description: "Bank Transfer Deposit",
      reference: "BNK-20260205-001",
    },
    {
      id: "TXN002",
      type: "investment",
      amount: 3000,
      status: "completed",
      date: "2026-02-04",
      description: "Property Investment - Luxury Apartment",
      reference: "INV-20260204-001",
    },
    {
      id: "TXN003",
      type: "withdrawal",
      amount: 1500,
      status: "pending",
      date: "2026-02-03",
      description: "Bank Withdrawal",
      reference: "WTH-20260203-001",
    },
    {
      id: "TXN004",
      type: "referral",
      amount: 250,
      status: "completed",
      date: "2026-02-02",
      description: "Referral Bonus - John Doe",
      reference: "REF-20260202-001",
    },
    {
      id: "TXN005",
      type: "transfer",
      amount: 800,
      status: "completed",
      date: "2026-02-01",
      description: "Transfer to Sarah Wilson",
      reference: "TRF-20260201-001",
    },
    {
      id: "TXN006",
      type: "deposit",
      amount: 10000,
      status: "completed",
      date: "2026-01-30",
      description: "Card Payment Deposit",
      reference: "CRD-20260130-001",
    },
    {
      id: "TXN007",
      type: "withdrawal",
      amount: 2500,
      status: "failed",
      date: "2026-01-28",
      description: "Bank Withdrawal - Insufficient Balance",
      reference: "WTH-20260128-001",
    },
    {
      id: "TXN008",
      type: "investment",
      amount: 7500,
      status: "completed",
      date: "2026-01-25",
      description: "Solar Power Project Investment",
      reference: "INV-20260125-001",
    },
  ];
};

// --- Page Component ---

export default function TransactionPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch {
        setError("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
      setError(null);
    } catch {
      setError("Failed to refresh transactions.");
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === selectedFilter);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((tx) => tx.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.reference.toLowerCase().includes(query) ||
          tx.description.toLowerCase().includes(query) ||
          tx.amount.toString().includes(query)
      );
    }

    return filtered;
  }, [selectedFilter, selectedStatus, searchQuery, transactions]);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case "deposit":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case "withdrawal":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case "investment":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "transfer":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case "referral":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return null;
    }
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Failed
          </span>
        );
      default:
        return null;
    }
  }, []);

  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "withdrawal":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "investment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "transfer":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "referral":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // --- Error State ---
  if (error && !loading && transactions.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-red-500"
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
          <p className="mb-4 text-lg font-medium text-black dark:text-white">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-body-color dark:text-body-color-dark md:text-base">
            View and manage your transaction history
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-black transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          aria-label="Refresh"
        >
          <svg
            className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Filters and Search */}
      {loading ? (
        <FilterSkeleton />
      ) : (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by reference, description, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 pl-11 text-sm text-black outline-none transition focus:border-primary dark:border-gray-800 dark:text-white"
              />
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color dark:text-body-color-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Type Filter */}
              <div className="flex-1">
                <label className="mb-2 block text-xs font-semibold text-black dark:text-white">
                  Transaction Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "deposit", "withdrawal", "investment", "transfer", "referral"].map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                          selectedFilter === filter
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <label className="mb-2 block text-xs font-semibold text-black dark:text-white">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "completed", "pending", "failed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                        selectedStatus === status
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      {loading ? (
        <>
          {/* Desktop Table Skeleton */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-dark lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-black/20">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">Reference</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-black dark:text-white">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-black dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Skeleton */}
          <div className="space-y-4 lg:hidden">
            {[1, 2, 3, 4].map((i) => (
              <MobileCardSkeleton key={i} />
            ))}
          </div>

          {/* Summary Stats Skeleton */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </>
      ) : filteredTransactions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-dark">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-semibold text-black dark:text-white">
            No transactions found
          </p>
          <p className="mt-1 text-sm text-body-color dark:text-body-color-dark">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-dark lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-black/20">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-white">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-black dark:text-white">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-black dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      onClick={() => router.push(`/dashboard/transaction/${transaction.id}`)}
                      className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-black dark:text-white">
                          {transaction.reference}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getTypeColor(transaction.type)}`}>
                            {getTypeIcon(transaction.type)}
                          </div>
                          <span className="text-sm font-medium capitalize text-black dark:text-white">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {transaction.description}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-body-color dark:text-body-color-dark">
                          {formatDate(transaction.date)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-semibold ${
                          transaction.type === "deposit" || transaction.type === "referral"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {transaction.type === "deposit" || transaction.type === "referral" ? "+" : "-"}
                          ${transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(transaction.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 lg:hidden">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => router.push(`/dashboard/transaction/${transaction.id}`)}
                className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-primary/30 dark:border-gray-800 dark:bg-gray-dark dark:hover:border-primary/30"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(transaction.type)}`}>
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize text-black dark:text-white">
                        {transaction.type}
                      </p>
                      <p className="text-xs text-body-color dark:text-body-color-dark">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-body-color dark:text-body-color-dark">
                      {transaction.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-body-color dark:text-body-color-dark">
                        Reference
                      </p>
                      <p className="font-mono text-xs font-medium text-black dark:text-white">
                        {transaction.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-body-color dark:text-body-color-dark">
                        Amount
                      </p>
                      <p className={`text-lg font-bold ${
                        transaction.type === "deposit" || transaction.type === "referral"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {transaction.type === "deposit" || transaction.type === "referral" ? "+" : "-"}
                        ${transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Summary Stats */}
      {!loading && filteredTransactions.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-dark">
            <p className="text-xs text-body-color dark:text-body-color-dark">
              Total Transactions
            </p>
            <p className="mt-1 text-2xl font-bold text-black dark:text-white">
              {filteredTransactions.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-dark">
            <p className="text-xs text-body-color dark:text-body-color-dark">
              Total Deposits
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              $
              {filteredTransactions
                .filter((tx) => tx.type === "deposit" || tx.type === "referral")
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-dark">
            <p className="text-xs text-body-color dark:text-body-color-dark">
              Total Withdrawals
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
              $
              {filteredTransactions
                .filter((tx) => tx.type === "withdrawal" || tx.type === "investment" || tx.type === "transfer")
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
