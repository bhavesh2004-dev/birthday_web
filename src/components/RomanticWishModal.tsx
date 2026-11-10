import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, Flame, ArrowRight, Gift, Cake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface RomanticWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRelight: () => void;
  onContinueToStory: () => void;
  onOpenGifts: () => void;
}

export const RomanticWishModal: React.FC<RomanticWishModalProps> = ({
  isOpen,
  onClose,
  onRelight,
  onContinueToStory,
  onOpenGifts,
}) => {
  const [sliceCount, setSliceCount] = useState(0);

  const handleEatSlice = () => {
    sounds.playPop();
    setSliceCount((prev) => prev + 1);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fbcfe8', '#fde047'],
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] to-[#FFF2F5] border-2 border-pink-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-pink-400 hover:text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 mb-3 border border-rose-200">
            <Sparkles size={13} className="text-rose-500 animate-spin" />
            <span>Candles Blown • A Wish Whispered to the Stars ✨</span>
          </div>

          {/* Princess Crown & Animated Hugs GIF */}
          <div className="relative mx-auto mb-3 flex flex-col items-center justify-center select-none">
            <div className="w-36 h-28 rounded-2xl overflow-hidden border-2 border-pink-200 shadow-md bg-white mb-2">
              <img
                src="/assets/hugs.gif"
                alt="Romantic Birthday Hugs"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-700 bg-pink-100/80 px-3 py-0.5 rounded-full border border-pink-200">
              <span>👑 Birthday Hugs For My Princess</span>
            </div>
          </div>

          {/* Headline */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-950 font-display mb-2">
            Make a Wish, My Birthday Princess! 🎂💖
          </h3>

          <p className="text-xs text-rose-500 font-cute font-bold uppercase tracking-wider mb-4">
            Happy 22nd Birthday, Bitu Baby • From Your Bee 🐝
          </p>

          {/* Heartfelt Romantic Message Box */}
          <div className="bg-white/85 p-5 sm:p-6 rounded-2xl border border-pink-200/80 shadow-sm text-left space-y-3 mb-6">
            <p className="text-xs sm:text-sm text-pink-950/90 leading-relaxed font-sans">
              <b>My Dearest Bitu (My sweet princess),</b>
            </p>
            <p className="text-xs sm:text-sm text-pink-950/85 leading-relaxed font-sans">
              Watching you blow out your 22nd birthday candles fills my heart with so much warmth and gratitude. 22 years ago today, the world was blessed with the kindest, cutest, and most radiant soul in the universe.
            </p>
            <p className="text-xs sm:text-sm text-pink-950/85 leading-relaxed font-sans">
              From our college first-year chaos—bunking classes, canteen samosas, and laughing at the dumbest things—to falling in love in second year and growing up together through internships, you have been my safest home and greatest happiness.
            </p>
            <div className="p-3 bg-pink-50 rounded-xl border border-pink-200">
              <p className="text-xs sm:text-sm font-handwriting text-pink-700 font-bold italic leading-relaxed">
                “May every silent wish you just made come true. Bee will spend every single day making you laugh, protecting you, feeding you treats, and loving you more than yesterday!”
              </p>
            </div>
            <p className="text-right text-xs font-cute text-pink-800 font-bold">
              Forever your idiot & soulmate, <br />
              <span className="text-pink-600 font-handwriting text-base">Bee 🐝❤️</span>
            </p>
          </div>

          {/* Interactive Actions Grid */}
          <div className="space-y-3">
            {/* Cut Cake Slice */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleEatSlice}
                className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Cake size={14} className="text-pink-500" />
                <span>Eat a Slice of Virtual Cake</span>
                {sliceCount > 0 && (
                  <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                    x{sliceCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  sounds.playChime();
                  onRelight();
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Flame size={14} className="text-amber-500" />
                <span>Relight Candles 🔥</span>
              </button>
            </div>

            {/* Explore Journey Timeline */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sounds.playChime();
                onContinueToStory();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-pink-300/40 flex items-center justify-center gap-2"
            >
              <span>Explore Our Story Timeline (Friends to Soulmates) 📖</span>
              <ArrowRight size={16} />
            </motion.button>

            {/* Open Gifts Quick Link */}
            <button
              onClick={() => {
                onClose();
                onOpenGifts();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-pink-700 hover:bg-pink-100/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <Gift size={14} />
              <span>Unwrap Bee's 3 Birthday Gifts 🎁</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
