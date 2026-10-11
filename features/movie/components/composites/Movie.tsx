'use client';

import axios from 'axios';

import { useMovie } from '../../hooks/use-movie';
import MovieHeroSection from '../primitives/MovieHeroSection';
import MovieSessions from '../primitives/Sessions';

interface MovieProps {
  movieId: string;
}

const Movie = ({ movieId }: MovieProps) => {
  const { movie, isLoading, isError, error, refetch } = useMovie(movieId);

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex items-center px-5 sm:px-10 lg:px-[60px] pt-[140px] w-full min-h-[620px]"
      >
        <div className="flex gap-[34px] mx-auto w-full max-w-[1728px] animate-pulse">
          <div className="hidden lg:block bg-white/10 rounded-[14px] w-[289px] h-[374px] shrink-0" />

          <div className="flex flex-col justify-end gap-[15px] w-full max-w-[580px]">
            <div className="bg-white/10 rounded-full w-[105px] h-[28px]" />
            <div className="bg-white/10 rounded-[8px] w-[80%] h-[48px]" />
            <div className="bg-white/10 rounded-full w-full h-[14px]" />
            <div className="bg-white/10 rounded-full w-[85%] h-[14px]" />
            <div className="bg-white/10 rounded-full w-[70%] h-[14px]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    const isNotFound =
      axios.isAxiosError(error) && error.response?.status === 404;

    return (
      <section className="flex flex-col justify-center items-center gap-[14px] px-5 pt-[120px] min-h-[620px] text-center">
        <h1 className="font-bold text-[24px] text-white">
          {isNotFound ? 'Movie not found' : 'Unable to load movie'}
        </h1>

        <p className="text-[#A9A9A9] text-[14px]">
          {isNotFound
            ? 'The requested movie does not exist.'
            : 'Something went wrong. Please try again.'}
        </p>

        {!isNotFound && (
          <button
            type="button"
            onClick={() => void refetch()}
            className="bg-[#FF321F] mt-[10px] px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-white cursor-pointer"
          >
            Try again
          </button>
        )}
      </section>
    );
  }

  return (
    <main className="min-h-screen">
      <MovieHeroSection movie={movie} />
      <MovieSessions movie={movie} />
    </main>
  );
};

export default Movie;
