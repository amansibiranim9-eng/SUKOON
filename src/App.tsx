import React from 'react';
import { AppLayout } from '@/components/layout';
import {
  SukoonLogo,
  HeroGreeting,
  StartButton,
  WorldSelector,
} from '@/components/ui';
import { RainWorld, NoorWorld, SakinaWorld } from '@/components/worlds';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const currentWorld = useAppStore((state) => state.currentWorld);
  const setWorld = useAppStore((state) => state.setWorld);
  const language = useAppStore((state) => state.language);

  return (
    <AppLayout>
      {/* Cinematic 3D Atmospheric Background Worlds with smooth transition */}
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

      {/* Atmospheric radial vignette overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/40 to-[#030712]/90" />

      {/* Main Experience Visual Interface */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 md:gap-10 px-4 py-4 my-auto">
        {/* 1. SUKOON Logo & Identity */}
        <SukoonLogo />

        {/* 2. Welcoming Arabic Greeting / Spiritual Invitation */}
        <HeroGreeting lang={language} />

        {/* 3. Prominent "ابدأ الاستغفار" Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="my-2"
        >
          <StartButton
            lang={language}
            onClick={() => {
              // Action handler prepared for starting session
            }}
          />
        </motion.div>

        {/* 4. Three Immersive World Selections (RAIN, NOOR, SAKINA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full mt-2"
        >
          <WorldSelector
            currentWorld={currentWorld}
            onSelectWorld={setWorld}
            lang={language}
          />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default App;
