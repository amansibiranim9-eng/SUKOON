import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDhikr } from '@/hooks';
import { useAppStore } from '@/store';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const DhikrDisplay: React.FC = () => {
  const { dhikr, count, targetCount, completedCycles, tap, reset } = useDhikr();
  const language = useAppStore((state) => state.language);
  const dailyTotal = useAppStore((state) => state.dailyTotal);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const isArabic = language === 'ar';

  const progressPercent = targetCount > 0 ? Math.min(100, (count / targetCount) * 100) : 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setRipples((prev) => [...prev.slice(-4), newRipple]);
    tap();
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center select-none px-4">
      {/* 1. Clear Arabic Dhikr text with beautiful calligraphy */}
      <motion.div
        key={dhikr.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 max-w-xl mx-auto"
      >
        <h2 className="font-arabic text-4xl sm:text-5xl md:text-6xl text-[#E9E2D3] leading-relaxed tracking-wide drop-shadow-[0_4px_24px_rgba(198,166,106,0.15)] font-normal">
          {dhikr.arabic}
        </h2>
        <p className="mt-2 text-sm sm:text-base font-light tracking-wider text-[#C6A66A]">
          {dhikr.transliteration}
        </p>
        <p className="mt-1 text-xs sm:text-sm text-[#E9E2D3]/60 italic font-light max-w-md mx-auto line-clamp-2">
          "{dhikr.translation}"
        </p>
      </motion.div>

      {/* 2. Large Interactive Dhikr Counter Circle */}
      <div className="relative my-2 sm:my-4 flex items-center justify-center">
        {/* Subtle breathing ambient glow */}
        <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#C6A66A]/10 blur-3xl pointer-events-none animate-pulse-slow" />

        {/* Outer Circular Progress Ring */}
        <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="120"
            className="stroke-[#171713]"
            strokeWidth="3"
            fill="transparent"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="120"
            className="stroke-[#C6A66A]"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            animate={{
              strokeDashoffset: 2 * Math.PI * 120 * (1 - progressPercent / 100),
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </svg>

        {/* Counter Interactive Disc */}
        <motion.div
          whileTap={{ scale: 0.96 }}
          onPointerDown={handlePointerDown}
          className="absolute w-56 h-56 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-[#1c1c17] to-[#12130f] border border-[#C6A66A]/30 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(233,226,211,0.15)] flex flex-col items-center justify-center cursor-pointer overflow-hidden touch-manipulation active:border-[#C6A66A]/60"
          role="button"
          tabIndex={0}
          aria-label={isArabic ? 'انقر للذكر' : 'Tap for Dhikr'}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              tap();
            }
          }}
        >
          {/* Touch Ripples */}
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                onAnimationComplete={() => removeRipple(r.id)}
                style={{
                  position: 'absolute',
                  left: r.x,
                  top: r.y,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(198, 166, 106, 0.45)',
                  boxShadow: '0 0 16px rgba(198, 166, 106, 0.6)',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </AnimatePresence>

          {/* Counter Numbers */}
          <div className="relative z-10 flex flex-col items-center pointer-events-none">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A66A]/80 font-light mb-1">
              {isArabic ? 'العدد' : 'COUNT'}
            </span>

            <motion.span
              key={count}
              initial={{ scale: 0.85, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="font-mono text-6xl sm:text-7xl font-extralight text-[#E9E2D3] tracking-tight drop-shadow-sm"
            >
              {count}
            </motion.span>

            <span className="text-xs text-[#E9E2D3]/50 font-light tracking-widest mt-1">
              / {targetCount}
            </span>
          </div>

          {/* Tap Prompt Hint */}
          <span className="absolute bottom-4 text-[10px] uppercase tracking-[0.25em] text-[#C6A66A]/60 font-light pointer-events-none">
            {isArabic ? 'المس للذكر' : 'TAP TO REMEMBER'}
          </span>
        </motion.div>
      </div>

      {/* 3. Daily Progress & Cycles Indicator */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-[#E9E2D3]/70 font-light">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66A] shadow-[0_0_6px_#C6A66A]" />
          <span>
            {isArabic ? 'الدورات المكتملة:' : 'Completed Cycles:'}{' '}
            <strong className="text-[#E9E2D3] font-mono">{completedCycles}</strong>
          </span>
        </div>

        <div className="h-3 w-[1px] bg-white/10" />

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#777B5A]" />
          <span>
            {isArabic ? 'مجموع اليوم:' : 'Daily Total:'}{' '}
            <strong className="text-[#E9E2D3] font-mono">{dailyTotal}</strong>
          </span>
        </div>

        {count > 0 && (
          <>
            <div className="h-3 w-[1px] bg-white/10" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="text-[#E9E2D3]/50 hover:text-[#C6A66A] transition cursor-pointer text-[11px] underline underline-offset-4"
            >
              {isArabic ? 'إعادة ضبط' : 'Reset'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
