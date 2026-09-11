"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarRating from "@/components/star-rating";

interface MyReview {
  id: string;
  collegeId: string;
  collegeName: string;
  collegeSlug: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [reviews, setReviews] = useState<MyReview[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.replace("/login");
          return;
        }
        if (cancelled) return;

        const reviewsRes = await fetch("/api/my/reviews");
        const json = await reviewsRes.json();
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) {
          setReviews(json.data);
        }
      } catch {
        if (!cancelled) router.replace("/login");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/my/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-9 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-6 h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          My Reviews
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Manage the reviews you&apos;ve submitted
        </p>

        {loading ? (
          <div className="mt-6 space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
            <svg
              className="h-12 w-12 text-zinc-300 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
              No reviews yet
            </p>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              Write your first review on a college page
            </p>
            <Link
              href="/colleges"
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse colleges
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/colleges/${review.collegeSlug}`}
                      className="text-base font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                    >
                      {review.collegeName}
                    </Link>
                    <div className="mt-2 flex items-center gap-3">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    aria-label={`Delete review for ${review.collegeName}`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}