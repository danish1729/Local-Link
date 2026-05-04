import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Types } from "mongoose";
import Header from "@/components/layout/Header";
import MessageButton from "@/components/chat/MessageButton";
import { format } from "date-fns";
import { MapPin, Calendar, User as UserIcon } from "lucide-react";

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  const customer = await User.findOne({
    _id: id,
    role: "customer",
  }).lean();

  if (!customer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 pt-12">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
          
          <div className="px-6 pb-8">
            {/* Avatar */}
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                {customer.profileImage ? (
                  <img src={customer.profileImage} alt={customer.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-full h-full p-4 text-slate-400" />
                )}
              </div>
              <div className="pb-2">
                <MessageButton userId={id} label="Message Customer" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Customer</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-slate-100">
                {customer.address && (
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {customer.address}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Joined {customer.createdAt ? format(new Date(customer.createdAt), "MMMM yyyy") : "Recently"}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-2">About</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {customer.bio || "This user hasn't added a bio yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
