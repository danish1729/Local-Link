import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Fatima Khan",
    role: "Homeowner, Karachi",
    content: "Found a plumber within minutes. Professional and affordable.",
    rating: 5,
  },
  {
    name: "Ali Ahmed",
    role: "Electrician, Lahore",
    content: "This platform helped me grow my income quickly.",
    rating: 5,
  },
  {
    name: "Zainab Malik",
    role: "Business Owner, Islamabad",
    content: "Reliable providers and transparent payments.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Trusted by Thousands</h2>
          <p className="text-xl text-slate-300">
            Real feedback from real users
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700"
            >
              <div className="flex gap-1 mb-4">
                {Array(t.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
              </div>
              <p className="text-slate-200 mb-6">{t.content}</p>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-slate-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
