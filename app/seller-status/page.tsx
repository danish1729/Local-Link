import Header from "@/components/layout/Header";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Link from "next/link";

export default async function SellerStatusPage() {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(authUser._id);

  if (!user) {
    redirect("/login");
  }

  const status = user.providerStatus;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {status === "pending" && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Pending</h2>
              <p className="text-slate-600 mb-6">
                Your request to become a seller is currently under review by our team. We will notify you once it is approved.
              </p>
            </>
          )}

          {status === "approved" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Approved!</h2>
              <p className="text-slate-600 mb-6">
                Congratulations! You are now a verified seller on LocalLink.
              </p>
              <Link
                href="/dashboard?role=provider"
                className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Go to Seller Dashboard
              </Link>
            </>
          )}

          {status === "rejected" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Rejected</h2>
              <p className="text-slate-600 mb-6">
                Unfortunately, your application to become a seller was not approved at this time.
              </p>
              <Link
                href="/become-seller"
                className="inline-block w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Apply Again
              </Link>
            </>
          )}

          {status === "none" && user.role !== "provider" && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No Application Found</h2>
              <p className="text-slate-600 mb-6">
                You haven't applied to become a seller yet.
              </p>
              <Link
                href="/become-seller"
                className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Become a Seller
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
