'use client';

import { useState } from 'react';
import type { Seat, SeatMap } from '@/features/seats/types/seats.types';
import type { SeatChoice } from '../types/booking.types';
import { seatCategory } from '../lib/booking-utils';

type VisibleCategory = 'available' | 'selected' | 'sold' | 'held';

const categories: { key: VisibleCategory; label: string; swatch: string }[] = [
  { key: 'available', label: 'Available', swatch: 'border border-[#515464] bg-[#1E2031]' },
  { key: 'selected', label: 'Selected', swatch: 'bg-[#EC3013]' },
  { key: 'sold', label: 'Sold', swatch: 'bg-[#292B3D]' },
  { key: 'held', label: 'Held by another user', swatch: 'bg-[repeating-linear-gradient(135deg,#292B3D_0,#292B3D_3px,#414354_3px,#414354_6px)]' },
];

interface SeatMapPickerProps {
  map: SeatMap;
  choices: SeatChoice[];
  contested: string[];
  pending: boolean;
  onToggleSeat: (seat: Seat) => void;
}

export default function SeatMapPicker({ map, choices, contested, pending, onToggleSeat }: SeatMapPickerProps) {
  const [visible, setVisible] = useState<Record<VisibleCategory, boolean>>({
    available: true,
    selected: true,
    sold: true,
    held: true,
  });
  const selectedIds = new Set(choices.map((choice) => choice.seatId));
  const contestedCodes = new Set(contested);

  return (
    <div className="min-w-0 max-w-full">
      <div aria-label="Seat map" className="scrollbar-hidden mt-5 min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-3">
        <div className="mx-auto w-max min-w-full">
          <p className="mx-auto mb-7 max-w-[680px] rounded-b-2xl bg-[#292B3D] py-2 text-center text-xs font-bold text-white">SCREEN</p>
          {map.sections.map((section, index) => (
            <section key={`${section.name}-${index}`} className="mb-5" aria-label={`${section.name} seats`}>
              <h2 className="mb-4 text-xs font-semibold uppercase text-[#A9A9A9]">
                {section.name} · Rows {section.rows.map((row) => row.label).join('–')}
              </h2>
              <div className="space-y-2">
                {section.rows.map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="w-5 shrink-0 text-center text-xs text-white">{row.label}</span>
                    {row.seats.map((seat) => {
                      const selected = selectedIds.has(seat.id);
                      const contestedSeat = contestedCodes.has(seat.code);
                      const category = seatCategory(seat, selected, contestedSeat);
                      const isVisible = category !== 'unavailable' && visible[category];
                      const selectable = !contestedSeat && (seat.state === 'available' || seat.isMine);
                      const color = category === 'selected'
                        ? 'border-[#EC3013] bg-[#EC3013] text-white'
                        : category === 'available'
                          ? 'border-[#515464] bg-[#1E2031] text-white hover:border-white'
                          : category === 'held'
                            ? 'border-transparent bg-[repeating-linear-gradient(135deg,#292B3D_0,#292B3D_7px,#363849_7px,#363849_14px)] text-[#A9A9A9]'
                            : 'border-transparent bg-[#1E2031] text-[#565866]';

                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={!isVisible || !selectable || pending}
                          aria-hidden={!isVisible}
                          aria-label={`Seat ${seat.code}: ${category}`}
                          aria-pressed={selected}
                          title={`Seat ${seat.code}: ${category}`}
                          onClick={() => onToggleSeat(seat)}
                          className={`size-10 shrink-0 rounded-xl border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${seat.aisleAfter ? 'mr-5' : ''} ${isVisible ? '' : 'invisible'} ${selectable ? 'cursor-pointer' : 'cursor-not-allowed'} ${color}`}
                        >
                          {seat.label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <fieldset className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-[#A9A9A9]">
        <legend className="sr-only">Show seat categories</legend>
        {categories.map(({ key, label, swatch }) => (
          <label key={key} className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={visible[key]}
              onChange={() => setVisible((current) => ({ ...current, [key]: !current[key] }))}
              className="peer sr-only"
            />
            <span aria-hidden="true" className={`flex size-4 items-center justify-center rounded-[4px] text-[11px] font-bold text-white transition-opacity peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white ${swatch} ${visible[key] ? '' : 'opacity-40'}`}>
              {visible[key] ? '✓' : ''}
            </span>
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
