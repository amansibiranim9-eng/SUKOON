import React from 'react';

export interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Background layer for 3D worlds */}
      <div className="fixed inset-0 pointer-events-none z-0" id="world-canvas-container" />

      {/* Header overlay */}
      <header className="relative z-10 w-full px-6 py-6 flex items-center justify-between pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-2xl font-light tracking-widest uppercase text-emerald-300/90">
            SUKOON
          </h1>
          <span className="text-xs text-slate-400 font-arabic tracking-wide">
            سکون قلبي
          </span>
        </div>
      </header>

      {/* Main interactive content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>

      {/* Footer controls overlay */}
      <footer className="relative z-10 w-full px-6 py-6 flex items-center justify-center pointer-events-auto text-xs text-slate-500">
        <span>Tap anywhere to recite &bull; Press R to reset</span>
      </footer>
    </div>
  );
};
