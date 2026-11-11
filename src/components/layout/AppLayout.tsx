import React, { ReactNode } from 'react';
import { useAppStore } from '@/store';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const language = useAppStore((state) => state.language);
  const toggleLanguage = useAppStore((state) => state.toggleLanguage);
  const settings = useAppStore((state) => state.settings);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-sukoon-deep text-white antialiased font-sans select-none"
    >
      {/* Top Atmospheric Header - Clean layout without overlapping fixed header buttons */}
      <header className="w-full flex items-center justify-between px-5 sm:px-8 py-4 z-10">
        <div className="flex items-center gap-2">
          {/* Subtle Brand Badge */}
          <span className="w-2 h-2 rounded-full bg-sukoon-glow animate-pulse" />
          <span className="text-xs text-white/50 tracking-wider font-light">
            {language === 'ar' ? 'سُكُون الروحي' : 'Spiritual Sukoon'}
          </span>
        </div>
      </header>

      {/* Main Interactive Body */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-2xl mx-auto px-4 pb-24">
        {children}
      </main>

      {/* Mobile-First Ergonomic Bottom Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 rounded-full bg-[#071426]/85 border border-sukoon-glow/20 backdrop-blur-xl shadow-[0_0_35px_rgba(22,139,255,0.2)]"
      >
        <button
          onClick={() => setActiveTab('counter')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'counter'
              ? 'bg-sukoon-electric text-white shadow-[0_0_15px_rgba(22,139,255,0.6)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{language === 'ar' ? 'الذكر' : 'Counter'}</span>
        </button>

        <button
          onClick={() => setActiveTab('adhkar')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'adhkar'
              ? 'bg-sukoon-electric text-white shadow-[0_0_15px_rgba(22,139,255,0.6)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>{language === 'ar' ? 'الأذكار' : 'Adhkar'}</span>
        </button>

        <button
          onClick={() => setActiveTab('worlds')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'worlds'
              ? 'bg-sukoon-electric text-white shadow-[0_0_15px_rgba(22,139,255,0.6)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{language === 'ar' ? 'العوالم' : 'Worlds'}</span>
        </button>
      </nav>
    </div>
  );
};
export default AppLayout;
