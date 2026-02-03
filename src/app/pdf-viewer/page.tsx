"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PDFViewerContent() {
  const searchParams = useSearchParams();
  const pdfFile = searchParams.get("file");

  if (!pdfFile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">No PDF file specified</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFile.split("/").pop() || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-dark">
      {/* Action Bar */}
      <div className="sticky top-0 z-40 bg-white shadow-md dark:bg-gray-800">
        <div className="mx-auto flex max-w-full items-center justify-between px-2 py-2 sm:px-4 sm:py-3 md:py-4">
          <h1 className="text-sm font-semibold text-black dark:text-white sm:text-base md:text-lg">
            PDF Viewer
          </h1>
          <div className="flex gap-1.5 sm:gap-2 md:gap-3">
            <button
              onClick={handlePrint}
              className="rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-white transition hover:bg-primary/80 sm:px-3 sm:py-2 sm:text-sm md:px-4"
            >
              Print
            </button>
            <button
              onClick={handleDownload}
              className="rounded-md bg-black px-2 py-1.5 text-xs font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90 sm:px-3 sm:py-2 sm:text-sm md:px-4"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="mx-auto max-w-full p-1 sm:p-2 md:p-4">
        <div className="overflow-auto rounded-sm bg-white shadow-lg sm:rounded-md md:rounded-lg" style={{ WebkitOverflowScrolling: 'touch' }}>
          <iframe
            src={pdfFile}
            className="h-[calc(100vh-60px)] w-full sm:h-[calc(100vh-80px)] md:h-[calc(100vh-120px)]"
            title="PDF Viewer"
            style={{ border: 'none', touchAction: 'manipulation' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PDFViewer() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Loading PDF...</p>
        </div>
      }
    >
      <PDFViewerContent />
    </Suspense>
  );
}
