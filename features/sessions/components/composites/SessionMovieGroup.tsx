import Image from 'next/image';
import Link from 'next/link';

import type { SessionGroup } from '../../types/sessions.types';
import ShowtimeCard from '../primitives/ShowtimeCard';
import { movieHref } from '@/lib/routes';

type SessionMovieGroupProps = {
  group: SessionGroup;
  viewerAge: number | null;
  now: number;
};

const SessionMovieGroup = ({
  group,
  viewerAge,
  now,
}: SessionMovieGroupProps) => {
  const { movie, sessions } = group;

  return (
    <li className="min-w-0 py-[32px] first:pt-0">
      <article aria-label={`${movie.title} showtimes`}>
        <Link
          href={movieHref(movie.slug)}
          aria-label={`View ${movie.title} details`}
          className="flex min-w-0 items-center gap-[16px] rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF321F]"
        >
          <div className="relative h-[80px] w-[56px] shrink-0 overflow-hidden rounded-[8px] bg-[#2A2C3D]">
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
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
        </Link>

        <div
          aria-label={`${movie.title} session times`}
          className="scrollbar-hidden mt-[14px] flex min-w-0 gap-[12px] overflow-x-auto overscroll-x-contain"
        >
          {sessions.map((showtime) => (
            <ShowtimeCard
              key={showtime.id}
              showtime={showtime}
              movieTitle={movie.title}
              movieSlug={movie.slug}
              minimumAge={movie.ageRating?.minAge ?? null}
              viewerAge={viewerAge}
              now={now}
            />
          ))}
        </div>
      </article>
    </li>
  );
};

export default SessionMovieGroup;
