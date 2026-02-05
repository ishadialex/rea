"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InvestmentProperty } from "@/types/investment";
import InvestmentModal from "@/components/InvestmentModal";

// Import mock data from the listing page
const mockInvestmentProperties: InvestmentProperty[] = [
  {
    id: "prop-001",
    title: "Luxury Downtown Apartment - Arbitrage Opportunity",
    description: "Prime downtown location with high rental demand. Perfect for short-term arbitrage with proven 18% annual returns. This fully furnished modern apartment features smart home technology and is located in the heart of Manhattan's financial district.",
    images: [
      "/images/how-it-works/property-1.jpg",
      "/images/how-it-works/property-2.jpg",
      "/images/how-it-works/property-3.jpg",
    ],
    location: "Manhattan, New York",
    investmentType: "individual",
    category: "arbitrage",
    price: 45000,
    minInvestment: 45000,
    maxInvestment: 45000,
    targetAmount: 45000,
    currentFunded: 45000,
    investorCount: 1,
    expectedROI: 18,
    monthlyReturn: 1.5,
    duration: 12,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    area: "1200 sqft",
    status: "available",
    features: ["Fully Furnished", "Smart Home", "Gym Access", "24/7 Security", "Doorman", "Rooftop Terrace"],
    riskLevel: "low",
    createdAt: "2026-02-01",
  },
  {
    id: "prop-002",
    title: "Beachfront Villa - Pooled Airbnb Investment",
    description: "Stunning beachfront property in Miami. Multiple investors pool resources for high-yield vacation rental returns. This luxurious villa features panoramic ocean views and premium amenities.",
    images: [
      "/images/how-it-works/property-2.jpg",
      "/images/how-it-works/property-3.jpg",
      "/images/how-it-works/property-1.jpg",
    ],
    location: "Miami Beach, Florida",
    investmentType: "pooled",
    category: "airbnb",
    price: 120000,
    minInvestment: 5000,
    maxInvestment: 20000,
    targetAmount: 120000,
    currentFunded: 78000,
    investorCount: 12,
    expectedROI: 22,
    monthlyReturn: 1.83,
    duration: 24,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    area: "2800 sqft",
    status: "available",
    features: ["Ocean View", "Private Pool", "Outdoor Kitchen", "Beach Access", "Hot Tub", "Smart TV"],
    riskLevel: "medium",
    createdAt: "2026-01-28",
  },
  {
    id: "prop-003",
    title: "Suburban Family Home - Mortgage Investment",
    description: "Stable long-term mortgage investment in growing suburban area with consistent returns. Perfect for conservative investors seeking reliable income.",
    images: [
      "/images/how-it-works/property-3.jpg",
      "/images/how-it-works/property-1.jpg",
      "/images/how-it-works/property-2.jpg",
    ],
    location: "Austin, Texas",
    investmentType: "pooled",
    category: "mortgage",
    price: 85000,
    minInvestment: 10000,
    maxInvestment: 25000,
    targetAmount: 85000,
    currentFunded: 85000,
    investorCount: 6,
    expectedROI: 15,
    monthlyReturn: 1.25,
    duration: 36,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: "1800 sqft",
    status: "fully-funded",
    features: ["Newly Renovated", "Large Backyard", "Near Schools", "Low Crime Area", "Modern Kitchen"],
    riskLevel: "low",
    createdAt: "2026-01-20",
  },
  {
    id: "prop-004",
    title: "Mountain Cabin - Seasonal Airbnb Rental",
    description: "Charming mountain retreat perfect for seasonal rentals. High demand during winter and summer seasons with excellent occupancy rates.",
    images: [
      "/images/how-it-works/property-1.jpg",
      "/images/how-it-works/property-2.jpg",
      "/images/how-it-works/property-3.jpg",
    ],
    location: "Aspen, Colorado",
    investmentType: "pooled",
    category: "airbnb",
    price: 95000,
    minInvestment: 8000,
    maxInvestment: 30000,
    targetAmount: 95000,
    currentFunded: 52000,
    investorCount: 8,
    expectedROI: 20,
    monthlyReturn: 1.67,
    duration: 18,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: "1600 sqft",
    status: "available",
    features: ["Mountain View", "Fireplace", "Ski Storage", "Hot Tub", "Deck", "Pet Friendly"],
    riskLevel: "medium",
    createdAt: "2026-01-25",
  },
  {
    id: "prop-005",
    title: "Urban Loft - High-Yield Arbitrage",
    description: "Modern loft in trendy urban district. Ideal for corporate rentals and business travelers with consistent demand year-round.",
    images: [
      "/images/how-it-works/property-2.jpg",
      "/images/how-it-works/property-1.jpg",
      "/images/how-it-works/property-3.jpg",
    ],
    location: "San Francisco, California",
    investmentType: "individual",
    category: "arbitrage",
    price: 55000,
    minInvestment: 55000,
    maxInvestment: 55000,
    targetAmount: 55000,
    currentFunded: 55000,
    investorCount: 1,
    expectedROI: 19,
    monthlyReturn: 1.58,
    duration: 12,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    area: "900 sqft",
    status: "available",
    features: ["Industrial Design", "High Ceilings", "Exposed Brick", "Walking Distance to Tech Hub", "Co-working Space"],
    riskLevel: "low",
    createdAt: "2026-02-03",
  },
  {
    id: "prop-006",
    title: "Lakeside Property - Pooled Mortgage Fund",
    description: "Beautiful lakeside home in peaceful residential area. Long-term mortgage investment with stable returns and low vacancy risk.",
    images: [
      "/images/how-it-works/property-3.jpg",
      "/images/how-it-works/property-2.jpg",
      "/images/how-it-works/property-1.jpg",
    ],
    location: "Lake Tahoe, Nevada",
    investmentType: "pooled",
    category: "mortgage",
    price: 110000,
    minInvestment: 15000,
    maxInvestment: 40000,
    targetAmount: 110000,
    currentFunded: 66000,
    investorCount: 5,
    expectedROI: 16,
    monthlyReturn: 1.33,
    duration: 30,
    bedrooms: 4,
    bathrooms: 3,
    parking: 3,
    area: "2200 sqft",
    status: "available",
    features: ["Lake View", "Private Dock", "Boat Storage", "Fireplace", "Large Deck", "Mountain Views"],
    riskLevel: "low",
    createdAt: "2026-01-22",
  },
  {
    id: "prop-007",
    title: "Historic Brownstone - Premium Arbitrage",
    description: "Elegant historic brownstone in prestigious neighborhood. High-end arbitrage opportunity with luxury amenities and premium rental rates.",
    images: [
      "/images/how-it-works/property-1.jpg",
      "/images/how-it-works/property-3.jpg",
      "/images/how-it-works/property-2.jpg",
    ],
    location: "Brooklyn, New York",
    investmentType: "pooled",
    category: "arbitrage",
    price: 75000,
    minInvestment: 7500,
    maxInvestment: 22500,
    targetAmount: 75000,
    currentFunded: 45000,
    investorCount: 7,
    expectedROI: 21,
    monthlyReturn: 1.75,
    duration: 15,
    bedrooms: 3,
    bathrooms: 2,
    parking: 0,
    area: "1500 sqft",
    status: "available",
    features: ["Historic Charm", "Original Details", "Renovated Kitchen", "Garden Access", "Near Subway"],
    riskLevel: "medium",
    createdAt: "2026-01-30",
  },
  {
    id: "prop-008",
    title: "Desert Oasis - Luxury Airbnb Rental",
    description: "Unique desert property with stunning architecture. High-demand vacation rental with excellent reviews and repeat guests.",
    images: [
      "/images/how-it-works/property-2.jpg",
      "/images/how-it-works/property-3.jpg",
      "/images/how-it-works/property-1.jpg",
    ],
    location: "Scottsdale, Arizona",
    investmentType: "individual",
    category: "airbnb",
    price: 38000,
    minInvestment: 38000,
    maxInvestment: 38000,
    targetAmount: 38000,
    currentFunded: 38000,
    investorCount: 1,
    expectedROI: 24,
    monthlyReturn: 2.0,
    duration: 12,
    bedrooms: 2,
    bathrooms: 2,
    parking: 2,
    area: "1100 sqft",
    status: "available",
    features: ["Desert View", "Private Pool", "Outdoor Shower", "Fire Pit", "Modern Design", "Solar Panels"],
    riskLevel: "medium",
    createdAt: "2026-02-04",
  },
  {
    id: "prop-009",
    title: "College Town Apartment - Student Housing",
    description: "Strategic investment near major university campus. Pooled mortgage investment with high occupancy and predictable cash flow.",
    images: [
      "/images/how-it-works/property-3.jpg",
      "/images/how-it-works/property-1.jpg",
      "/images/how-it-works/property-2.jpg",
    ],
    location: "Boston, Massachusetts",
    investmentType: "pooled",
    category: "mortgage",
    price: 65000,
    minInvestment: 12000,
    maxInvestment: 20000,
    targetAmount: 65000,
    currentFunded: 65000,
    investorCount: 4,
    expectedROI: 14,
    monthlyReturn: 1.17,
    duration: 24,
    bedrooms: 4,
    bathrooms: 2,
    parking: 1,
    area: "1400 sqft",
    status: "fully-funded",
    features: ["Near Campus", "Updated Appliances", "Study Rooms", "High-Speed Internet", "Laundry"],
    riskLevel: "low",
    createdAt: "2026-01-18",
  },
  {
    id: "prop-010",
    title: "Coastal Condo - Coming Soon",
    description: "Exciting new opportunity in prime coastal location. Premium beachfront condo with resort-style amenities. Perfect for luxury vacation rentals.",
    images: [
      "/images/how-it-works/property-1.jpg",
      "/images/how-it-works/property-2.jpg",
      "/images/how-it-works/property-3.jpg",
    ],
    location: "Malibu, California",
    investmentType: "pooled",
    category: "airbnb",
    price: 150000,
    minInvestment: 10000,
    maxInvestment: 50000,
    targetAmount: 150000,
    currentFunded: 0,
    investorCount: 0,
    expectedROI: 25,
    monthlyReturn: 2.08,
    duration: 24,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    area: "2000 sqft",
    status: "coming-soon",
    features: ["Ocean Front", "Resort Amenities", "Concierge", "Infinity Pool", "Private Beach", "Spa"],
    riskLevel: "high",
    createdAt: "2026-02-05",
  },
];

