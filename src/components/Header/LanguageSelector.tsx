"use client";

import { useState, useEffect, useRef } from "react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
];

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: "",
    name: "Language",
    flag: ""
  });
  const [isTranslateReady, setIsTranslateReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Google Translate script
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="translate.google.com"]')) {
      // Check if already initialized
      if (window.google?.translate?.TranslateElement) {
        setIsTranslateReady(true);
      }
      return;
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: languages.map((lang) => lang.code).join(","),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        // Mark as ready after a short delay to ensure widget is fully initialized
        setTimeout(() => {
          setIsTranslateReady(true);
        }, 1000);
      }
    };

    // Add Google Translate script
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      console.error("Failed to load Google Translate script");
    };
    document.body.appendChild(script);
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);

    // If selecting English, clear the translation and reload
    if (language.code === "en") {
      // Clear Google Translate cookies for all domains
      const domain = window.location.hostname;
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;

      // Reload to show original content
      window.location.reload();
      return;
    }

    // Set Google Translate cookie directly - this is the most reliable method
    const translateValue = `/en/${language.code}`;
    const domain = window.location.hostname;

    // Set cookie for current domain and all subdomains
    document.cookie = `googtrans=${translateValue}; path=/;`;
    document.cookie = `googtrans=${translateValue}; path=/; domain=${domain};`;
    document.cookie = `googtrans=${translateValue}; path=/; domain=.${domain};`;

    // Reload page to apply translation
    window.location.reload();
  };

  return (
    <div className="relative notranslate" ref={dropdownRef}>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden"></div>

      {/* Custom Language Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notranslate flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-dark transition-all duration-300 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        aria-label="Select Language"
      >
        <span className="notranslate">{selectedLanguage.name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="notranslate absolute right-0 top-full z-50 mt-2 w-64 max-h-96 overflow-y-auto rounded-lg border border-stroke bg-white shadow-lg dark:border-transparent dark:bg-gray-dark dark:shadow-two">
          <div className="p-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`notranslate flex w-full items-center justify-center rounded-md px-4 py-2 text-sm transition-all duration-200 ${
                  selectedLanguage.code === language.code
                    ? "bg-primary text-white"
                    : "text-body-color hover:bg-gray-100 dark:text-body-color-dark dark:hover:bg-gray-800"
                }`}
              >
                <span className="notranslate">{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
