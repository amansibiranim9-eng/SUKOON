import React from 'react';
import { motion } from 'framer-motion';

export interface HeroGreetingProps {
  lang?: 'ar' | 'en';
}

export const HeroGreeting: React.FC<HeroGreetingProps> = ({ lang = 'ar' }) => {
  const isArabic = lang === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
      className="flex flex-col items-center text-center max-w-xl mx-auto px-4"
    >
      <h1 className="font-arabic text-2xl sm:text-3xl md:text-4xl font-normal text-[#E9E2D3] leading-relaxed drop-shadow-sm">
        أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
      </h1>

      <p className="mt-2 text-xs sm:text-sm text-[#E9E2D3]/60 font-light tracking-wide max-w-md">
        {isArabic
          ? 'ملاذ رقمي هادئ للذكر والسكينة والارتقاء الروحي'
          : 'Verily, in the remembrance of Allah do hearts find rest. A tranquil digital sanctuary.'}
      </p>
    </motion.div>
  );
};
