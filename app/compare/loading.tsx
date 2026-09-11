export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto h-9 w-72 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mx-auto mt-3 h-5 w-80 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}