type Provider = {
  name: string;
  serviceType?: string;
};

type Props = {
  provider: Provider;
};

export default function ProviderHeader({ provider }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
        {provider.name[0]}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">{provider.name}</h1>
        <p className="text-slate-600">{provider.serviceType}</p>
      </div>
    </div>
  );
}
