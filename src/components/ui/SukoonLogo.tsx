import React from 'react';
import { motion } from 'framer-motion';

export const SukoonLogo: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="flex flex-col items-center select-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle breathing ambient halo */}
        <div className="absolute w-28 h-28 rounded-full bg-[#C6A66A]/10 blur-2xl animate-pulse-slow pointer-events-none" />

        <div className="relative font-arabic text-4xl sm:text-5xl font-normal tracking-wide text-[#E9E2D3] drop-shadow-[0_2px_20px_rgba(198,166,106,0.25)]">
          سُكُون
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#8E6E45]/60" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#C6A66A] font-light">
          SUKOON
        </span>
        <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#8E6E45]/60" />
      </div>
    </motion.div>
  );
};
