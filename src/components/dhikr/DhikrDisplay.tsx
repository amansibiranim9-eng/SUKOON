import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const DhikrDisplay: React.FC = () => {
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const session = useAppStore((state) => state.session);
  const dailyTotal = useAppStore((state) => state.dailyTotal);
  const incrementDhikr = useAppStore((state) => state.incrementDhikr);
  const resetDhikr = useAppStore((state) => state.resetDhikr);
  const language = useAppStore((state) => state.language);
  const decayIntensity = useAppStore((state) => state.decayIntensity);

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isPressing, setIsPressing] = useState(false);

  // Smooth decay for atmospheric intensity pulse
  useEffect(() => {
    const interval = setInterval(() => {
      decayIntensity();
    }, 100);
    return () => clearInterval(interval);
  }, [decayIntensity]);

  // Keyboard accessibility: Space or Enter increments counter exactly once
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        triggerIncrement();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [incrementDhikr]);

  const triggerIncrement = (e?: React.MouseEvent | React.TouchEvent) => {
    // Exact 1-press = 1-count guarantee
    incrementDhikr();

    // Trigger ripple animation
    const id = Date.now() + Math.random();
    let x = 140;
    let y = 140;
    if (e && 'clientX' in e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 900);
  };

  const target = currentDhikr.targetCount || 33;
  const progressPercent = Math.min(100, Math.round((session.count / target) * 100));

  // Circular progress calculations (Radius = 118, Circumference = 2 * PI * 118 ~= 741.4)
  const radius = 118;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 z-10 select-none">
      {/* Central Arabic Dhikr Display with smooth transitions */}
      <div className="text-center mb-6 min-h-[140px] flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDhikr.id}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl sm:text-5xl font-arabic text-sukoon-pure font-bold tracking-wide leading-relaxed py-1 drop-shadow-[0_0_25px_rgba(57,169,255,0.45)]">
              {currentDhikr.arabic}
            </h1>
            <p className="text-sukoon-glow text-base sm:text-lg font-medium tracking-wider mt-1 opacity-90">
              {currentDhikr.transliteration}
            </p>
            <p className="text-white/60 text-xs sm:text-sm font-light mt-1 max-w-xs text-center italic">
              &quot;{currentDhikr.translation}&quot;
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Interactive Circular Dhikr Counter Button */}
      <div className="relative flex items-center justify-center my-2">
        {/* Animated Particles Orbiting the Counter */}
        <div className="absolute inset-[-18px] rounded-full pointer-events-none animate-spin" style={{ animationDuration: '28s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sukoon-glow shadow-[0_0_12px_#39A9FF]" />
          <div className="absolute bottom-2 left-1/4 w-1.5 h-1.5 rounded-full bg-sukoon-electric shadow-[0_0_10px_#168BFF]" />
          <div className="absolute top-1/3 right-1 w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_#ffffff]" />
        </div>

        {/* Outer Circular SVG Progress Ring */}
        <svg
          className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 pointer-events-none drop-shadow-[0_0_20px_rgba(22,139,255,0.35)]"
          viewBox="0 0 280 280"
        >
          {/* Subtle Track */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="rgba(7, 20, 38, 0.8)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Indicator */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="url(#blue-gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300 ease-out"
          />
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#168BFF" />
              <stop offset="100%" stopColor="#39A9FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Circular Tap Target Button */}
        <motion.button
          onClick={(e) => triggerIncrement(e)}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          animate={{ scale: isPressing ? 0.96 : 1 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-[#071426]/90 to-[#030407]/95 border border-sukoon-glow/30 backdrop-blur-xl shadow-[0_0_45px_rgba(22,139,255,0.25)] focus:outline-none focus:ring-2 focus:ring-sukoon-glow/50 cursor-pointer overflow-hidden active:shadow-[0_0_65px_rgba(57,169,255,0.5)]"
          aria-label="Tap to count Dhikr"
        >
          {/* Ripple Effects on Press */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none animate-ripple-out bg-sukoon-glow/30"
              style={{
                left: ripple.x - 40,
                top: ripple.y - 40,
                width: 80,
                height: 80,
              }}
            />
          ))}

          {/* Subtitle / Counter Label */}
          <span className="text-white/50 text-xs sm:text-sm font-medium tracking-wider uppercase mb-1">
            {language === 'ar' ? 'العدد' : 'COUNT'}
          </span>

          {/* Large Smooth Numerical Counter */}
          <motion.span
            key={session.count}
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="text-6xl sm:text-7xl font-bold tracking-tight text-sukoon-pure drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]"
          >
            {session.count}
          </motion.span>

          {/* Target Progress Ratio */}
          <span className="text-sukoon-glow text-xs sm:text-sm font-light mt-1 opacity-80">
            / {target}
          </span>

          {/* Subtle Tap Prompt */}
          <span className="text-white/30 text-[10px] sm:text-xs font-light mt-3 tracking-widest">
            {language === 'ar' ? 'المس للذكر' : 'TAP TO REMEMBER'}
          </span>
        </motion.button>
      </div>

      {/* Session Controls & Metrics */}
      <div className="w-full flex items-center justify-between mt-8 px-4 text-xs sm:text-sm text-white/70">
        <button
          onClick={resetDhikr}
          className="hover:text-sukoon-glow transition-colors duration-200 underline underline-offset-4 active:scale-95 cursor-pointer py-1"
        >
          {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-white/50">{language === 'ar' ? 'مجموع اليوم:' : 'Daily:'}</span>
          <span className="font-semibold text-sukoon-pure">{dailyTotal}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-white/50">{language === 'ar' ? 'الدورات:' : 'Cycles:'}</span>
          <span className="font-semibold text-sukoon-glow">{session.completedCycles}</span>
        </div>
      </div>
    </div>
  );
};
export default DhikrDisplay;
