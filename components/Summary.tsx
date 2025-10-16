import React from 'react';
import type { Task } from '../types';

interface SummaryProps {
  tasks: Task[];
  today: string;
}

const Summary: React.FC<SummaryProps> = ({ tasks, today }) => {
  const totalCompletionsToday = tasks.reduce((total, task) => {
    return total + (task.completions[today] || 0);
  }, 0);

  return (
    <div className="my-6 p-4 bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 rounded-r-lg shadow">
      <p className="font-semibold">
        {totalCompletionsToday > 0 
         ? `Luar biasa! Anda telah menyelesaikan ${totalCompletionsToday} tugas kecil hari ini.`
         : `Ayo mulai! Apa tugas 1 menit pertamamu?`}
      </p>
    </div>
  );
};

export default Summary;