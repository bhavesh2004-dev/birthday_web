import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface PasswordGateProps {
  onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [wrongAttemptCount, setWrongAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [characterMood, setCharacterMood] = useState<'normal' | 'typing' | 'happy' | 'pout'>('normal');

  const HINTS = [
    'Hint: Our first car drive 🚗',
    'Hint: Our first kiss 💋',
    'Hint: Our relationship starting date 📅',
  ];

  const getCurrentHint = () => {
    if (wrongAttemptCount <= 1) return HINTS[0];
    if (wrongAttemptCount === 2) return HINTS[1];
    return HINTS[2];
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = password.trim().replace(/\s+/g, ' ');
    const noSpaces = password.trim().replace(/\s+/g, '');

    // Strictly check for 06 07 or 0607
    if (clean === '06 07' || noSpaces === '0607') {
      triggerSuccess();
    } else {
      const newAttempts = wrongAttemptCount + 1;
      setWrongAttemptCount(newAttempts);
      setIsError(true);
      setCharacterMood('pout');

      // Progressive hint message on wrong attempt
      if (newAttempts === 1) {
        setErrorMessage(HINTS[0]);
      } else if (newAttempts === 2) {
        setErrorMessage(HINTS[1]);
      } else {
        setErrorMessage(HINTS[2]);
      }

      sounds.playBoing();
      setTimeout(() => setCharacterMood('normal'), 2500);
    }
  };

  const triggerSuccess = () => {
    setIsUnlocked(true);
    setCharacterMood('happy');
    sounds.playChime();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#ec4899', '#fbbf24', '#c084fc'],
    });

    setTimeout(() => {
      onUnlock();
    }, 1100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/85 backdrop-blur-md rounded-3xl border-2 border-pink-200/80 p-6 sm:p-8 shadow-2xl shadow-pink-200/50 text-center relative overflow-hidden"
      >
        {/* Decorative Top Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 mb-4 border border-pink-200">
          <Sparkles size={13} className="text-pink-500" />
          <span>Top Secret • For Bitu's Eyes Only</span>
        </div>

        {/* Cute Animated Bee Character SVG */}
        <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center select-none">
          <motion.div
            animate={
              characterMood === 'happy'
                ? { y: [-15, 0, -15], rotate: [0, -10, 10, 0] }
                : characterMood === 'pout'
                ? { x: [-4, 4, -4, 4, 0], rotate: [-4, 4, 0] }
                : { y: [0, -8, 0] }
            }
            transition={{
              duration: characterMood === 'happy' ? 0.6 : 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <svg width="130" height="130" viewBox="0 0 130 130" className="overflow-visible">
              {/* Fluttering Wings */}
              <motion.ellipse
                cx="42"
                cy="38"
                rx="16"
                ry="22"
                fill="#E0F2FE"
                stroke="#BAE6FD"
                strokeWidth="2"
                animate={{ rotate: [-15, -35, -15], scaleY: [0.9, 1.1, 0.9] }}
                transition={{ duration: 0.15, repeat: Infinity }}
                style={{ transformOrigin: '48px 48px' }}
                opacity="0.85"
              />
              <motion.ellipse
                cx="88"
                cy="38"
                rx="16"
                ry="22"
                fill="#E0F2FE"
                stroke="#BAE6FD"
                strokeWidth="2"
                animate={{ rotate: [15, 35, 15], scaleY: [0.9, 1.1, 0.9] }}
                transition={{ duration: 0.15, repeat: Infinity }}
                style={{ transformOrigin: '82px 48px' }}
                opacity="0.85"
              />

              {/* Antennae */}
              <path d="M 52 38 Q 45 20 40 22" stroke="#4A3B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="39" cy="21" r="4.5" fill="#F472B6" />
              <path d="M 78 38 Q 85 20 90 22" stroke="#4A3B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="91" cy="21" r="4.5" fill="#F472B6" />

              {/* Chubby Bee Body */}
              <ellipse cx="65" cy="72" rx="38" ry="34" fill="#FDE047" stroke="#EAB308" strokeWidth="2.5" />

              {/* Honey Stripes */}
              <path d="M 33 65 Q 65 72 97 65" stroke="#4A3B4E" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M 36 78 Q 65 85 94 78" stroke="#4A3B4E" strokeWidth="6.5" strokeLinecap="round" fill="none" />

              {/* Rosy Cheeks */}
              <circle cx="44" cy="74" r="6" fill="#FB7185" opacity="0.65" />
              <circle cx="86" cy="74" r="6" fill="#FB7185" opacity="0.65" />

              {/* Eyes */}
              {characterMood === 'happy' ? (
                <>
                  <path d="M 48 64 Q 54 58 60 64" stroke="#4A3B4E" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 70 64 Q 76 58 82 64" stroke="#4A3B4E" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              ) : characterMood === 'pout' ? (
                <>
                  <path d="M 48 60 L 58 66 L 48 72" stroke="#4A3B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 82 60 L 72 66 L 82 72" stroke="#4A3B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="53" cy="64" r="4.5" fill="#4A3B4E" />
                  <circle cx="55" cy="62" r="1.8" fill="#FFFFFF" />
                  <circle cx="77" cy="64" r="4.5" fill="#4A3B4E" />
                  <circle cx="79" cy="62" r="1.8" fill="#FFFFFF" />
                </>
              )}

              {/* Mouth */}
              {characterMood === 'happy' ? (
                <path d="M 60 76 Q 65 83 70 76" stroke="#4A3B4E" strokeWidth="2.5" fill="#FB7185" strokeLinecap="round" />
              ) : characterMood === 'pout' ? (
                <path d="M 61 79 Q 65 74 69 79" stroke="#4A3B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 61 74 Q 65 78 69 74" stroke="#4A3B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </svg>
          </motion.div>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-950 font-display mb-1">
          Welcome, Princess Bitu! 👑
        </h2>
        <p className="text-sm text-pink-700/80 mb-6 font-medium">
          Enter the secret passcode to enter the World of Bitu & Bee 🍯
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsError(false);
                setCharacterMood(e.target.value.length > 0 ? 'typing' : 'normal');
              }}
              placeholder="Enter secret passcode..."
              className={`w-full px-5 py-3.5 pl-11 rounded-2xl bg-white border-2 text-center font-bold tracking-widest text-pink-900 placeholder-pink-300 focus:outline-none transition-all shadow-sm text-lg ${
                isError
                  ? 'border-rose-400 ring-2 ring-rose-200'
                  : 'border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100'
              }`}
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400">
              {isUnlocked ? <Unlock size={18} className="text-emerald-500" /> : <Lock size={18} />}
            </div>
          </div>

          {/* Error Message with Progressive Clues */}
          <AnimatePresence>
            {isError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs text-rose-500 font-semibold font-cute"
              >
                {errorMessage}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-pink-300/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enter World of Love</span>
            <ArrowRight size={18} />
          </motion.button>
        </form>

        {/* Hint & Birthday Bypass */}
        <div className="mt-5 pt-4 border-t border-pink-100 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setShowHint(!showHint);
            }}
            className="text-xs text-pink-500 hover:text-pink-700 font-medium inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <HelpCircle size={13} />
            <span>{showHint ? 'Hide secret hint' : 'Need a hint? 🤫'}</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs bg-pink-50 text-pink-800 p-2.5 rounded-xl border border-pink-200/60 leading-relaxed font-cute"
              >
                💡 {getCurrentHint()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
