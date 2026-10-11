import Image from 'next/image';

import type { TicketOrder } from '../../types/tickets.types';
import { formatTicketSession } from '../../utils/format-ticket-session';

interface TicketCardProps {
  order: TicketOrder;
  onRefund?: (order: TicketOrder) => void;
}

const TicketCard = ({ order, onRefund }: TicketCardProps) => {
  const { session, tickets } = order;
  const { movie, venue, hall, format, language } = session;

  const sessionDate = formatTicketSession(session.date, session.time);

  const isEligible =
    order.isUpcoming && order.status === 'paid' && order.isRefundable;

  const canRefund = isEligible && Boolean(onRefund);

  const refundMessage =
    order.status === 'refunded'
      ? 'This order has already been refunded.'
      : !order.isUpcoming
        ? 'Refunds are unavailable for past sessions.'
        : !order.isRefundable
          ? 'Refund unavailable. The refund deadline may have passed.'
          : 'Refund functionality is not connected yet.';

  return (
    <article className="relative flex lg:flex-row flex-col bg-[#1E2031] rounded-[26px] w-full max-w-[1400px] lg:min-h-[183px]">
      <div className="flex flex-1 items-start lg:items-center gap-[20px] p-[20px] lg:px-[30px] min-w-0">
        <div className="relative bg-[#2A2C3D] rounded-[8px] w-[100px] h-[134px] overflow-hidden shrink-0">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes="100px"
              className="object-cover"
            />
          ) : (
            <div className="flex justify-center items-center px-2 h-full text-[#A9A9A9] text-[11px] text-center">
              No poster
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 gap-[12px] min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h2 className="font-extrabold text-[20px] text-white">
              {movie.title.toUpperCase()}
            </h2>

            {movie.ageRating && (
              <span className="flex justify-center items-center bg-[#FF321F]/10 px-[9px] rounded-full h-[21px] font-semibold text-[#FF321F] text-[12px]">
                {movie.ageRating.code}
              </span>
            )}

            {movie.runtimeMinutes != null && (
              <span className="text-[#A9A9A9] text-[14px]">
                {movie.runtimeMinutes} min
              </span>
            )}
          </div>

          {/* Session details */}
          <div className="flex flex-wrap items-start gap-x-[30px] gap-y-[12px]">
            <div className="flex flex-col gap-[4px]">
              <span className="font-semibold text-[#A9A9A9] text-[12px]">
                DATE
              </span>

              <span className="font-semibold text-[14px] text-white">
                {sessionDate}
              </span>
            </div>

            <div className="flex flex-col gap-[4px]">
              <span className="font-semibold text-[#A9A9A9] text-[12px]">
                VENUE
              </span>

              <span className="font-semibold text-[14px] text-white">
                {venue.name} · Hall {hall.name}
              </span>
            </div>

            <div className="flex flex-col gap-[4px]">
              <span className="font-semibold text-[#A9A9A9] text-[12px]">
                FORMAT
              </span>

              <span className="font-semibold text-[14px] text-white">
                {format.name} · {language.name}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-[8px]">
            <span className="mr-[2px] font-semibold text-[#A9A9A9] text-[12px]">
              SEATS
            </span>

            {tickets.map((ticket) => (
              <span
                key={ticket.id}
                className="bg-[#343647] px-[10px] py-[5px] rounded-[6px] font-semibold text-[12px] text-white"
              >
                {ticket.seatCode} · {ticket.ticketType.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-[20px] py-[20px] border-[#505261]/40 border-t lg:border-t-0 lg:border-l border-dashed w-full lg:w-[310px] shrink-0">
        <div className="flex flex-col">
          <span className="font-semibold text-[#A9A9A9] text-[12px]">
            ORDER
          </span>

          <span className="font-semibold text-[14px] text-white">
            #{order.reference}
          </span>
        </div>

        <div className="flex justify-between items-center mt-[18px]">
          <span className="font-semibold text-[#A9A9A9] text-[14px]">
            Total paid
          </span>

          <span className="font-extrabold text-[24px] text-white">
            ₾
            {order.totalPrice.toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div
          className="group relative mt-[10px]"
          tabIndex={canRefund ? undefined : 0}
          aria-label={canRefund ? undefined : refundMessage}
        >
          <button
            type="button"
            disabled={!canRefund}
            onClick={() => onRefund?.(order)}
            className={`h-[35px] w-full rounded-full text-[14px] font-bold transition-colors ${
              canRefund
                ? 'cursor-pointer bg-[#FF321F] text-white hover:bg-[#EC3013]'
                : 'cursor-not-allowed bg-[#2A2C3D] text-white/30'
            }`}
          >
            {order.status === 'refunded' ? 'Refunded' : 'Refund'}
          </button>

          {!canRefund && (
            <div
              role="tooltip"
              className="right-0 bottom-[calc(100%+8px)] z-20 absolute bg-[#343647] opacity-0 group-focus:opacity-100 group-hover:opacity-100 shadow-lg px-[12px] py-[9px] rounded-[8px] w-[260px] max-w-[80vw] text-[12px] text-white text-center leading-[150%] transition-opacity pointer-events-none"
            >
              {refundMessage}
            </div>
          )}
        </div>

        <p className="mt-[10px] text-[#A9A9A9] text-[12px] text-center leading-[130%]">
          {order.status === 'refunded'
            ? 'This order has been refunded'
            : order.isRefundable
              ? 'This order is eligible for a refund'
              : 'Refund is not available'}
        </p>
      </div>
    </article>
  );
};

export default TicketCard;
