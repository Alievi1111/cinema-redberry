import axios from 'axios';

interface MovieErrorProps {
  error: unknown;
  onRetry: () => void;
}

const MovieError = ({ error, onRetry }: MovieErrorProps) => {
  const isNotFound =
    axios.isAxiosError(error) && error.response?.status === 404;

  return (
    <main className="flex min-h-[620px] items-center justify-center px-5 pt-[120px] pb-[60px] text-center sm:px-10 lg:px-[60px]">
      <section
        role="alert"
        aria-labelledby="movie-error-title"
        className="flex max-w-[480px] flex-col items-center gap-[14px]"
      >
        <h1
          id="movie-error-title"
          className="font-bold text-[24px] text-white"
        >
          {isNotFound ? 'Movie not found' : 'Unable to load movie'}
        </h1>

        <p className="text-[14px] text-[#A9A9A9]">
          {isNotFound
            ? 'The requested movie does not exist.'
            : 'Something went wrong. Please try again.'}
        </p>

        {!isNotFound && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-[10px] cursor-pointer rounded-full bg-[#FF321F] px-[24px] py-[10px] font-semibold text-[14px] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Try again
          </button>
        )}
      </section>
    </main>
  );
};

export default MovieError;
