'use client';

import useEmblaCarousel from 'embla-carousel-react';

import type { ComingSoonMovie } from '../../types/coming-soon.types';
import ComingSoonCard from '../primitives/ComingSoonCard';

interface ComingSoonCarouselProps {
  movies: ComingSoonMovie[];
  pendingMovieIds: ReadonlySet<number>;
  onNotify: (movie: ComingSoonMovie) => void;
}

const ComingSoonCarousel = ({
  movies,
  pendingMovieIds,
  onNotify,
}: ComingSoonCarouselProps) => {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    watchDrag: true,
  });

  return (
    <div
      ref={emblaRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div className="flex gap-[16px] touch-pan-y select-none">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-[0_0_90%] sm:flex-[0_0_470px] min-w-0"
          >
            <ComingSoonCard
              movie={movie}
              isNotified={movie.isNotified}
              isPending={pendingMovieIds.has(movie.id)}
              onNotify={() => onNotify(movie)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoonCarousel;
