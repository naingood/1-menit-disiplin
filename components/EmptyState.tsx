import React from 'react';

interface EmptyStateProps {
  onAddTask?: () => void;
  onStartTimer?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask, onStartTimer }) => {
  const quickStartTasks = [
    "Balas 1 komentar di media sosial",
    "Rekam 1 klip video pendek",
    "Cek ide konten di catatan",
    "Baca 1 artikel tentang niche Anda",
    "Buat 1 postingan untuk besok"
  ];

  return (
    <div className="text-center py-12 px-6">
      <div className="max-w-md mx-auto">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-6">
            <div className="text-6xl">🚀</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Mulai Perjalanan Produktivitas Anda
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Setiap hari dimulai dengan langkah kecil. Buat tugas pertama Anda dan lihat bagaimana konsistensi membawa perubahan besar.
          </p>
        </div>

        {/* Quick Start Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Ide Cepat untuk Memulai
          </h4>
          <div className="space-y-3 text-left">
            {quickStartTasks.map((task, index) => (
              <button
                key={index}
                onClick={() => onAddTask?.()}
                className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 border border-blue-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{task}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onAddTask}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span className="text-xl">➕</span>
            Buat Tugas Pertama
          </button>

          <button
            onClick={onStartTimer}
            className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-2"
          >
            <span className="text-xl">⏱️</span>
            Mulai dengan Timer
          </button>
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-green-100 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            "Konsistensi adalah kunci kesuksesan. Mulai hari ini, satu tugas dalam satu menit."
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
