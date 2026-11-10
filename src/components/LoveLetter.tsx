import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, FastForward } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LoveLetterProps {
  onContinue: () => void;
}

const FULL_LETTER_PARAGRAPHS = [
  `Bitu, sometimes I think about how we met in first year and how far we’ve come since then. From our silly jokes and masti , our midnight bike rides, jalebis, shawarma, waffles, and me teaching you how to ride my Bullet… we’ve made so many beautiful memories together. And honestly, I want to create a thousand more with you, again and again, in every phase of our lives.`,
  `You always say that I love you, but I don't think you realise how grateful I am to have you. You came into my life when things felt really dark, and you became my light. You brought happiness into places where I couldn't find any, and I'm so thankful that I have you by my side.`,
  `I want to keep loving you, annoying you, making you smile, and creating little memories with you. I promise I'll always give my best to keep you happy and make you feel as loved as you truly deserve.`,
  `Happy 22nd birthday once again, my Bittu. ❤️ You are my light, my favourite person, and someone I want to keep choosing, every single day. I love you so much. 🧿❤️`,
];

const FULL_LETTER_RAW = FULL_LETTER_PARAGRAPHS.join('\n\n');

export const LoveLetter: React.FC<LoveLetterProps> = ({ onContinue }) => {
  const [displayedTextLength, setDisplayedTextLength] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showLightingEffect, setShowLightingEffect] = useState(true);
  const [hasWritingStarted, setHasWritingStarted] = useState(false);

  // Single source of truth for character pointer - strictly prevents duplicate concurrent loops
  const charIndexRef = useRef(0);
  const isTypingActiveRef = useRef(false);

  // 1. Initial Lighting Effect on Mount & Volume Ducking for Letter Reading
  useEffect(() => {
    sounds.playSparkle();
    // Duck background song smoothly so typing sound is clear and intimate
    sounds.duckBgm(0.12, 1000);

    const lightTimer = setTimeout(() => {
      setShowLightingEffect(false);
      setHasWritingStarted(true);
      sounds.startTypingSound();
    }, 1200);

    return () => {
      clearTimeout(lightTimer);
      sounds.stopTypingSound();
      sounds.restoreBgm(0.55, 600);
    };
  }, []);

  // 2. Slow & Romantic Typewriter Engine (Rock-Solid Sequential Loop)
  useEffect(() => {
    if (!hasWritingStarted || isTypingComplete) return;

    // Prevent any duplicate loop instances
    if (isTypingActiveRef.current) return;
    isTypingActiveRef.current = true;
    sounds.startTypingSound();

    let timeoutId: number;
    let isCancelled = false;

    const typeNext = () => {
      if (isCancelled) return;

      const current = charIndexRef.current;
      if (current >= FULL_LETTER_RAW.length) {
        setIsTypingComplete(true);
        isTypingActiveRef.current = false;
        sounds.stopTypingSound();
        return;
      }

      const char = FULL_LETTER_RAW[current];
      const nextChar = FULL_LETTER_RAW[current + 1];

      // Increment position
      const nextIndex = current + 1;
      charIndexRef.current = nextIndex;
      setDisplayedTextLength(nextIndex);

      // Balanced medium romantic typing cadence:
      // Normal characters: ~32ms - 42ms per character (natural, engaging medium pace)
      let delay = 32 + Math.random() * 10;

      if (char === ',' || char === ';') {
        delay = 130; // brief natural comma breath
      } else if (char === '.' || char === '!' || char === '?') {
        delay = 220; // gentle pause at end of sentence
      } else if (char === '…') {
        delay = 180;
      } else if (char === '\n') {
        delay = nextChar === '\n' ? 280 : 160; // smooth paragraph transition
      }

      timeoutId = window.setTimeout(typeNext, delay);
    };

    // Initial brief breath before typing begins
    timeoutId = window.setTimeout(typeNext, 250);

    return () => {
      isCancelled = true;
      isTypingActiveRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [hasWritingStarted, isTypingComplete]);

  // Skip button to immediately reveal entire letter
  const handleSkip = () => {
    sounds.playPop();
    sounds.stopTypingSound();
    charIndexRef.current = FULL_LETTER_RAW.length;
    setDisplayedTextLength(FULL_LETTER_RAW.length);
    setIsTypingComplete(true);
  };

  const handleContinue = () => {
    sounds.stopTypingSound();
    // Restore song volume back to normal when moving to next section
    sounds.restoreBgm(0.55, 800);
    sounds.playChime();
    onContinue();
  };

  const currentText = FULL_LETTER_RAW.slice(0, displayedTextLength);
  const currentParagraphs = currentText.split('\n\n');

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center justify-center z-10 max-w-3xl mx-auto overflow-hidden">
      {/* 1. Magical Golden Lighting Beam Effect on Page Entry */}
      <AnimatePresence>
        {showLightingEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <div
              className="w-[120vw] h-[120vh] rounded-full blur-3xl opacity-60"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255, 230, 200, 0.9) 0%, rgba(254, 205, 211, 0.5) 40%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Pill */}
      <div className="text-center mb-5 z-20">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-100/90 text-rose-700 border border-rose-200 shadow-sm backdrop-blur-sm">
          <Mail size={13} className="text-rose-500" />
          <span>A Letter From Bee’s Heart • Just For Bitu 🍯</span>
        </div>
      </div>

      {/* 3. Main Parchment Letter Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full bg-[#FFFDF9] border-2 border-[#F3DFC8] rounded-3xl p-6 sm:p-10 shadow-2xl shadow-pink-200/40 text-left overflow-hidden z-20"
      >
        {/* Fast-Forward / Skip button while writing */}
        {!isTypingComplete && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-pink-600 bg-pink-100/80 hover:bg-pink-200 px-3.5 py-1.5 rounded-full border border-pink-200 shadow-sm transition-all cursor-pointer"
            title="Read full letter immediately"
          >
            <FastForward size={13} />
            <span>Show All ⚡</span>
          </button>
        )}

        {/* Cute Hug Animation at the Top of the Letter */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-32 sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-pink-200 bg-white">
            <img
              src="/assets/hugs.gif"
              alt="Birthday Hugs"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="mt-2 text-xs font-cute text-pink-700 font-bold flex items-center gap-1">
            <span>🫂 Tight Hugs for Bitu</span>
          </span>
        </div>

        {/* User's Exact Letter Header */}
        <h2 className="text-2xl sm:text-3xl font-black text-pink-950 font-display mb-6 tracking-tight border-b border-pink-100 pb-3 text-center sm:text-left">
          Happiest Birthday to my favourite person, my Bitu ❤️🎂
        </h2>

        {/* Animated Real-time Letter Writing Content */}
        <div className="space-y-4 text-sm sm:text-base text-[#3D2C3E] leading-relaxed font-sans min-h-[300px]">
          {currentParagraphs.map((para, idx) => {
            const isLast = idx === currentParagraphs.length - 1;
            const isSpecialHighlight = idx === 3;

            if (isSpecialHighlight) {
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 bg-pink-50/90 rounded-2xl border border-pink-200/90 shadow-sm"
                >
                  <p className="font-semibold text-pink-900 leading-relaxed font-cute">
                    {para}
                    {!isTypingComplete && isLast && (
                      <span className="inline-block w-2 h-4 bg-pink-500 ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
              );
            }

            return (
              <p key={idx}>
                {para}
                {!isTypingComplete && isLast && (
                  <span className="inline-block w-2 h-4 bg-pink-500 ml-1 animate-pulse" />
                )}
              </p>
            );
          })}
        </div>

        {/* Sign-off (appears when typing finishes or progresses) */}
        {displayedTextLength > FULL_LETTER_RAW.length * 0.85 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 pt-4 border-t border-[#F3DFC8] flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <p className="text-sm font-handwriting text-pink-700 font-bold text-lg">
                Forever and always yours,
              </p>
              <p className="text-2xl font-handwriting text-pink-900 font-black flex items-center gap-1.5">
                Your Bee 🐝❤️
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 border-2 border-white shadow-md flex items-center justify-center text-white text-xl">
              🐝
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 4. Button to Next Section: Masti / Love Quiz */}
      <div className="mt-8 text-center z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-300/50 flex items-center gap-2 cursor-pointer mx-auto"
        >
          <span>A Quick Question for Bitu 😜👉</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};
