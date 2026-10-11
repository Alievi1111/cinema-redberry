type SessionPaginationProps = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

const getVisiblePages = (currentPage: number, lastPage: number) => {
  if (lastPage <= 5) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const start =
    currentPage <= 3
      ? 1
      : currentPage >= lastPage - 2
        ? lastPage - 2
        : currentPage - 1;
  const pages = new Set([1, lastPage, start, start + 1, start + 2]);
  const sorted = [...pages].sort((a, b) => a - b);
  const visible: Array<number | string> = [];

  for (const page of sorted) {
    const previous = visible.at(-1);
    if (typeof previous === 'number' && page - previous === 2) {
      visible.push(previous + 1);
    } else if (typeof previous === 'number' && page - previous > 2) {
      visible.push(`ellipsis-${previous}-${page}`);
    }
    visible.push(page);
  }

  return visible;
};

const SessionPagination = ({
  currentPage,
  lastPage,
  onPageChange,
}: SessionPaginationProps) => {
  if (lastPage <= 1) return null;

  const pages = getVisiblePages(currentPage, lastPage);
  const arrowClass =
    'flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#1E2031] text-[#A9A9A9] transition-colors hover:bg-[#2A2C3D] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF321F] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#1E2031] disabled:hover:text-[#A9A9A9]';

  return (
    <nav aria-label="Sessions pagination" className="mt-[20px]">
      <p className="sr-only" aria-live="polite">
        Page {currentPage} of {lastPage}
      </p>
      <div className="flex items-center justify-center gap-[8px]">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={arrowClass}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-[16px]">
            <path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {pages.map((page) =>
          typeof page === 'number' ? (
            <button
              key={page}
              type="button"
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={`flex size-[40px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF321F] ${
                page === currentPage
                  ? 'bg-[#FF321F] text-white'
                  : 'text-[#A9A9A9] hover:bg-[#1E2031] hover:text-white'
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={page}
              aria-hidden="true"
              className="flex size-[28px] shrink-0 items-center justify-center text-[13px] text-[#A9A9A9]"
            >
              …
            </span>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className={arrowClass}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-[16px]">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default SessionPagination;
