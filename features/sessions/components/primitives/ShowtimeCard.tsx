import Link from 'next/link';

import { getAuthToken } from '@/features/auth/lib/auth-session';
import { seatSelectionHref } from '@/lib/routes';
import type { Showtime } from '../../types/sessions.types';

type ShowtimeCardProps = {
  showtime: Showtime;
  movieTitle: string;
  minimumAge: number | null;
  viewerAge: number | null;
  onGuestSelect: (sessionId: number) => void;
};

const LOW_SEAT_THRESHOLD = 5;

const ShowtimeCard = ({
  showtime,
  movieTitle,
  minimumAge,
  viewerAge,
  onGuestSelect,
}: ShowtimeCardProps) => {
  const soldOut = showtime.isSoldOut || showtime.seatsLeft <= 0;
  const underage =
    viewerAge !== null && minimumAge !== null && viewerAge < minimumAge;
  const disabledReason = soldOut
    ? 'Sold out'
    : underage
      ? `Available for ages ${minimumAge} and up`
      : null;
  const lowSeats = showtime.seatsLeft <= LOW_SEAT_THRESHOLD;
  const href = seatSelectionHref(showtime.id);
  const price = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(showtime.price);

  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[18px] font-extrabold leading-none text-white">
          {showtime.time}
        </span>
        <span className="max-w-[130px] truncate rounded-full bg-[#2A2C3D] px-[10px] py-[5px] text-[12px] font-semibold leading-none text-white">
          {showtime.format.name}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 text-[12px] leading-[130%]">
        <span className="truncate text-[#A9A9A9]" title={showtime.language.name}>
          {showtime.language.name}
        </span>
        {soldOut ? (
          <span className="shrink-0 text-[#A9A9A9]">Sold out</span>
        ) : (
          <span
            className={`flex shrink-0 items-center gap-[4px] ${lowSeats ? 'text-[#FF321F]' : 'text-[#34D985]'}`}
          >
            <span
              aria-hidden="true"
              className="size-[13px] bg-current"
              style={{
                maskImage: "url('/icons/ticket.svg')",
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
              }}
            />
            {showtime.seatsLeft} left
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span
          className="min-w-0 truncate text-[12px] font-semibold text-white"
          title={`${showtime.venue.name} · Hall ${showtime.hall.name}`}
        >
          {showtime.venue.name} · Hall {showtime.hall.name}
        </span>
        <span className="shrink-0 text-[14px] font-bold text-white">₾{price}</span>
      </div>
    </>
  );

  const cardClass =
    'flex h-[104px] w-[252px] shrink-0 flex-col justify-between rounded-[16px] bg-[#1E2031] p-[15px]';

  if (disabledReason) {
    return (
      <div
        role="group"
        aria-label={`${movieTitle}, ${showtime.time}: ${disabledReason}`}
        aria-disabled="true"
        title={disabledReason}
        className={`${cardClass} cursor-not-allowed opacity-40`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={`${movieTitle}, ${showtime.time}, ${showtime.format.name}, ${showtime.language.name}, ${showtime.venue.name}, Hall ${showtime.hall.name}, ${showtime.seatsLeft} seats left, ₾${price}`}
      onNavigate={(event) => {
        if (!getAuthToken()) {
          event.preventDefault();
          onGuestSelect(showtime.id);
        }
      }}
      className={`${cardClass} transition-colors hover:bg-[#292C3D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF321F]`}
    >
      {content}
    </Link>
  );
};

export default ShowtimeCard;
