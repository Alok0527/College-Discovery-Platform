"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const EXAMS = ["JEE Main", "JEE Advanced"];
const CATEGORIES = ["General", "OBC", "SC", "ST"];
const BRANCHES = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Information Technology",
  "Biotechnology",
];

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  placementAverage: number | null;
  imageUrl: string | null;
}

interface PredictorResult {
  college: College;
  branch: string;
  closingRank: number;
  chance: "High" | "Medium" | "Low";
  exam: string;
  year: number;
}

interface ApiResponse {
  success: boolean;
  data?: PredictorResult[];
  error?: { message: string };
}

const chanceConfig = {
  High: {
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    label: "High Chance",
  },
  Medium: {
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    label: "Medium Chance",
  },
  Low: {
    bg: "bg-orange-50 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    label: "Low Chance",
  },
};

function PredictorContent() {
  const searchParams = useSearchParams();
  const initialExam =
    EXAMS.find((e) => e === searchParams.get("exam")) ?? "JEE Main";

  const [exam, setExam] = useState(initialExam);
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [branch, setBranch] = useState("");

  const [results, setResults] = useState<PredictorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(rank, 10);
    if (!rankNum || rankNum <= 0) {
      setError("Please enter a valid rank");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const body: Record<string, unknown> = { exam, rank: rankNum, category };
      if (branch) body.branch = branch;

      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json: ApiResponse = await res.json();

      if (json.success) {
        setResults(json.data ?? []);
      } else {
        setError(json.error?.message ?? "Prediction failed");
        setResults([]);
      }
    } catch {
      setError("Network error. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Admission Predictor
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Enter your rank to find colleges where you have a chance of admission
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Exam
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                {EXAMS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Rank
              </label>
              <input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 5000"
                min={1}
                max={1000000}
                required
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Branch{" "}
                <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">All Branches</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !rank}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Predicting...
              </span>
            ) : (
              "Find Colleges"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {hasSearched && !loading && !error && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {results.length > 0
                ? `${results.length} college${results.length !== 1 ? "s" : ""} found`
                : "No matching colleges found"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {results.length > 0
                ? "Based on previous year cutoff data"
                : "Try adjusting your rank, category, or branch"}
            </p>

            <div className="mt-4 space-y-4">
              {results.map((result, i) => {
                const chance = chanceConfig[result.chance];
                return (
                  <Link
                    key={`${result.college.id}-${result.branch}-${i}`}
                    href={`/colleges/${result.college.slug ?? result.college.id}`}
                    className="group block rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:shadow-md hover:border-blue-200 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                            {result.college.name}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${chance.bg} ${chance.text} ${chance.border}`}
                          >
                            {chance.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {result.college.city}, {result.college.state}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {result.branch}
                          </span>
                          <span>
                            Closing Rank:{" "}
                            <span className="font-medium text-zinc-900 dark:text-zinc-50">
                              {result.closingRank.toLocaleString("en-IN")}
                            </span>
                          </span>
                          <span>
                            Fees: ₹{result.college.fees.toLocaleString("en-IN")}
                          </span>
                          {result.college.placementAverage !== null && (
                            <span>
                              Avg: ₹{result.college.placementAverage} LPA
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <span className="text-sm font-semibold text-amber-600">
                          ★ {result.college.rating.toFixed(1)}
                        </span>
                        <svg
                          className="h-4 w-4 text-zinc-300 group-hover:text-blue-400 dark:text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PredictorPage() {
  return (
    <Suspense>
      <PredictorContent />
    </Suspense>
  );
}
