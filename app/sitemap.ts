import type { MetadataRoute } from 'next';

import { siteUrl } from '@/lib/seo';

type MovieListResponse = { data?: { slug?: string }[] };

const getMovieSlugs = async (category: 'now-playing' | 'coming-soon') => {
  try {
    const response = await fetch(
      `https://api.kinoxii.redberryinternship.ge/api/movies/${category}`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return [];

    const result = (await response.json()) as MovieListResponse;
    return Array.isArray(result.data)
      ? result.data.flatMap((movie) =>
          typeof movie.slug === 'string' && movie.slug ? [movie.slug] : []
        )
      : [];
  } catch {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;
  if (!baseUrl) return [];

  const [nowPlaying, comingSoon] = await Promise.all([
    getMovieSlugs('now-playing'),
    getMovieSlugs('coming-soon'),
  ]);

  return [
    { url: new URL('/', baseUrl).toString(), changeFrequency: 'daily', priority: 1 },
    { url: new URL('/sessions', baseUrl).toString(), changeFrequency: 'daily', priority: 0.9 },
    ...[...new Set([...nowPlaying, ...comingSoon])].map((slug) => ({
      url: new URL(`/movie/${encodeURIComponent(slug)}`, baseUrl).toString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
