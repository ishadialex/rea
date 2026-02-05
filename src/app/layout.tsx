"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import NewsletterPopup from "@/components/NewsletterPopup";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  shouldShowNewsletterPopup,
  markNewsletterPopupShown,
} from "@/utils/newsletter-popup";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPDFViewer = pathname?.startsWith("/pdf-viewer");
  const isDashboard = pathname?.startsWith("/dashboard");
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

  // Check if popup should be shown (only if 6 hours have passed)
  useEffect(() => {
    // Small delay to ensure smooth page load
    const timer = setTimeout(() => {
      if (shouldShowNewsletterPopup()) {
        setShowNewsletterPopup(true);
      }
    }, 1000); // Show popup 1 second after page load

    return () => clearTimeout(timer);
  }, []);

  // Handle closing the popup
  const handleClosePopup = () => {
    setShowNewsletterPopup(false);
    markNewsletterPopupShown();
  };

  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <div className="isolate">
            {!isPDFViewer && !isDashboard && <Header />}
            {children}
            {!isPDFViewer && !isDashboard && <Footer />}
          </div>
          {!isPDFViewer && !isDashboard && <ScrollToTop />}
          <NewsletterPopup
            isOpen={showNewsletterPopup}
            onClose={handleClosePopup}
          />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";

