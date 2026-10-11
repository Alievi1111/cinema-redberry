import type { MovieDetailsType } from '../../types/movie.types';
import { formatMovieDate } from '../../utils/movie-date';

interface MovieDetailsProps {
  movie: MovieDetailsType;
}

const MovieDetails = ({ movie }: MovieDetailsProps) => {
  const details = [
    {
      label: 'DIRECTOR',
      value: movie.director,
    },
    {
      label: 'MAIN CAST',
      value: movie.cast,
    },
    {
      label: 'DURATION',
      value:
        movie.runtimeMinutes != null ? `${movie.runtimeMinutes} minutes` : null,
    },
    {
      label: 'RELEASE DATE',
      value: formatMovieDate(movie.releaseDate),
    },
    {
      label: 'FORMATS',
      value: movie.formats.map((format) => format.name).join(', '),
    },
    {
      label: 'FROM',
      value:
        !movie.isComingSoon && movie.fromPrice != null
          ? `₾${movie.fromPrice}`
          : null,
    },
  ];

  return (
    <aside className="w-full lg:w-[389px] shrink-0">
      <h2 className="mb-[17px] font-bold text-[20px] text-white leading-[22px]">
        Details
      </h2>

      <div className="flex flex-col gap-[17px]">
        {details.map(
          ({ label, value }) =>
            value && (
              <div key={label}>
                <p className="font-semibold text-[#A9A9A9] text-[12px] leading-none">
                  {label}
                </p>

                <p className="mt-[7px] font-semibold text-[14px] text-white leading-[150%]">
                  {value}
                </p>
              </div>
            )
        )}

        {movie.ageRating && (
          <div className="flex flex-col gap-[7px] bg-[#FF9500]/10 px-[13px] py-[9px] rounded-[12px]">
            <p className="font-semibold text-[#FF9500] text-[12px] leading-none">
              RATING NOTE
            </p>

            <div className="flex items-start gap-[10px] text-[#FF9500]">
              <span className="font-semibold text-[12px] leading-[130%] shrink-0">
                {movie.ageRating.code}
              </span>

              <p className="text-[12px] leading-[130%]">
                {movie.ageRating.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MovieDetails;
