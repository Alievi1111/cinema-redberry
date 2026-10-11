'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { waitForLogin } from '@/features/auth/lib/auth-challenge';
import { getAuthToken } from '@/features/auth/lib/auth-session';
import { useComingSoon } from '../../hook/use-coming-soon';
import { useNotifyMovie } from '../../hook/use-notify-movie';
import type { ComingSoonMovie } from '../../types/coming-soon.types';
import ComingSoonCarousel from '../primitives/ComingSoonCarousel';
import NotificationToast from '../primitives/NotificationToast';
import ComingSoonError from '../primitives/skelleton/ComingSoonError';
import ComingSoonSkeleton from '../primitives/skelleton/ComingSoonSkeleton';

const ComingSoon = () => {
  const { movies, isLoading, isError, refetch } = useComingSoon(6);
  const notifyMovie = useNotifyMovie();
  const [pendingMovieIds, setPendingMovieIds] = useState<Set<number>>(
    () => new Set()
  );
  const [toast, setToast] = useState<{
    movieTitle: string;
    error?: string;
  } | null>(null);
  const pendingIds = useRef(new Set<number>());

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleNotify = (movie: ComingSoonMovie) => {
    if (movie.isNotified || pendingIds.current.has(movie.id)) return;
    pendingIds.current.add(movie.id);
    setPendingMovieIds(new Set(pendingIds.current));

    void (async () => {
      try {
        if (!getAuthToken()) {
          try {
            await waitForLogin();
          } catch {
            return;
          }
        }

        if (!getAuthToken()) return;

        const result = await notifyMovie.mutateAsync(movie.slug);
        if (!result.subscribed) {
          setToast({
            movieTitle: movie.title,
            error: 'Subscription could not be confirmed.',
          });
          return;
        }

        setToast({ movieTitle: movie.title });
      } catch (error) {
        // Closing the login modal after a 401 is not a notification failure.
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          !getAuthToken()
        ) {
          return;
        }

        const message = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;

        setToast({
          movieTitle: movie.title,
          error: message || 'Please try again.',
        });
      } finally {
        pendingIds.current.delete(movie.id);
        setPendingMovieIds(new Set(pendingIds.current));
      }
    })();
  };

  if (isLoading) {
    return <ComingSoonSkeleton />;
  }

  if (isError) {
    return <ComingSoonError onRetry={() => void refetch()} />;
  }

  if (movies.length === 0) {
    return (
      <section className="flex justify-center items-center bg-[#020B1C] px-5 min-h-[240px]">
        <p className="text-[#A9A9A9] text-[14px]">
          No upcoming movies available.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mx-auto px-5 sm:px-10 lg:px-16 w-full max-w-[1728px]">
        <div className="mb-[24px] flex items-center justify-between gap-4">
          <h2 className="font-bold text-[24px] text-white">COMING SOON...</h2>
          <Link
            href="/sessions"
            className="shrink-0 text-[12px] font-semibold text-[#FF321F] hover:text-[#FF6B5C] focus-visible:outline-2 focus-visible:outline-[#FF321F]"
          >
            See all
          </Link>
        </div>

        <ComingSoonCarousel
          movies={movies}
          pendingMovieIds={pendingMovieIds}
          onNotify={handleNotify}
        />
      </div>

      {toast && (
        <NotificationToast
          movieTitle={toast.movieTitle}
          error={toast.error}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default ComingSoon;
