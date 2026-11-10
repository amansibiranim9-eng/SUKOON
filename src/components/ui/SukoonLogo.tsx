import React from 'react';
import { motion } from 'framer-motion';

export const SukoonLogo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="flex flex-col items-center select-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle breathing radial glow behind emblem */}
        <div className="absolute w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl animate-pulse-slow pointer-events-none" />

        <div className="relative font-arabic text-4xl md:text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-emerald-100 via-emerald-200 to-emerald-400 drop-shadow-[0_2px_15px_rgba(16,185,129,0.3)]">
          سُكُون
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-emerald-400/40" />
        <span className="text-[11px] uppercase tracking-[0.35em] text-emerald-200/70 font-light">
          SUKOON
        </span>
        <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-emerald-400/40" />
      </div>
    </motion.div>
  );
};
