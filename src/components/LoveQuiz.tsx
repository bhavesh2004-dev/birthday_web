import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertCircle, CheckCircle, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface LoveQuizProps {
  onContinue: () => void;
}

export const LoveQuiz: React.FC<LoveQuizProps> = ({ onContinue }) => {
  const [noButtonPosition, setNoButtonPosition] = useState<{ x: number; y: number } | null>(null);
  const [noClickCount, setNoClickCount] = useState(0);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [hasSaidYes, setHasSaidYes] = useState(false);
  const [lovePercentage, setLovePercentage] = useState(100);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const NO_BUTTON_PHRASES = [
    'NO 🙄',
    'Wait, what?! 🤨',
    'Are you sure, Bitu? 🥺',
    'Bee is crying! 😭',
    'abe mat kar yar ! 😢',
    'Wrong answer baby! 😜',
    'Can’t catch me! 🏃‍♂️',
    'Deal with it, he is yours! 💍',
  ];

  const handleNoDodge = () => {
    sounds.playBoing();
    setNoClickCount((prev) => prev + 1);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = Math.max(40, (rect.width / 2) - 80);
      const maxY = 65;
      const randomX = Math.max(-maxX, Math.min(maxX, (Math.random() - 0.5) * maxX * 1.6));
      const randomY = Math.max(-maxY, Math.min(maxY, (Math.random() - 0.5) * maxY * 1.6));
      setNoButtonPosition({ x: randomX, y: randomY });
    }
  };

  const handleNoClick = () => {
    sounds.playBoing();
    setShowDeniedModal(true);
  };

  const handleYesClick = () => {
    sounds.playFanfare();
    setHasSaidYes(true);
    setLovePercentage(100000);

    // Spectacular celebration confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#f472b6', '#fbbf24', '#e879f9'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#ff007f', '#ffb6c1', '#ffffff'],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#ff007f', '#ffb6c1', '#ffffff'],
      });
    }, 400);
  };

  const currentNoPhrase = NO_BUTTON_PHRASES[Math.min(noClickCount, NO_BUTTON_PHRASES.length - 1)];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={containerRef}
        className="relative w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl border-2 border-pink-200/90 p-6 sm:p-10 shadow-2xl shadow-pink-200/50 text-center overflow-hidden"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 mb-4 border border-rose-200">
          <Heart size={13} className="fill-rose-500 text-rose-500 animate-heart-beat" />
          <span>❤️ A little question for Bitu</span>
        </div>

        {/* Animated Heart Graphic */}
        <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.18, 1, 1.18, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-6xl select-none"
          >
            💖
          </motion.div>
        </div>

        {/* Headline Question */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-pink-950 font-display mb-2">
          Do You Love Your Bee? 🥺👉👈
        </h2>

        <p className="text-sm sm:text-base text-pink-800/80 mb-8 font-medium">
          Answer truthfully, Bitu! Bee’s fragile heart is holding its breath...
        </p>

        {!hasSaidYes ? (
          /* Interactive Button Area */
          <div className="relative min-h-[140px] flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {/* The YES Button (grows bigger with every NO attempt) */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleYesClick}
              style={{
                transform: `scale(${1 + Math.min(noClickCount * 0.08, 0.4)})`,
              }}
              className="px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-base sm:text-lg shadow-xl shadow-pink-300/60 transition-transform duration-200 flex items-center gap-2 z-10"
            >
              <Heart size={20} className="fill-white" />
              <span>YES, SO MUCH! 💕</span>
            </motion.button>

            {/* The Runaway NO Button */}
            <motion.button
              onMouseEnter={handleNoDodge}
              onTouchStart={handleNoDodge}
              onClick={handleNoClick}
              animate={
                noButtonPosition
                  ? { x: noButtonPosition.x, y: noButtonPosition.y }
                  : { x: 0, y: 0 }
              }
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-sm sm:text-base border border-gray-300 shadow-sm transition-colors cursor-pointer select-none"
            >
              {currentNoPhrase}
            </motion.button>
          </div>
        ) : (
          /* Celebratory Result View */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Love Meter */}
            <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-pink-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles size={13} /> Bitu's Love Meter for Bee:
                </span>
                <span className="text-rose-600 text-sm">100,000% (MAX OVERFLOW)</span>
              </div>
              <div className="w-full h-3 bg-pink-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 rounded-full"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-5 rounded-2xl border border-rose-200">
              <h3 className="text-xl sm:text-2xl font-bold text-rose-950 font-display mb-1">
                ❤️ A little question for Bitu
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 leading-relaxed font-cute">
                You have no idea how happy it makes me to be your person, Bitu. I just want to keep making you smile, annoying you a little, and loving you more every day. 🫶🏻
              </p>
            </div>

            {/* Next Chapter Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sounds.playChime();
                onContinue();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-pink-300/40 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Relive Our Memories Timeline 📸💖</span>
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* The Requested "SORRY YOU CAN'T SAY NO HE IS YOURS ONLY YOU HAVE TO DEAL IT" Modal */}
      <AnimatePresence>
        {showDeniedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="relative w-full max-w-md bg-white border-4 border-rose-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden"
            >
              {/* Alert Icon */}
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <ShieldAlert size={36} className="animate-bounce" />
              </div>

              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
                🚨 ILLEGAL OPTION DETECTED 🚨
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-950 font-display mb-3">
                Sorry, You Can't Say NO! 😜
              </h3>

              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-sm text-rose-900 font-medium leading-relaxed mb-6 font-cute">
                <p className="font-bold text-base text-rose-600 mb-1">
                  HE IS YOURS ONLY, YOU HAVE TO DEAL WITH IT! 💍
                </p>
                <p className="text-xs text-rose-700">
                  There is strictly <b>NO RETURN</b>, <b>NO EXCHANGE</b>, and <b>NO REFUND</b> policy on Bee. You officially signed up for this in college and you are stuck with him for life! 🍯🐝
                </p>
              </div>

              {/* Surrender Button */}
              <button
                onClick={() => {
                  setShowDeniedModal(false);
                  handleYesClick();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-300/50 flex items-center justify-center gap-2"
              >
                <Heart size={18} className="fill-white" />
                <span>Fine, I Surrender, I Love You! ❤️</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
