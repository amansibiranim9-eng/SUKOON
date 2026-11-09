import React from 'react';
import { AppLayout } from '@/components/layout';
import { DhikrDisplay } from '@/components/dhikr';
import { RainWorld, NoorWorld, SakinaWorld } from '@/components/worlds';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui';

export const App: React.FC = () => {
  const currentWorld = useAppStore((state) => state.currentWorld);
  const setWorld = useAppStore((state) => state.setWorld);

  return (
    <AppLayout>
      {/* Active 3D Atmospheric Background World */}
      {currentWorld === 'rain' && <RainWorld />}
      {currentWorld === 'noor' && <NoorWorld />}
      {currentWorld === 'sakina' && <SakinaWorld />}

      {/* Interactive Dhikr Display */}
      <div className="z-10 flex flex-col items-center">
        <DhikrDisplay />

        {/* Atmospheric World Selector */}
        <div className="mt-8 flex items-center gap-3">
          <Button
            variant={currentWorld === 'rain' ? 'primary' : 'glass'}
            size="sm"
            onClick={() => setWorld('rain')}
          >
            Rain (مطر)
          </Button>
          <Button
            variant={currentWorld === 'noor' ? 'primary' : 'glass'}
            size="sm"
            onClick={() => setWorld('noor')}
          >
            Noor (نور)
          </Button>
          <Button
            variant={currentWorld === 'sakina' ? 'primary' : 'glass'}
            size="sm"
            onClick={() => setWorld('sakina')}
          >
            Sakina (سكينة)
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default App;
