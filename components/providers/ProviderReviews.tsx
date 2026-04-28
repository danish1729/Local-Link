"use client";

import { useState } from "react";
import { Star, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

type ProviderReviewsProps = {
  providerId: string;
  initialReviews: any[];
  averageRating: number;
  totalReviews: number;
};

export default function ProviderReviews({ providerId, initialReviews, averageRating, totalReviews }: ProviderReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/provider/${providerId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setReviews([data.review, ...reviews]);
      setSuccess(true);
      setRating(0);
      setComment("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 mt-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Reviews <span className="text-slate-500 font-medium">({totalReviews})</span>
        </h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2 text-yellow-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold text-slate-900">{averageRating}</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="mb-10">
        {success ? (
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
            <h4 className="text-lg font-bold text-slate-900">Thank you for your review!</h4>
            <p className="text-slate-600 text-sm mt-1">Your feedback helps our community.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-4 text-emerald-600 text-sm font-semibold hover:underline"
            >
              Write another review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4">Leave a Review</h4>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full bg-white border border-slate-300 rounded-lg p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none h-24 mb-4"
            ></textarea>

            {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-70 flex items-center gap-2 text-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Post Review
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
            <p className="text-slate-500">Be the first to leave a review for this provider.</p>
          </div>
        ) : (
          reviews.map((review: any, idx: number) => (
            <div key={idx} className="border-b border-slate-100 last:border-0 pb-8 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {review.customerImage ? (
                      <img src={review.customerImage} alt={review.customerName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-slate-100">
                        {review.customerName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{review.customerName}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {review.createdAt ? format(new Date(review.createdAt), "MMMM d, yyyy") : "Recently"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
