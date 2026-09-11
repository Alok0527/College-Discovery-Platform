"use client";

import Image from "next/image";
import Link from "next/link";

interface CollegeCardProps {
  id: string;
  name: string;
  slug?: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  imageUrl: string | null;
  placementAverage: number | null;
  courses: string[];
}

export default function CollegeCard({
  id,
  name,
  slug,
  city,
  state,
  fees,
  rating,
  imageUrl,
  placementAverage,
  courses,
}: CollegeCardProps) {
  return (
    <Link
      href={`/colleges/${slug ?? id}`}
      className="group block rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-zinc-100 dark:bg-zinc-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-300 dark:text-zinc-600">
            {name.charAt(0)}
          </div>
        )}
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-amber-600 backdrop-blur dark:bg-zinc-900/90">
          ★ {rating.toFixed(1)}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {name}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {city}, {state}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Annual Fees
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              ₹{fees.toLocaleString("en-IN")}
            </p>
          </div>
          {placementAverage !== null && (
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Avg Placement
              </p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                ₹{placementAverage.toLocaleString("en-IN")} LPA
              </p>
            </div>
          )}
        </div>

        {courses.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {courses.slice(0, 3).map((course) => (
              <span
                key={course}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              >
                {course}
              </span>
            ))}
            {courses.length > 3 && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                +{courses.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
