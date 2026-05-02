import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BrowseServicesClient from "./BrowseServicesClient";

export const metadata: Metadata = {
  title: "Browse Services | LocalLink",
  description:
    "Find verified local service professionals near you. Filter by category, price, rating, and distance to discover the perfect provider.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <BrowseServicesClient />
      </Suspense>
      <Footer />
    </>
  );
}
