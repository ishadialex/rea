"use client";

import { useState, useEffect } from "react";
import { ApiResponse } from "@/types/user";

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("password");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchSessions();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const result: ApiResponse<UserSettings> = await response.json();
      if (result.success && result.data) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await fetch("/api/settings/sessions");
      const result: ApiResponse<ActiveSession[]> = await response.json();
      if (result.success && result.data) {
        setSessions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccessMessage(message);
      setErrorMessage("");
    } else {
      setErrorMessage(message);
      setSuccessMessage("");
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 5000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);
    setPasswordErrors({});

    try {
      const response = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        showNotification("Password changed successfully!", "success");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showNotification(result.message || "Failed to change password", "error");
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSettingChange = async (key: keyof UserSettings, value: boolean | number) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    setIsSavingSettings(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });

      const result: ApiResponse<UserSettings> = await response.json();

      if (result.success) {
        showNotification("Settings saved successfully!", "success");
      } else {
        setSettings(settings);
        showNotification("Failed to save settings", "error");
      }
    } catch (error) {
      setSettings(settings);
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/settings/sessions/${sessionId}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        showNotification("Session revoked successfully!", "success");
      } else {
        showNotification("Failed to revoke session", "error");
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showNotification("Please type DELETE to confirm", "error");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/settings/account", {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        window.location.href = "/";
      } else {
        showNotification("Failed to delete account", "error");
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: "password", label: "Password", icon: "lock" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "privacy", label: "Privacy", icon: "shield" },
    { id: "sessions", label: "Sessions", icon: "device" },
    { id: "danger", label: "Danger Zone", icon: "warning" },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "lock":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case "bell":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case "shield":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "device":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-body-color-dark">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Notifications */}
      {successMessage && (
        <div className="fixed left-4 right-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg sm:left-auto sm:right-4 sm:w-auto sm:gap-3 sm:px-6 sm:py-4">
          <svg className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="flex-1 text-sm font-medium sm:text-base">{successMessage}</p>
          <button onClick={() => setSuccessMessage("")} className="flex-shrink-0 rounded-full p-1 hover:bg-white/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="fixed left-4 right-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg sm:left-auto sm:right-4 sm:w-auto sm:gap-3 sm:px-6 sm:py-4">
          <svg className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="flex-1 text-sm font-medium sm:text-base">{errorMessage}</p>
          <button onClick={() => setErrorMessage("")} className="flex-shrink-0 rounded-full p-1 hover:bg-white/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-body-color dark:text-body-color-dark sm:text-base">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 flex justify-center overflow-x-auto">
        <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800 sm:gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm dark:bg-gray-dark"
                  : "text-body-color hover:text-black dark:text-body-color-dark dark:hover:text-white"
              }`}
            >
              {renderIcon(tab.icon)}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-gray-dark sm:p-6">
        {/* Password Tab */}
        {activeTab === "password" && (
          <div>
            <h2 className="mb-2 text-lg font-bold text-black dark:text-white sm:text-xl">
              Change Password
            </h2>
            <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
              Ensure your account is using a strong password for security
            </p>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-primary dark:bg-gray-800 dark:text-white sm:text-base ${
                    passwordErrors.currentPassword ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-primary dark:bg-gray-800 dark:text-white sm:text-base ${
                    passwordErrors.newPassword ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-primary dark:bg-gray-800 dark:text-white sm:text-base ${
                    passwordErrors.confirmPassword ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                  }`}
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Password requirements:</strong> At least 8 characters, including uppercase, lowercase, numbers, and special characters.
                </p>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="mb-2 text-lg font-bold text-black dark:text-white sm:text-xl">
              Notification Preferences
            </h2>
            <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
              Choose how and when you want to be notified
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-black/20">
                <div>
                  <h3 className="font-medium text-black dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Receive important updates via email
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-black/20">
                <div>
                  <h3 className="font-medium text-black dark:text-white">Push Notifications</h3>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Receive real-time alerts on your device
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-black/20">
                <div>
                  <h3 className="font-medium text-black dark:text-white">Marketing Emails</h3>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Receive news, offers, and promotions
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={(e) => handleSettingChange("marketingEmails", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-black/20">
                <div>
                  <h3 className="font-medium text-black dark:text-white">Login Alerts</h3>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.loginAlerts}
                    onChange={(e) => handleSettingChange("loginAlerts", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div>
            <h2 className="mb-2 text-lg font-bold text-black dark:text-white sm:text-xl">
              Privacy & Security
            </h2>
            <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
              Manage your privacy settings and security options
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-black/20">
                <div>
                  <h3 className="font-medium text-black dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-body-color dark:text-body-color-dark">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/dashboard/security/setup-2fa")}
                  className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {settings.twoFactorEnabled ? "Manage" : "Enable"}
                </button>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-black/20">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-black dark:text-white">Session Timeout</h3>
                    <p className="text-sm text-body-color dark:text-body-color-dark">
                      Automatically log out after inactivity
                    </p>
                  </div>
                </div>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-black outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800 dark:text-blue-300">Security Tip</p>
                    <p className="text-blue-700 dark:text-blue-400">
                      Enable two-factor authentication and use a strong, unique password to keep your account secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <div>
            <h2 className="mb-2 text-lg font-bold text-black dark:text-white sm:text-xl">
              Active Sessions
            </h2>
            <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
              Manage devices that are currently logged into your account
            </p>

            {isLoadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between ${
                      session.current ? "bg-primary/5 dark:bg-primary/10" : "bg-gray-50 dark:bg-black/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                        <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-black dark:text-white">{session.browser}</h3>
                          {session.current && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-body-color dark:text-body-color-dark">
                          {session.device} • {session.location}
                        </p>
                        <p className="text-xs text-body-color dark:text-body-color-dark">
                          Last active: {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="self-start rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:hover:bg-red-900/20 sm:self-center"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={fetchSessions}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh sessions
            </button>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === "danger" && (
          <div>
            <h2 className="mb-2 text-lg font-bold text-red-600 dark:text-red-400 sm:text-xl">
              Danger Zone
            </h2>
            <p className="mb-6 text-sm text-body-color dark:text-body-color-dark">
              Irreversible and destructive actions
            </p>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20 sm:p-6">
              <h3 className="mb-2 font-semibold text-red-800 dark:text-red-300">
                Delete Account
              </h3>
              <p className="mb-4 text-sm text-red-700 dark:text-red-400">
                Once you delete your account, there is no going back. All your data will be permanently removed. Please be certain.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                      Type <span className="font-bold">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-black outline-none focus:border-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      placeholder="DELETE"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText("");
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-black transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== "DELETE" || isDeleting}
                      className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Permanently Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
