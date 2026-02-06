"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Types
interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "transaction" | "investment" | "security" | "referral";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

// Mock API functions - Replace these with actual API calls
const fetchNotifications = async (): Promise<Notification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  // In real app: const response = await fetch('/api/notifications');
  return [
    {
      id: "notif-001",
      type: "investment",
      title: "Investment Confirmed",
      message: "Your investment of $5,000 in Downtown Office Complex has been confirmed.",
      timestamp: "2026-02-06T10:30:00Z",
      read: false,
    },
    {
      id: "notif-002",
      type: "transaction",
      title: "Withdrawal Processed",
      message: "Your withdrawal of $1,200 has been processed successfully.",
      timestamp: "2026-02-05T14:22:00Z",
      read: false,
    },
    {
      id: "notif-003",
      type: "security",
      title: "New Login Detected",
      message: "A new login was detected from Chrome on Windows.",
      timestamp: "2026-02-05T09:15:00Z",
      read: true,
    },
    {
      id: "notif-004",
      type: "referral",
      title: "Referral Bonus Earned",
      message: "You earned $50 from John Smith's first investment.",
      timestamp: "2026-02-04T16:45:00Z",
      read: true,
    },
  ];
};

const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // In real app: await fetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
  return true;
};

const markAllAsRead = async (): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In real app: await fetch('/api/notifications/read-all', { method: 'PATCH' });
  return true;
};

const clearAllNotifications = async (): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In real app: await fetch('/api/notifications', { method: 'DELETE' });
  return true;
};

// Notification Icon Component
const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
  const iconClasses = "h-4 w-4 md:h-5 md:w-5";

  const getIconBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "transaction":
        return "bg-blue-500";
      case "investment":
        return "bg-primary";
      case "security":
        return "bg-purple-500";
      case "referral":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "warning":
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "error":
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "transaction":
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case "investment":
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "security":
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "referral":
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getIconBgColor()} md:h-10 md:w-10`}>
      <span className="text-white">{renderIcon()}</span>
    </div>
  );
};

// Skeleton Components
const NotificationSkeleton = () => (
  <div className="flex gap-3 px-4 py-3 md:gap-4 md:px-6 md:py-4">
    <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 md:h-10 md:w-10" />
    <div className="flex-1">
      <div className="mb-2 h-3 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700 md:h-4" />
      <div className="mb-1 h-2 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700 md:h-3" />
      <div className="h-2 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
);

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Data states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Fetch notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle marking single notification as read
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error("Failed to mark notification as read");
      }
    }

    // Navigate to link if provided
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      setActionLoading(true);
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle clear all
  const handleClearAll = async () => {
    try {
      setActionLoading(true);
      await clearAllNotifications();
      setNotifications([]);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to clear notifications");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await loadNotifications();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 md:h-14 md:w-14"
        aria-label="Notifications"
      >
        {/* Bell Icon */}
        <svg
          className="h-5 w-5 text-black dark:text-white md:h-6 md:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed right-2 top-[4.5rem] z-50 w-[calc(100vw-1rem)] max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-dark md:absolute md:right-0 md:top-full md:mt-4 md:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-br from-primary/5 to-primary/10 px-4 py-3 dark:from-primary/10 dark:to-primary/20 md:px-6 md:py-4">
            <div>
              <h3 className="text-base font-semibold text-black dark:text-white md:text-lg">
                Notifications
              </h3>
              {!loading && unreadCount > 0 && (
                <p className="text-xs text-body-color dark:text-body-color-dark md:text-sm">
                  {unreadCount} unread
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Refresh notifications"
              >
                <svg
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
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
              {/* Mark All Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={actionLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Mark all as read"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[60vh] overflow-y-auto md:max-h-96">
            {loading ? (
              <>
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
              </>
            ) : error ? (
              <div className="px-4 py-6 text-center md:px-6 md:py-8">
                <svg
                  className="mx-auto mb-3 h-10 w-10 text-red-400 md:h-12 md:w-12"
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
                <p className="mb-2 text-xs font-medium text-black dark:text-white md:text-sm">
                  {error}
                </p>
                <button
                  onClick={handleRefresh}
                  className="text-xs text-primary hover:underline md:text-sm"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center md:px-6 md:py-8">
                <svg
                  className="mx-auto mb-3 h-10 w-10 text-gray-400 md:h-12 md:w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-xs text-body-color dark:text-body-color-dark md:text-sm">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 md:gap-4 md:px-6 md:py-4 ${
                      !notification.read ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <NotificationIcon type={notification.type} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-black dark:text-white md:text-sm">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[10px] text-body-color dark:text-body-color-dark md:text-xs">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500 md:text-xs">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear All Button */}
          {!loading && notifications.length > 0 && (
            <div className="bg-gray-50 p-2 dark:bg-black/20 md:p-3">
              <button
                onClick={handleClearAll}
                disabled={actionLoading}
                className="w-full rounded-lg px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-gray-100 disabled:opacity-50 dark:text-white dark:hover:bg-gray-800 md:py-3 md:text-sm"
              >
                {actionLoading ? "Clearing..." : "Clear All"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
