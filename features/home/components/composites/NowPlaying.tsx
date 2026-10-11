'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
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
    <section>
      <div className="mx-auto px-5 sm:px-10 lg:px-[64px] w-full max-w-[1728px]">
        <div className="mb-[24px] flex items-center justify-between gap-4">
          <h2 className="font-bold text-[24px] text-white">NOW PLAYING</h2>
          <Link
            href="/sessions"
            className="shrink-0 text-[12px] font-semibold text-[#FF321F] hover:text-[#FF6B5C] focus-visible:outline-2 focus-visible:outline-[#FF321F]"
          >
            See all
          </Link>
        </div>

        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="flex gap-[16px] touch-pan-y select-none">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group min-w-0 flex-[0_0_260px] md:hover:basis-[450px] md:focus-within:basis-[450px] motion-safe:transition-[flex-basis] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
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
