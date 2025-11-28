"use client";

import AboutCresify from "@/components/home/AboutCresify";
import BlogSection from "@/components/home/BlogSection";
import CTASection from "@/components/home/CTASection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedServices from "@/components/home/FeaturedServices";
import HomeBanner from "@/components/home/HomeBanner";
import WhyChoose from "@/components/home/WhyChoose";

export default function DashboardPage() {
  return (
    <div className="">
      <HomeBanner />
      <FeaturedProducts />
      <FeaturedServices />
      <WhyChoose />
      <BlogSection />
      <AboutCresify />
      <CTASection />
    </div>
  );
}
