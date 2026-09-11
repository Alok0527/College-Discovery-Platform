import Link from "next/link";

export default function CollegeNotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-6xl font-bold text-blue-600">404</p>
          <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            College not found
          </h1>
          <p className="mt-3 max-w-md text-zinc-500 dark:text-zinc-400">
            The college you&apos;re looking for doesn&apos;t exist or may have been
            removed from our directory.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/colleges"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse all colleges
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}