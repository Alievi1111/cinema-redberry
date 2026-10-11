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
            <div className="bg-[#1E2031] mt-[20px] px-[20px] py-[35px] rounded-[18px] text-center">
              <p className="font-semibold text-[16px] text-white">
                Coming soon
              </p>

              <p className="mt-[8px] text-[#A9A9A9] text-[13px]">
                Sessions and ticket booking are not available yet.
              </p>
            </div>
          ) : (
            <>
              <MovieDatePicker
                days={days}
                activeDate={activeDate}
                onChange={handleDateChange}
              />

              <div className="mt-[27px]">
                {!activeDate ? (
                  <div className="bg-[#1E2031] px-[20px] py-[35px] rounded-[18px] text-[#A9A9A9] text-[14px] text-center">
                    No sessions available for the next seven days.
                  </div>
                ) : isLoading ? (
                  <div
                    role="status"
                    className="flex flex-col gap-[12px] animate-pulse"
                  >
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="bg-[#1E2031] rounded-[18px] w-full h-[133px]"
                      />
                    ))}
                  </div>
                ) : isError ? (
                  <div className="flex flex-col items-center gap-[12px] bg-[#1E2031] px-[20px] py-[30px] rounded-[18px] text-center">
                    <p className="text-[#A9A9A9] text-[14px]">
                      Failed to load sessions.
                    </p>

                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="bg-[#FF321F] px-[20px] py-[10px] rounded-full font-semibold text-[12px] text-white cursor-pointer"
                    >
                      Try again
                    </button>
                  </div>
                ) : venues.length === 0 ? (
                  <div className="bg-[#1E2031] px-[20px] py-[35px] rounded-[18px] text-[#A9A9A9] text-[14px] text-center">
                    No sessions found for this date.
                  </div>
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
