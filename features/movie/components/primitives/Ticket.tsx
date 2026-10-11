import Image from "next/image";

import type { MovieSessionType } from "../../types/movie.types";

interface TicketProps {
  session: MovieSessionType;
  disabledReason?: string | null;
  onSelect: (session: MovieSessionType) => void;
}

export const Ticket = ({ session, disabledReason, onSelect }: TicketProps) => {
  const isUnavailable = session.isSoldOut || session.seatsLeft <= 0;
  const isDisabled = isUnavailable || Boolean(disabledReason);

  const reason = isUnavailable ? "This session is sold out." : disabledReason;

  return (
    <button
      type="button"
      disabled={isDisabled}
      title={reason ?? undefined}
      onClick={() => onSelect(session)}
      className={`relative flex h-[81px] w-[207px] shrink-0 cursor-pointer rounded-[12px] border border-transparent bg-[#020B1C] text-left transition-colors duration-200 hover:border-[#FF321F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF321F] ${isDisabled ? "cursor-not-allowed opacity-45" : ""}`}
    >
      <span className="-top-[6px] left-[124px] absolute bg-[#1E2031] rounded-full w-[12px] h-[12px]" />

      <span className="-bottom-[6px] left-[124px] absolute bg-[#1E2031] rounded-full w-[12px] h-[12px]" />

      <div className="flex flex-col justify-center items-center w-[130px] shrink-0">
        <p className="font-bold text-[20px] text-white leading-none">
          {session.time}
        </p>

        <div className="flex items-center gap-[7px] mt-[10px]">
          <span
            title={session.language.name}
            className="text-[#A9A9A9] text-[12px] leading-[130%]"
          >
            {session.language.code}
          </span>

          <span className="bg-white/10 px-[10px] py-[3px] rounded-full font-semibold text-[#A9A9A9] text-[12px] leading-none">
            {session.format.name}
          </span>
        </div>
      </div>

      <div className="my-[10px] border-white border-l border-dashed h-[61px]" />

      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="font-bold text-[18px] text-[#FF321F]">₾{session.price}</p>

        <div className="flex items-center gap-[4px] mt-[4px]">
          <Image
            src="/icons/ticket-availability.svg"
            alt="ticket"
            width={12}
            height={12}
          />

          <span className="text-[#A9A9A9] text-[12px] leading-[130%] pt-1">
            {isUnavailable ? "Sold out" : `${session.seatsLeft} left`}
          </span>
        </div>
      </div>
    </button>
  );
};
