"use client";

export default function InvestmentsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">
        My Investments
      </h1>

      {/* Investments List */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-dark">
        <p className="text-body-color dark:text-body-color-dark">
          You don't have any active investments yet.
        </p>
        <button className="mt-4 rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary/90">
          Browse Properties
        </button>
      </div>
    </div>
  );
}
