'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { waitForLogin } from '@/features/auth/lib/auth-challenge';
import { getAuthToken } from '@/features/auth/lib/auth-session';
import { seatSelectionHref } from '@/lib/routes';
import { useMovieSessions } from '../../hooks/use-movie-sessions';

import type {
  MovieDetailsType,
  MovieSessionType,
} from '../../types/movie.types';

import { formatMovieDate, getMovieCalendar } from '../../utils/movie-date';

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
  const router = useRouter();
  const { user } = useAuthUser();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const pendingSessionId = useRef<number | null>(null);
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

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleSessionSelect = (session: MovieSessionType) => {
    if (getAuthToken()) {
      router.push(seatSelectionHref(session.id));
      return;
    }

    pendingSessionId.current = session.id;
    if (loginPending.current) return;

    loginPending.current = true;
    void waitForLogin()
      .then(() => {
        const sessionId = pendingSessionId.current;
        if (sessionId !== null && getAuthToken()) {
          router.push(seatSelectionHref(sessionId));
        }
      })
      .catch(() => {})
      .finally(() => {
        pendingSessionId.current = null;
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
    </section>
  );
};

export default MovieSessions;
