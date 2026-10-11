import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_RECENTLY_VIEWED,
  mergeGuestRecentlyViewed,
  readRecentlyViewed,
  recordRecentlyViewed,
  recentlyViewedStorageKey,
} from '../lib/recently-viewed.ts';

const makeStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
};

const movie = (slug) => ({
  slug, title: slug, kind: 'film', posterUrl: null, backdropUrl: null,
  genres: [{ name: 'Drama' }], runtimeMinutes: 134, ageRating: { code: '12+' },
});

test('opened movies appear newest first, without duplicates, and the list stays bounded', () => {
  const storage = makeStorage();
  for (let index = 0; index < MAX_RECENTLY_VIEWED + 1; index++) {
    recordRecentlyViewed(movie(`movie-${index}`), null, storage, index + 1);
  }
  assert.equal(readRecentlyViewed(null, storage).length, MAX_RECENTLY_VIEWED);
  assert.equal(readRecentlyViewed(null, storage)[0].slug, `movie-${MAX_RECENTLY_VIEWED}`);
  assert.equal(readRecentlyViewed(null, storage).some((item) => item.slug === 'movie-0'), false);

  recordRecentlyViewed(movie('movie-2'), null, storage, 20);
  assert.equal(readRecentlyViewed(null, storage)[0].slug, 'movie-2');
  assert.equal(readRecentlyViewed(null, storage).filter((item) => item.slug === 'movie-2').length, 1);
});

test('guest views move into the signed-in history without exposing another account', () => {
  const storage = makeStorage();
  recordRecentlyViewed(movie('guest-movie'), null, storage, 10);
  recordRecentlyViewed(movie('account-movie'), 1, storage, 8);
  recordRecentlyViewed(movie('other-account-movie'), 2, storage, 12);

  mergeGuestRecentlyViewed(1, storage);
  assert.deepEqual(readRecentlyViewed(1, storage).map((item) => item.slug), ['guest-movie', 'account-movie']);
  assert.deepEqual(readRecentlyViewed(2, storage).map((item) => item.slug), ['other-account-movie']);
  assert.deepEqual(readRecentlyViewed(null, storage), []);
  assert.equal(storage.getItem(recentlyViewedStorageKey(null)), null);
});
