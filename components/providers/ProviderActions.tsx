import Link from "next/link";

export default function ProviderActions({
  providerId,
}: {
  providerId: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Hire Provider</h2>

      <Link
        href={`/dashboard/bookings/new?providerId=${providerId}`}
        className="block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Book Now
      </Link>

      <p className="text-sm text-slate-500 text-center">
        Secure booking • Verified provider
      </p>
    </div>
  );
}
