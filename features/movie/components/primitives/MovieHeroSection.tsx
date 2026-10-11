import Image from 'next/image';

import type { MovieDetailsType } from '../../types/movie.types';

interface MovieHeroSectionProps {
  movie: MovieDetailsType;
}

const MovieHeroSection = ({ movie }: MovieHeroSectionProps) => {
  return (
    <section className="relative flex items-center w-full min-h-[567px] overflow-hidden">
      {movie.backdropUrl && (
        <Image
          src={movie.backdropUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-center object-cover"
        />
      )}

      <div className="absolute inset-0 bg-[#070C1C]/60" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#020B1C]/90 via-[#020B1C]/60 to-transparent" />

      <div className="z-10 relative flex lg:flex-row flex-col items-start lg:items-end gap-[34px] mx-auto px-5 sm:px-10 lg:px-[60px] pt-[150px] pb-[45px] w-full max-w-[1728px]">
        <div className="relative bg-[#1E2031] rounded-[14px] w-[289px] h-[374px] overflow-hidden shrink-0">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              fill
              priority
              sizes="289px"
              className="object-cover"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full text-[#A9A9A9] text-[14px]">
              No poster available
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[15px] min-w-0 max-w-[580px]">
          <div className="bg-[#EC3013]/10 px-[10px] py-[6px] rounded-full w-fit">
            <p className="font-semibold text-[#EC3013] text-[12px]">
              {movie.isComingSoon ? 'COMING SOON' : 'NOW PLAYING'}
            </p>
          </div>

          <div className="flex flex-col gap-[10px]">
            <h1 className="font-extrabold text-[32px] text-white sm:text-[40px] leading-[110%]">
              {movie.title.toUpperCase()}
            </h1>

            {movie.synopsis && (
              <p className="text-[14px] text-white leading-[150%]">
                {movie.synopsis}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-[7px] mt-[5px]">
            {movie.ageRating && (
              <span
                title={movie.ageRating.description}
                className="bg-[#EC3013]/10 px-[10px] py-[6px] rounded-full font-semibold text-[#EC3013] text-[12px]"
              >
                {movie.ageRating.code}
              </span>
            )}

            {movie.runtimeMinutes != null && (
              <span className="inline-flex items-center gap-[6px] bg-white/10 px-[10px] py-[6px] rounded-full font-semibold text-[12px] text-white">
                <Image src="/icons/movie-clock.svg" alt="" width={11} height={13} />
                {movie.runtimeMinutes} Min
              </span>
            )}

            {movie.formats.map((format) => (
              <span
                key={format.id}
                className="bg-white/10 px-[10px] py-[6px] rounded-full font-semibold text-[12px] text-white"
              >
                {format.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieHeroSection;
