import React from 'react';
import { AppLayout } from '@/components/layout';
import {
  SukoonLogo,
  HeroGreeting,
  WorldSelector,
} from '@/components/ui';
import { DhikrDisplay } from '@/components/dhikr';
import { RainWorld, NoorWorld, SakinaWorld } from '@/components/worlds';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const currentWorld = useAppStore((state) => state.currentWorld);
  const setWorld = useAppStore((state) => state.setWorld);
  const language = useAppStore((state) => state.language);
  const activeTab = useAppStore((state) => state.activeTab);
  const adhkarList = useAppStore((state) => state.adhkarList);
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const setDhikr = useAppStore((state) => state.setDhikr);

  const isArabic = language === 'ar';

  return (
    <AppLayout>
      {/* 3D Atmospheric Background Worlds with smooth crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWorld}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          {currentWorld === 'rain' && <RainWorld />}
          {currentWorld === 'noor' && <NoorWorld />}
          {currentWorld === 'sakina' && <SakinaWorld />}
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric dark organic vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#10110F]/40 to-[#10110F]/90" />

      {/* Main Experience Visual Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 px-4 my-auto">
        {/* Brand identity emblem */}
        <SukoonLogo />

        {/* Tab 1: Main Interactive Dhikr Counter Experience */}
        {activeTab === 'counter' && (
          <motion.div
            key="tab-counter"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            <HeroGreeting lang={language} />

            <div className="w-full mt-2">
              <DhikrDisplay />
            </div>
          </motion.div>
        )}

        {/* Tab 2: Authentic Adhkar Selection */}
        {activeTab === 'adhkar' && (
          <motion.div
            key="tab-adhkar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl flex flex-col items-center gap-3 px-2"
          >
            <div className="text-center mb-2">
              <h3 className="font-arabic text-2xl text-[#E9E2D3]">
                {isArabic ? 'اختر الذكر المبارك' : 'Choose Dhikr'}
              </h3>
              <p className="text-xs text-[#E9E2D3]/60 font-light mt-1">
                {isArabic
                  ? 'أذكار مأثورة بأعداد مسنونة'
                  : 'Traditional authentic remembrances with target cycles'}
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              {adhkarList.map((item) => {
                const isSelected = item.id === currentDhikr.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setDhikr(item)}
                    className={`w-full p-4 rounded-2xl border text-right transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#171713] border-[#C6A66A]/60 shadow-[0_4px_20px_rgba(198,166,106,0.15)]'
                        : 'bg-[#171713]/50 border-white/5 hover:border-white/10 hover:bg-[#171713]/80'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-arabic text-xl sm:text-2xl text-[#E9E2D3] font-normal">
                        {item.arabic}
                      </span>
                      <span className="text-xs text-[#C6A66A] mt-0.5">
                        {item.transliteration}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#E9E2D3]/60 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {item.targetCount}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#C6A66A] shadow-[0_0_8px_#C6A66A]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tab 3: World Selector */}
        {activeTab === 'worlds' && (
          <motion.div
            key="tab-worlds"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            <WorldSelector
              currentWorld={currentWorld}
              onSelectWorld={setWorld}
              lang={language}
            />
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default App;
