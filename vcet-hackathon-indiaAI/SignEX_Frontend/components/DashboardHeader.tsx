'use client';

import { useState, useEffect } from 'react';

const DashboardHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  const date = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl white-card-elevated p-4 sm:p-6 lg:p-8 fade-in">
      {/* Subtle Background Elements */}
      <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-blue-100 opacity-50 blur-xl"></div>

      <div className="relative z-10">
        <div className="mb-6 sm:mb-8 slide-in-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SignEX</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Professional video conferencing made simple
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="white-card rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{time}</div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">{date}</div>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <div className="white-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center min-w-[70px] sm:min-w-[80px] hover:shadow-lg transition-all duration-300 group flex-1 sm:flex-none">
              <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors duration-300">2</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Upcoming</div>
            </div>
            <div className="white-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center min-w-[70px] sm:min-w-[80px] hover:shadow-lg transition-all duration-300 group flex-1 sm:flex-none">
              <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">5</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
