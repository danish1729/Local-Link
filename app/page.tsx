import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ProviderCategorySlider from "@/components/landing/ProviderCategorySlider";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <ProviderCategorySlider />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
