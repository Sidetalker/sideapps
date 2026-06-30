import type { Metadata } from 'next';
import Link from 'next/link';
import {
  changelog,
  CHANGE_TYPE_META,
  type ChangeType,
} from '@/data/changelog';

export const metadata: Metadata = {
  title: 'Changelog | SideApps',
  description:
    'A running log of updates, improvements, and fixes made to the SideApps website.',
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// Render change types in a consistent, scannable order.
const TYPE_ORDER: ChangeType[] = ['added', 'changed', 'fixed', 'removed'];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-orange-300/80">
            What&apos;s new
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Changelog</h1>
          <p className="mx-auto max-w-2xl text-base text-gray-300 sm:text-lg text-pretty">
            A running log of the updates, improvements, and fixes shipped to the
            SideApps website.
          </p>
          <Link
            href="/"
            className="mx-auto mt-2 inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition-colors hover:text-orange-100"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9.16671 15.8334L3.33337 10L9.16671 4.16669"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.6667 10H3.33337"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to portfolio</span>
          </Link>
        </header>

        <ol className="relative flex flex-col gap-10 border-l border-white/10 pl-6 sm:pl-8">
          {changelog.map((entry) => {
            const orderedChanges = [...entry.changes].sort(
              (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type),
            );

            return (
              <li key={entry.version} className="relative">
                <span
                  className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-gray-950 bg-orange-400 sm:-left-[39px]"
                  aria-hidden="true"
                />
                <article className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold">
                      v{entry.version}
                    </span>
                    <time
                      dateTime={entry.date}
                      className="text-sm text-gray-400"
                    >
                      {formatDate(entry.date)}
                    </time>
                  </div>

                  {entry.title && (
                    <h2 className="mt-4 text-xl font-semibold text-white text-balance">
                      {entry.title}
                    </h2>
                  )}

                  <ul className="mt-5 flex flex-col gap-3">
                    {orderedChanges.map((change, index) => {
                      const meta = CHANGE_TYPE_META[change.type];
                      return (
                        <li
                          key={`${entry.version}-${index}`}
                          className="flex items-start gap-3"
                        >
                          <span
                            className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${meta.badgeClass}`}
                          >
                            {meta.label}
                          </span>
                          <p className="text-sm leading-relaxed text-gray-200 text-pretty">
                            {change.description}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
