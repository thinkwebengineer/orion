"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────

interface Review {
  id: string;
  rating: number;
  body: string;
  user_name: string;
  created_at: string;
}

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  productId: string;
}

// ── Star display (read-only) ───────────────────────────────────────────────

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-[#FFD700]" : "text-zinc-600"}>
          ★
        </span>
      ))}
    </span>
  );
}

// ── Star selector (interactive) ───────────────────────────────────────────

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl transition-colors focus:outline-none ${
              filled ? "text-[#FFD700]" : "text-zinc-600"
            } hover:text-[#FFD700] cursor-pointer`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
      {hover > 0 && (
        <span className="text-sm text-zinc-400 ml-2">
          {hover === 1 ? "Poor" : hover === 2 ? "Fair" : hover === 3 ? "Good" : hover === 4 ? "Very Good" : "Excellent"}
        </span>
      )}
    </div>
  );
}

// ── Format date ─────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Review list ─────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <Stars rating={review.rating} />
        <span className="text-xs text-zinc-500">{formatDate(review.created_at)}</span>
      </div>
      <p className="text-sm font-medium text-zinc-300 mb-1">{review.user_name}</p>
      <p className="text-sm text-zinc-400 leading-relaxed">{review.body}</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Reviews({ productId }: Props) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Fetch reviews ──────────────────────────────────────────────────────

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ── Submit review ──────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || body.trim().length === 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, body: body.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to submit review");
      }

      // Reset form and refetch
      setRating(0);
      setBody("");
      await fetchReviews();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Review form - only for authenticated users */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-base font-semibold text-zinc-100 mb-4">
          Leave a Review
        </h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Rating</label>
              <StarSelector value={rating} onChange={setRating} />
              {rating === 0 && submitError && (
                <p className="text-xs text-red-400 mt-1">Please select a rating</p>
              )}
            </div>
            <div>
              <label htmlFor="review-body" className="block text-sm text-zinc-400 mb-2">
                Your Review
              </label>
              <textarea
                id="review-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Share your experience with this product..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>
            {submitError && (
              <p className="text-sm text-red-400">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={submitting || rating === 0 || body.trim().length === 0}
              className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-zinc-400">
            <Link href="/login" className="text-amber-400 hover:text-amber-300 underline">
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-zinc-100">
          Customer Reviews {reviews.length > 0 && <span className="text-zinc-500 font-normal">({reviews.length})</span>}
        </h3>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span className="ml-3 text-sm text-zinc-400">Loading reviews...</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-800/40 bg-red-900/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-zinc-500 text-sm">No reviews yet.</p>
            <p className="text-zinc-600 text-xs mt-1">Be the first to share your experience.</p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
