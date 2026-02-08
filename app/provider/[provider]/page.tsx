import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ProviderHeader from "@/components/providers/ProvidersHeader";
import ProviderInfo from "@/components/providers/ProviderInfo";
import ProviderStats from "@/components/providers/ProviderStats";
import ProviderActions from "@/components/providers/ProviderActions";

type Props = {
  params: {
    providerId: string;
  };
};

export default async function ProviderProfilePage({ params }: Props) {
  await connectDB();

  const provider = await User.findOne({
    _id: params.providerId,
    role: "provider",
  }).lean();

  if (!provider) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <ProviderHeader provider={provider} />

      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <ProviderInfo provider={provider} />
        <ProviderActions providerId={provider._id.toString()} />
      </div>

      <ProviderStats providerId={provider._id.toString()} />
    </div>
  );
}
