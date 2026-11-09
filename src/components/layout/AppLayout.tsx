import React from 'react';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const language = useAppStore((state) => state.language);
  const toggleLanguage = useAppStore((state) => state.toggleLanguage);
  const soundEnabled = useAppStore((state) => state.settings.soundEnabled);
  const toggleSound = useAppStore((state) => state.toggleSound);

  const isArabic = language === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200"
    >
      {/* Top Header bar */}
      <header className="relative z-20 w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Subtle branding or indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_8px_#34d399]" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-light">
            {isArabic ? 'تجربة تفاعلية روحية' : 'Spiritual Experience'}
          </span>
        </div>

        {/* Actions: Sound toggle & Language toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {soundEnabled ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition cursor-pointer font-medium"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      {/* Main content viewport */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-8">
        {children}
      </main>

      {/* Footer subtle atmospheric indicator */}
      <footer className="relative z-20 w-full px-6 py-5 flex items-center justify-center text-center text-xs text-slate-500/80 font-light">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          {isArabic
            ? 'سُكُون • ملاذ رقمي للاستغفار والتأمل'
            : 'SUKOON • A Digital Sanctuary for Istighfar and Contemplation'}
        </motion.p>
      </footer>
    </div>
  );
};
