
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const motivationalMessages = [
  "Great job! You did it! 🎉",
  "Excellent work! 🌟",
  "You're becoming a great programmer! 💪",
  "Keep coding! 🚀",
  "Outstanding performance! ⭐",
  "You're on fire! 🔥",
  "Brilliant solution! 🧠",
  "Level conquered! 🏆",
  "Code master in the making! 👨‍💻",
  "Unstoppable! Keep going! 💫",
];

interface CelebrationOverlayProps {
  show: boolean;
  onClose: () => void;
}

const CelebrationOverlay = ({ show, onClose }: CelebrationOverlayProps) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!show) return;

    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);

    // Fire confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#a78bfa', '#f9a8d4', '#fbbf24', '#34d399', '#60a5fa'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#a78bfa', '#f9a8d4', '#fbbf24', '#34d399', '#60a5fa'],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-3xl p-8 shadow-cute-lg text-center max-w-sm mx-4 animate-fade-in">
        <div className="text-6xl mb-4 animate-float">🏆</div>
        <h2 className="text-2xl font-extrabold text-foreground mb-2">Level Complete!</h2>
        <p className="text-primary font-bold text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute px-6 py-2 font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CelebrationOverlay;
