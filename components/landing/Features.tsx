import {
  ShieldCheck,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: MapPin,
    title: "Hyperlocal Search",
    desc: "Find services within your neighborhood",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Escrow-based payments with protection",
  },
  {
    icon: Clock,
    title: "Quick Booking",
    desc: "Same-day or scheduled services",
  },
  {
    icon: TrendingUp,
    title: "Higher Earnings",
    desc: "Transparent pricing for providers",
  },
  {
    icon: Award,
    title: "Verified Quality",
    desc: "Only trusted professionals onboarded",
  },
  {
    icon: Zap,
    title: "Fast Support",
    desc: "Local support when you need it",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">
            Why Choose LocalLink
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built for Pakistan’s local service ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition space-y-4"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-600">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
