import type { NowPlayingMovie } from './now-playing.types';

export type ComingSoonMovie = Omit<NowPlayingMovie, 'synopsis'>;

export interface ComingSoonResponse {
  data: ComingSoonMovie[];
}
