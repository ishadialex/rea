import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyInvest from "@/components/WhyInvest";
import TwoWaysToInvest from "@/components/TwoWaysToInvest";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";
import { getTeamMembers, getTestimonials, getInvestmentOptions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
};

export default async function Home() {
  const [teamMembers, testimonials, investmentOptions] = await Promise.all([
    getTeamMembers(),
    getTestimonials(),
    getInvestmentOptions(),
  ]);

  return (
    <>
      <ScrollUp />
      <Hero />
      <HowItWorks />
      <WhyInvest />
      <TwoWaysToInvest options={investmentOptions} />
      <Team members={teamMembers} />
      <Video />
      <Brands />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
