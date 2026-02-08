import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">LocalLink</span>
            </div>
            <p className="text-sm">
              Pakistan’s trusted hyperlocal services marketplace.
            </p>
          </div>

          {[
            {
              title: "Customers",
              links: ["Browse Services", "Pricing", "Support"],
            },
            {
              title: "Providers",
              links: ["Join Now", "Earning Guide", "FAQs"],
            },
            {
              title: "Company",
              links: ["About", "Contact", "Privacy"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link} className="hover:text-white">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          © 2024 LocalLink — Made for Pakistan 🇵🇰
        </div>
      </div>
    </footer>
  );
}
