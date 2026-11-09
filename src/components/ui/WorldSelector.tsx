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
    subtitleAr: 'أجواء ماطرة هادئة',
    subtitleEn: 'Dark blue rainy serenity',
    dotColor: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
  },
  {
    id: 'noor',
    titleAr: 'نُور',
    titleEn: 'NOOR',
    subtitleAr: 'إشراق ذهبي دافئ',
    subtitleEn: 'Warm golden radiance',
    dotColor: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
  },
  {
    id: 'sakina',
    titleAr: 'سَكِينَة',
    titleEn: 'SAKINA',
    subtitleAr: 'جسيمات كونية وضاءة',
    subtitleEn: 'Peaceful drifting calm',
    dotColor: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
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
      <span className="text-xs uppercase tracking-[0.25em] text-slate-400/80 font-light">
        {isArabic ? 'اختر الأجواء المحيطة' : 'Atmospheric Worlds'}
      </span>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full">
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
                  ? 'bg-slate-900/80 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-950/40 border-white/5 hover:border-white/15 hover:bg-slate-900/40 text-slate-400'
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
                    isActive ? 'text-slate-100 font-semibold' : 'text-slate-300'
                  )}
                >
                  {isArabic ? world.titleAr : world.titleEn}
                </span>
              </div>

              <span className="text-[10px] text-slate-400/70 tracking-wide line-clamp-1">
                {isArabic ? world.subtitleAr : world.subtitleEn}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeWorldIndicator"
                  className="absolute inset-0 rounded-2xl border border-emerald-400/40 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
