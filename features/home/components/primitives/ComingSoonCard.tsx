import Image from 'next/image';
import Link from 'next/link';

import type { ComingSoonMovie } from '../../types/coming-soon.types';
import { formatReleaseDate } from '../../utils/format-release-date';
import { movieHref } from '@/lib/routes';

interface ComingSoonCardProps {
  movie: ComingSoonMovie;
  isNotified: boolean;
  isPending: boolean;
  onNotify: () => void;
}

const ComingSoonCard = ({
  movie,
  isNotified,
  isPending,
  onNotify,
}: ComingSoonCardProps) => {
  const releaseDate = formatReleaseDate(movie.releaseDate);
  const releaseYear = movie.releaseDate?.slice(0, 4);

  const genre = movie.genres[0]?.name ?? 'Film';

  return (
    <article className="flex items-center gap-[15px] bg-[#1E2031] p-[12px] rounded-[20px] w-full h-[160px] overflow-hidden">
      <Link href={movieHref(movie.slug)} className="relative bg-[#252D3B] rounded-[12px] w-[42%] sm:w-[229px] h-[136px] overflow-hidden shrink-0">
        {movie.backdropUrl ? (
          <Image
            src={movie.backdropUrl}
            alt={`${movie.title} scene`}
            fill
            sizes="(max-width: 640px) 42vw, 229px"
            draggable={false}
            className="object-cover"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full text-[#A9A9A9] text-[12px]">
            No image
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 items-start min-w-0">
        <p className="font-semibold text-[#FF321F] text-[11px]">
          {releaseDate
            ? `RELEASE DATE ${releaseDate} ${releaseYear}`
            : 'COMING SOON'}
        </p>

        <h3
          title={movie.title}
          className="mt-[7px] font-semibold text-[12px] text-white line-clamp-2"
        >
          <Link href={movieHref(movie.slug)}>{movie.title}</Link>
        </h3>

        <p className="mt-[7px] max-w-full font-semibold text-[#A9A9A9] text-[12px] truncate">
          {genre}
          {movie.runtimeMinutes != null && ` · ${movie.runtimeMinutes} min`}
        </p>

        {movie.ageRating && (
          <span className="block mt-[7px] font-semibold text-[#FF321F] text-[12px]">
            {movie.ageRating.code}
          </span>
        )}

        <button
          type="button"
          disabled={isNotified || isPending}
          aria-busy={isPending}
          onClick={onNotify}
          aria-label={
            isNotified
              ? `Notification selected for ${movie.title}`
              : isPending
                ? `Adding notification for ${movie.title}`
                : `Notify me about ${movie.title}`
          }
          className="flex justify-center items-center gap-[7px] mt-auto px-[10px] border border-[#A9A9A9] rounded-full h-[28px] text-white cursor-pointer transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#FF321F] disabled:cursor-default disabled:opacity-60"
        >
          <Image src="/icons/notify-me.svg" alt="" width={13} height={14} />

          <span className="font-semibold text-[12px] text-white whitespace-nowrap">
            {isNotified ? 'Notified' : isPending ? 'Adding...' : 'Notify Me'}
          </span>
        </button>
      </div>
    </article>
  );
};

export default ComingSoonCard;
