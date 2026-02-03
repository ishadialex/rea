import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhyInvest from "@/components/WhyInvest";
import TwoWaysToInvest from "@/components/TwoWaysToInvest";
import Team from "@/components/Team";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <HowItWorks />
      <WhyInvest />
      <TwoWaysToInvest />
      <Team />
      {/* <Features /> */}
      <Video />
      <Brands />
      {/* <AboutSectionOne />
      <AboutSectionTwo /> */}
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}
