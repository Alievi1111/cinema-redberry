'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import BookingModal from '@/features/booking/components/BookingModal';
import { releaseHoldApi } from '@/features/booking/api/booking-api';
import { bookingWindowStorageKey, holdStorageKey } from '@/features/booking/lib/booking-utils';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { waitForLogin } from '@/features/auth/lib/auth-challenge';
import { getAuthToken } from '@/features/auth/lib/auth-session';
import ProfileCompletionDialog from '@/features/seats/components/ProfileCompletionDialog';
import { getMovieSessionsApi } from '../../api/movie-api';
import { useSessionClock } from '../../hooks/use-session-clock';
import { useMovieSessions } from '../../hooks/use-movie-sessions';
import { findNextBookableSession } from '../../utils/session-availability';

import type {
  MovieDetailsType,
  MovieSessionType,
} from '../../types/movie.types';

import { formatMovieDate, getCinemaToday, getMovieCalendar } from '../../utils/movie-date';

import MovieDatePicker from './MovieDatePicker';
import MovieVenueSessions from './MovieVenueSessions';
import MovieDetails from './MovieDetails';
import SessionsEmpty from './states/SessionsEmpty';
import SessionsError from './states/SessionsError';
import SessionsSkeleton from './states/SessionsSkeleton';

interface MovieSessionsProps {
  movie: MovieDetailsType;
}

