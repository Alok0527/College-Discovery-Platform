import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Campus<span className="text-blue-600">Connect</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Find the best engineering colleges across India. Compare fees,
              placements, and cutoffs to make the right choice.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-50">
              Explore
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/colleges", label: "All Colleges" },
                { href: "/predictor", label: "Admission Predictor" },
                { href: "/compare", label: "Compare Colleges" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-50">
              Account
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/login", label: "Login" },
                { href: "/register", label: "Sign Up" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-50">
              Exams Covered
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                { label: "JEE Main", href: "/predictor?exam=JEE+Main" },
                { label: "JEE Advanced", href: "/predictor?exam=JEE+Advanced" },
              ].map((exam) => (
                <li key={exam.label}>
                  <Link
                    href={exam.href}
                    className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    {exam.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} CampusConnect. Built for
            students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
