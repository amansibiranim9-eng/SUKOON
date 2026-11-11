import React from 'react';
import { useAppStore } from '@/store';
import { WorldType } from '@/types';

interface WorldOption {
  id: WorldType;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  icon: string;
}

const WORLDS: WorldOption[] = [
  {
    id: 'rain',
    titleAr: 'عالم المطر',
    titleEn: 'Rain World',
    subtitleAr: 'قطرات متساقطة وسكون عميق',
    subtitleEn: 'Cinematic falling rain & deep stillness',
    icon: '🌧️',
  },
  {
    id: 'noor',
    titleAr: 'عالم النور',
    titleEn: 'Night & Noor',
    subtitleAr: 'ضوء القمر وسكينة الليل',
    subtitleEn: 'Serene moonlight & drifting stars',
    icon: '🌙',
  },
  {
    id: 'sakina',
    titleAr: 'عالم السكينة',
    titleEn: 'Sakina World',
    subtitleAr: 'أطياف هادئة ونسائم روحانية',
    subtitleEn: 'Tranquil drifting particles & inner calm',
    icon: '✨',
  },
];

export const WorldSelector: React.FC = () => {
  const currentWorld = useAppStore((state) => state.currentWorld);
  const setWorld = useAppStore((state) => state.setWorld);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const language = useAppStore((state) => state.language);

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm mx-auto p-4">
      <h3 className="text-center text-sm font-semibold text-sukoon-glow uppercase tracking-wider mb-2">
        {language === 'ar' ? 'اختر البيئة الروحانية' : 'Select Atmosphere'}
      </h3>

      <div className="flex flex-col gap-2.5">
        {WORLDS.map((world) => {
          const isSelected = currentWorld === world.id;
          return (
            <button
              key={world.id}
              onClick={() => {
                setWorld(world.id);
                setActiveTab('counter');
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                isSelected
                  ? 'bg-sukoon-electric/15 border-sukoon-glow shadow-[0_0_20px_rgba(22,139,255,0.35)]'
                  : 'bg-[#071426]/60 border-white/10 hover:border-sukoon-glow/40 hover:bg-[#071426]/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{world.icon}</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-sukoon-pure text-sm sm:text-base">
                    {language === 'ar' ? world.titleAr : world.titleEn}
                  </span>
                  <span className="text-xs text-white/50">
                    {language === 'ar' ? world.subtitleAr : world.subtitleEn}
                  </span>
                </div>
              </div>

              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-sukoon-glow shadow-[0_0_8px_#39A9FF]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default WorldSelector;
