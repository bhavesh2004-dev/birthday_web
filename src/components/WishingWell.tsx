import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Heart, Send, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface WishingWellProps {
  onRestart: () => void;
}

export const WishingWell: React.FC<WishingWellProps> = ({ onRestart }) => {
  const [wish, setWish] = useState('');
  const [savedWish, setSavedWish] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem('bitu_birthday_wish');
    if (existing) {
      setSavedWish(existing);
      setIsSubmitted(true);
    }
  }, []);

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;

    sounds.playFanfare();
    localStorage.setItem('bitu_birthday_wish', wish.trim());
    setSavedWish(wish.trim());
    setIsSubmitted(true);

    // Multi-stage fireworks confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fde047', '#38bdf8', '#a855f7'],
    });

    const end = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 20,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#ffd700', '#ff1493'],
      });
      confetti({
        particleCount: 20,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#ffd700', '#ff1493'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const launchFireworks = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#ff007f', '#ffb6c1', '#fde047', '#38bdf8', '#c084fc'],
    });
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center z-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-3 border border-amber-200">
          <Star size={13} className="text-amber-500 fill-amber-400" />
          <span>The 22nd Birthday Wishing Well</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-pink-950 font-display">
          Make a Secret Birthday Wish 🌟
        </h2>
        <p className="text-sm text-pink-800/80 mt-2 font-medium max-w-lg mx-auto">
          Close your eyes, make your deepest wish for age 22, and cast it into the stars!
        </p>
      </div>

      {/* Main Interactive Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl border-2 border-amber-200/90 p-6 sm:p-10 shadow-2xl shadow-pink-200/50 text-center"
      >
        {!isSubmitted ? (
          <form onSubmit={handleWishSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Dear universe & Bee, for my 22nd year, I wish for..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-amber-50/50 border-2 border-amber-200 text-pink-950 placeholder-pink-300 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 text-sm font-medium leading-relaxed resize-none shadow-inner"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!wish.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-300/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>Send My Wish to the Stars & Bee ✨</span>
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <CheckCircle2 size={36} className="text-amber-500" />
            </div>

            <h3 className="text-2xl font-bold text-pink-950 font-display">
              Wish Sealed in the Stars! 🌠
            </h3>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Bitu's 22nd Birthday Wish:
              </span>
              <p className="text-sm font-medium text-pink-950 font-cute mt-1 italic">
                "{savedWish}"
              </p>
            </div>

            <p className="text-xs text-pink-700 font-medium">
              Bee will do everything in his power to make all your dreams come true! 💍💕
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setWish(savedWish || '');
              }}
              className="text-xs text-pink-500 hover:text-pink-700 underline font-medium"
            >
              Edit My Wish
            </button>
          </motion.div>
        )}

        {/* Celebration Buttons */}
        <div className="mt-8 pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={launchFireworks}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-300/40 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} /> Launch Fireworks 🎆
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onRestart();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={14} /> Back to 3D Cake 🎂
          </button>
        </div>
      </motion.div>

      {/* Romantic Closing Footer */}
      <div className="mt-12 text-center text-xs text-pink-700/80 font-medium space-y-1">
        <p className="flex items-center justify-center gap-1">
          Made with infinite love by <span className="font-bold text-pink-900">Bee 🐝</span> for his forever queen <span className="font-bold text-pink-900">Bitu 👑</span>
        </p>
        <p className="text-[11px] text-pink-400">
          Happy 22nd Birthday, Bitu • College 1st Year to Infinity & Beyond
        </p>
      </div>
    </div>
  );
};
