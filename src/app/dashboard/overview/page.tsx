"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";

// Types
interface UserData {
  name: string;
  email: string;
  accountBalance: number;
  kycStatus: "pending" | "verified" | "rejected";
  twoFactorEnabled: boolean;
}

interface Investment {
  id: string;
  propertyTitle: string;
  amount: number;
  expectedReturn: number;
  monthlyReturn: number;
  status: "active" | "completed" | "pending";
  type: "pooled" | "individual";
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "transfer" | "referral";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
}

interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  expectedROI: number;
  minInvestment: number;
  status: string;
  image: string;
}

interface DashboardData {
  user: UserData | null;
  investments: Investment[];
  transactions: Transaction[];
  featuredProperties: FeaturedProperty[];
}

// Mock API functions - Replace these with actual API calls
const fetchUserData = async (): Promise<UserData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In production, replace with: const response = await fetch('/api/user'); return response.json();
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    accountBalance: 12500.0,
    kycStatus: "verified",
    twoFactorEnabled: true,
  };
};

const fetchInvestments = async (): Promise<Investment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In production, replace with: const response = await fetch('/api/investments'); return response.json();
  return [
    {
      id: "INV-001",
      propertyTitle: "Beachfront Villa - Miami",
      amount: 10000,
      expectedReturn: 2200,
      monthlyReturn: 183,
      status: "active",
      type: "pooled",
    },
    {
      id: "INV-002",
      propertyTitle: "Luxury Downtown Apartment",
      amount: 5000,
      expectedReturn: 900,
      monthlyReturn: 75,
      status: "active",
      type: "individual",
    },
  ];
};

const fetchTransactions = async (): Promise<Transaction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 900));

  // In production, replace with: const response = await fetch('/api/transactions?limit=5'); return response.json();
  return [
    {
      id: "TXN001",
      type: "deposit",
      amount: 5000,
      status: "completed",
      date: "2026-02-05",
      description: "Bank Transfer Deposit",
    },
    {
      id: "TXN002",
      type: "investment",
      amount: 3000,
      status: "completed",
      date: "2026-02-04",
      description: "Property Investment",
    },
    {
      id: "TXN003",
      type: "referral",
      amount: 250,
      status: "completed",
      date: "2026-02-02",
      description: "Referral Bonus",
    },
    {
      id: "TXN004",
      type: "withdrawal",
      amount: 1500,
      status: "pending",
      date: "2026-02-01",
      description: "Bank Withdrawal",
    },
  ];
};

const fetchFeaturedProperties = async (): Promise<FeaturedProperty[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1100));

  // In production, replace with: const response = await fetch('/api/properties/featured'); return response.json();
  return [
    {
      id: "prop-001",
      title: "Desert Oasis - Luxury Airbnb",
      location: "Scottsdale, Arizona",
      expectedROI: 24,
      minInvestment: 5000,
      status: "available",
      image: "/images/how-it-works/property-1.jpg",
    },
    {
      id: "prop-002",
      title: "Mountain Cabin Retreat",
      location: "Aspen, Colorado",
      expectedROI: 20,
      minInvestment: 8000,
      status: "available",
      image: "/images/how-it-works/property-2.jpg",
    },
    {
      id: "prop-003",
      title: "Beachfront Villa",
      location: "Miami Beach, Florida",
      expectedROI: 22,
      minInvestment: 5000,
      status: "available",
      image: "/images/how-it-works/property-3.jpg",
    },
  ];
};

// Loading Skeleton Components
const StatCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
    <div className="mb-3 flex items-center justify-between">
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
    <div className="mt-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
  </div>
);

const TransactionSkeleton = () => (
  <div className="flex animate-pulse items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div>
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-1 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
    <div className="text-right">
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1 h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
);

const PropertyCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow dark:border-gray-800 dark:bg-gray-dark">
    <div className="h-40 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4">
      <div className="mb-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mb-3 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  </div>
);

