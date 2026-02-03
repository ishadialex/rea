"use client";

import Image from "next/image";
import Link from "next/link";

const TwoWaysToInvest = () => {
  const investmentOptions = [
    {
      image: "/images/investment/entire-ownership.jpg",
      title: "Entire Rental Property Ownership",
      minInvestment: "$15,000",
      description:
        "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000. This option grants you 100% control of the asset and all rental income it generates. No revenue sharing, no third-party splits. You decide how it's managed, when it's rented, and how the earnings are reinvested or withdrawn. Perfect for investors seeking maximum autonomy and long-term wealth through short-term rentals.",
      link: "/investment/entire-ownership",
    },
    {
      image: "/images/investment/mortgage-backed.jpg",
      title: "Mortgage Backed Airbnb Arbitrage",
      minInvestment: "$45,000",
      description:
        "Golden Units helps investors acquire high performing Airbnb properties using strategic mortgage financing. With investments starting from just $45,000, you only fund 15% to 30% of the property's cost, while we cover the rest through the profit we make from short-term rentals We fully furnish, manage, and list the property on Airbnb; using 50% of the monthly profit to repay the mortgage and remitting the other 50% directly to you. Once the loan is cleared, typically within 3 years, you decide whether to cash out, continue earning, or take over full control of the property. Your money works smarter, not harder, earning you monthly income and long term property appreciation with minimal upfront capital.",
      link: "/investment/mortgage-backed",
    },
  ];

  return (
    <section className="relative bg-gray-2 py-16 dark:bg-bg-color-dark md:py-20 lg:py-28">
      <div className="container">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-[600px] text-center md:mb-16 lg:mb-20">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-[45px] md:leading-tight">
            Two Ways to
            <br />
            Invest
          </h2>
        </div>

        {/* Investment Cards */}
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {investmentOptions.map((option, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-dark dark:shadow-two sm:p-8 md:p-10"
            >
              {/* Image */}
              <div className="mb-8 overflow-hidden rounded-lg">
                <div className="relative h-[200px] sm:h-[240px] md:h-[280px] w-full">
                  <Image
                    src={option.image}
                    alt={option.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">
                {option.title}
              </h3>

              {/* Investment Amount */}
              <div className="mb-6">
                <p className="mb-2 text-sm text-body-color dark:text-body-color-dark">
                  Investments from
                </p>
                <p className="text-3xl font-bold text-black dark:text-white">
                  {option.minInvestment}
                </p>
              </div>

              {/* Description */}
              <p className="mb-8 text-base leading-relaxed text-body-color dark:text-body-color-dark">
                {option.description}
              </p>

              {/* CTA Button */}
              <Link
                href={option.link}
                className="inline-block rounded-xs bg-black px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                EXPLORE MORE
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToInvest;
