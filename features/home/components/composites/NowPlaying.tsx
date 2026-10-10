'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useNowPlaying } from '../../hook/use-now-playing';
import MovieCard from '../primitives/MovieCard';
import NowPlayingSkeleton from '../primitives/skelleton/NowPlayingSkeleton';
import NowPlayingError from '../primitives/skelleton/NowPlayingError';

const NowPlaying = () => {
  const { movies, isLoading, isError, refetch } = useNowPlaying(6);

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    watchDrag: true,
  });

  if (isLoading) {
    return <NowPlayingSkeleton />;
  }

  if (isError) {
    return <NowPlayingError onRetry={() => void refetch()} />;
  }

  if (movies.length === 0) {
    return (
      <section className="flex justify-center items-center bg-[#020B1C] min-h-[240px]">
        <p className="text-[#A9A9A9] text-[14px]">
          No movies currently playing.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#020B1C] py-[32px]">
      <div className="mx-auto px-5 sm:px-10 lg:px-[64px] w-full max-w-[1728px]">
        <h2 className="mb-[24px] font-bold text-[24px] text-white">
          NOW PLAYING
        </h2>

        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-[16px] touch-pan-y select-none">
            {movies.map((movie) => (
              <div key={movie.id} className="flex-[0_0_260px] min-w-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NowPlaying;
