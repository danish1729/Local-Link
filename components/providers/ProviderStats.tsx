export default function ProviderStats({ providerId }: { providerId: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 grid grid-cols-3 text-center">
      <div>
        <p className="text-2xl font-bold">4.9</p>
        <p className="text-slate-600">Rating</p>
      </div>
      <div>
        <p className="text-2xl font-bold">120+</p>
        <p className="text-slate-600">Jobs</p>
      </div>
      <div>
        <p className="text-2xl font-bold">98%</p>
        <p className="text-slate-600">Success</p>
      </div>
    </div>
  );
}
