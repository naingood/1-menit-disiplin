import React, { useEffect, useState } from 'react';

interface CelebrationAnimationProps {
  onComplete: () => void;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3000); // Animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-confetti-0 { animation: confetti-fall 3s ease-in-out forwards; }
        .animate-confetti-1 { animation: confetti-fall 3.2s ease-in-out forwards; }
        .animate-confetti-2 { animation: confetti-fall 2.8s ease-in-out forwards; }
        .animate-confetti-3 { animation: confetti-fall 3.5s ease-in-out forwards; }
        .animate-confetti-4 { animation: confetti-fall 2.5s ease-in-out forwards; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out; }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
        <div className="relative">
          {/* Central celebration text */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2 animate-pulse">
              Selamat!
            </h2>
            <p className="text-xl text-white animate-fade-in-delayed">
              Milestone tercapai!
            </p>
          </div>

          {/* CSS-based confetti animation */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full animate-confetti-${i % 5}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][i % 5],
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CelebrationAnimation;
