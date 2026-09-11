"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface CompareCollege {
  id: string;
  name: string;
  slug?: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  placementAverage: number | null;
  placementHighest: number | null;
  courses: string[];
}

interface ApiResponse {
  success: boolean;
  data?: CompareCollege[];
  error?: { message: string };
}

function bestIndex(
  values: (number | null)[],
  mode: "highest" | "lowest"
): number {
  let bestIdx = -1;
  let bestVal: number | null = null;
  values.forEach((v, i) => {
    if (v === null) return;
    if (bestVal === null) {
      bestVal = v;
      bestIdx = i;
    } else if (mode === "highest" && v > bestVal) {
      bestVal = v;
      bestIdx = i;
    } else if (mode === "lowest" && v < bestVal) {
      bestVal = v;
      bestIdx = i;
    }
  });
  return bestIdx;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [colleges, setColleges] = useState<CompareCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ids, setIds] = useState<string[]>(() => {
    const fromUrl = searchParams.get("ids");
    if (fromUrl) return fromUrl.split(",").filter(Boolean);
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("compareIds");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (ids.length >= 2) {
      localStorage.setItem("compareIds", JSON.stringify(ids));
    }
  }, [ids]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (ids.length < 2) {
        if (!cancelled) setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/compare?ids=${ids.join(",")}`);
        const json: ApiResponse = await res.json();
        if (cancelled) return;
        if (json.success && json.data) {
          setColleges(json.data);
        } else {
          setError(json.error?.message ?? "Failed to load comparison");
        }
      } catch {
        if (!cancelled) setError("Network error. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const removeCollege = (id: string) => {
    const next = ids.filter((cid) => cid !== id);
    setIds(next);
    if (next.length < 2) setColleges([]);
    router.replace(next.length > 0 ? `/compare?ids=${next.join(",")}` : "/compare");
  };

  const feeBest = bestIndex(
    colleges.map((c) => c.fees),
    "lowest"
  );
  const ratingBest = bestIndex(
    colleges.map((c) => c.rating),
    "highest"
  );
  const avgBest = bestIndex(
    colleges.map((c) => c.placementAverage),
    "highest"
  );
  const highBest = bestIndex(
    colleges.map((c) => c.placementHighest),
    "highest"
  );

  const allCourses = Array.from(
    new Set(colleges.flatMap((c) => c.courses))
  ).sort();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Compare Colleges
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Side-by-side comparison of up to 3 colleges
          </p>
        </div>

        {ids.length < 2 && !loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-900">
            <svg
              className="h-16 w-16 text-zinc-300 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
              Add at least 2 colleges to compare
            </p>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              Use the &quot;Add to Compare&quot; button on college detail pages
            </p>
            <Link
              href="/colleges"
              className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Browse Colleges
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => {
                setIds([]);
                setColleges([]);
                localStorage.removeItem("compareIds");
                router.replace("/compare");
              }}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Clear & Start Over
            </button>
          </div>
        ) : (
          <>
            {/* Remove buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
              {colleges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => removeCollege(c.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-red-800 dark:hover:text-red-400"
                >
                  {c.name}
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* Comparison cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {colleges.map((college) => (
                <Link
                  key={college.id}
                  href={`/colleges/${college.slug ?? college.id}`}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
                >
                  <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {college.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {college.city}, {college.state}
                  </p>
                </Link>
              ))}
            </div>

            {/* Comparison table */}
            <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Feature
                    </th>
                    {colleges.map((c) => (
                      <th
                        key={c.id}
                        className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50"
                      >
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {/* Rating */}
                  <tr className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      Rating
                    </td>
                    {colleges.map((c, i) => (
                      <td
                        key={c.id}
                        className={`px-6 py-4 font-medium ${
                          i === ratingBest
                            ? "text-green-600 dark:text-green-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        ★ {c.rating.toFixed(1)}
                        {i === ratingBest && (
                          <span className="ml-1.5 text-xs text-green-500">
                            Best
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Annual Fees */}
                  <tr className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      Annual Fees
                    </td>
                    {colleges.map((c, i) => (
                      <td
                        key={c.id}
                        className={`px-6 py-4 font-medium ${
                          i === feeBest
                            ? "text-green-600 dark:text-green-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        ₹{c.fees.toLocaleString("en-IN")}
                        {i === feeBest && (
                          <span className="ml-1.5 text-xs text-green-500">
                            Lowest
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Avg Placement */}
                  <tr className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      Avg Placement
                    </td>
                    {colleges.map((c, i) => (
                      <td
                        key={c.id}
                        className={`px-6 py-4 font-medium ${
                          i === avgBest
                            ? "text-green-600 dark:text-green-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {c.placementAverage !== null
                          ? `₹${c.placementAverage} LPA`
                          : "N/A"}
                        {i === avgBest && c.placementAverage !== null && (
                          <span className="ml-1.5 text-xs text-green-500">
                            Best
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Highest Package */}
                  <tr className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      Highest Package
                    </td>
                    {colleges.map((c, i) => (
                      <td
                        key={c.id}
                        className={`px-6 py-4 font-medium ${
                          i === highBest
                            ? "text-green-600 dark:text-green-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {c.placementHighest !== null
                          ? `₹${c.placementHighest} LPA`
                          : "N/A"}
                        {i === highBest && c.placementHighest !== null && (
                          <span className="ml-1.5 text-xs text-green-500">
                            Best
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Location */}
                  <tr className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      Location
                    </td>
                    {colleges.map((c) => (
                      <td
                        key={c.id}
                        className="px-6 py-4 text-zinc-700 dark:text-zinc-300"
                      >
                        {c.city}, {c.state}
                      </td>
                    ))}
                  </tr>

                  {/* Courses */}
                  <tr>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      Courses ({allCourses.length} total)
                    </td>
                    {colleges.map((c) => (
                      <td key={c.id} className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {c.courses.map((course) => (
                            <span
                              key={course}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
