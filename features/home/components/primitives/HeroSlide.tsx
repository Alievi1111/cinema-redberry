import Image from 'next/image';
import Link from 'next/link';

import type { FeaturedMovie } from '../../types/featured-movie.types';
import { formatReleaseDate } from '../../utils/format-release-date';

interface HeroSlideProps {
  movie: FeaturedMovie;
  index: number;
  total: number;
}

const HeroSlide = ({ movie, index, total }: HeroSlideProps) => {
  const releaseDate = formatReleaseDate(movie.releaseDate);

  const sessionsHref = `/movies/${movie.slug}#sessions`;

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${movie.title}`}
      className="relative flex-[0_0_100%] bg-[#020B1C] min-w-0 min-h-[620px]"
    >
      {movie.backdropUrl && (
        <Image
          src={movie.backdropUrl}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-center object-cover"
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#020B1C_0%,rgba(2,11,28,0.96)_28%,rgba(2,11,28,0.64)_57%,rgba(2,11,28,0.18)_100%)]" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/80 via-transparent to-transparent" />

      <div className="z-10 relative flex items-center mx-auto px-5 sm:px-10 lg:px-[67px] pt-[80px] pb-[115px] w-full max-w-[1728px] min-h-[760px]">
        <div className="flex flex-col gap-[15px] w-full max-w-[580px]">
          <p className="bg-[#EC3013]/10 px-[10px] py-[6px] rounded-full w-fit font-semibold text-[#EC3013] text-[12px]">
            FEATURED{releaseDate ? ` · ${releaseDate}` : ''}
          </p>

          <h2 className="font-bold text-[32px] text-white sm:text-[40px] leading-none">
            {movie.title.toUpperCase()}
          </h2>

          <div className="flex flex-wrap items-center gap-[8px]">
            {movie.ageRating && (
              <span className="bg-[#252D3B] px-[12px] py-[6px] rounded-full font-semibold text-[#FF321F] text-[12px]">
                {movie.ageRating.code}
              </span>
            )}

            {movie.runtimeMinutes != null && (
              <span className="flex items-center gap-[6px] bg-[#252D3B] px-[12px] py-[6px] rounded-full font-semibold text-[12px] text-white">
                ⏱ {movie.runtimeMinutes} Min
              </span>
            )}

            {movie.formats.map((format) => (
              <span
                key={format.id}
                className="bg-[#252D3B] px-[12px] py-[6px] rounded-full font-semibold text-[12px] text-white"
              >
                {format.name}
              </span>
            ))}
          </div>

          {movie.synopsis && (
            <p className="font-semibold text-[14px] text-white line-clamp-4 leading-[130%]">
              {movie.synopsis}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-[10px] mt-[4px]">
            <Link
              href={sessionsHref}
              className="flex justify-center items-center gap-[4px] bg-[#FF321F] hover:bg-[#EC3013] rounded-full w-[143px] h-[42px] font-semibold text-[14px] text-white transition-colors"
            >
              <Image src="/icons/buyicon.svg" alt="" width={20} height={20} />

              <span>Buy tickets</span>
            </Link>

            <Link
              href={sessionsHref}
              className="flex justify-center items-center bg-[#344653] hover:bg-[#465A69] px-[22px] rounded-full h-[42px] font-semibold text-[14px] text-white transition-colors"
            >
              All sessions
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HeroSlide;
