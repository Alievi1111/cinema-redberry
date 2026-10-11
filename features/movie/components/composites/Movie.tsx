'use client';

import { useEffect } from 'react';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { mergeGuestRecentlyViewed, recordRecentlyViewed } from '@/features/recently-viewed/lib/recently-viewed';
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
  const { user, isLoading: authLoading } = useAuthUser();

  useEffect(() => {
    if (isLoading || isError || !movie) return;
    if (authLoading) {
      recordRecentlyViewed(movie, null);
      return;
    }
    if (user) mergeGuestRecentlyViewed(user.id);
    recordRecentlyViewed(movie, user?.id ?? null);
  }, [movie, isLoading, isError, authLoading, user?.id]);

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
