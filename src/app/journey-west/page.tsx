import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Journey West Tools Directory | SideApps',
  description:
    'Discover the internal tools crafted for the Journey West team, starting with the email signature generator.',
};

export default function JourneyWestToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative h-16 w-56 sm:h-20 sm:w-72">
            <Image
              src="/journeyWest/textLogo.jpg"
              alt="Journey West"
              fill
              sizes="(min-width: 768px) 18rem, 14rem"
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.4em] text-orange-300/80">
              Tools Directory
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Journey West Toolkit</h1>
            <p className="mx-auto max-w-2xl text-base text-gray-300 sm:text-lg">
              A curated collection of digital tools crafted to support the Journey West
              Colorado team. Explore resources designed for quick deployment, brand
              alignment, and delightful client experiences.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/signature"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl"
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-400/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/30 bg-orange-300/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-orange-200">
                Signature
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Email Signature Studio</h2>
                <p className="mt-2 text-sm text-gray-300">
                  Build polished Journey West signatures in minutes with live previews,
                  brand-ready templates, and quick export options.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-3 text-sm font-medium text-orange-200">
                <span>Launch Tool</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8333 4.16669L16.6666 10L10.8333 15.8334"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33337 10H16.6667"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 text-sm text-gray-300">
            <h3 className="text-lg font-medium text-white">More Coming Soon</h3>
            <p className="mt-3">
              We&apos;re continually developing new utilities to streamline operations and
              enhance client-facing experiences. Have an idea for the next tool? Let&apos;s
              make it happen.
            </p>
            <div className="mt-6 space-y-3 text-gray-400">
              <p>Potential additions:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-300/70" />
                  Branded proposal templates
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-300/70" />
                  Client onboarding checklist
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-300/70" />
                  Campaign performance dashboards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
