import { Suspense } from 'react';
import type { Metadata } from 'next';

import SessionsView from '@/features/sessions/components/composites/SessionsView';
import SessionResultsSkeleton from '@/features/sessions/components/composites/SessionResultsSkeleton';
import { siteUrl } from '@/lib/seo';

const description =
  'Browse Kino XII showtimes by cinema, date, format, language, and time. Find available seats and book your tickets.';

export const metadata: Metadata = {
  title: 'Sessions',
  description,
  alternates: siteUrl ? { canonical: '/sessions' } : undefined,
  openGraph: {
    title: 'Cinema Sessions | Kino XII',
    description,
    url: siteUrl ? '/sessions' : undefined,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Kino XII cinema sessions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cinema Sessions | Kino XII',
    description,
    images: ['/twitter-image'],
  },
};

const SessionsPage = () => (
  <div className="mx-auto px-5 sm:px-10 lg:px-[51px] pt-[112px] pb-[80px] w-full max-w-[1728px] text-white">
    <header className="mb-[32px]">
      <h1 className="font-bold text-[24px]">Sessions</h1>
      <p className="mt-[4px] text-[14px] text-[#A9A9A9]">
        Browse showtimes across all venues
      </p>
    </header>

    <Suspense
      fallback={
        <div className="gap-[51px] lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="bg-[#1D2030] rounded-[16px] min-h-[880px] lg:min-h-[1000px] motion-safe:animate-pulse" />
          <div className="mt-[32px] min-w-0 lg:mt-0">
            <SessionResultsSkeleton showToolbar />
          </div>
        </div>
      }
    >
      <SessionsView />
    </Suspense>
  </div>
);

export default SessionsPage;
