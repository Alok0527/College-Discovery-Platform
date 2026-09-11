"use client";

import StarRating from "@/components/star-rating";

interface ReviewItemProps {
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewCard({ rating, comment, createdAt }: ReviewItemProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <StarRating rating={rating} size="md" />
        <span className="text-xs text-zinc-400">
          {new Date(createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {comment}
      </p>
    </div>
  );
}