// Mock API function
const fetchPropertyById = async (id: string): Promise<InvestmentProperty | null> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockInvestmentProperties.find((p) => p.id === id) || null;
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<InvestmentProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");

  // Load property
  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      const data = await fetchPropertyById(params.id as string);
      setProperty(data);
      setLoading(false);
    };
    loadProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-body-color dark:text-body-color-dark">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-semibold text-black dark:text-white">
            Property not found
          </p>
          <button
            onClick={() => router.push("/dashboard/property-market/properties")}
            className="mt-4 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const fundingPercentage =
    property.investmentType === "pooled"
      ? (property.currentFunded / property.targetAmount) * 100
      : 100;

  const remainingAmount =
    property.investmentType === "pooled"
      ? property.targetAmount - property.currentFunded
      : 0;

  const amount = parseFloat(investmentAmount) || 0;
  const monthlyEarnings = amount * (property.monthlyReturn / 100);
  const annualEarnings = amount * (property.expectedROI / 100);

  const getCategoryBadge = () => {
    const colors = {
      arbitrage: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      mortgage: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      airbnb: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    };
    return colors[property.category];
  };

  const getRiskBadge = () => {
    const colors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[property.riskLevel];
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/property-market/properties")}
        className="mb-4 flex items-center text-body-color hover:text-primary dark:text-body-color-dark"
      >
        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Properties
      </button>

      {/* Image Carousel */}
      <div className="relative mb-6 h-64 overflow-hidden rounded-xl md:h-96">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="h-full w-full object-cover"
        />
        {/* Navigation Arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-1 text-sm text-white">
          {currentImageIndex + 1} / {property.images.length}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Title and Badges */}
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadge()}`}>
                {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
              </span>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${property.investmentType === "individual" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"}`}>
                {property.investmentType === "individual" ? "Individual" : "Pooled"}
              </span>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRiskBadge()}`}>
                {property.riskLevel.charAt(0).toUpperCase() + property.riskLevel.slice(1)} Risk
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-black dark:text-white md:text-3xl">
              {property.title}
            </h1>
            <p className="flex items-center text-body-color dark:text-body-color-dark">
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.location}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-dark">
            <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
              About This Property
            </h2>
            <p className="text-body-color dark:text-body-color-dark">
              {property.description}
            </p>
          </div>

          {/* Property Details */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-dark">
            <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
              Property Details
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="mb-1 text-sm text-body-color dark:text-body-color-dark">Bedrooms</p>
                <p className="text-lg font-semibold text-black dark:text-white">{property.bedrooms}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-body-color dark:text-body-color-dark">Bathrooms</p>
                <p className="text-lg font-semibold text-black dark:text-white">{property.bathrooms}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-body-color dark:text-body-color-dark">Parking</p>
                <p className="text-lg font-semibold text-black dark:text-white">{property.parking}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-body-color dark:text-body-color-dark">Area</p>
                <p className="text-lg font-semibold text-black dark:text-white">{property.area}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-dark">
            <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
              Features & Amenities
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-black dark:text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Investment Overview */}
          <div className="sticky top-6 mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-800 dark:bg-gray-dark">
            <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
              Investment Overview
            </h2>

            <div className="mb-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-body-color dark:text-body-color-dark">Expected ROI</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{property.expectedROI}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-body-color dark:text-body-color-dark">Monthly Return</span>
                <span className="font-semibold text-black dark:text-white">{property.monthlyReturn}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-body-color dark:text-body-color-dark">Duration</span>
                <span className="font-semibold text-black dark:text-white">{property.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-body-color dark:text-body-color-dark">Min Investment</span>
                <span className="font-semibold text-black dark:text-white">${property.minInvestment.toLocaleString()}</span>
              </div>
              {property.investmentType === "individual" && (
                <div className="flex justify-between">
                  <span className="text-sm text-body-color dark:text-body-color-dark">Total Price</span>
                  <span className="text-xl font-bold text-black dark:text-white">${property.price.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Pooled Investment Progress */}
            {property.investmentType === "pooled" && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-body-color dark:text-body-color-dark">
                    Funded: ${property.currentFunded.toLocaleString()}
                  </span>
                  <span className="font-semibold text-primary">
                    {fundingPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="mb-2 h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-3 rounded-full bg-primary transition-all"
                    style={{ width: `${fundingPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-body-color dark:text-body-color-dark">
                  <span>{property.investorCount} investors</span>
                  <span>${remainingAmount.toLocaleString()} remaining</span>
                </div>
              </div>
            )}

            {/* Investment Calculator */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Investment Amount
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min={property.minInvestment}
                max={property.investmentType === "pooled" ? Math.min(property.maxInvestment, remainingAmount) : property.maxInvestment}
                placeholder={`Min: $${property.minInvestment.toLocaleString()}`}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Return Calculations */}
            {amount > 0 && (
              <div className="mb-6 space-y-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800 dark:text-blue-300">Monthly Earnings</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ${monthlyEarnings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800 dark:text-blue-300">Annual Earnings</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ${annualEarnings.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Invest Button */}
            <button
              onClick={() => setShowInvestmentModal(true)}
              disabled={property.status !== "available" || amount < property.minInvestment}
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {property.status === "available" ? "Invest Now" : property.status === "fully-funded" ? "Fully Funded" : "Coming Soon"}
            </button>

            {property.status === "available" && amount < property.minInvestment && amount > 0 && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                Minimum investment is ${property.minInvestment.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && (
        <InvestmentModal
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
          property={property}
          walletBalance={25000}
          initialAmount={amount}
        />
      )}
    </div>
  );
}
