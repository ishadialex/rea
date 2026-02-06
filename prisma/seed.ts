import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.teamMember.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.investmentOption.deleteMany();

  // Seed Team Members
  const teamMembers = [
    {
      name: "Reda Assel",
      role: "Chief Operating Officer",
      image: "/images/team/member-1.jpg",
      instagram: "https://instagram.com/",
      order: 0,
    },
    {
      name: "Laura Whitlock",
      role: "Financial Consultant",
      image: "/images/team/member-2.jpg",
      instagram: "https://instagram.com/",
      order: 1,
    },
    {
      name: "Crystal Rocillo",
      role: "Chief Financial Officer",
      image: "/images/team/member-3.jpg",
      instagram: "https://instagram.com/",
      order: 2,
    },
    {
      name: "Michael Torres",
      role: "Property Manager",
      image: "/images/team/member-4.jpg",
      instagram: "https://instagram.com/",
      order: 3,
    },
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      image: "/images/team/member-5.jpg",
      instagram: "https://instagram.com/",
      order: 4,
    },
    {
      name: "David Chen",
      role: "Investment Analyst",
      image: "/images/team/member-6.jpg",
      instagram: "https://instagram.com/",
      order: 5,
    },
    {
      name: "Emma Martinez",
      role: "Client Relations Manager",
      image: "/images/team/member-7.jpg",
      instagram: "https://instagram.com/",
      order: 6,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`  Seeded ${teamMembers.length} team members`);

  // Seed Testimonials
  const testimonials = [
    {
      name: "Musharof Chy",
      designation: "Founder @TailGrids",
      content:
        "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
      image: "/images/testimonials/auth-01.png",
      star: 5,
    },
    {
      name: "Devid Weilium",
      designation: "Founder @UIdeck",
      content:
        "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
      image: "/images/testimonials/auth-02.png",
      star: 5,
    },
    {
      name: "Lethium Frenci",
      designation: "Founder @Lineicons",
      content:
        "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
      image: "/images/testimonials/auth-03.png",
      star: 5,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log(`  Seeded ${testimonials.length} testimonials`);

  // Seed Investment Options
  const investmentOptions = [
    {
      title: "Entire Rental Property Ownership",
      image: "/images/investment/entire-ownership.jpg",
      minInvestment: "$15,000",
      description:
        "Step into full ownership of a profitable Airbnb rental property with an investment as low as $15,000. This option grants you 100% control of the asset and all rental income it generates. No revenue sharing, no third-party splits. You decide how it's managed, when it's rented, and how the earnings are reinvested or withdrawn. Perfect for investors seeking maximum autonomy and long-term wealth through short-term rentals.",
      link: "/investment/entire-ownership",
      order: 0,
    },
    {
      title: "Mortgage Backed Airbnb Arbitrage",
      image: "/images/investment/mortgage-backed.jpg",
      minInvestment: "$45,000",
      description:
        "Golden Units helps investors acquire high performing Airbnb properties using strategic mortgage financing. With investments starting from just $45,000, you only fund 15% to 30% of the property's cost, while we cover the rest through the profit we make from short-term rentals We fully furnish, manage, and list the property on Airbnb; using 50% of the monthly profit to repay the mortgage and remitting the other 50% directly to you. Once the loan is cleared, typically within 3 years, you decide whether to cash out, continue earning, or take over full control of the property. Your money works smarter, not harder, earning you monthly income and long term property appreciation with minimal upfront capital.",
      link: "/investment/mortgage-backed",
      order: 1,
    },
  ];

  for (const option of investmentOptions) {
    await prisma.investmentOption.create({ data: option });
  }
  console.log(`  Seeded ${investmentOptions.length} investment options`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
