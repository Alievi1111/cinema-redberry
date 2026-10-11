'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

import type { SearchResult } from '../../types/search.types';

interface SearchDropdownProps {
  results: SearchResult[];
  isSearching: boolean;
  isError: boolean;
  getResultHref: (result: SearchResult) => string;
  onSelect: () => void;
}

const SearchDropdown = ({
  results,
  isSearching,
  isError,
  getResultHref,
  onSelect,
}: SearchDropdownProps) => {
  return (
    <motion.div
      id="header-search-results"
      role="region"
      aria-label="Search results"
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="top-[calc(100%+12px)] left-0 z-50 absolute bg-[#020B1C] shadow-[0_18px_60px_rgba(0,0,0,0.35)] border border-white/10 rounded-[16px] w-[480px] max-w-[calc(100vw-32px)] overflow-hidden origin-top-left"
    >
      <div className="p-[10px] max-h-[342px] overflow-y-auto">
        <div className="flex justify-between items-center p-[8px]">
          <p className="font-semibold text-[#A9A9A9] text-[12px]">
            FILMS & EVENTS
          </p>

          <p className="text-[#A9A9A9] text-[12px]">
            {isSearching
              ? 'Searching...'
              : `${results.length} ${
                  results.length === 1 ? 'result' : 'results'
                }`}
          </p>
        </div>

        {isSearching && (
          <div
            role="status"
            className="flex justify-center items-center gap-[10px] py-[28px]"
          >
            <div className="border-2 border-white/20 border-t-[#FF321F] rounded-full w-[16px] h-[16px] animate-spin" />

            <p className="text-[#A9A9A9] text-[13px]">Searching films...</p>
          </div>
        )}

        {!isSearching && isError && (
          <p
            role="alert"
            className="py-[24px] text-[#A9A9A9] text-[13px] text-center"
          >
            Something went wrong. Please try again.
          </p>
        )}

        {!isSearching && !isError && results.length === 0 && (
          <p className="py-[24px] text-[#A9A9A9] text-[13px] text-center">
            No films or events found.
          </p>
        )}

        {!isSearching && !isError && results.length > 0 && (
          <div className="flex flex-col gap-[2px]">
            {results.map((result) => {
              const kindLabel =
                result.kind === 'film'
                  ? 'Film'
                  : result.kind === 'event'
                    ? 'Event'
                    : result.kind;

              const details = [
                kindLabel,
                result.ageRating?.code,
                result.runtimeMinutes != null
                  ? `${result.runtimeMinutes} min`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ');

              return (
                <Link
                  key={result.id}
                  href={getResultHref(result)}
                  onClick={onSelect}
                  className="flex justify-between items-center gap-[12px] hover:bg-white/5 focus-visible:bg-white/5 px-[6px] py-[8px] rounded-[8px] focus-visible:outline-none transition-colors duration-200"
                >
                  <div className="flex items-center gap-[14px] min-w-0">
                    <div className="relative bg-[#1E2031] rounded-[6px] w-[40px] h-[56px] overflow-hidden shrink-0">
                      {result.posterUrl ? (
                        <Image
                          src={result.posterUrl}
                          alt={result.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-full h-full">
                          <span className="text-[18px]">🎬</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-[3px] min-w-0">
                      <p className="font-semibold text-[14px] text-white truncate">
                        {result.title}
                      </p>

                      <p className="text-[#A9A9A9] text-[12px] truncate">
                        {details}
                      </p>
                    </div>
                  </div>

                  {result.fromPrice != null && (
                    <p className="font-semibold text-[13px] text-white whitespace-nowrap shrink-0">
                      from ₾{result.fromPrice}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchDropdown;
