export default function CollegesLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-9 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-5 w-80 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full shrink-0 lg:w-72">
            <div className="h-64 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="flex-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}