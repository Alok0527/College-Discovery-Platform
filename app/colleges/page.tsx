"use client";

import { useState, useEffect } from "react";
import CollegeCard from "@/components/college-card";
import SearchBar from "@/components/search-bar";
import FilterSidebar from "@/components/filter-sidebar";
import Pagination from "@/components/pagination";

interface Filters {
  city: string;
  state: string;
  minFees: string;
  maxFees: string;
  minRating: string;
  course: string;
}

interface CollegeResult {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  imageUrl: string | null;
  placementAverage: number | null;
  placementHighest: number | null;
  courses: string[];
}

interface ApiResponse {
  success: boolean;
  data?: {
    results: CollegeResult[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
  };
  error?: { message: string };
}

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "fees-asc", label: "Fees (Low to High)" },
  { value: "fees-desc", label: "Fees (High to Low)" },
  { value: "rating-desc", label: "Rating (High to Low)" },
  { value: "rating-asc", label: "Rating (Low to High)" },
] as const;

const DEFAULT_FILTERS: Filters = {
  city: "",
  state: "",
  minFees: "",
  maxFees: "",
  minRating: "",
  course: "",
};

function syncUrl(search: string, sort: string, filters: Filters, page: number) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (filters.city) params.set("city", filters.city);
  if (filters.state) params.set("state", filters.state);
  if (filters.minFees) params.set("minFees", filters.minFees);
  if (filters.maxFees) params.set("maxFees", filters.maxFees);
  if (filters.minRating) params.set("minRating", filters.minRating);
  if (filters.course) params.set("course", filters.course);
  if (sort !== "rating-desc") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  window.history.replaceState(null, "", `/colleges${qs ? `?${qs}` : ""}`);
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<CollegeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [searchKey, setSearchKey] = useState(0);

  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);

  const [search, setSearch] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("search") ?? "";
  });
  const [sort, setSort] = useState(() => {
    if (typeof window === "undefined") return "rating-desc";
    return new URLSearchParams(window.location.search).get("sort") ?? "rating-desc";
  });
  const [filters, setFilters] = useState<Filters>(() => {
    if (typeof window === "undefined") return DEFAULT_FILTERS;
    const p = new URLSearchParams(window.location.search);
    return {
      city: p.get("city") ?? "",
      state: p.get("state") ?? "",
      minFees: p.get("minFees") ?? "",
      maxFees: p.get("maxFees") ?? "",
      minRating: p.get("minRating") ?? "",
      course: p.get("course") ?? "",
    };
  });
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const p = new URLSearchParams(window.location.search);
    return Math.max(1, parseInt(p.get("page") ?? "1", 10) || 1);
  });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      syncUrl(search, sort, filters, currentPage);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filters.city) params.set("city", filters.city);
      if (filters.state) params.set("state", filters.state);
      if (filters.minFees) params.set("minFees", filters.minFees);
      if (filters.maxFees) params.set("maxFees", filters.maxFees);
      if (filters.minRating) params.set("minRating", filters.minRating);
      if (filters.course) params.set("course", filters.course);
      const [sortBy, sortOrder] = sort.split("-");
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      params.set("page", String(currentPage));
      params.set("limit", "12");
      try {
        const res = await fetch(`/api/colleges?${params.toString()}`);
        const json: ApiResponse = await res.json();
        if (cancelled) return;
        if (json.success && json.data) {
          setColleges(json.data.results);
          setTotalPages(json.data.totalPages);
          setTotalResults(json.data.totalResults);
        } else {
          setError(json.error?.message ?? "Failed to load colleges");
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
  }, [search, filters, sort, currentPage, retryCount]);

  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch("/api/colleges?limit=100");
        const json: ApiResponse = await res.json();
        if (json.success && json.data) {
          const uniqueCities = [
            ...new Set(json.data.results.map((c) => c.city)),
          ].sort();
          const uniqueStates = [
            ...new Set(json.data.results.map((c) => c.state)),
          ].sort();
          const uniqueCourses = [
            ...new Set(json.data.results.flatMap((c) => c.courses)),
          ].sort();
          setCities(uniqueCities);
          setStates(uniqueStates);
          setCourses(uniqueCourses);
        }
      } catch {
        // metadata fetch failed silently
      }
    }
    fetchMeta();
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Discover Colleges
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Find the best engineering colleges across India
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchBar key={searchKey} value={search} onChange={handleSearch} />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="hidden text-sm text-zinc-400 sm:inline">
              {totalResults} college{totalResults !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full shrink-0 lg:w-72">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              cities={cities}
              states={states}
              courses={courses}
            />
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="h-48 rounded-t-2xl bg-zinc-200 dark:bg-zinc-800" />
                    <div className="space-y-3 p-5">
                      <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                      <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                      <div className="flex justify-between">
                        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 dark:border-red-900 dark:bg-red-950/30">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={() => setRetryCount((c) => c + 1)}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : colleges.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
                  No colleges found
                </p>
                <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSearchKey((k) => k + 1);
                    setFilters(DEFAULT_FILTERS);
                    setSort("rating-desc");
                    setCurrentPage(1);
                  }}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} {...college} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
