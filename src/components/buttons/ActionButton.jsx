const ActionButton = ({ icon, onClick, ariaLabel, size = 'md' }) => {
  const sizeClasses = {
    md: 'h-7 w-7 sm:h-10 md:h-12 md:w-12',
    lg: 'h-8 w-8 sm:h-12 md:h-14 md:w-14'
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        ${sizeClasses[size]}
        p-1 sm:p-2 transition-all flex items-center justify-center
        border border-black
        rounded-md
        bg-transparent
        sm:border-none sm:rounded-full
        sm:hover:bg-gray-100 sm:active:bg-gray-200
      `}
    >
      {icon === 'heart' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 sm:w-full sm:h-full fill-black sm:fill-none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 sm:w-full sm:h-full stroke-black sm:stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </button>
  );
};

export default ActionButton;