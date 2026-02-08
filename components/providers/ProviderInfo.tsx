type Provider = {
  bio?: string;
  serviceType?: string;
  hourlyRate?: number | string;
};

type ProviderInfoProps = {
  provider: Provider;
};

export default function ProviderInfo({ provider }: ProviderInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">About</h2>

      <p className="text-slate-600">{provider.bio || "No bio provided yet."}</p>

      <div className="pt-4 border-t space-y-2">
        <p>
          <span className="font-semibold">Service:</span> {provider.serviceType}
        </p>
        <p>
          <span className="font-semibold">Rate:</span> PKR {provider.hourlyRate}
          /hour
        </p>
      </div>
    </div>
  );
}
