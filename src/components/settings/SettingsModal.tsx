import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { WorldType } from '@/types/world';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGarden?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenGarden }) => {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const language = useAppStore((state) => state.language);
  const toggleLanguage = useAppStore((state) => state.toggleLanguage);
  const currentWorld = useAppStore((state) => state.currentWorld);
  const setWorld = useAppStore((state) => state.setWorld);

  const worlds: { id: WorldType; nameAr: string; nameEn: string }[] = [
    { id: 'rain', nameAr: 'المطر', nameEn: 'Rain' },
    { id: 'noor', nameAr: 'النور', nameEn: 'Noor' },
    { id: 'sakina', nameAr: 'السكينة', nameEn: 'Sakina' },
  ];

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
            className="relative w-full max-w-md bg-[#071426]/95 border-t sm:border border-[#38bdf8]/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-[0_0_50px_rgba(22,139,255,0.25)] backdrop-blur-2xl max-h-[88vh] overflow-y-auto flex flex-col z-10"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white font-arabic">
                  {language === 'ar' ? 'الإعدادات' : 'Settings'}
                </h2>
                <p className="text-xs text-white/50">
                  {language === 'ar' ? 'تخصيص التجربة والتفضيلات' : 'Customize your spiritual experience'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center justify-center text-sm transition cursor-pointer"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3.5 text-sm text-white">
              {/* My Garden Shortcut */}
              {onOpenGarden && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenGarden();
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#2563eb]/25 to-[#0f172a] border border-[#38bdf8]/30 hover:border-[#38bdf8]/60 transition cursor-pointer text-right"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🌳</span>
                    <div>
                      <p className="font-semibold text-white">
                        {language === 'ar' ? 'شجرة النور (روضتي)' : 'Tree of Noor (My Garden)'}
                      </p>
                      <p className="text-xs text-white/50">
                        {language === 'ar' ? 'شاهد نمو أورادك وسكينتك' : 'Explore your spiritual growth'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[#38bdf8] text-sm">→</span>
                </button>
              )}

              {/* Stillness Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#030712]/60 border border-white/10">
                <div>
                  <p className="font-medium">{language === 'ar' ? 'لحظة السكون (Stillness)' : 'Stillness Moment'}</p>
                  <p className="text-xs text-white/40">
                    {language === 'ar' ? 'هدوء تلقائي بعد 5 ثوانٍ يمنح نقاط نور' : 'Auto-calm after 5s idle; earns Noor points'}
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ stillnessEnabled: !settings.stillnessEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.stillnessEnabled ? 'bg-[#2563eb]' : 'bg-white/20'
                  }`}
                  aria-label="Toggle stillness"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.stillnessEnabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Voice Mode Toggle (Opt-in with clear privacy disclosure) */}
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#030712]/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{language === 'ar' ? 'التفاعل الصوتي (Voice mode)' : 'Voice Mode'}</p>
                    <p className="text-xs text-white/40">
                      {language === 'ar' ? 'العالم ينبض مع صوت الذكر' : 'World breathes with your recitation'}
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ voiceModeEnabled: !settings.voiceModeEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.voiceModeEnabled ? 'bg-[#2563eb]' : 'bg-white/20'
                    }`}
                    aria-label="Toggle voice mode"
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.voiceModeEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Privacy Guarantee Note */}
                <p className="text-[10px] text-[#38bdf8]/80 leading-relaxed bg-[#071426] p-2 rounded-xl border border-[#38bdf8]/20">
                  🔒 {language === 'ar'
                    ? 'المعالجة الصوتية تتم محلياً بالكامل على جهازك دون أي تسجيل أو حفظ أو إرسال خارجي.'
                    : 'Audio is processed purely on-device via Web Audio. Zero audio is ever recorded, stored, or sent.'}
                </p>

                {/* Calibration / Utterance counting sub-options */}
                {settings.voiceModeEnabled && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/80">{language === 'ar' ? 'العدّ التلقائي بالصوت' : 'Auto-count on utterance'}</span>
                      <input
                        type="checkbox"
                        checked={settings.voiceCountEnabled ?? false}
                        onChange={(e) => updateSettings({ voiceCountEnabled: e.target.checked })}
                        className="accent-[#2563eb] cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex justify-between text-white/60">
                        <span>{language === 'ar' ? 'حساسية الالتقاط' : 'Microphone Sensitivity'}</span>
                        <span className="text-[#38bdf8]">{Math.round((settings.voiceSensitivity ?? 0.5) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.voiceSensitivity ?? 0.5}
                        onChange={(e) => updateSettings({ voiceSensitivity: parseFloat(e.target.value) })}
                        className="w-full accent-[#2563eb] cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#030712]/60 border border-white/10">
                <div>
                  <p className="font-medium">{language === 'ar' ? 'الصوت التفاعلي' : 'Sound Effects'}</p>
                  <p className="text-xs text-white/40">
                    {language === 'ar' ? 'أصوات الخرز والأجراس' : 'Synthesized beads and chimes'}
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.soundEnabled ? 'bg-[#2563eb]' : 'bg-white/20'
                  }`}
                  aria-label="Toggle sound"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* SFX Volume */}
              {settings.soundEnabled && (
                <div className="p-3 rounded-2xl bg-[#030712]/60 border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">{language === 'ar' ? 'حجم صوت النقر (SFX)' : 'Tap Volume'}</span>
                    <span className="text-[#38bdf8]">{Math.round((settings.sfxVolume ?? 0.8) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume ?? 0.8}
                    onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
                    className="w-full accent-[#2563eb] cursor-pointer"
                  />
                </div>
              )}

              {/* Ambient Volume */}
              {settings.soundEnabled && (
                <div className="p-3 rounded-2xl bg-[#030712]/60 border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">{language === 'ar' ? 'حجم الصوت البيئي (Ambient)' : 'Ambient Volume'}</span>
                    <span className="text-[#38bdf8]">{Math.round((settings.ambientVolume ?? 0.6) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.ambientVolume ?? 0.6}
                    onChange={(e) => updateSettings({ ambientVolume: parseFloat(e.target.value) })}
                    className="w-full accent-[#2563eb] cursor-pointer"
                  />
                </div>
              )}

              {/* Haptics */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#030712]/60 border border-white/10">
                <div>
                  <p className="font-medium">{language === 'ar' ? 'الاهتزاز التفاعلي (Haptics)' : 'Haptic Feedback'}</p>
                  <p className="text-xs text-white/40">
                    {language === 'ar' ? 'اهتزاز عند كل تسبيحة' : 'Tactile vibration per tap'}
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ hapticEnabled: !settings.hapticEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.hapticEnabled ? 'bg-[#2563eb]' : 'bg-white/20'
                  }`}
                  aria-label="Toggle haptics"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.hapticEnabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* World Picker */}
              <div className="p-3 rounded-2xl bg-[#030712]/60 border border-white/10 flex flex-col gap-2">
                <p className="font-medium text-xs text-white/70">
                  {language === 'ar' ? 'العالم البيئي' : 'Atmospheric World'}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {worlds.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWorld(w.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition cursor-pointer border ${
                        currentWorld === w.id
                          ? 'bg-[#2563eb] text-white border-[#38bdf8] shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {language === 'ar' ? w.nameAr : w.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switch */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#030712]/60 border border-white/10">
                <div>
                  <p className="font-medium">{language === 'ar' ? 'اللغة' : 'Language'}</p>
                  <p className="text-xs text-white/40">العربية / English</p>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#38bdf8] font-semibold text-xs border border-white/15 transition cursor-pointer"
                >
                  {language === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default SettingsModal;