export default function DashboardOverviewPage() {
  // State
  const [data, setData] = useState<DashboardData>({
    user: null,
    investments: [],
    transactions: [],
    featuredProperties: [],
  });
  const [loading, setLoading] = useState({
    user: true,
    investments: true,
    transactions: true,
    properties: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);

      // Fetch all data in parallel
      const [userData, investmentsData, transactionsData, propertiesData] = await Promise.all([
        fetchUserData().finally(() => setLoading((prev) => ({ ...prev, user: false }))),
        fetchInvestments().finally(() => setLoading((prev) => ({ ...prev, investments: false }))),
        fetchTransactions().finally(() => setLoading((prev) => ({ ...prev, transactions: false }))),
        fetchFeaturedProperties().finally(() => setLoading((prev) => ({ ...prev, properties: false }))),
      ]);

      setData({
        user: userData,
        investments: investmentsData,
        transactions: transactionsData,
        featuredProperties: propertiesData,
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard fetch error:", err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate stats from investments
  const stats = useMemo(() => {
    const totalInvested = data.investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpectedReturns = data.investments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
    const monthlyIncome = data.investments.reduce((sum, inv) => sum + inv.monthlyReturn, 0);
    const activeCount = data.investments.filter((inv) => inv.status === "active").length;
    const totalROI = totalInvested > 0 ? ((totalExpectedReturns / totalInvested) * 100).toFixed(1) : "0";

    return {
      accountBalance: data.user?.accountBalance || 0,
      totalInvested,
      totalExpectedReturns,
      monthlyIncome,
      activeCount,
      totalROI,
    };
  }, [data.investments, data.user]);

  // Transaction icon helper
  const getTransactionIcon = useCallback((type: string) => {
    switch (type) {
      case "deposit":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case "withdrawal":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case "investment":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case "referral":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  }, []);

  // Refresh data handler
  const handleRefresh = () => {
    setLoading({
      user: true,
      investments: true,
      transactions: true,
      properties: true,
    });
    fetchDashboardData();
  };

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="mb-4 text-lg font-semibold text-black dark:text-white">{error}</p>
        <button
          onClick={handleRefresh}
          className="rounded-lg bg-primary px-6 py-2 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Welcome Header */}
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <div>
          {loading.user ? (
            <div className="animate-pulse">
              <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-2 h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
                Welcome back, {data.user?.name.split(" ")[0]}!
              </h1>
              <p className="mt-1 text-sm text-body-color dark:text-body-color-dark md:text-base">
                Here&apos;s an overview of your investment portfolio
              </p>
            </>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading.user || loading.investments || loading.transactions || loading.properties}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          title="Refresh data"
        >
          <svg
            className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${
              loading.user || loading.investments || loading.transactions || loading.properties ? "animate-spin" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mb-8">
        {loading.user || loading.investments ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Account Balance */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-primary/10 to-primary/5 p-4 shadow dark:border-gray-800 dark:from-primary/20 dark:to-primary/10 md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
                  Account Balance
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-black dark:text-white md:text-3xl">
                ${stats.accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Available for investment
              </p>
            </div>

            {/* Total Invested */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
                  Total Invested
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-black dark:text-white md:text-3xl">
                ${stats.totalInvested.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Across {stats.activeCount} active investment{stats.activeCount !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Monthly Income */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
                  Monthly Income
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 md:text-3xl">
                ${stats.monthlyIncome.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Expected monthly returns
              </p>
            </div>

            {/* Total ROI */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
                  Portfolio ROI
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-black dark:text-white md:text-3xl">
                {stats.totalROI}%
              </p>
              <p className="mt-1 text-xs text-body-color dark:text-body-color-dark">
                Expected annual return
              </p>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 md:mb-8">
        <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          <Link
            href="/dashboard/add-fund"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-dark dark:hover:border-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white">Add Funds</p>
              <p className="text-xs text-body-color dark:text-body-color-dark">Deposit money</p>
            </div>
          </Link>

          <Link
            href="/dashboard/property-market/properties"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-dark dark:hover:border-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white">Invest Now</p>
              <p className="text-xs text-body-color dark:text-body-color-dark">Browse properties</p>
            </div>
          </Link>

          <Link
            href="/dashboard/withdraw-fund"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-dark dark:hover:border-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white">Withdraw</p>
              <p className="text-xs text-body-color dark:text-body-color-dark">Cash out funds</p>
            </div>
          </Link>

          <Link
            href="/dashboard/my-referral"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-dark dark:hover:border-primary"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white">Refer & Earn</p>
              <p className="text-xs text-body-color dark:text-body-color-dark">Invite friends</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow dark:border-gray-800 dark:bg-gray-dark">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800 md:p-6">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Recent Transactions
              </h2>
              <Link
                href="/dashboard/transaction"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading.transactions ? (
                <>
                  <TransactionSkeleton />
                  <TransactionSkeleton />
                  <TransactionSkeleton />
                  <TransactionSkeleton />
                </>
              ) : data.transactions.length > 0 ? (
                data.transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-body-color dark:text-body-color-dark">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "deposit" || transaction.type === "referral"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "deposit" || transaction.type === "referral" ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-body-color dark:text-body-color-dark">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Status & Active Investments */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Account Status
            </h2>
            {loading.user ? (
              <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* KYC Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      data.user?.kycStatus === "verified"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-yellow-100 dark:bg-yellow-900/30"
                    }`}>
                      {data.user?.kycStatus === "verified" ? (
                        <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-black dark:text-white">KYC Verification</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    data.user?.kycStatus === "verified"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}>
                    {data.user?.kycStatus === "verified" ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* 2FA Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      data.user?.twoFactorEnabled
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      <svg className={`h-4 w-4 ${data.user?.twoFactorEnabled ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-sm text-black dark:text-white">2FA Security</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    data.user?.twoFactorEnabled
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {data.user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <Link
                  href="/dashboard/security"
                  className="mt-2 block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 text-center text-sm font-medium text-black transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Manage Security
                </Link>
              </div>
            )}
          </div>

          {/* Active Investments Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                My Investments
              </h2>
              <Link
                href="/dashboard/investments"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            {loading.investments ? (
              <div className="animate-pulse space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-600" />
                  <div className="flex justify-between">
                    <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600" />
                    <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-600" />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-600" />
                  <div className="flex justify-between">
                    <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600" />
                    <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-600" />
                  </div>
                </div>
              </div>
            ) : data.investments.length > 0 ? (
              <div className="space-y-3">
                {data.investments.slice(0, 3).map((investment) => (
                  <div
                    key={investment.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <p className="mb-1 text-sm font-semibold text-black dark:text-white">
                      {investment.propertyTitle}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-body-color dark:text-body-color-dark">
                        ${investment.amount.toLocaleString()} invested
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +${investment.monthlyReturn}/mo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-body-color dark:text-body-color-dark">
                  No active investments yet
                </p>
                <Link
                  href="/dashboard/property-market/properties"
                  className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Start Investing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="mt-6 md:mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Featured Investment Opportunities
          </h2>
          <Link
            href="/dashboard/property-market/properties"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All Properties
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading.properties ? (
            <>
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </>
          ) : data.featuredProperties.length > 0 ? (
            data.featuredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/dashboard/property-market/properties/${property.id}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow transition-all hover:border-primary hover:shadow-lg dark:border-gray-800 dark:bg-gray-dark dark:hover:border-primary"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                    {property.expectedROI}% ROI
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-black dark:text-white">
                    {property.title}
                  </h3>
                  <p className="mb-2 text-xs text-body-color dark:text-body-color-dark">
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black dark:text-white">
                      Min: ${property.minInvestment.toLocaleString()}
                    </span>
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Available
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-gray-200 bg-white p-8 text-center shadow dark:border-gray-800 dark:bg-gray-dark">
              <p className="text-body-color dark:text-body-color-dark">No properties available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
