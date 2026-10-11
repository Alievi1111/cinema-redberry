import Image from 'next/image';

import type { SessionGroup } from '../../types/sessions.types';
import ShowtimeCard from '../primitives/ShowtimeCard';

type SessionMovieGroupProps = {
  group: SessionGroup;
  viewerAge: number | null;
  onGuestSelect: (sessionId: number, minimumAge: number | null) => void;
};

const SessionMovieGroup = ({
  group,
  viewerAge,
  onGuestSelect,
}: SessionMovieGroupProps) => {
  const { movie, sessions } = group;

  return (
    <li className="min-w-0 py-[32px] first:pt-0">
      <article aria-label={`${movie.title} showtimes`}>
        <div className="flex min-w-0 items-center gap-[16px]">
          <div className="relative h-[80px] w-[56px] shrink-0 overflow-hidden rounded-[8px] bg-[#2A2C3D]">
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#A9A9A9]">
                No poster
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-[12px]">
              <h2 className="text-[18px] font-extrabold text-white">
                {movie.title}
              </h2>
              {movie.ageRating && (
                <span
                  title={movie.ageRating.description}
                  aria-label={`${movie.ageRating.code}: ${movie.ageRating.description}`}
                  className="rounded-full bg-[#FF321F]/10 px-[10px] py-[4px] text-[12px] font-semibold leading-none text-[#FF321F]"
                >
                  {movie.ageRating.code}
                </span>
              )}
            </div>
            {movie.runtimeMinutes != null && (
              <p className="mt-[12px] text-[14px] text-[#A9A9A9]">
                {movie.runtimeMinutes} min
              </p>
            )}
          </div>
        </div>

        <div
          aria-label={`${movie.title} session times`}
          className="scrollbar-hidden mt-[14px] flex min-w-0 gap-[12px] overflow-x-auto overscroll-x-contain"
        >
          {sessions.map((showtime) => (
            <ShowtimeCard
              key={showtime.id}
              showtime={showtime}
              movieTitle={movie.title}
              minimumAge={movie.ageRating?.minAge ?? null}
              viewerAge={viewerAge}
              onGuestSelect={onGuestSelect}
            />
          ))}
        </div>
      </article>
    </li>
  );
};

export default SessionMovieGroup;
