import React from 'react';

interface StreakTrackerProps {
  streak: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ streak }) => {
  return (
    <div className="my-6 p-4 bg-orange-100 dark:bg-orange-500/20 border-l-4 border-orange-500 dark:border-orange-400 rounded-r-lg shadow flex items-center justify-center gap-3 animate-fade-in">
      <span className="text-3xl animate-pulse" role="img" aria-label="Api Runtutan">🔥</span>
      <p className="font-bold text-lg text-orange-800 dark:text-orange-200">
        Runtutan {streak} Hari!
      </p>
      <span className="text-sm text-orange-600 dark:text-orange-300">Terus lanjutkan!</span>
    </div>
  );
};

export default StreakTracker;