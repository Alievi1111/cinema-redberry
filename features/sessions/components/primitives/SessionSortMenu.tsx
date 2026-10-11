'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import type { FilterOptions } from '../../types/sessions.types';

type SessionSortMenuProps = {
  options: FilterOptions['sorts'];
  value: string;
  onChange: (value: string) => void;
};

const SessionSortMenu = ({ options, value, onChange }: SessionSortMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value)
  );
  const selectedLabel = options[selectedIndex]?.label ?? 'Sort sessions';

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) optionRefs.current[activeIndex]?.focus();
  }, [isOpen, activeIndex]);

  const openMenu = (index = selectedIndex) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeMenu = (restoreFocus: boolean) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const choose = (optionId: string) => {
    if (optionId !== value) onChange(optionId);
    closeMenu(true);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % options.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + options.length) % options.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      closeMenu(false);
    }
  };

  return (
    <div ref={rootRef} className="relative flex items-center gap-[8px] self-start text-[13px] sm:self-auto">
      <span className="text-[#A9A9A9]">Sort:</span>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Sort sessions: ${selectedLabel}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'session-sort-options' : undefined}
        disabled={options.length === 0}
        onClick={() => (isOpen ? closeMenu(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openMenu(event.key === 'ArrowUp' ? options.length - 1 : selectedIndex);
          }
        }}
        className="flex cursor-pointer items-center gap-[8px] py-1 font-semibold text-white hover:text-[#FFB0A7] focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-[#FF321F] disabled:cursor-not-allowed"
      >
        <span>{selectedLabel}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className={`size-[16px] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="m3 6 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="session-sort-options"
          role="listbox"
          aria-label="Sort sessions"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-full z-30 mt-[8px] min-w-[224px] rounded-[12px] border border-[#393C50] bg-[#1D2030] p-[5px] shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
        >
          {options.map((option, index) => (
            <button
              key={option.id}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={option.id === value}
              tabIndex={-1}
              onClick={() => choose(option.id)}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[8px] px-[12px] py-[10px] text-left text-[13px] focus-visible:outline-2 focus-visible:outline-[#FF321F] ${
                option.id === value
                  ? 'bg-[#FF321F]/15 font-semibold text-white'
                  : 'text-[#D4D5DD] hover:bg-[#2A2C3D]'
              }`}
            >
              <span>{option.label}</span>
              {option.id === value && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="size-[16px] shrink-0 text-[#FF321F]"
                >
                  <path
                    d="m3 8 3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionSortMenu;
