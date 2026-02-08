import { Search, MessageCircle, CheckCircle, Star } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Search",
    desc: "Find trusted providers near your location",
  },
  {
    icon: MessageCircle,
    title: "Connect",
    desc: "Discuss requirements and availability",
  },
  {
    icon: CheckCircle,
    title: "Book",
    desc: "Confirm booking with secure payment",
  },
  {
    icon: Star,
    title: "Review",
    desc: "Rate and review after completion",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Book local services in just a few simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="bg-white rounded-2xl p-8 border border-slate-200 text-center hover:shadow-lg transition"
            >
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
