import React from 'react';

interface QuickActionsProps {
  onAddTask?: () => void;
  onStartTimer?: () => void;
  onViewProgress?: () => void;
  onShareTasks?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddTask, onStartTimer, onViewProgress, onShareTasks }) => {
  const actions = [
    {
      id: 'add-task',
      icon: '➕',
      label: 'Tambah Tugas',
      color: 'from-blue-500 to-indigo-600',
      onClick: onAddTask
    },
    {
      id: 'timer',
      icon: '⏱️',
      label: 'Timer 1 Menit',
      color: 'from-green-500 to-emerald-600',
      onClick: onStartTimer
    },
    {
      id: 'progress',
      icon: '📊',
      label: 'Lihat Progress',
      color: 'from-purple-500 to-pink-600',
      onClick: onViewProgress
    },
    {
      id: 'share',
      icon: '📤',
      label: 'Bagikan',
      color: 'from-orange-500 to-red-600',
      onClick: onShareTasks
    }
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 md:hidden">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`w-14 h-14 bg-gradient-to-r ${action.color} hover:shadow-lg rounded-full shadow-md transition-all duration-300 transform hover:scale-110 flex items-center justify-center text-white text-xl`}
          title={action.label}
          aria-label={action.label}
        >
          <span>{action.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
