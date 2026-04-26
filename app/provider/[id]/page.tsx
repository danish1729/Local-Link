import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ProviderHeader from "@/components/providers/ProvidersHeader";
import ProviderInfo from "@/components/providers/ProviderInfo";
import ProviderStats from "@/components/providers/ProviderStats";
import ProviderActions from "@/components/providers/ProviderActions";
import ProviderReviews from "@/components/providers/ProviderReviews";
import ProviderGallery from "@/components/providers/ProvidersGallery";
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
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <ProviderHeader provider={provider} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <ProviderInfo provider={provider} />
              <ProviderGallery providerId={provider._id} />
              <ProviderReviews providerId={provider._id} />
            </div>

            {/* Right Sidebar - Actions & Stats */}
            <div className="space-y-6">
              <ProviderActions providerId={provider._id} />
              <ProviderStats providerId={provider._id} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
