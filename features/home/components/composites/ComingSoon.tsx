'use client';

import { useComingSoon } from '../../hook/use-coming-soon';
import ComingSoonCarousel from '../primitives/ComingSoonCarousel';
import ComingSoonError from '../primitives/skelleton/ComingSoonError';
import ComingSoonSkeleton from '../primitives/skelleton/ComingSoonSkeleton';

const ComingSoon = () => {
  const { movies, isLoading, isError, refetch } = useComingSoon(6);

  if (isLoading) {
    return <ComingSoonSkeleton />;
  }

  if (isError) {
    return <ComingSoonError onRetry={() => void refetch()} />;
  }

  if (movies.length === 0) {
    return (
      <section className="flex justify-center items-center bg-[#020B1C] px-5 min-h-[240px]">
        <p className="text-[#A9A9A9] text-[14px]">
          No upcoming movies available.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#020B1C] pt-10">
      <div className="mx-auto px-5 sm:px-10 lg:px-16 w-full max-w-[1728px]">
        <h2 className="mb-[24px] font-bold text-[24px] text-white">
          COMING SOON...
        </h2>

        <ComingSoonCarousel movies={movies} />
      </div>
    </section>
  );
};

export default ComingSoon;
