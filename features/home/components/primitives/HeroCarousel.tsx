'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import type { FeaturedMovie } from '../../types/featured-movie.types';
import HeroSlide from '../primitives/HeroSlide';

interface HeroCarouselProps {
  movies: FeaturedMovie[];
}

const HeroCarousel = ({ movies }: HeroCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [autoplay] = useState(() =>
    Autoplay({
      delay: 6000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
      rootNode: (emblaRoot) => emblaRoot.parentElement ?? emblaRoot,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: movies.length > 1,
      align: 'start',
    },
    movies.length > 1 ? [autoplay] : []
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section
      aria-label="Featured movies"
      aria-roledescription="carousel"
      className="relative bg-[#020B1C] w-full"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {movies.map((movie, index) => (
            <HeroSlide
              key={movie.id}
              movie={movie}
              index={index}
              total={movies.length}
            />
          ))}
        </div>
      </div>

      {movies.length > 1 && (
        <div className="right-0 bottom-0 left-0 z-20 absolute pointer-events-none">
          <div className="flex items-center gap-[20px] mx-auto px-5 sm:px-10 lg:px-[67px] pb-[30px] w-full max-w-[1728px]">
            <div className="flex flex-1 items-center gap-[8px] min-w-0 pointer-events-auto">
              {movies.map((movie, index) => (
                <button
                  key={movie.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}: ${movie.title}`}
                  aria-current={index === selectedIndex ? 'true' : undefined}
                  onClick={() => scrollTo(index)}
                  className="group flex flex-1 items-center min-w-0 h-[36px] cursor-pointer"
                >
                  <span
                    className={`h-[3px] w-full rounded-full transition-colors duration-300 ${
                      selectedIndex === index
                        ? 'bg-[#FF321F]'
                        : 'bg-white/70 group-hover:bg-white'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-[10px] pointer-events-auto shrink-0">
              <button
                type="button"
                aria-label="Previous movie"
                onClick={scrollPrev}
                className="flex justify-center items-center hover:bg-white/10 border border-white/30 hover:border-white rounded-full w-[40px] h-[40px] text-white transition-all duration-200 cursor-pointer"
              >
                <span aria-hidden="true" className="text-[20px]">
                  ←
                </span>
              </button>

              <button
                type="button"
                aria-label="Next movie"
                onClick={scrollNext}
                className="flex justify-center items-center hover:bg-white/10 border border-white/30 hover:border-white rounded-full w-[40px] h-[40px] text-white transition-all duration-200 cursor-pointer"
              >
                <span aria-hidden="true" className="text-[20px]">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
