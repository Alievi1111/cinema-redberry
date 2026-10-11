import type { MovieDetailsType } from '@/features/movie/types/movie.types';

export type RecentlyViewedMovie = {
  slug: string;
  title: string;
  posterUrl: string | null;
  genre: string;
  runtimeMinutes: number | null;
  ageRatingCode: string | null;
  viewedAt: number;
};

type RecentStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const RECENTLY_VIEWED_CHANGED = 'recently-viewed:changed';
export const MAX_RECENTLY_VIEWED = 6;

export const recentlyViewedStorageKey = (userId: number | null) =>
  `kinoxii_recently_viewed:${userId ?? 'guest'}`;

const browserStorage = (): RecentStorage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const readRecentlyViewed = (
  userId: number | null,
  storage: RecentStorage | null = browserStorage()
): RecentlyViewedMovie[] => {
  if (!storage) return [];
  try {
    const value: unknown = JSON.parse(storage.getItem(recentlyViewedStorageKey(userId)) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is RecentlyViewedMovie =>
      item !== null && typeof item === 'object' &&
      typeof item.slug === 'string' && typeof item.title === 'string' &&
      (item.posterUrl === null || typeof item.posterUrl === 'string') &&
      typeof item.genre === 'string' &&
      (item.runtimeMinutes === null || typeof item.runtimeMinutes === 'number') &&
      (item.ageRatingCode === null || typeof item.ageRatingCode === 'string') &&
      typeof item.viewedAt === 'number' && Number.isFinite(item.viewedAt)
    ).slice(0, MAX_RECENTLY_VIEWED);
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (
  current: RecentlyViewedMovie[],
  movie: RecentlyViewedMovie
): RecentlyViewedMovie[] => [
  movie,
  ...current.filter((item) => item.slug !== movie.slug),
].slice(0, MAX_RECENTLY_VIEWED);

const notifyChange = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(RECENTLY_VIEWED_CHANGED));
};

export const recordRecentlyViewed = (
  movie: MovieDetailsType,
  userId: number | null,
  storage: RecentStorage | null = browserStorage(),
  viewedAt = Date.now()
) => {
  if (!storage) return;
  const entry: RecentlyViewedMovie = {
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.posterUrl ?? movie.backdropUrl,
    genre: movie.genres[0]?.name ?? (movie.kind === 'event' ? 'Event' : 'Film'),
    runtimeMinutes: movie.runtimeMinutes,
    ageRatingCode: movie.ageRating?.code ?? null,
    viewedAt,
  };
  try {
    storage.setItem(
      recentlyViewedStorageKey(userId),
      JSON.stringify(addRecentlyViewed(readRecentlyViewed(userId, storage), entry))
    );
    notifyChange();
  } catch {
    // Browsing still works if storage is unavailable.
  }
};

export const mergeGuestRecentlyViewed = (
  userId: number,
  storage: RecentStorage | null = browserStorage()
) => {
  if (!storage) return;
  const guest = readRecentlyViewed(null, storage);
  if (guest.length === 0) return;

  const merged = [...guest, ...readRecentlyViewed(userId, storage)]
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .reduce<RecentlyViewedMovie[]>((items, movie) =>
      items.some((item) => item.slug === movie.slug) ? items : [...items, movie], []
    )
    .slice(0, MAX_RECENTLY_VIEWED);

  try {
    storage.setItem(recentlyViewedStorageKey(userId), JSON.stringify(merged));
    storage.removeItem(recentlyViewedStorageKey(null));
    notifyChange();
  } catch {
    // Keep the guest list for a later merge if writing fails.
  }
};
