import React, { Suspense, useState, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { AppLayout } from '@/components/layout';
import { SukoonLogo, HeroGreeting, WorldSelector, StartButton } from '@/components/ui';
import { DhikrDisplay } from '@/components/dhikr';
import { RainWorld, NoorWorld, SakinaWorld } from '@/components/worlds';

// Lazy-loaded modal screens for lightweight main bundle
const DhikrLibraryModal = lazy(() => import('@/components/library/DhikrLibraryModal'));
const SettingsModal = lazy(() => import('@/components/settings/SettingsModal'));
const StatsModal = lazy(() => import('@/components/stats/StatsModal'));

export const App: React.FC = () => {
  const view = useAppStore((state) => state.view);
  const setView = useAppStore((state) => state.setView);
  const currentWorld = useAppStore((state) => state.currentWorld);
  const activeTab = useAppStore((state) => state.activeTab);
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const language = useAppStore((state) => state.language);

  // Lazy modal toggles
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

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

      {/* Floating Header Quick Controls */}
      <header className="fixed top-4 inset-x-0 max-w-lg mx-auto px-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071426]/80 hover:bg-[#0f172a] text-[#38bdf8] border border-[#38bdf8]/25 text-xs backdrop-blur-md transition cursor-pointer"
            aria-label="Open Dhikr Library"
          >
            <span>📖</span>
            <span className="font-medium">{language === 'ar' ? 'المكتبة' : 'Library'}</span>
          </button>

          <button
            onClick={() => setIsStatsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071426]/80 hover:bg-[#0f172a] text-[#38bdf8] border border-[#38bdf8]/25 text-xs backdrop-blur-md transition cursor-pointer"
            aria-label="Open Progress Stats"
          >
            <span>⚡</span>
            <span className="font-medium">{language === 'ar' ? 'الإنجاز' : 'Stats'}</span>
          </button>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 rounded-full bg-[#071426]/80 hover:bg-[#0f172a] text-white/80 hover:text-white border border-[#38bdf8]/25 flex items-center justify-center text-xs backdrop-blur-md transition cursor-pointer"
            aria-label="Open Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* View Switcher using AnimatePresence */}
      <AnimatePresence mode="wait">
        {view === 'session' ? (
          <motion.div
            key="session-view"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center justify-center my-auto relative pt-12 sm:pt-6"
          >
            {/* Back Button to Home View */}
            <div className="w-full max-w-md flex items-center justify-between px-4 mb-2">
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
            className="w-full flex flex-col items-center justify-center my-auto pt-12 sm:pt-6"
          >
            {/* Main Tab Content inside Home */}
            {activeTab === 'counter' && (
              <div className="w-full flex flex-col items-center justify-center gap-6 animate-fadeIn">
                <div className="mb-1">
                  <SukoonLogo />
                </div>

                <div className="mb-1">
                  <HeroGreeting />
                </div>

                {/* StartButton switches to Session View */}
                <div className="my-2">
                  <StartButton onClick={() => setView('session')} lang={language} />
                </div>

                {/* Quick session preview previewing active Dhikr */}
                <button
                  onClick={() => setIsLibraryOpen(true)}
                  className="text-center px-4 py-2.5 rounded-2xl bg-[#0f172a]/60 hover:bg-[#0f172a]/80 border border-[#38bdf8]/20 hover:border-[#38bdf8]/40 transition max-w-sm cursor-pointer"
                >
                  <p className="text-xs text-white/50 mb-1 flex items-center justify-center gap-1">
                    <span>{language === 'ar' ? 'الذكر المختار للجلسة' : 'Selected Dhikr'}</span>
                    <span className="text-[10px] text-[#38bdf8]">({language === 'ar' ? 'اضغط للتغيير' : 'tap to change'})</span>
                  </p>
                  <p className="font-arabic text-xl font-bold text-white mb-0.5">
                    {currentDhikr.arabic}
                  </p>
                  <p className="text-[#38bdf8] text-xs">
                    {currentDhikr.transliteration} ({currentDhikr.targetCount} {language === 'ar' ? 'مرة' : 'times'})
                  </p>
                </button>
              </div>
            )}

            {/* Adhkar Tab opens library modal or triggers view */}
            {activeTab === 'adhkar' && (
              <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center my-auto animate-fadeIn text-center">
                <button
                  onClick={() => setIsLibraryOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-[#2563eb] text-white font-semibold text-sm border border-[#38bdf8]/50 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  {language === 'ar' ? 'فتح مكتبة الأذكار' : 'Open Dhikr Library'}
                </button>
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

      {/* Lazy Modals with Suspense */}
      <Suspense fallback={null}>
        {isLibraryOpen && (
          <DhikrLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
        )}
        {isSettingsOpen && (
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        )}
        {isStatsOpen && (
          <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
        )}
      </Suspense>
    </AppLayout>
  );
};
export default App;
