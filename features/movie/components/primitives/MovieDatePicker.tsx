import type { MovieCalendarDay } from '../../utils/movie-date';
import { formatMovieDate } from '../../utils/movie-date';

interface MovieDatePickerProps {
  days: MovieCalendarDay[];
  activeDate: string | null;
  onChange: (date: string) => void;
}

const MovieDatePicker = ({
  days,
  activeDate,
  onChange,
}: MovieDatePickerProps) => {
  return (
    <div
      role="group"
      aria-label="Choose session date"
      className="[&::-webkit-scrollbar]:hidden flex gap-[10px] mt-[20px] pb-[6px] w-full min-w-0 overflow-x-auto [scrollbar-width:none]"
    >
      {days.map(({ date, day, number, isAvailable }) => {
        const isActive = activeDate === date;

        return (
          <button
            key={date}
            type="button"
            disabled={!isAvailable}
            aria-pressed={isActive}
            title={
              isAvailable ? formatMovieDate(date) : 'No sessions available'
            }
            onClick={() => onChange(date)}
            className={`flex h-[80px] w-[80px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[16px] border transition-colors duration-200 ${
              isActive
                ? 'border-[#FF321F] bg-[#2A2C3D]'
                : 'border-transparent bg-[#1E2031]'
            } ${
              isAvailable
                ? 'hover:bg-[#2A2C3D]'
                : 'cursor-not-allowed opacity-35'
            }`}
          >
            <span className="font-semibold text-[12px] text-white leading-none">
              {day}
            </span>

            <span className="mt-[7px] font-bold text-[18px] text-white leading-none">
              {number}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MovieDatePicker;
