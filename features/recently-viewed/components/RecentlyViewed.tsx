'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { movieHref } from '@/lib/routes';
import {
  mergeGuestRecentlyViewed,
  readRecentlyViewed,
  RECENTLY_VIEWED_CHANGED,
  recentlyViewedStorageKey,
  type RecentlyViewedMovie,
} from '../lib/recently-viewed';

export default function RecentlyViewed() {
  const { user, isLoading } = useAuthUser();
  const userId = user?.id ?? null;
  const key = isLoading ? null : recentlyViewedStorageKey(userId);
  const [history, setHistory] = useState<{
    key: string;
    movies: RecentlyViewedMovie[];
  } | null>(null);

  useEffect(() => {
    if (!key) return;
    if (userId !== null) mergeGuestRecentlyViewed(userId);

    let active = true;
    const update = () => {
      if (active) setHistory({ key, movies: readRecentlyViewed(userId) });
    };
    queueMicrotask(update);
    window.addEventListener('storage', update);
    window.addEventListener(RECENTLY_VIEWED_CHANGED, update);
    return () => {
      active = false;
      window.removeEventListener('storage', update);
      window.removeEventListener(RECENTLY_VIEWED_CHANGED, update);
    };
  }, [key, userId]);

  if (!key || history?.key !== key || history.movies.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-title" className="border-b border-[#1E2031] bg-[#070C1C]">
      <div className="mx-auto max-w-[1728px] px-5 pb-10 pt-7 sm:px-10 lg:px-[64px]">
        <h2 id="recently-viewed-title" className="text-[24px] font-bold text-white">Recently viewed</h2>
        <div className="scrollbar-hidden mt-5 flex gap-3 overflow-x-auto overscroll-x-contain pb-1">
          {history.movies.map((movie) => (
            <Link
              key={movie.slug}
              href={movieHref(movie.slug)}
              aria-label={`View ${movie.title}`}
              className="flex h-[87px] w-[290px] shrink-0 items-center gap-3 rounded-[16px] bg-[#1E2031] p-[10px] transition-colors hover:bg-[#292C3D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF321F] sm:w-[330px]"
            >
              <div className="relative h-[67px] w-[87px] shrink-0 overflow-hidden rounded-[10px] bg-[#292C3D]">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={`${movie.title} poster`}
                    fill
                    sizes="87px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#A9A9A9]">No poster</span>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-[14px] font-bold text-white">{movie.title.toUpperCase()}</h3>
                <p className="mt-1 truncate text-[12px] leading-[130%] text-[#A9A9A9]">
                  {movie.genre}{movie.runtimeMinutes != null && ` · ${movie.runtimeMinutes} min`}
                </p>
                {movie.ageRatingCode && (
                  <span className="mt-1.5 inline-block rounded-full bg-[#FF321F]/10 px-2 py-1 text-[11px] font-semibold leading-none text-[#FF321F]">
                    {movie.ageRatingCode}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
