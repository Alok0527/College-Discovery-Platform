import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

interface FeaturedCollege {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  imageUrl: string | null;
  placementAverage: number | null;
  courseCount: number;
  reviewCount: number;
}

async function getFeaturedColleges(): Promise<FeaturedCollege[]> {
  const colleges = await prisma.college.findMany({
    orderBy: { rating: "desc" },
    take: 6,
    include: {
      courses: { select: { name: true }, take: 3 },
      reviews: { select: { rating: true } },
    },
  });

  return colleges.map((college: (typeof colleges)[number]) => ({
    id: college.id,
    name: college.name,
    slug: college.slug,
    city: college.city,
    state: college.state,
    fees: college.fees,
    rating: college.rating,
    imageUrl: college.imageUrl,
    placementAverage: college.placementAverage,
    courseCount: college.courses.length,
    reviewCount: college.reviews.length,
  }));
}

async function getStats() {
  const [collegeCount, courseCount, reviewCount] = await Promise.all([
    prisma.college.count(),
    prisma.course.count(),
    prisma.review.count(),
  ]);
  return { collegeCount, courseCount, reviewCount };
}

export default async function FeaturedSection() {
  const [featured, stats] = await Promise.all([
    getFeaturedColleges(),
    getStats(),
  ]);

  return (
    <>
      {/* Stats */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.collegeCount}+
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Colleges
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.courseCount}+
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Courses
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.reviewCount}+
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Top Rated Colleges
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Highest rated engineering colleges on CampusConnect
            </p>
          </div>
          <Link
            href="/colleges"
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:inline dark:text-blue-400"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((college) => (
            <Link
              key={college.id}
              href={`/colleges/${college.slug}`}
              className="group block rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-zinc-100 dark:bg-zinc-800">
                {college.imageUrl ? (
                  <Image
                    src={college.imageUrl}
                    alt={college.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-300 dark:text-zinc-600">
                    {college.name.charAt(0)}
                  </div>
                )}
                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-sm font-semibold text-amber-600 backdrop-blur dark:bg-zinc-900/90">
                  ★ {college.rating.toFixed(1)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                  {college.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {college.city}, {college.state}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    ₹{college.fees.toLocaleString("en-IN")}
                  </span>
                  {college.placementAverage !== null && (
                    <span className="text-green-600 dark:text-green-400">
                      Avg ₹{college.placementAverage} LPA
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                  <span>{college.courseCount} courses</span>
                  <span>•</span>
                  <span>{college.reviewCount} reviews</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View all colleges →
          </Link>
        </div>
      </section>
    </>
  );
}
