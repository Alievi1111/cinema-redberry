import { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';

import Movie from '@/features/movie/components/composites/Movie';
import MovieSkeleton from '@/features/movie/components/primitives/states/MovieSkeleton';
import type { MovieDetailsResponse } from '@/features/movie/types/movie.types';
import { siteUrl } from '@/lib/seo';

interface PageProps {
  params: Promise<{
    movieId: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { movieId } = await params;

  try {
    const response = await fetch(
      `https://api.kinoxii.redberryinternship.ge/api/movies/${encodeURIComponent(movieId)}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) throw new Error('Movie metadata is unavailable');

    const { data: movie } = (await response.json()) as MovieDetailsResponse;
    if (!movie?.title) throw new Error('Movie metadata is unavailable');

    const description =
      movie.synopsis?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
      `Explore ${movie.title} and its showtimes at Kino XII.`;
    const imageUrl = movie.backdropUrl || movie.posterUrl;
    const image = imageUrl && /^https?:\/\//i.test(imageUrl)
      ? { url: imageUrl, alt: `${movie.title} movie image` }
      : null;
    const inherited = await parent;

    return {
      title: movie.title,
      description,
      alternates: siteUrl
        ? { canonical: `/movie/${encodeURIComponent(movie.slug)}` }
        : undefined,
      openGraph: {
        ...inherited.openGraph,
        title: `${movie.title} | Kino XII`,
        description,
        url: siteUrl ? `/movie/${encodeURIComponent(movie.slug)}` : undefined,
        images: image ? [image] : ['/opengraph-image'],
      },
      twitter: {
        ...inherited.twitter,
        card: 'summary_large_image',
        title: `${movie.title} | Kino XII`,
        description,
        images: image ? [image] : ['/twitter-image'],
      },
    };
  } catch {
    return {
      title: 'Movie',
      description: 'Explore movies and showtimes at Kino XII.',
      robots: { index: false, follow: false },
    };
  }
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
