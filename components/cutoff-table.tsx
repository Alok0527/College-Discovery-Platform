"use client";

import { useState, useMemo } from "react";

interface CutoffItem {
  id: string;
  exam: string;
  branch: string;
  category: string;
  openingRank: number | null;
  closingRank: number;
  year: number;
}

interface CutoffTableProps {
  cutoffs: CutoffItem[];
}

export default function CutoffTable({ cutoffs }: CutoffTableProps) {
  const [examFilter, setExamFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const exams = useMemo(
    () => ["All", ...Array.from(new Set(cutoffs.map((c) => c.exam))).sort()],
    [cutoffs]
  );

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(cutoffs.map((c) => c.category))).sort(),
    ],
    [cutoffs]
  );

  const filtered = useMemo(
    () =>
      cutoffs.filter(
        (c) =>
          (examFilter === "All" || c.exam === examFilter) &&
          (categoryFilter === "All" || c.category === categoryFilter)
      ),
    [cutoffs, examFilter, categoryFilter]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        >
          {exams.map((e) => (
            <option key={e} value={e}>
              {e === "All" ? "All Exams" : e}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400">
          No cutoff data available for the selected filters.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Exam
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Branch
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Opening Rank
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Closing Rank
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Year
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filtered.map((cutoff) => (
                <tr
                  key={cutoff.id}
                  className="bg-white transition-colors hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                    {cutoff.exam}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {cutoff.branch}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {cutoff.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {cutoff.openingRank?.toLocaleString("en-IN") ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    {cutoff.closingRank.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {cutoff.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
