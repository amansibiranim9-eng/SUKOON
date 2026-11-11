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
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600/40 via-sky-400/30 to-blue-500/40 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 group-hover:duration-200 animate-pulse-slow" />

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className="relative px-10 py-4 rounded-full bg-[#030712]/90 hover:bg-[#0f172a] text-white border border-[#38bdf8]/40 hover:border-[#38bdf8] shadow-[0_0_25px_rgba(37,99,235,0.35)] backdrop-blur-xl transition-all duration-300 flex items-center gap-3 cursor-pointer select-none"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8] animate-ping" />
        <span
          className={`text-lg md:text-xl font-medium tracking-wide ${
            isArabic ? 'font-arabic text-2xl font-bold' : ''
          } text-white`}
        >
          {isArabic ? 'ابدأ الجلسة' : 'Begin Session'}
        </span>
      </motion.button>
    </div>
  );
};
