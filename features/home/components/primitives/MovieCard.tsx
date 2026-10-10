import Image from 'next/image';
import Link from 'next/link';

import type { NowPlayingMovie } from '../../types/now-playing.types';

interface MovieCardProps {
  movie: NowPlayingMovie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const genre = movie.genres[0]?.name ?? 'Film';

  return (
    <article className="flex flex-col bg-[#1D2033] p-3 rounded-[20px] w-[260px] h-[452px] shrink-0">
      <div className="relative bg-[#252D3B] rounded-[16px] w-full h-[300px] overflow-hidden shrink-0">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="236px"
            className="object-cover"
          />
        ) : (
          <div className="flex justify-center items-center h-full text-[#8D91A3] text-[13px]">
            No poster available
          </div>
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
        <span className="mt-[7px] w-fit text-[#FF321F] text-[12px] leading-normal">
          {movie.ageRating.code}
        </span>
      )}

      <div className="flex justify-between items-center gap-[8px] mt-auto">
        <span className="text-[12px] text-white">
          {movie.fromPrice != null
            ? `From ₾ ${movie.fromPrice}`
            : 'Price unavailable'}
        </span>

        <Link
          href={`/movies/${movie.slug}#sessions`}
          className="flex justify-center items-center bg-[#FF321F] hover:opacity-90 px-[16px] rounded-full min-w-[119px] h-[35px] font-semibold text-[12px] text-white transition-opacity"
        >
          Buy Ticket
        </Link>
      </div>
    </article>
  );
};

export default MovieCard;
