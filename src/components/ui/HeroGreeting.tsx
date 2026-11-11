import React from 'react';
import { useAppStore } from '@/store';

export const HeroGreeting: React.FC = () => {
  const language = useAppStore((state) => state.language);

  return (
    <div className="flex flex-col items-center text-center px-4 max-w-lg mx-auto select-none">
      <p className="font-arabic text-xl sm:text-2xl text-sukoon-pure/95 font-medium leading-relaxed drop-shadow-[0_0_12px_rgba(57,169,255,0.35)]">
        أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
      </p>
      <p className="text-white/60 text-xs sm:text-sm font-light mt-1 tracking-wide">
        {language === 'ar'
          ? 'ملاذ رقمي هادئ للذكر والسكينة والارتقاء الروحي'
          : 'A serene sanctuary for Dhikr, tranquility, and spiritual presence'}
      </p>
    </div>
  );
};
export default HeroGreeting;
