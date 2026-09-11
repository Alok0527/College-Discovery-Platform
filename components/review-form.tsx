"use client";

import { useState } from "react";

interface ReviewFormProps {
  collegeId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({
  collegeId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/colleges/${collegeId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setRating(0);
        setComment("");
        onReviewSubmitted();
      } else {
        setError(json.error?.message ?? "Failed to submit review");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
        <p className="text-sm font-medium text-green-700 dark:text-green-300">
          Review submitted successfully!
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm text-green-600 underline hover:text-green-700 dark:text-green-400"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Write a Review
      </h4>

      {/* Star rating */}
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-0.5 transition-colors"
          >
            <svg
              className={`h-6 w-6 ${
                star <= (hoveredRating || rating)
                  ? "text-amber-400"
                  : "text-zinc-300 dark:text-zinc-600"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
            {rating}/5
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience about this college..."
        rows={3}
        className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
      />

      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