const MovieSessions = ({ movie }: MovieSessionsProps) => {
  const { user, isLoading: authLoading, refetch: refetchUser } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bookingSessionId = searchParams.get('bookingSession');
  const bookingIntent = searchParams.get('book') === '1';
  const now = useSessionClock();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);
  const pendingSession = useRef<MovieSessionType | null>(null);
  const loginPending = useRef(false);

  const { days, activeDate } = useMemo(
    () => getMovieCalendar(movie.availableDates, selectedDate),
    [movie.availableDates, selectedDate]
  );

  const { venues, isLoading, isError, refetch } = useMovieSessions(
    movie.slug,
    activeDate,
    !movie.isComingSoon
  );

  const sessionsCount = venues.reduce(
    (total, venue) => total + venue.sessions.length,
    0
  );

  const updateBookingParam = (sessionId: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('book');
    if (sessionId) next.set('bookingSession', sessionId);
    else next.delete('bookingSession');
    const url = `${pathname}${next.size ? `?${next}` : ''}`;
    if (sessionId) router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
  };

  useEffect(() => {
    if (!bookingIntent || bookingSessionId) return;
    const controller = new AbortController();
    const clearIntent = (sessionId?: number) => {
      const next = new URLSearchParams(window.location.search);
      next.delete('book');
      if (sessionId) next.set('bookingSession', String(sessionId));
      router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
    };

    const openNextSession = async () => {
      try {
        if (movie.isComingSoon) {
          setBookingNotice('Tickets are not on sale for this movie yet.');
          clearIntent();
          return;
        }
        const today = getCinemaToday();
        const lastDay = new Date(`${today}T00:00:00Z`);
        lastDay.setUTCDate(lastDay.getUTCDate() + 6);
        const dates = [...new Set(movie.availableDates)]
          .filter((date) => date >= today && date <= lastDay.toISOString().slice(0, 10))
          .sort();

        for (const date of dates) {
          const groups = await getMovieSessionsApi(movie.slug, date, controller.signal);
          if (controller.signal.aborted) return;
          const session = findNextBookableSession(groups, Date.now());
          if (!session) continue;
          setSelectedDate(date);
          clearIntent(session.id);
          return;
        }
        if (controller.signal.aborted) return;
        setBookingNotice('No upcoming sessions are available for this movie.');
        clearIntent();
      } catch {
        if (controller.signal.aborted) return;
        setBookingNotice('Could not find an upcoming session. Please try again.');
        clearIntent();
      }
    };

    void openNextSession();
    return () => controller.abort();
  }, [bookingIntent, bookingSessionId, movie.availableDates, movie.isComingSoon, movie.slug, pathname, router]);

  useEffect(() => {
    if (!bookingSessionId || user || authLoading || loginPending.current) return;
    loginPending.current = true;
    void waitForLogin()
      .catch(() => {
        const next = new URLSearchParams(window.location.search);
        next.delete('bookingSession');
        router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false });
      })
      .finally(() => { loginPending.current = false; });
  }, [bookingSessionId, user, authLoading, router, pathname]);

  useEffect(() => {
    if (!bookingSessionId || !user) return;
    const releaseOnBack = () => {
      if (new URLSearchParams(window.location.search).has('bookingSession')) return;
      sessionStorage.removeItem(bookingWindowStorageKey(user.id, bookingSessionId));
      const key = holdStorageKey(user.id, bookingSessionId);
      const holdId = localStorage.getItem(key);
      if (!holdId) return;
      localStorage.removeItem(key);
      void releaseHoldApi(holdId).catch(() => {});
    };
    window.addEventListener('popstate', releaseOnBack);
    return () => window.removeEventListener('popstate', releaseOnBack);
  }, [bookingSessionId, user]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleSessionSelect = (session: MovieSessionType) => {
    if (Date.parse(session.startsAt) <= Date.now()) {
      setBookingNotice('This session has already started. Choose a later showtime.');
      return;
    }
    setBookingNotice(null);
    if (user) {
      updateBookingParam(String(session.id));
      return;
    }

    pendingSession.current = session;
    if (loginPending.current) return;

    loginPending.current = true;
    const restoreSession = getAuthToken()
      ? refetchUser().then(({ data }) => {
          if (!data) return waitForLogin();
        })
      : waitForLogin();

    void restoreSession
      .then(() => {
        const selected = pendingSession.current;
        if (selected && getAuthToken()) {
          updateBookingParam(String(selected.id));
        }
      })
      .catch(() => {})
      .finally(() => {
        pendingSession.current = null;
        loginPending.current = false;
      });
  };

  return (
    <section className="py-[40px] w-full">
      <div className="flex lg:flex-row flex-col gap-[40px] lg:gap-[36px] mx-auto px-5 sm:px-10 lg:px-[60px] w-full max-w-[1728px]">
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-[20px] text-white leading-none">
            Sessions
          </h2>

          <p className="mt-[7px] text-[#A9A9A9] text-[12px] leading-[130%]">
            {movie.isComingSoon
              ? 'Sessions will be announced soon'
              : activeDate && !isLoading && !isError
                ? `${sessionsCount} sessions on ${formatMovieDate(activeDate)}`
                : 'Choose an available date to see sessions'}
          </p>

          {bookingNotice && <p role="status" className="mt-3 text-sm text-[#FF634F]">{bookingNotice}</p>}

          {movie.isComingSoon ? (
            <SessionsEmpty variant="coming-soon" />
          ) : (
            <>
              <MovieDatePicker
                days={days}
                activeDate={activeDate}
                onChange={handleDateChange}
              />

              <div className="mt-[27px]">
                {!activeDate ? (
                  <SessionsEmpty variant="next-seven-days" />
                ) : isLoading ? (
                  <SessionsSkeleton />
                ) : isError ? (
                  <SessionsError onRetry={() => void refetch()} />
                ) : venues.length === 0 ? (
                  <SessionsEmpty variant="selected-date" />
                ) : (
                  <>
                    <MovieVenueSessions
                      venues={venues}
                      ageRating={movie.ageRating}
                      user={user}
                      now={now}
                      onSelect={handleSessionSelect}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <MovieDetails movie={movie} />
      </div>

      {bookingSessionId && user?.profileComplete && (
        <BookingModal
          key={`${user.id}:${bookingSessionId}`}
          sessionId={bookingSessionId}
          movieSlug={movie.slug}
          onClose={() => updateBookingParam(null)}
        />
      )}

      {bookingSessionId && user && !user.profileComplete && (
        <ProfileCompletionDialog onClose={() => updateBookingParam(null)} />
      )}
    </section>
  );
};

export default MovieSessions;
