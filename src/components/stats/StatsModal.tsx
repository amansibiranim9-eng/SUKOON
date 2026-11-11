import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { calculateStats } from '@/utils/stats';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const dailyTotal = useAppStore((state) => state.dailyTotal);
  const dailyHistory = useAppStore((state) => state.dailyHistory);
  const session = useAppStore((state) => state.session);
  const language = useAppStore((state) => state.language);

  const stats = useMemo(() => {
    return calculateStats(dailyHistory, dailyTotal, session.completedCycles);
  }, [dailyHistory, dailyTotal, session.completedCycles]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md bg-[#071426]/95 border-t sm:border border-[#38bdf8]/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-[0_0_50px_rgba(22,139,255,0.25)] backdrop-blur-2xl flex flex-col z-10"
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white font-arabic">
                  {language === 'ar' ? 'سجل الإنجاز والورد' : 'Dhikr Progress & Stats'}
                </h2>
                <p className="text-xs text-white/50">
                  {language === 'ar' ? 'متابعة الاستمرار والبركة اليومية' : 'Consistency and daily remembrance'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center text-sm transition cursor-pointer"
                aria-label="Close stats"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              {/* Consecutive Streak */}
              <div className="p-4 rounded-2xl bg-[#030712]/70 border border-[#38bdf8]/30 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1">⚡</span>
                <span className="text-3xl font-bold text-[#38bdf8]">{stats.streakDays}</span>
                <span className="text-xs text-white/60 mt-0.5">
                  {language === 'ar' ? 'أيام متتالية' : 'Days Streak'}
                </span>
              </div>

              {/* Today's Count */}
              <div className="p-4 rounded-2xl bg-[#030712]/70 border border-white/10 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1">✨</span>
                <span className="text-3xl font-bold text-white">{stats.todayCount}</span>
                <span className="text-xs text-white/60 mt-0.5">
                  {language === 'ar' ? 'تسبيحات اليوم' : 'Today’s Count'}
                </span>
              </div>

              {/* Completed Cycles */}
              <div className="p-4 rounded-2xl bg-[#030712]/70 border border-white/10 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1">📿</span>
                <span className="text-3xl font-bold text-[#60a5fa]">{stats.completedCycles}</span>
                <span className="text-xs text-white/60 mt-0.5">
                  {language === 'ar' ? 'الدورات المكتملة' : 'Completed Cycles'}
                </span>
              </div>

              {/* Total Count */}
              <div className="p-4 rounded-2xl bg-[#030712]/70 border border-white/10 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1">🌌</span>
                <span className="text-3xl font-bold text-white">{stats.totalCount}</span>
                <span className="text-xs text-white/60 mt-0.5">
                  {language === 'ar' ? 'المجموع الكلي' : 'Lifetime Total'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default StatsModal;
