import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <h2 className="text-4xl lg:text-5xl font-bold">
          Ready to Get Started?
        </h2>

        <p className="text-xl text-blue-100">
          Join thousands of users already connecting with local services.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="/signup?role=customer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            Find Services
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/signup?role=provider"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Become a Provider
          </a>
        </div>
      </div>
    </section>
  );
}
