import React, { Suspense } from 'react';
import { useAppStore } from '@/store';
import { AppLayout } from '@/components/layout';
import { SukoonLogo, HeroGreeting, WorldSelector } from '@/components/ui';
import { DhikrDisplay } from '@/components/dhikr';
import { RainWorld, NoorWorld, SakinaWorld } from '@/components/worlds';

export const App: React.FC = () => {
  const currentWorld = useAppStore((state) => state.currentWorld);
  const activeTab = useAppStore((state) => state.activeTab);
  const adhkarList = useAppStore((state) => state.adhkarList);
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const setDhikr = useAppStore((state) => state.setDhikr);
  const language = useAppStore((state) => state.language);

  return (
    <AppLayout>
      {/* 3D Atmospheric Background Worlds */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#030407]" />}>
        {currentWorld === 'rain' && <RainWorld />}
        {currentWorld === 'noor' && <NoorWorld />}
        {currentWorld === 'sakina' && <SakinaWorld />}
      </Suspense>

      {/* Cinematic Vignette Overlay */}
      <div className="fixed inset-0 cinematic-vignette pointer-events-none -z-5" />

      {/* Main Tab Content */}
      {activeTab === 'counter' && (
        <div className="w-full flex flex-col items-center justify-center my-auto animate-fadeIn">
          <div className="mb-4">
            <SukoonLogo />
          </div>

          <div className="mb-4">
            <HeroGreeting />
          </div>

          <DhikrDisplay />
        </div>
      )}

      {/* Arabic Dhikr Selection Drawer/View */}
      {activeTab === 'adhkar' && (
        <div className="w-full max-w-lg mx-auto p-4 flex flex-col gap-4 animate-fadeIn">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-arabic font-bold text-sukoon-pure drop-shadow-[0_0_15px_rgba(57,169,255,0.4)]">
              {language === 'ar' ? 'مختارات الأذكار النبوية' : 'Authentic Adhkar Collection'}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              {language === 'ar'
                ? 'اختر الذكر لتبدأ جلستك المباركة'
                : 'Select a Dhikr to begin your spiritual focus'}
            </p>
          </div>

          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {adhkarList.map((item) => {
              const isSelected = currentDhikr.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setDhikr(item)}
                  className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 text-right cursor-pointer ${
                    isSelected
                      ? 'bg-sukoon-electric/20 border-sukoon-glow shadow-[0_0_25px_rgba(22,139,255,0.35)]'
                      : 'bg-[#071426]/75 border-white/10 hover:border-sukoon-glow/40 hover:bg-[#071426]/90'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sukoon-glow/15 text-sukoon-glow font-medium">
                      {item.targetCount} {language === 'ar' ? 'مرة' : 'times'}
                    </span>
                    <span className="font-arabic text-xl font-bold text-sukoon-pure">
                      {item.arabic}
                    </span>
                  </div>

                  <p className="text-sukoon-glow/90 text-xs font-medium text-left dir-ltr mt-1">
                    {item.transliteration}
                  </p>

                  <p className="text-white/60 text-xs text-left dir-ltr mt-0.5 italic">
                    {item.translation}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Worlds Selection Tab */}
      {activeTab === 'worlds' && (
        <div className="w-full flex flex-col items-center justify-center my-auto animate-fadeIn">
          <WorldSelector />
        </div>
      )}
    </AppLayout>
  );
};
export default App;
