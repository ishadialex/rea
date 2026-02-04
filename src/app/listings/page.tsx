"use client";

import Image from "next/image";

interface Property {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
}

const properties: Property[] = [
  {
    id: 1,
    title: "Entire Rental Property Ownership",
    price: "$15,000",
    description: "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000.",
    image: "/images/how-it-works/property-1.jpg",
  },
  {
    id: 2,
    title: "Entire Rental Property Ownership",
    price: "$15,000",
    description: "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000.",
    image: "/images/how-it-works/property-2.jpg",
  },
  {
    id: 3,
    title: "Entire Rental Property Ownership",
    price: "$15,000",
    description: "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000.",
    image: "/images/how-it-works/property-3.jpg",
  },
  {
    id: 4,
    title: "Entire Rental Property Ownership",
    price: "$15,000",
    description: "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000.",
    image: "/images/how-it-works/property-1.jpg",
  },
  {
    id: 5,
    title: "Entire Rental Property Ownership",
    price: "$15,000",
    description: "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000.",
    image: "/images/how-it-works/property-2.jpg",
  },
  {
    id: 6,
    title: "Entire Rental Property Ownership",
    price: "$15,000",
    description: "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000.",
    image: "/images/how-it-works/property-3.jpg",
  },
];

export default function ListingsPage() {
  return (
    <section className="relative z-10 overflow-hidden bg-white pb-12 pt-36 dark:bg-gray-dark md:pb-20 lg:pb-28 lg:pt-40">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-[45px] md:leading-tight">
            Properties Listings
          </h1>
        </div>

        {/* Properties Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-dark"
            >
              {/* Property Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold text-black dark:text-white">
                  {property.title}
                </h3>
                <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
                  Investments from
                </p>
                <p className="mb-4 text-2xl font-bold text-black dark:text-white">
                  {property.price}
                </p>
                <p className="mb-6 text-sm leading-relaxed text-body-color dark:text-body-color-dark">
                  {property.description}
                </p>

                {/* View More Button */}
                <button className="w-full rounded-full bg-black px-8 py-3 text-center text-base font-medium text-white transition-all duration-300 hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90">
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
