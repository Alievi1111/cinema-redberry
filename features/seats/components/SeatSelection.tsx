'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { movieHref } from '@/lib/routes';
import { useSeatSelection } from '../hooks/use-seat-selection';
import type { SeatMap } from '../types/seats.types';
import ProfileCompletionDialog from './ProfileCompletionDialog';

interface SeatSelectionProps {
  sessionId: string;
}

const SeatMapView = ({ map, price }: { map: SeatMap; price: number }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const availableIds = new Set(
    map.sections.flatMap((section) =>
      section.rows.flatMap((row) =>
        row.seats
          .filter((seat) => seat.state === 'available')
          .map((seat) => seat.id)
      )
    )
  );
  const selected = selectedIds.filter((id) => availableIds.has(id));
  const selectedSet = new Set(selected);

  const toggleSeat = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  return (
    <div className="mt-8 rounded-[20px] bg-[#1E2031] p-5 sm:p-8">
      <div className="mx-auto mb-10 h-2 max-w-[540px] rounded-full bg-[#FF321F] shadow-[0_6px_24px_#FF321F55]" />
      <p className="mb-8 text-center text-[12px] uppercase tracking-[0.25em] text-[#A9A9A9]">
        Screen
      </p>

      <div className="overflow-x-auto pb-3">
        <div className="mx-auto flex w-max min-w-full flex-col items-center gap-7">
          {map.sections.map((section, sectionIndex) => (
            <section
              key={`${section.name}-${sectionIndex}`}
              aria-label={`${section.name} seats`}
            >
              <h2 className="mb-4 text-center text-[13px] font-semibold text-[#A9A9A9]">
                {section.name}
              </h2>
              <div className="flex flex-col gap-2">
                {section.rows.map((row, rowIndex) => (
                  <div
                    key={`${row.label}-${rowIndex}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="w-7 text-right text-[12px] text-[#A9A9A9]">
                      {row.label}
                    </span>
                    {row.seats.map((seat) => {
                      const isAvailable = seat.state === 'available';
                      const isSelected = selectedSet.has(seat.id);

                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => toggleSeat(seat.id)}
                          aria-label={`Seat ${seat.code}: ${isSelected ? 'selected' : seat.state}`}
                          aria-pressed={isSelected}
                          title={`Seat ${seat.code}: ${isSelected ? 'selected' : seat.state}`}
                          className={`h-8 w-8 rounded-t-[9px] border text-[10px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${seat.aisleAfter ? 'mr-5' : ''} ${isSelected ? 'border-[#FF321F] bg-[#FF321F] text-white' : isAvailable ? 'cursor-pointer border-[#34D985] bg-[#34D985]/20 text-white hover:bg-[#34D985]/40' : 'cursor-not-allowed border-white/10 bg-white/10 text-[#A9A9A9]'}`}
                        >
                          {seat.label}
                        </button>
                      );
                    })}
                    <span className="w-7 text-[12px] text-[#A9A9A9]">
                      {row.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[#A9A9A9]">
        <span>
          <i className="mr-2 inline-block size-3 rounded-sm bg-[#34D985]" />
          Available
        </span>
        <span>
          <i className="mr-2 inline-block size-3 rounded-sm bg-[#FF321F]" />
          Selected
        </span>
        <span>
          <i className="mr-2 inline-block size-3 rounded-sm bg-white/20" />
          Unavailable
        </span>
      </div>

      <div
        className="mt-8 border-t border-white/10 pt-5 text-center text-[14px] text-white"
        aria-live="polite"
      >
        {selected.length === 0
          ? 'Choose available seats on the map.'
          : `${selected.length} ${selected.length === 1 ? 'seat' : 'seats'} selected · ₾${(selected.length * price).toFixed(2)} adult price`}
      </div>
    </div>
  );
};

const SeatSelection = ({ sessionId }: SeatSelectionProps) => {
  const router = useRouter();
  const { user } = useAuthUser();
  const { session, seatMap } = useSeatSelection(
    sessionId,
    Boolean(user?.profileComplete)
  );

  if (session.isPending) {
    return (
      <p role="status" className="text-[#A9A9A9]">
        Loading session…
      </p>
    );
  }

  if (session.isError) {
    return (
      <div role="alert" className="text-white">
        <p>Could not load this session.</p>
        <button
          type="button"
          onClick={() => void session.refetch()}
          className="mt-3 cursor-pointer text-[#FF321F]"
        >
          Try again
        </button>
        <Link href="/sessions" className="ml-5 text-[#A9A9A9]">
          All sessions
        </Link>
      </div>
    );
  }

  const showtime = session.data;
  const movieLink = movieHref(showtime.movie.slug);
  const tooYoung =
    user?.profileComplete &&
    showtime.movie.ageRating &&
    (user.age === null || user.age < showtime.movie.ageRating.minAge);

  return (
    <>
      <Link
        href={movieLink}
        className="text-[13px] text-[#A9A9A9] hover:text-white"
      >
        ← Back to {showtime.movie.title}
      </Link>
      <h1 className="mt-5 text-[28px] font-bold text-white">
        Select seats for {showtime.movie.title}
      </h1>
      <p className="mt-2 text-[14px] text-[#A9A9A9]">
        {showtime.date} · {showtime.time} · {showtime.venue.name} · Hall {showtime.hall.name} · {showtime.format.name}
      </p>

      {showtime.isSoldOut || showtime.seatsLeft <= 0 ? (
        <p role="status" className="mt-8 text-white">
          This session is sold out.
        </p>
      ) : tooYoung ? (
        <p role="alert" className="mt-8 text-white">
          This movie is available for ages {showtime.movie.ageRating?.minAge} and
          up.
        </p>
      ) : !user?.profileComplete ? (
        <ProfileCompletionDialog onClose={() => router.push(movieLink)} />
      ) : seatMap.isPending ? (
        <p role="status" className="mt-8 text-[#A9A9A9]">
          Loading seats…
        </p>
      ) : seatMap.isError ? (
        <div role="alert" className="mt-8 text-white">
          <p>Could not load the seat map.</p>
          <button
            type="button"
            onClick={() => void seatMap.refetch()}
            className="mt-3 cursor-pointer text-[#FF321F]"
          >
            Try again
          </button>
        </div>
      ) : (
        <SeatMapView
          key={seatMap.data.sessionId}
          map={seatMap.data}
          price={showtime.price}
        />
      )}
    </>
  );
};

export default SeatSelection;
