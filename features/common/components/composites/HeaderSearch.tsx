'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useSearch } from '../../hook/use-search';
import type { SearchResult } from '../../types/search.types';
import SearchDropdown from '../primitives/SearchDropdown';

const getResultHref = (result: SearchResult) => {
  if (result.kind === 'event') {
    return `/events/${result.slug}`;
  }

  return `/movies/${result.slug}`;
};

const HeaderSearch = () => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const { results, isSearching, isError } = useSearch(query, isOpen);

  const showDropdown = isOpen && query.trim().length > 0;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = () => {
    setIsOpen(false);
    setQuery('');
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key !== 'Enter' ||
      isSearching ||
      isError ||
      results.length === 0
    ) {
      return;
    }

    router.push(getResultHref(results[0]));
    handleSelect();
  };

  return (
    <div ref={searchRef} className="relative w-[480px] shrink-0">
      <div className="flex items-center gap-[4px] bg-white/10 px-[12px] rounded-full w-full h-[41px]">
        <Image src="/icons/searchVector.svg" alt="" width={16} height={16} />

        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleEnter}
          placeholder="Search films and live events"
          aria-label="Search films and live events"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? 'header-search-results' : undefined}
          autoComplete="off"
          className="bg-transparent outline-none w-full text-[14px] text-white placeholder:text-white"
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <SearchDropdown
            key="search-dropdown"
            results={results}
            isSearching={isSearching}
            isError={isError}
            getResultHref={getResultHref}
            onSelect={handleSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderSearch;
