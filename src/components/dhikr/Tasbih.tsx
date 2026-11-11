import React, { memo, useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TasbihProps {
  count: number;
  targetCount: number;
  completedCycles?: number;
}

interface BeadItemProps {
  index: number;
  isFront: boolean;
  isMarker: boolean;
  isCycleClimax: boolean;
}

// Memoized single bead to prevent per-frame re-renders
const BeadItem = memo<BeadItemProps>(({ index, isFront, isMarker, isCycleClimax }) => {
  // Center of bead string index is 16
  const beadRadius = isMarker ? 11 : isFront ? 10.5 : 8.5;
  const beadGlow = isMarker
    ? '#38bdf8'
    : isFront
    ? '#60a5fa'
    : 'rgba(255, 255, 255, 0.4)';

  return (
    <g className="transition-transform duration-200" style={{ transformOrigin: 'center' }}>
      {/* Outer soft glow halo for front & marker beads */}
      {(isFront || isMarker || isCycleClimax) && (
        <circle
          cx={index * 26 + 18}
          cy={24}
          r={beadRadius + 5}
          fill={isCycleClimax ? '#38bdf8' : beadGlow}
          opacity={isCycleClimax ? 0.6 : isFront ? 0.4 : 0.25}
          filter="blur(3px)"
        />
      )}

      {/* Pearl-white bead body */}
      <circle
        cx={index * 26 + 18}
        cy={24}
        r={beadRadius}
        fill={isMarker ? 'url(#marker-gradient)' : isFront ? 'url(#pearl-front-gradient)' : 'url(#pearl-gradient)'}
        stroke={isFront ? '#38bdf8' : isMarker ? '#60a5fa' : 'rgba(255, 255, 255, 0.3)'}
        strokeWidth={isFront || isMarker ? 1.5 : 0.8}
        style={{
          filter: isFront
            ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))'
            : isMarker
            ? 'drop-shadow(0 0 6px rgba(96, 165, 250, 0.6))'
            : 'none',
        }}
      />

      {/* Pearl specular sheen highlight */}
      <ellipse
        cx={index * 26 + 15}
        cy={21}
        rx={beadRadius * 0.35}
        ry={beadRadius * 0.22}
        fill="#ffffff"
        opacity={isFront ? 0.95 : 0.75}
      />
    </g>
  );
});

BeadItem.displayName = 'BeadItem';

/**
 * Living Tasbih: A string of 33 pearl-white beads with electric-blue glow.
 * Built with SVG + Framer Motion (GPU-accelerated transforms/opacity).
 * Slides forward on every tap with spring physics.
 */
export const Tasbih: React.FC<TasbihProps> = memo(({ count, targetCount = 33, completedCycles = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isCycleClimax, setIsCycleClimax] = useState(false);

  // Tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Detect cycle completion climax glow wave
  useEffect(() => {
    if (completedCycles > 0) {
      setIsCycleClimax(true);
      const timer = setTimeout(() => {
        setIsCycleClimax(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [completedCycles]);

  // The active bead index in 0-32 cycle
  const currentBeadInCycle = targetCount > 0 ? (count - 1 + targetCount) % targetCount : 0;
  const beadSpacing = 26;

  // Bead offset drives the self-moving string forward
  const xOffset = -(count % 33) * beadSpacing;

  // Generate 45 beads (33 beads + wrap padding on ends for seamless slide)
  const beads = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => {
      const beadIndex = i % 33;
      const isMarker = beadIndex === 32; // 33rd bead
      const isFront = count > 0 && beadIndex === currentBeadInCycle;
      return {
        id: i,
        index: i,
        isMarker,
        isFront,
      };
    });
  }, [count, currentBeadInCycle]);

  return (
    <div className="relative w-full max-w-sm mx-auto h-16 flex items-center justify-center overflow-hidden select-none pointer-events-none my-1">
      {/* Soft gradient edge fade mask */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#030712] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#030712] to-transparent z-10" />

      {/* SVG Container with gentle idle sway */}
      <motion.svg
        viewBox="0 0 380 48"
        className="w-full h-full overflow-visible"
        animate={
          isTabVisible && !shouldReduceMotion
            ? {
                y: [0, -2.5, 0],
                rotate: [0, 0.4, 0, -0.4, 0],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 6.5,
          ease: 'easeInOut',
        }}
      >
        <defs>
          {/* Pearl Gradient */}
          <radialGradient id="pearl-gradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>

          {/* Front Highlighted Pearl Gradient */}
          <radialGradient id="pearl-front-gradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </radialGradient>

          {/* 33rd Marker Bead Gradient */}
          <radialGradient id="marker-gradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>

          {/* Climax Glow Filter */}
          <filter id="climax-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cord / String Line */}
        <line
          x1="-100"
          y1="24"
          x2="500"
          y2="24"
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Sliding Bead String with Spring Physics */}
        <motion.g
          animate={{
            x: xOffset,
            scale: [1, 1.025, 1],
          }}
          transition={{
            x: shouldReduceMotion
              ? { duration: 0.1 }
              : { type: 'spring', stiffness: 320, damping: 22, mass: 0.8 },
            scale: { duration: 0.22, ease: 'easeOut' },
          }}
          filter={isCycleClimax ? 'url(#climax-glow)' : undefined}
        >
          {beads.map((bead) => (
            <BeadItem
              key={bead.id}
              index={bead.index}
              isFront={bead.isFront}
              isMarker={bead.isMarker}
              isCycleClimax={isCycleClimax}
            />
          ))}
        </motion.g>
      </motion.svg>
    </div>
  );
});

Tasbih.displayName = 'Tasbih';
export default Tasbih;
