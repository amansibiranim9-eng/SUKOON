import React from 'react';
import { useAppStore } from '@/store';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const language = useAppStore((state) => state.language);
  const toggleLanguage = useAppStore((state) => state.toggleLanguage);
  const soundEnabled = useAppStore((state) => state.settings.soundEnabled);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const isArabic = language === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#10110F] text-[#E9E2D3] flex flex-col justify-between selection:bg-[#C6A66A]/30 selection:text-[#E9E2D3]"
    >
      {/* Top Header bar */}
      <header className="relative z-20 w-full px-5 py-4 sm:py-5 flex items-center justify-between max-w-5xl mx-auto">
        {/* Subtle status indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C6A66A] shadow-[0_0_8px_#C6A66A]" />
          <span className="text-xs uppercase tracking-widest text-[#E9E2D3]/60 font-light">
            {isArabic ? 'سُكُون الروحي' : 'SUKOON'}
          </span>
        </div>

        {/* Actions: Sound toggle & Language toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#171713]/80 hover:bg-[#171713] border border-[#C6A66A]/20 text-[#E9E2D3]/80 hover:text-[#E9E2D3] transition cursor-pointer flex items-center gap-1.5"
          >
            {soundEnabled ? (
              <svg className="w-4 h-4 text-[#C6A66A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#E9E2D3]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
            <span className="hidden sm:inline text-xs font-light text-[#E9E2D3]/70">
              {soundEnabled ? (isArabic ? 'صوت' : 'Sound') : (isArabic ? 'صامت' : 'Muted')}
            </span>
          </button>

          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full bg-[#171713]/80 hover:bg-[#171713] border border-[#C6A66A]/20 text-xs text-[#E9E2D3]/80 transition cursor-pointer font-medium"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      {/* Main content viewport */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 pb-24 sm:pb-28">
        {children}
      </main>

      {/* Elegant Mobile-First Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex justify-center p-3 sm:p-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-[#171713]/90 border border-[#C6A66A]/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => setActiveTab('counter')}
            className={`px-4 py-2 rounded-full text-xs transition cursor-pointer font-medium flex items-center gap-1.5 ${
              activeTab === 'counter'
                ? 'bg-[#C6A66A] text-[#10110F] font-semibold shadow-sm'
                : 'text-[#E9E2D3]/70 hover:text-[#E9E2D3]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{isArabic ? 'الذكر' : 'Counter'}</span>
          </button>

          <button
            onClick={() => setActiveTab('adhkar')}
            className={`px-4 py-2 rounded-full text-xs transition cursor-pointer font-medium flex items-center gap-1.5 ${
              activeTab === 'adhkar'
                ? 'bg-[#C6A66A] text-[#10110F] font-semibold shadow-sm'
                : 'text-[#E9E2D3]/70 hover:text-[#E9E2D3]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{isArabic ? 'الأذكار' : 'Adhkar'}</span>
          </button>

          <button
            onClick={() => setActiveTab('worlds')}
            className={`px-4 py-2 rounded-full text-xs transition cursor-pointer font-medium flex items-center gap-1.5 ${
              activeTab === 'worlds'
                ? 'bg-[#C6A66A] text-[#10110F] font-semibold shadow-sm'
                : 'text-[#E9E2D3]/70 hover:text-[#E9E2D3]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{isArabic ? 'العوالم' : 'Worlds'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
