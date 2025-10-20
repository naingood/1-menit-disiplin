import React, { useState } from 'react';
import type { Task } from '../types';

interface AddTaskFormProps {
  onAddTask: (text: string) => void;
  tasks?: Task[];
  onShareTasks?: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, tasks = [], onShareTasks }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim());
      setText('');
    }
  };

  const totalTasks = tasks.length;

  const handleShareTasks = () => {
    if (onShareTasks) {
      onShareTasks();
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tugas Harian</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total: {totalTasks}</span>
          {onShareTasks && (
            <button
              onClick={handleShareTasks}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Bagikan Tugas"
            >
              📤
            </button>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Balas 1 komentar"
          className="flex-grow p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          disabled={!text.trim()}
        >
          <span className="text-xl">+</span>
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;