export const AuthLoadingScreen = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex justify-center items-center min-h-screen"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          aria-hidden="true"
          className="border-[3px] border-gray-200 border-t-[#EC3013] rounded-full w-9 h-9 animate-spin"
        />

        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
};
