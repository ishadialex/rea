"use client";

import { useState, useRef, useEffect } from "react";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sample notifications - in a real app, these would come from an API or state management
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Daniel Nathan update your profile information",
      timestamp: "February 05, 2026 06:04 AM",
      read: false,
    },
    {
      id: 2,
      message: "Daniel Nathan update your profile information",
      timestamp: "January 16, 2026 05:09 AM",
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const handleClearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
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
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed right-2 top-[4.5rem] z-50 w-[calc(100vw-1rem)] max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-dark md:absolute md:right-0 md:top-full md:mt-4 md:w-96">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 px-4 py-3 dark:from-primary/10 dark:to-primary/20 md:px-6 md:py-4">
            <h3 className="text-base font-semibold text-black dark:text-white md:text-lg">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <p className="text-xs text-body-color dark:text-body-color-dark md:text-sm">
                You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[60vh] overflow-y-auto md:max-h-96">
            {notifications.length === 0 ? (
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
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 md:gap-4 md:px-6 md:py-4 ${
                      !notification.read ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white md:h-10 md:w-10">
                        <svg
                          className="h-4 w-4 text-white dark:text-black md:h-5 md:w-5"
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
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-black dark:text-white md:text-sm">
                        {notification.message}
                      </p>
                      <p className="mt-0.5 text-[10px] text-body-color dark:text-body-color-dark md:mt-1 md:text-xs">
                        {notification.timestamp}
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
          {notifications.length > 0 && (
            <div className="bg-gray-50 p-2 dark:bg-black/20 md:p-3">
              <button
                onClick={handleClearAll}
                className="w-full rounded-lg px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 md:py-3 md:text-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
