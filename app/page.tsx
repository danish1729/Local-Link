import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import PopularCategories from "@/components/landing/PopularCategories";
import ValueProposition from "@/components/landing/ValueProposition";
import ProviderCategorySlider from "@/components/landing/ProviderCategorySlider";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <>
      <Header />
      {/* 1 – Hero: full-screen dark with search bar */}
      <Hero />
      {/* 2 – Trusted By: company logo strip */}
      <TrustedBy />
      {/* 3 – Popular Categories: image card slider */}
      <PopularCategories />
      {/* 4 – Value Proposition / About Us */}
      <ValueProposition />
      {/* 5 – Top-Rated Providers (existing real-data slider) */}
      <ProviderCategorySlider />
      {/* 6 – How It Works */}
      <HowItWorks />
      {/* 7 – Testimonials */}
      <Testimonials />
      {/* 8 – Final CTA */}
      <CTA />
      <Footer />
    </>
  );
}
