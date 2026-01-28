import SignupForm from "../../components/signup/SignupForm";
import { MapPin, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Create Account | LocalLink",
  description: "Sign up to access local services near you",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left branding section */}
        <section className="hidden lg:flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LocalLink</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Join Our{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-md">
              Connect with trusted service providers or offer your services to
              customers in your area.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4 pt-8">
            {/* Verified Providers */}
            <div className="flex gap-4 group cursor-pointer">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Verified Providers
                </h3>
                <p className="text-sm text-slate-400">
                  All service providers are thoroughly vetted
                </p>
              </div>
            </div>

            {/* Secure Bookings */}
            <div className="flex gap-4 group cursor-pointer">
              <div className="flex-shrink-0">
                <Zap className="w-6 h-6 text-blue-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Secure Bookings
                </h3>
                <p className="text-sm text-slate-400">
                  Safe and encrypted transaction process
                </p>
              </div>
            </div>

            {/* Hyperlocal Search */}
            <div className="flex gap-4 group cursor-pointer">
              <div className="flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Hyperlocal Search
                </h3>
                <p className="text-sm text-slate-400">
                  Find services near you instantly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right form section */}
        <section className="flex items-center justify-center">
          <SignupForm />
        </section>
      </div>
    </main>
  );
}
