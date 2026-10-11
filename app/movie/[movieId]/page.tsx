import { Suspense } from 'react';

import Movie from '@/features/movie/components/composites/Movie';
import MovieSkeleton from '@/features/movie/components/primitives/states/MovieSkeleton';

interface PageProps {
  params: Promise<{
    movieId: string;
  }>;
}

const MovieContent = async ({ params }: PageProps) => {
  const { movieId } = await params;

  return <Movie movieId={movieId} />;
};

const MoviePage = ({ params }: PageProps) => {
  return (
    <Suspense fallback={<MovieSkeleton />}>
      <MovieContent params={params} />
    </Suspense>
  );
};

export default MoviePage;
