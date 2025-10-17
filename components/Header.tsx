import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setShowCompletionDialog(true);
      // Play notification sound if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Waktu Habis!', {
          body: '1 menit telah berlalu. Bagus sekali!',
          icon: '/icons/icon-192x192.png'
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(60);
    setIsRunning(true);
    setShowTimer(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(60);
  };

  const closeTimer = () => {
    setShowTimer(false);
    setIsRunning(false);
    setTimeLeft(60);
  };

  const closeCompletionDialog = () => {
    setShowCompletionDialog(false);
    setShowTimer(false);
    setTimeLeft(60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <header className="text-center p-6 bg-white dark:bg-gray-800 shadow-md rounded-b-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          1 Menit Disiplin
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Bangun konsistensi, satu tugas kecil setiap saat.
        </p>
        <button
          onClick={startTimer}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          ⏱️ Timer 1 Menit
        </button>
      </header>

      {/* Timer Modal */}
      {showTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                ⏱️ Timer 1 Menit
              </h2>

              <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-6">
                {formatTime(timeLeft)}
              </div>

              <div className="flex gap-3 justify-center">
                {!isRunning ? (
                  <button
                    onClick={() => setIsRunning(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    ▶️ Mulai
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    ⏸️ Pause
                  </button>
                )}

                <button
                  onClick={resetTimer}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  🔄 Reset
                </button>

                <button
                  onClick={closeTimer}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  ✕ Tutup
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Lakukan tugas kecil Anda selama 1 menit!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Completion Dialog */}
      {showCompletionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Waktu Habis!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Selamat! Anda telah menyelesaikan 1 menit fokus. Bagus sekali!
              </p>
              <button
                onClick={closeCompletionDialog}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
