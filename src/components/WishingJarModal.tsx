import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Sparkles, Heart } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface WishingJarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAIRY_STARS = [
  { id: 1, text: "You have the prettiest smile in the universe, Bitu. Never let anything dim it! ✨" },
  { id: 2, text: "Thank you for being my anchor through college, exams, and internship stress. 🌸" },
  { id: 3, text: "I love the way your eyes light up when your favorite food arrives! 🍕🍰" },
  { id: 4, text: "From college besties to soulmates... falling in love with you was the easiest thing ever. 💖" },
  { id: 5, text: "Your sleepy voice during late night calls is Bee's absolute peace. 🌙" },
  { id: 6, text: "Even when you scold me, you look too adorable to take seriously! 😜" },
  { id: 7, text: "Bee promises to hold your hand through every chapter of this beautiful life. 💍" },
  { id: 8, text: "Happy 22nd Birthday to the girl who holds my whole heart! 🎂👑" },
];

export const WishingJarModal: React.FC<WishingJarProps> = ({ isOpen, onClose }) => {
  const [activeStar, setActiveStar] = useState<number | null>(null);

  const handleStarClick = (id: number) => {
    sounds.playSparkle();
    setActiveStar(id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#FFF7ED] to-[#FFF0F5] border-2 border-amber-200 rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-amber-500 hover:text-amber-700 rounded-full hover:bg-amber-100 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-2">
              <Sparkles size={14} className="text-amber-500" /> Magical Fairy Jar
            </span>
            <h3 className="text-2xl font-bold text-amber-950 font-display">
              Catch a Glowing Star! ⭐
            </h3>
            <p className="text-sm text-amber-800/80 mt-1">
              Every star in this jar holds a little secret love note from Bee. Tap one to catch its light!
            </p>
          </div>

          {/* Active Star Note Card (if selected) */}
          <div className="min-h-[100px] mb-6 p-4 rounded-2xl bg-white/90 border border-amber-200 shadow-sm flex items-center justify-center text-center">
            {activeStar !== null ? (
              <motion.div
                key={activeStar}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  <Star size={16} className="fill-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Star #{activeStar}</span>
                  <Star size={16} className="fill-amber-400" />
                </div>
                <p className="text-sm sm:text-base font-medium text-pink-950 leading-relaxed font-cute">
                  "{FAIRY_STARS.find((s) => s.id === activeStar)?.text}"
                </p>
              </motion.div>
            ) : (
              <p className="text-sm text-amber-700/70 italic flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400 animate-spin" />
                Tap any shining star below to release its message!
              </p>
            )}
          </div>

          {/* Grid of Stars */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-4">
            {FAIRY_STARS.map((star) => {
              const isSelected = activeStar === star.id;
              return (
                <motion.button
                  key={star.id}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStarClick(star.id)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-white shadow-lg shadow-amber-300/60 ring-2 ring-amber-300'
                      : 'bg-white/80 hover:bg-amber-50 text-amber-500 border border-amber-200/80 shadow-sm'
                  }`}
                >
                  <Star
                    size={26}
                    className={`${
                      isSelected
                        ? 'fill-white stroke-white'
                        : 'fill-amber-300 stroke-amber-500'
                    } animate-pulse`}
                  />
                  <span className="text-[10px] font-bold mt-1">#{star.id}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-medium text-sm rounded-full shadow-md shadow-amber-300/40 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Heart size={14} className="fill-white" />
              Put Stars Back Safely in Jar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
