import LoginForm from "../../components/login/LoginForm";
import { Lock, MapPin, CheckCircle, MapPinned } from "lucide-react";

export const metadata = {
  title: "Login | LocalLink",
  description: "Login to access local services near you",
};

const FEATURES = [
  {
    icon: Lock,
    title: "Bank-Level Security",
    desc: "End-to-end encrypted authentication",
  },
  {
    icon: MapPin,
    title: "Location Intelligence",
    desc: "Discover services precisely near you",
  },
  {
    icon: CheckCircle,
    title: "Verified Providers",
    desc: "All providers are thoroughly vetted",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left branding section */}
        <section className="hidden lg:flex flex-col justify-center space-y-8">
          {/* Logo + Heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <MapPinned className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LocalLink</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome{" "}
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Back
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-md">
              Access local services, manage bookings, and connect with verified
              providers in your area.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4 pt-8">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-400 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right form section */}
        <section className="flex items-center justify-center">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
