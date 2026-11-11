import React, { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { AppLayout } from '@/components/layout';
import { SukoonLogo, HeroGreeting, WorldSelector, StartButton } from '@/components/ui';
import { DhikrDisplay } from '@/components/dhikr';
import { RainWorld, NoorWorld, SakinaWorld } from '@/components/worlds';

export const App: React.FC = () => {
  const view = useAppStore((state) => state.view);
  const setView = useAppStore((state) => state.setView);
  const currentWorld = useAppStore((state) => state.currentWorld);
  const activeTab = useAppStore((state) => state.activeTab);
  const adhkarList = useAppStore((state) => state.adhkarList);
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const setDhikr = useAppStore((state) => state.setDhikr);
  const language = useAppStore((state) => state.language);

  return (
    <AppLayout>
      {/* 3D Atmospheric Background Worlds */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#030712]" />}>
        {currentWorld === 'rain' && <RainWorld />}
        {currentWorld === 'noor' && <NoorWorld />}
        {currentWorld === 'sakina' && <SakinaWorld />}
      </Suspense>

      {/* Cinematic Vignette Overlay */}
      <div className="fixed inset-0 cinematic-vignette pointer-events-none -z-5" />

      {/* View Switcher using AnimatePresence */}
      <AnimatePresence mode="wait">
        {view === 'session' ? (
          <motion.div
            key="session-view"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center justify-center my-auto relative"
          >
            {/* Back Button to Home View */}
            <div className="w-full max-w-md flex items-center justify-between px-4 mb-3">
              <button
                onClick={() => setView('home')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#030712]/70 hover:bg-[#0f172a] text-[#38bdf8] hover:text-white border border-[#38bdf8]/30 transition-all duration-200 text-xs backdrop-blur-md cursor-pointer select-none"
              >
                <span>{language === 'ar' ? '→' : '←'}</span>
                <span>{language === 'ar' ? 'الرئيسية' : 'Back to Home'}</span>
              </button>

              <span className="text-xs text-white/50 tracking-wider font-light">
                {language === 'ar' ? 'جلسة ذكر حية' : 'Live Dhikr Session'}
              </span>
            </div>

            <DhikrDisplay />
          </motion.div>
        ) : (
          <motion.div
            key="home-view"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center justify-center my-auto"
          >
            {/* Main Tab Content inside Home */}
            {activeTab === 'counter' && (
              <div className="w-full flex flex-col items-center justify-center gap-6 animate-fadeIn">
                <div className="mb-2">
                  <SukoonLogo />
                </div>

                <div className="mb-2">
                  <HeroGreeting />
                </div>

                {/* StartButton switches to Session View */}
                <div className="my-3">
                  <StartButton onClick={() => setView('session')} lang={language} />
                </div>

                {/* Quick session preview previewing active Dhikr */}
                <div className="text-center px-4 py-2 rounded-2xl bg-[#0f172a]/60 border border-[#38bdf8]/20 max-w-sm">
                  <p className="text-xs text-white/50 mb-1">
                    {language === 'ar' ? 'الذكر المختار للجلسة' : 'Current Selected Dhikr'}
                  </p>
                  <p className="font-arabic text-xl font-bold text-white mb-0.5">
                    {currentDhikr.arabic}
                  </p>
                  <p className="text-[#38bdf8] text-xs">
                    {currentDhikr.transliteration} ({currentDhikr.targetCount} {language === 'ar' ? 'مرة' : 'times'})
                  </p>
                </div>
              </div>
            )}

            {/* Arabic Dhikr Selection Drawer/View */}
            {activeTab === 'adhkar' && (
              <div className="w-full max-w-lg mx-auto p-4 flex flex-col gap-4 animate-fadeIn">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-arabic font-bold text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
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
                            ? 'bg-[#2563eb]/20 border-[#38bdf8] shadow-[0_0_25px_rgba(37,99,235,0.35)]'
                            : 'bg-[#0f172a]/75 border-white/10 hover:border-[#38bdf8]/40 hover:bg-[#0f172a]/90'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] font-medium">
                            {item.targetCount} {language === 'ar' ? 'مرة' : 'times'}
                          </span>
                          <span className="font-arabic text-xl font-bold text-white">
                            {item.arabic}
                          </span>
                        </div>

                        <p className="text-[#38bdf8]/90 text-xs font-medium text-left dir-ltr mt-1">
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
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};
export default App;
