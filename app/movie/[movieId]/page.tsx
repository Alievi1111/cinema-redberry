import { Suspense } from 'react';

import Movie from '@/features/movie/components/composites/Movie';

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
    <Suspense fallback={<div className="pt-[150px] min-h-screen" />}>
      <MovieContent params={params} />
    </Suspense>
  );
};

export default MoviePage;
