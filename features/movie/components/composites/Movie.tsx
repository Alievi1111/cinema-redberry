'use client';

import { useMovie } from '../../hooks/use-movie';
import MovieHeroSection from '../primitives/MovieHeroSection';
import MovieSessions from '../primitives/Sessions';
import MovieError from '../primitives/states/MovieError';
import MovieSkeleton from '../primitives/states/MovieSkeleton';

interface MovieProps {
  movieId: string;
}

const Movie = ({ movieId }: MovieProps) => {
  const { movie, isLoading, isError, error, refetch } = useMovie(movieId);

  if (isLoading) {
    return <MovieSkeleton />;
  }

  if (isError || !movie) {
    return <MovieError error={error} onRetry={() => void refetch()} />;
  }

  return (
    <main className="min-h-screen">
      <MovieHeroSection movie={movie} />
      <MovieSessions movie={movie} />
    </main>
  );
};

export default Movie;
