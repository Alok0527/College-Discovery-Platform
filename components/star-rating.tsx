"use client";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md";
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
}: StarRatingProps) {
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => {
        const fill =
          rating >= i + 1
            ? "currentColor"
            : rating >= i + 0.5
              ? "currentColor"
              : "none";
        const opacity = rating >= i + 1 ? 1 : rating >= i + 0.5 ? 0.6 : 0.2;
        return (
          <svg
            key={i}
            className={sizeClass}
            style={{ color: "#f59e0b", opacity }}
            fill={fill}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        );
      })}
    </div>
  );
}
