import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ProviderProfileCard from "@/components/providers/ProviderProfileCard";
import ProviderInfo from "@/components/providers/ProviderInfo";
import ProviderStats from "@/components/providers/ProviderStats";
import ProviderReviews from "@/components/providers/ProviderReviews";
import ProviderGallery from "@/components/providers/ProvidersGallery";
import ProviderCertificates from "@/components/providers/ProviderCertificates";
import { Types } from "mongoose";
import Header from "@/components/layout/Header";
import { serializeProvider } from "@/lib/serializers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProviderProfilePage({ params }: Props) {
  await connectDB();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  const rawProvider = await User.findOne({
    _id: id,
    role: "provider",
  }).lean();

  if (!rawProvider) {
    notFound();
  }

  const provider = serializeProvider(rawProvider); //

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar - Profile Card (Sticky) */}
            <div className="lg:col-span-4">
              <ProviderProfileCard provider={provider} />
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <ProviderInfo provider={provider} />
              
              <ProviderStats provider={provider} />
              
              <ProviderCertificates certificates={provider.certificates} />
              <ProviderGallery providerId={provider._id} />
              <ProviderReviews 
                providerId={provider._id} 
                initialReviews={provider.reviewsReceived}
                averageRating={provider.averageRating}
                totalReviews={provider.totalReviews}
              />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
