'use client';

import { useFeaturedMovies } from '../../hook/use-featured-movies';
import HeroSkeleton from '../primitives/skelleton/HeroSkeleton';
import HeroError from '../primitives/skelleton/HeroError';
import HeroCarousel from '../primitives/HeroCarousel';

const Hero = () => {
  const { movies, isLoading, isError, refetch } = useFeaturedMovies();

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (isError) {
    return <HeroError onRetry={() => void refetch()} />;
  }

  if (movies.length === 0) {
    return (
      <section className="flex justify-center items-center bg-[#020B1C] px-5 min-h-[300px]">
        <p className="text-[14px] text-white/70">
          No featured movies available.
        </p>
      </section>
    );
  }

  return <HeroCarousel movies={movies} />;
};

export default Hero;
