import React from 'react';
import { motion } from 'framer-motion';

export interface StartButtonProps {
  onClick?: () => void;
  lang?: 'ar' | 'en';
}

export const StartButton: React.FC<StartButtonProps> = ({
  onClick,
  lang = 'ar',
}) => {
  const isArabic = lang === 'ar';

  return (
    <div className="relative group flex items-center justify-center">
      {/* Subtle pulsing background glow ring */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500/30 via-teal-400/20 to-amber-400/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 group-hover:duration-200 animate-pulse-slow" />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="relative px-10 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800/90 text-slate-100 border border-emerald-400/30 hover:border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-xl transition-all duration-300 flex items-center gap-3 cursor-pointer select-none"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
        <span
          className={`text-lg md:text-xl font-medium tracking-wide ${
            isArabic ? 'font-arabic text-2xl font-normal' : ''
          } text-emerald-100`}
        >
          {isArabic ? 'ابدأ الاستغفار' : 'Begin Istighfar'}
        </span>
      </motion.button>
    </div>
  );
};
