"use client";

export default function DashboardOverviewPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">
        Dashboard Overview
      </h1>

      {/* Stats Cards Section */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder for stat cards */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-dark">
          <p className="text-sm text-body-color dark:text-body-color-dark">
            Total Investment
          </p>
          <p className="mt-2 text-2xl font-bold text-black dark:text-white">
            $0.00
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-dark">
          <p className="text-sm text-body-color dark:text-body-color-dark">
            Monthly Returns
          </p>
          <p className="mt-2 text-2xl font-bold text-black dark:text-white">
            $0.00
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-dark">
          <p className="text-sm text-body-color dark:text-body-color-dark">
            Active Properties
          </p>
          <p className="mt-2 text-2xl font-bold text-black dark:text-white">
            0
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-dark">
          <p className="text-sm text-body-color dark:text-body-color-dark">
            Total ROI
          </p>
          <p className="mt-2 text-2xl font-bold text-black dark:text-white">
            0%
          </p>
        </div>
      </div>

      {/* Charts/Additional Content */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-dark">
        <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
          Recent Activity
        </h2>
        <p className="text-body-color dark:text-body-color-dark">
          No recent activity to display.
        </p>
      </div>
    </div>
  );
}
