import React from 'react';
import { useDhikr } from '@/hooks';

export const DhikrDisplay: React.FC = () => {
  const { dhikr, count, targetCount, tap } = useDhikr();

  return (
    <div
      onClick={tap}
      className="flex flex-col items-center justify-center cursor-pointer select-none text-center px-4 py-8 rounded-3xl transition-transform active:scale-95"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          tap();
        }
      }}
    >
      <div className="font-arabic text-5xl md:text-7xl mb-4 text-emerald-100 tracking-wide leading-relaxed drop-shadow-md">
        {dhikr.arabic}
      </div>

      <div className="text-xl md:text-2xl font-light text-slate-200 tracking-wider mb-2">
        {dhikr.transliteration}
      </div>

      <div className="text-sm text-slate-400 max-w-md italic mb-8">
        "{dhikr.translation}"
      </div>

      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-extralight text-emerald-400/90 font-mono">
          {count}
        </span>
        <span className="text-xs text-slate-500 tracking-widest uppercase mt-1">
          / {targetCount}
        </span>
      </div>
    </div>
  );
};
