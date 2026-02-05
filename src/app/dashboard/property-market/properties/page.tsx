"use client";

import { useState, useEffect, useMemo } from "react";
import { InvestmentProperty } from "@/types/investment";
import PropertyCard from "@/components/PropertyCard";

// Mock data for investment properties
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

// Mock API functions
const fetchInvestmentProperties = async (filters?: {
  category?: string;
  type?: string;
  status?: string;
  search?: string;
}): Promise<InvestmentProperty[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let filtered = mockInvestmentProperties;

  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters?.type && filters.type !== "all") {
    filtered = filtered.filter((p) => p.investmentType === filters.type);
  }

  if (filters?.status && filters.status !== "all") {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  return filtered;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<InvestmentProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    status: "all",
    search: "",
  });

  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      const data = await fetchInvestmentProperties(filters);
      setProperties(data);
      setLoading(false);
    };
    loadProperties();
  }, [filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const available = properties.filter((p) => p.status === "available");
    const avgROI =
      available.length > 0
        ? available.reduce((sum, p) => sum + p.expectedROI, 0) / available.length
        : 0;

    // Mock total invested (in real app, this would come from user's investment history)
    const totalInvested = 0;
    const activeInvestments = 0;

    return {
      totalProperties: properties.length,
      avgROI: avgROI.toFixed(1),
      totalInvested,
      activeInvestments,
    };
  }, [properties]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
          Investment Properties
        </h1>
        <p className="mt-2 text-sm text-body-color dark:text-body-color-dark md:text-base">
          Browse our curated selection of high-yield investment opportunities
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
            Total Properties
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {stats.totalProperties}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
            Average ROI
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.avgROI}%
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
            Total Invested
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            ${stats.totalInvested.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark md:p-6">
          <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
            Active Investments
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {stats.activeInvestments}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow dark:border-gray-800 dark:bg-gray-dark">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Category
            </label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              >
                <option value="all" className="bg-white text-black dark:bg-gray-800 dark:text-white">All Categories</option>
                <option value="arbitrage" className="bg-white text-black dark:bg-gray-800 dark:text-white">Arbitrage</option>
                <option value="mortgage" className="bg-white text-black dark:bg-gray-800 dark:text-white">Mortgage</option>
                <option value="airbnb" className="bg-white text-black dark:bg-gray-800 dark:text-white">Airbnb</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Investment Type
            </label>
            <div className="relative">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              >
                <option value="all" className="bg-white text-black dark:bg-gray-800 dark:text-white">All Types</option>
                <option value="individual" className="bg-white text-black dark:bg-gray-800 dark:text-white">Individual</option>
                <option value="pooled" className="bg-white text-black dark:bg-gray-800 dark:text-white">Pooled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Status
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              >
                <option value="all" className="bg-white text-black dark:bg-gray-800 dark:text-white">All Status</option>
                <option value="available" className="bg-white text-black dark:bg-gray-800 dark:text-white">Available</option>
                <option value="fully-funded" className="bg-white text-black dark:bg-gray-800 dark:text-white">Fully Funded</option>
                <option value="coming-soon" className="bg-white text-black dark:bg-gray-800 dark:text-white">Coming Soon</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search properties..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-black outline-none focus:border-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-body-color dark:text-body-color-dark">
              Loading properties...
            </p>
          </div>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow dark:border-gray-800 dark:bg-gray-dark">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-lg font-semibold text-black dark:text-white">
            No properties found
          </p>
          <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
}
