"use client";

import { ReactNode, useState } from "react";
import DashboardSidebar from "@/components/Dashboard/Sidebar";
import ThemeToggler from "@/components/Header/ThemeToggler";
import NotificationPanel from "@/components/Dashboard/NotificationPanel";
import ProfileDropdown from "@/components/Dashboard/ProfileDropdown";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-1 dark:bg-black">
      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="min-h-screen lg:ml-64">
        {/* Mobile Header with Hamburger */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-4 shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] dark:bg-gray-dark dark:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.3)] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open sidebar"
          >
            <svg
              className="h-6 w-6 text-black dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="text-lg font-semibold text-black dark:text-white">
            Dashboard
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggler />
            <NotificationPanel />
            <ProfileDropdown />
          </div>
        </div>

        {/* Desktop Top Bar - Top Right */}
        <div className="fixed right-6 top-6 z-30 hidden items-center gap-3 lg:flex">
          <ThemeToggler />
          <NotificationPanel />
          <ProfileDropdown />
        </div>

        {/* Page Content */}
        <div className="p-4 pt-6 sm:p-6 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
