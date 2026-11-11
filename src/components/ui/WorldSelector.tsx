import React from 'react';
import { motion } from 'framer-motion';
import { WorldType } from '@/types';
import { cn } from '@/utils';

export interface WorldSelectorProps {
  currentWorld: WorldType;
  onSelectWorld: (world: WorldType) => void;
  lang?: 'ar' | 'en';
}

interface WorldOption {
  id: WorldType;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  dotColor: string;
}

const worlds: WorldOption[] = [
  {
    id: 'rain',
    titleAr: 'مَطَر',
    titleEn: 'RAIN',
    subtitleAr: 'فحم داكن وضياء فضي',
    subtitleEn: 'Dark charcoal & silver rain',
    dotColor: 'bg-slate-300 shadow-[0_0_8px_#d1d5db]',
  },
  {
    id: 'noor',
    titleAr: 'نُور',
    titleEn: 'NOOR',
    subtitleAr: 'إشراق ذهبي دافئ',
    subtitleEn: 'Warm golden illumination',
    dotColor: 'bg-[#C6A66A] shadow-[0_0_8px_#C6A66A]',
  },
  {
    id: 'sakina',
    titleAr: 'سَكِينَة',
    titleEn: 'SAKINA',
    subtitleAr: 'زيتوني هادئ ونور عاجي',
    subtitleEn: 'Muted olive & ivory peace',
    dotColor: 'bg-[#E9E2D3] shadow-[0_0_8px_#E9E2D3]',
  },
];

export const WorldSelector: React.FC<WorldSelectorProps> = ({
  currentWorld,
  onSelectWorld,
  lang = 'ar',
}) => {
  const isArabic = lang === 'ar';

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl mx-auto px-4 select-none">
      <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A66A]/80 font-light">
        {isArabic ? 'العوالم الروحية' : 'Atmospheric Worlds'}
      </span>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full">
        {worlds.map((world) => {
          const isActive = currentWorld === world.id;

          return (
            <motion.button
              key={world.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectWorld(world.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer',
                isActive
                  ? 'bg-[#171713]/90 border-[#C6A66A]/60 shadow-[0_4px_24px_rgba(198,166,106,0.18)] text-[#E9E2D3]'
                  : 'bg-[#10110F]/60 border-white/5 hover:border-white/10 hover:bg-[#171713]/50 text-[#E9E2D3]/60'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    world.dotColor,
                    isActive ? 'scale-125' : 'opacity-40'
                  )}
                />
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isArabic ? 'font-arabic text-base font-normal' : '',
                    isActive ? 'text-[#E9E2D3] font-semibold' : 'text-[#E9E2D3]/70'
                  )}
                >
                  {isArabic ? world.titleAr : world.titleEn}
                </span>
              </div>

              <span className="text-[10px] text-[#E9E2D3]/40 tracking-wide line-clamp-1">
                {isArabic ? world.subtitleAr : world.subtitleEn}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeWorldIndicator"
                  className="absolute inset-0 rounded-2xl border border-[#C6A66A]/40 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
