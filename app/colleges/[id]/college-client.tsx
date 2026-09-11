"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/star-rating";
import ReviewCard from "@/components/review-card";
import ReviewForm from "@/components/review-form";
import CutoffTable from "@/components/cutoff-table";

interface Course {
  id: string;
  name: string;
  duration: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Cutoff {
  id: string;
  exam: string;
  branch: string;
  category: string;
  openingRank: number | null;
  closingRank: number;
  year: number;
}

export interface CollegeDetail {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  location: string;
  fees: number;
  rating: number;
  overview: string;
  placementAverage: number | null;
  placementHighest: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
  reviews: Review[];
  cutoffs: Cutoff[];
}

type Tab = "overview" | "courses" | "cutoffs" | "reviews";

export default function CollegeDetailClient({
  initialCollege,
}: {
  initialCollege: CollegeDetail;
}) {
  const [college, setCollege] = useState<CollegeDetail>(initialCollege);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("compareIds");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleCompare = () => {
    setCompareIds((prev) => {
      const next = prev.includes(college.id)
        ? prev.filter((cid) => cid !== college.id)
        : prev.length < 3
          ? [...prev, college.id]
          : prev;
      localStorage.setItem("compareIds", JSON.stringify(next));
      return next;
    });
  };

  const inCompare = compareIds.includes(college.id);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "courses", label: "Courses", count: college.courses.length },
    { key: "cutoffs", label: "Cutoffs", count: college.cutoffs.length },
    { key: "reviews", label: "Reviews", count: college.reviews.length },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
          <Link
            href="/colleges"
            className="hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Colleges
          </Link>
          <span>/</span>
          <span className="text-zinc-600 dark:text-zinc-300">
            {college.name}
          </span>
        </nav>

        {/* Hero */}
        <div className="relative h-64 overflow-hidden rounded-2xl bg-zinc-200 sm:h-80 dark:bg-zinc-800">
          {college.imageUrl ? (
            <Image
              src={college.imageUrl}
              alt={college.name}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl font-bold text-zinc-300 dark:text-zinc-600">
              {college.name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {college.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {college.location}, {college.city}, {college.state}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Annual Fees
            </p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              ₹{college.fees.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Rating
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {college.rating.toFixed(1)}
              </span>
              <StarRating rating={college.rating} size="md" />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Avg Placement
            </p>
            <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
              {college.placementAverage !== null
                ? `₹${college.placementAverage} LPA`
                : "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Highest Package
            </p>
            <p className="mt-1 text-xl font-bold text-purple-600 dark:text-purple-400">
              {college.placementHighest !== null
                ? `₹${college.placementHighest} LPA`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={toggleCompare}
            disabled={!inCompare && compareIds.length >= 3}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              inCompare
                ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-300"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {inCompare ? "✓ In Compare" : "+ Add to Compare"}
          </button>
          {compareIds.length >= 2 && (
            <Link
              href={`/compare?ids=${compareIds.join(",")}`}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Compare ({compareIds.length})
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "overview" && (
            <div className="prose prose-zinc max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                About {college.name}
              </h2>
              <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
                {college.overview}
              </p>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    Location
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {college.location}, {college.city}, {college.state}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    Total Courses
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {college.courses.length} programs available
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Available Courses
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {college.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {course.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {course.duration} years
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      B.Tech
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "cutoffs" && (
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Admission Cutoffs
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Previous year cutoff ranks for various exams and branches
              </p>
              <div className="mt-4">
                <CutoffTable cutoffs={college.cutoffs} />
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Student Reviews
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {college.reviews.length} review
                    {college.reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 mb-6">
                <ReviewForm
                  collegeId={college.id}
                  onReviewSubmitted={() => {
                    fetch(`/api/colleges/${college.slug}`)
                      .then((r) => r.json())
                      .then((json) => {
                        if (json.success && json.data) {
                          setCollege(json.data);
                        }
                      });
                  }}
                />
              </div>
              <div className="space-y-4">
                {college.reviews.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-400">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  college.reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      rating={review.rating}
                      comment={review.comment}
                      createdAt={review.createdAt}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}