import Image from 'next/image';

import type { ComingSoonMovie } from '../../types/coming-soon.types';
import { formatReleaseDate } from '../../utils/format-release-date';

interface ComingSoonCardProps {
  movie: ComingSoonMovie;
}

const ComingSoonCard = ({ movie }: ComingSoonCardProps) => {
  const releaseDate = formatReleaseDate(movie.releaseDate);
  const releaseYear = movie.releaseDate?.slice(0, 4);

  const genre = movie.genres[0]?.name ?? 'Film';

  return (
    <article className="flex items-center gap-[15px] bg-[#1E2031] p-[12px] rounded-[20px] w-full h-[160px] overflow-hidden">
      <div className="relative bg-[#252D3B] rounded-[12px] w-[42%] sm:w-[229px] h-[136px] overflow-hidden shrink-0">
        {movie.backdropUrl ? (
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
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
      </div>

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
          {movie.title}
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
          disabled
          title="Notification API is not available yet"
          className="flex justify-center items-center gap-[7px] opacity-80 mt-auto px-[10px] border border-[#A9A9A9] rounded-full h-[28px] cursor-not-allowed"
        >
          <Image src="/icons/NotifYMe.svg" alt="" width={12} height={13} />

          <span className="font-semibold text-[12px] text-white whitespace-nowrap">
            {movie.isNotified ? 'Notified' : 'Notify Me'}
          </span>
        </button>
      </div>
    </article>
  );
};

export default ComingSoonCard;
