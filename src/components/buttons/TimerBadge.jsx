import React from 'react';

const TimerBadge = ({ minutes }) => (
  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
    <button className="bg-white border-2 border-black rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-md hover:scale-105 transition-transform">
      <span className="font-bold text-xs sm:text-sm">
        {minutes}m
      </span>
    </button>
  </div>
);

export default TimerBadge;