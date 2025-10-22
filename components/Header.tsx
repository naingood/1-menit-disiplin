import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onProfileClick }) => {
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          setProgress(((60 - newTime) / 60) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
      setProgress(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(60);
    setProgress(0);
    setIsRunning(true);
    setShowTimer(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(60);
    setProgress(0);
  };

  const closeTimer = () => {
    setShowTimer(false);
    setIsRunning(false);
    setTimeLeft(60);
    setProgress(0);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const closeCompletionDialog = () => {
    setShowCompletionDialog(false);
    setShowTimer(false);
    setTimeLeft(60);
    setProgress(0);
    setIsRunning(false);
  };

  const playBellSound = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create oscillator for bell-like sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bell-like sound: start with higher frequency, drop to lower
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

      // Volume envelope
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log('Web Audio API not supported, using fallback notification');
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowCompletionDialog(true);

    // Play bell sound
    playBellSound();

    // Play notification sound if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ Waktu Habis!', {
        body: '1 menit telah berlalu. Bagus sekali!',
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <header className="bg-gradient-to-br from-blue-900 to-black border-b border-blue-800 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                1 Menit Disiplin
              </h1>
              <p className="text-xs text-white">
                Bangun konsistensi setiap hari
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startTimer}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="text-base">⏱️</span>
              Timer
            </button>

            <div className="relative menu-container">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <span className="text-lg">⋮</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="py-1">
                    {onProfileClick && (
                      <button
                        onClick={() => {
                          onProfileClick();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">👤</span>
                        Profil
                      </button>
                    )}
                    {onSettingsClick && (
                      <button
                        onClick={() => {
                          onSettingsClick();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">⚙️</span>
                        Pengaturan
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Timer Modal */}
      {showTimer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">⏱️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Timer 1 Menit
                  </h2>
                  <div className="h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-1"></div>
                </div>
              </div>

              {/* Progress Circle */}
              <div className="relative mb-8">
                <svg className="w-48 h-48 mx-auto transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#timerGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Timer text in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {Math.round(progress)}% selesai
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center mb-6">
                {!isRunning ? (
                  <button
                    onClick={() => setIsRunning(true)}
                    className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                    title="Mulai Timer"
                  >
                    <span className="text-2xl">▶️</span>
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                    title="Pause Timer"
                  >
                    <span className="text-2xl">⏸️</span>
                  </button>
                )}

                <button
                  onClick={resetTimer}
                  className="w-14 h-14 bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  title="Reset Timer"
                >
                  <span className="text-2xl">🔄</span>
                </button>

                <button
                  onClick={closeTimer}
                  className="w-14 h-14 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  title="Tutup Timer"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  💡 Lakukan tugas kecil Anda selama 1 menit!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Dialog */}
      {showCompletionDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20 dark:border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-white text-4xl">🎉</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white text-4xl">✅</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                Waktu Habis!
              </h2>
              <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mb-6"></div>

              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg font-medium leading-relaxed">
                🎊 Selamat! Anda telah menyelesaikan 1 menit fokus.<br/>
                <span className="text-green-600 dark:text-green-400 font-semibold">Bagus sekali!</span>
              </p>

              <button
                onClick={closeCompletionDialog}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
              >
                <span className="text-lg">🎯</span>
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
