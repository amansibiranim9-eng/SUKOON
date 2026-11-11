import React from 'react';
import { useAppStore } from '@/store';

export const SukoonLogo: React.FC = () => {
  const language = useAppStore((state) => state.language);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative flex items-center justify-center">
        {/* Subtle glowing halo */}
        <div className="absolute w-12 h-12 rounded-full bg-sukoon-electric/25 blur-xl pointer-events-none" />
        <span className="font-arabic text-3xl sm:text-4xl font-bold tracking-wider text-sukoon-pure drop-shadow-[0_0_15px_rgba(57,169,255,0.6)]">
          سُكُون
        </span>
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-sukoon-glow/40" />
        <span className="text-[10px] tracking-[0.3em] font-medium text-sukoon-glow uppercase">
          SUKOON
        </span>
        <span className="h-px w-6 bg-gradient-to-l from-transparent to-sukoon-glow/40" />
      </div>
      <span className="sr-only">
        {language === 'ar' ? 'سكون - تجربة الذكر التفاعلية' : 'Sukoon - Premium Dhikr Experience'}
      </span>
    </div>
  );
};
export default SukoonLogo;
