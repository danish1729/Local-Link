import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HowItWorksClient from "./HowWorksClient";

export const metadata: Metadata = {
  title: "How It Works | LocalLink",
  description:
    "Everything you need to know about LocalLink — from creating an account and booking services to becoming a provider, payments, reviews, and support.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <HowItWorksClient />
      <Footer />
    </>
  );
}
