import React, { useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAppStore } from '@/store';
import { generateTreeOfNoor, getGardenTimeTheme } from '@/utils/treeOfNoor';

interface TreeOfNoorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TreeOfNoorModal: React.FC<TreeOfNoorModalProps> = ({ isOpen, onClose }) => {
  const dailyTotal = useAppStore((state) => state.dailyTotal);
  const session = useAppStore((state) => state.session);
  const noorPoints = useAppStore((state) => state.noorPoints);
  const language = useAppStore((state) => state.language);
  const shouldReduceMotion = useReducedMotion();

  const theme = useMemo(() => getGardenTimeTheme(), []);
  const treeData = useMemo(() => {
    return generateTreeOfNoor({
      totalCount: dailyTotal,
      completedCycles: session.completedCycles,
      noorPoints,
    });
  }, [dailyTotal, session.completedCycles, noorPoints]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#071426]/95 border border-[#38bdf8]/35 rounded-3xl p-5 shadow-[0_0_60px_rgba(22,139,255,0.3)] backdrop-blur-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 z-10">
              <div>
                <h2 className="text-xl font-bold text-white font-arabic flex items-center gap-2">
                  <span>{language === 'ar' ? 'شجرة النور (روضتي)' : 'Tree of Noor (My Garden)'}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#2563eb]/30 text-[#38bdf8] border border-[#38bdf8]/30">
                    {language === 'ar' ? theme.nameAr : theme.nameEn}
                  </span>
                </h2>
                <p className="text-xs text-white/50">
                  {language === 'ar'
                    ? 'كل تسبيحة تنمي غصناً، وكل دورة تضيء زهرة، والسكينة تبعث نوراً'
                    : 'Every dhikr grows a branch, cycles bloom flowers, stillness brings fireflies'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center text-sm transition cursor-pointer"
                aria-label="Close garden"
              >
                ✕
              </button>
            </div>

            {/* Tree Canvas / SVG Container */}
            <div
              className="relative w-full h-[360px] my-3 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom, ${theme.skyGradient[0]}, ${theme.skyGradient[1]})`,
              }}
            >
              <svg
                viewBox="0 0 500 460"
                className="w-full h-full overflow-visible select-none pointer-events-none"
              >
                <defs>
                  {/* Branch glow filter */}
                  <filter id="branch-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.6" />
                  </filter>
                  <radialGradient id="tree-root-light" cx="50%" cy="100%" r="60%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ground reflection glow */}
                <ellipse cx="250" cy="435" rx="140" ry="25" fill="url(#tree-root-light)" />

                {/* Procedural Branches */}
                <g filter="url(#branch-glow)">
                  {treeData.branches.map((b) => (
                    <line
                      key={b.id}
                      x1={b.x1}
                      y1={b.y1}
                      x2={b.x2}
                      y2={b.y2}
                      stroke={b.depth === 1 ? '#e0f2fe' : '#38bdf8'}
                      strokeWidth={b.thickness}
                      strokeLinecap="round"
                      opacity={Math.max(0.4, 1 - b.depth * 0.08)}
                    />
                  ))}
                </g>

                {/* Glowing Blossoms (from completed cycles) */}
                {treeData.blossoms.map((blossom) => (
                  <g key={`blossom-${blossom.id}`}>
                    <circle
                      cx={blossom.x}
                      cy={blossom.y}
                      r={blossom.radius + 3}
                      fill={blossom.glowColor}
                      opacity={0.35}
                      className={shouldReduceMotion ? '' : 'animate-pulse'}
                    />
                    <circle
                      cx={blossom.x}
                      cy={blossom.y}
                      r={blossom.radius}
                      fill={blossom.glowColor}
                      stroke="#ffffff"
                      strokeWidth={0.8}
                    />
                  </g>
                ))}

                {/* Drifting Fireflies (from stillness Noor points) */}
                {treeData.fireflies.map((ff) => (
                  <motion.circle
                    key={`firefly-${ff.id}`}
                    cx={ff.x}
                    cy={ff.y}
                    r={ff.size}
                    fill={theme.fireflyColor}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: [0, -12, 0],
                            x: [0, (ff.id % 2 === 0 ? 8 : -8), 0],
                            opacity: [0.3, 0.9, 0.3],
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 3 + (ff.id % 3) * 1.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </svg>
            </div>

            {/* Garden Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/80">
              <div className="p-2.5 rounded-xl bg-[#030712]/70 border border-white/10">
                <span className="text-[#38bdf8] font-bold block text-sm">{treeData.branches.length}</span>
                <span className="text-white/50 text-[10px]">{language === 'ar' ? 'الأغصان' : 'Branches'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#030712]/70 border border-white/10">
                <span className="text-[#60a5fa] font-bold block text-sm">{treeData.blossoms.length}</span>
                <span className="text-white/50 text-[10px]">{language === 'ar' ? 'الزهور المضيئة' : 'Blossoms'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#030712]/70 border border-white/10">
                <span className="text-white font-bold block text-sm">{noorPoints}</span>
                <span className="text-white/50 text-[10px]">{language === 'ar' ? 'نقاط النور' : 'Noor Points'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default TreeOfNoorModal;
