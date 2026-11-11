import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { AUTHENTIC_ADHKAR, getSuggestedCategory } from '@/data/adhkar';
import { DhikrCategory, DhikrItem } from '@/types/dhikr';

interface DhikrLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DhikrLibraryModal: React.FC<DhikrLibraryModalProps> = ({ isOpen, onClose }) => {
  const currentDhikr = useAppStore((state) => state.currentDhikr);
  const setDhikr = useAppStore((state) => state.setDhikr);
  const language = useAppStore((state) => state.language);

  const suggestedCategory = useMemo(() => getSuggestedCategory(), []);
  const [selectedCategory, setSelectedCategory] = useState<DhikrCategory>(suggestedCategory);

  const categories: { id: DhikrCategory; labelAr: string; labelEn: string }[] = [
    { id: 'morning', labelAr: 'أذكار الصباح', labelEn: 'Morning' },
    { id: 'evening', labelAr: 'أذكار المساء', labelEn: 'Evening' },
    { id: 'istighfar', labelAr: 'استغفار', labelEn: 'Istighfar' },
    { id: 'tasbih', labelAr: 'تسبيح', labelEn: 'Tasbih' },
    { id: 'hamd', labelAr: 'حمد وشكر', labelEn: 'Hamd' },
    { id: 'salawat', labelAr: 'صلوات', labelEn: 'Salawat' },
  ];

  const filteredAdhkar = useMemo(() => {
    return AUTHENTIC_ADHKAR.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelect = (item: DhikrItem) => {
    setDhikr(item);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg bg-[#071426]/95 border-t sm:border border-[#38bdf8]/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-[0_0_50px_rgba(22,139,255,0.25)] backdrop-blur-2xl max-h-[85vh] flex flex-col z-10"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h2 className="text-xl font-arabic font-bold text-white flex items-center gap-2">
                  <span>{language === 'ar' ? 'مكتبة الأذكار' : 'Dhikr Library'}</span>
                  {selectedCategory === suggestedCategory && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2563eb]/30 text-[#38bdf8] border border-[#38bdf8]/40">
                      {language === 'ar' ? 'مقترح لك الآن' : 'Suggested Now'}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-white/50">
                  {language === 'ar' ? 'أذكار نبوية أصيلة ومأثورة' : 'Authentic prophetic remembrances'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center text-sm transition cursor-pointer"
                aria-label="Close library"
              >
                ✕
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar border-b border-white/5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const isSuggested = suggestedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#2563eb] text-white shadow-[0_0_15px_rgba(37,99,235,0.6)]'
                        : 'bg-[#030712]/60 text-white/70 hover:text-white hover:bg-[#030712]/90 border border-white/10'
                    }`}
                  >
                    <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
                    {isSuggested && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Adhkar List */}
            <div className="flex flex-col gap-2.5 overflow-y-auto py-3 pr-1 max-h-[55vh]">
              {filteredAdhkar.map((item) => {
                const isSelected = currentDhikr.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 text-right cursor-pointer group ${
                      isSelected
                        ? 'bg-[#2563eb]/20 border-[#38bdf8] shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                        : 'bg-[#030712]/65 border-white/10 hover:border-[#38bdf8]/40 hover:bg-[#030712]/85'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] font-semibold">
                        {item.targetCount} {language === 'ar' ? 'مرة' : 'times'}
                      </span>
                      <span className="font-arabic text-lg sm:text-xl font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                        {item.arabic}
                      </span>
                    </div>

                    <p className="text-[#38bdf8]/85 text-xs font-medium text-left dir-ltr mt-1">
                      {item.transliteration}
                    </p>

                    <p className="text-white/60 text-xs text-left dir-ltr mt-1 line-clamp-2 italic">
                      {typeof item.translation === 'string'
                        ? item.translation
                        : language === 'ar'
                        ? item.translation.ar
                        : item.translation.en}
                    </p>

                    {item.source && (
                      <span className="text-[10px] text-white/40 text-left dir-ltr mt-2">
                        {language === 'ar' ? 'المصدر:' : 'Source:'} {item.source}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default DhikrLibraryModal;
