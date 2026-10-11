import Image from 'next/image';
import Link from 'next/link';

import type { NowPlayingMovie } from '../../types/now-playing.types';

interface MovieCardProps {
  movie: NowPlayingMovie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const genre = movie.genres[0]?.name ?? 'Film';
  const posterUrl = movie.posterUrl ?? movie.backdropUrl;

  return (
    <article className="flex h-[452px] w-full flex-col rounded-[20px] bg-[#1D2033] p-3">
      <div className="relative h-[300px] w-full shrink-0 overflow-hidden rounded-[16px] bg-[#252D3B] md:group-hover:h-[225px] md:group-focus-within:h-[225px] motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="236px"
            className={`object-cover motion-safe:transition-opacity motion-safe:duration-300 ${movie.backdropUrl ? 'md:group-hover:opacity-0 md:group-focus-within:opacity-0' : ''}`}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-[#8D91A3] text-[13px]">
            No poster available
          </div>
        )}
        {movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 426px, 236px"
            className="object-cover opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 motion-safe:transition-opacity motion-safe:duration-500"
          />
        )}
      </div>

      <div className="mt-[10px] min-w-0">
        <h3
          title={movie.title}
          className="font-bold text-[18px] text-white truncate leading-normal"
        >
          {movie.title}
        </h3>

        <p className="text-[#8D91A3] text-[12px] truncate leading-[130%]">
          {genre}
          {movie.runtimeMinutes != null && ` · ${movie.runtimeMinutes} min`}
        </p>
      </div>

      {movie.ageRating && (
        <span className="mt-[7px] w-fit rounded-full bg-[#FF321F]/10 px-[7px] text-[#FF321F] text-[12px] leading-normal">
          {movie.ageRating.code}
        </span>
      )}

      {movie.synopsis && (
        <div className="max-h-0 overflow-hidden opacity-0 md:group-hover:mt-[10px] md:group-hover:max-h-[76px] md:group-hover:opacity-100 md:group-focus-within:mt-[10px] md:group-focus-within:max-h-[76px] md:group-focus-within:opacity-100 motion-safe:transition-[max-height,opacity,margin] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]">
          <p className="line-clamp-3 text-[13px] leading-[18px] text-[#A9A9A9]">
            {movie.synopsis}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center gap-[8px] mt-auto">
        <span className="text-[12px] text-white">
          {movie.fromPrice != null
            ? `From ₾ ${movie.fromPrice}`
            : 'Price unavailable'}
        </span>

        <Link
          href={`/movie/${movie.slug}`}
          className="flex justify-center items-center bg-[#FF321F] hover:opacity-90 px-[16px] rounded-full min-w-[119px] h-[35px] font-semibold text-[12px] text-white transition-opacity"
        >
          Buy Ticket
        </Link>
      </div>
    </article>
  );
};

export default MovieCard;
