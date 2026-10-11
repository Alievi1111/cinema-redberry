'use client';

import { useMemo, useState } from 'react';

import { useAuthUser } from '@/features/auth/hook/use-auth-user';
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
  const { user } = useAuthUser();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );

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

  const selectedSession = venues
    .flatMap((venue) => venue.sessions)
    .find((session) => session.id === selectedSessionId);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSessionId(null);
  };

  const handleSessionSelect = (session: MovieSessionType) => {
    setSelectedSessionId(session.id);
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
                      selectedSessionId={selectedSessionId}
                      onSelect={handleSessionSelect}
                    />

                    {selectedSession && (
                      <div
                        role="status"
                        className="bg-[#FF321F]/10 mt-[20px] px-[16px] py-[12px] border border-[#FF321F]/30 rounded-[12px]"
                      >
                        <p className="font-semibold text-[13px] text-white">
                          Selected session: {selectedSession.time}
                        </p>

                        <p className="mt-[4px] text-[#A9A9A9] text-[12px]">
                          Seat selection will be connected to the booking flow.
                        </p>

                        {!user && (
                          <p className="mt-[4px] text-[#A9A9A9] text-[12px]">
                            Sign in to continue with booking.
                          </p>
                        )}
                      </div>
                    )}
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
