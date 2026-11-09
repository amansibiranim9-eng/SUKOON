import React from 'react';
import { motion } from 'framer-motion';

export interface HeroGreetingProps {
  lang?: 'ar' | 'en';
}

export const HeroGreeting: React.FC<HeroGreetingProps> = ({ lang = 'ar' }) => {
  const isArabic = lang === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
      className="flex flex-col items-center text-center max-w-xl mx-auto px-4"
    >
      {/* Welcoming Arabic Greeting / Spiritual verse */}
      <h2
        className={`font-arabic text-3xl md:text-5xl font-normal text-slate-100 leading-relaxed md:leading-normal drop-shadow-lg ${
          isArabic ? 'tracking-normal' : ''
        }`}
      >
        أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
      </h2>

      <p className="mt-3 text-sm md:text-base text-slate-300/80 font-light tracking-wide max-w-md">
        {isArabic
          ? 'رحلة تفاعلية هادئة ترتقي بروحك عبر أبعاد من النور والسكينة'
          : 'Verily, in the remembrance of Allah do hearts find rest. An immersive spiritual sanctuary.'}
      </p>
    </motion.div>
  );
};
