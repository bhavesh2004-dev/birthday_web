import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

const REASONS = [
  { id: 1, text: "The way your eyes sparkle whenever your favorite food arrives 🍕🍰", emoji: "✨" },
  { id: 2, text: "How you scold Bee like a little mom when I skip meals or stay up too late 🥺", emoji: "🧸" },
  { id: 3, text: "Your infectious, unfiltered laugh that instantly cures all my stress ☀️", emoji: "😂" },
  { id: 4, text: "How we went from roasting each other in college 1st year to soulmates in 2nd year 🎒", emoji: "💖" },
  { id: 5, text: "Your warm, sleepy voice on late night and morning calls 🌙", emoji: "💤" },
  { id: 6, text: "The way you hold Bee’s hand and lock your fingers tightly with mine 🤝", emoji: "🌸" },
  { id: 7, text: "Your fierce work ethic and passion during your internship and college days 💼", emoji: "⭐" },
  { id: 8, text: "How ridiculously cute you look when you pout or pretend to be mad at me 😜", emoji: "🐥" },
  { id: 9, text: "How we communicate entire conversations with just one look across the room 👀", emoji: "🔮" },
  { id: 10, text: "The sweetest way you say 'Beeee' when you want attention or treats 🍯", emoji: "🐝" },
  { id: 11, text: "Your golden, genuine heart that cares so deeply about everyone around you 💛", emoji: "🌟" },
  { id: 12, text: "Our endless shared memories: canteen samosas, bunking, and late-night drives 🛵", emoji: "📸" },
  { id: 13, text: "How you make anywhere feel like home just by sitting beside me 🏡", emoji: "🕊️" },
  { id: 14, text: "Your warm, cozy bear hugs that make the rest of the world vanish 🫂", emoji: "🧸" },
  { id: 15, text: "That you were my best friend first, and my forever love always 💍", emoji: "👑" },
  { id: 16, text: "The adorable happy dance you do when good food is served 💃", emoji: "🍟" },
  { id: 17, text: "How you always believe in me, even when I doubt myself 🛡️", emoji: "🌈" },
  { id: 18, text: "Your chaotic daily gossip updates: 'Bee, listen na what happened!' ☕", emoji: "📱" },
  { id: 19, text: "How patient and loving you are with my goofy antics and bad puns 🤪", emoji: "🌻" },
  { id: 20, text: "The fact that you STILL give me butterflies every single time I see you 🦋", emoji: "💓" },
  { id: 21, text: "Watching you bloom into this incredible, independent, gorgeous 22yo woman 🌷", emoji: "👸" },
  { id: 22, text: "Simply because you are YOU—my Bitu, my sweetest girl, my forever home ❤️", emoji: "♾️" },
];

interface ReasonsListProps {
  onContinue: () => void;
}

export const ReasonsList: React.FC<ReasonsListProps> = ({ onContinue }) => {
  const [revealedIds, setRevealedIds] = useState<number[]>([1, 2, 3]);

  const toggleReason = (id: number) => {
    sounds.playPop();
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (!revealedIds.includes(id) && revealedIds.length + 1 === 22) {
      sounds.playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const revealAll = () => {
    sounds.playSparkle();
    setRevealedIds(REASONS.map((r) => r.id));
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 max-w-5xl mx-auto z-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 mb-3 border border-rose-200">
          <Sparkles size={13} className="text-rose-500" />
          <span>22 Years • 22 Little Treasures</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-pink-950 font-display">
          22 Reasons Why Bee Loves Bitu 💖
        </h2>
        <p className="text-sm sm:text-base text-pink-800/80 mt-2 font-medium max-w-xl mx-auto">
          Tap each card to flip and uncover a sweet truth about why you own Bee’s whole heart!
        </p>

        {/* Counter & Reveal All */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
            Flipped: {revealedIds.length} / 22
          </span>
          {revealedIds.length < 22 && (
            <button
              onClick={revealAll}
              className="text-xs font-semibold text-pink-600 hover:text-pink-800 underline transition-colors"
            >
              Reveal All at Once ✨
            </button>
          )}
        </div>
      </div>

      {/* Grid of 22 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {REASONS.map((reason) => {
          const isFlipped = revealedIds.includes(reason.id);

          return (
            <motion.div
              key={reason.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleReason(reason.id)}
              className="h-44 cursor-pointer select-none perspective-1000"
            >
              <div
                className={`relative w-full h-full rounded-2xl transition-all duration-500 transform-style-3d p-4 flex flex-col justify-between border ${
                  isFlipped
                    ? 'bg-white border-pink-200 shadow-md'
                    : 'bg-gradient-to-br from-[#FFE7EB] to-[#FFF0F5] border-pink-200/80 shadow-sm hover:shadow-md hover:border-pink-300'
                }`}
              >
                {!isFlipped ? (
                  /* Front Card */
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-2">{reason.emoji}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-500 font-cute">
                      Reason #{reason.id}
                    </span>
                    <p className="text-xs text-pink-700/70 mt-1 font-medium">
                      Tap to flip 🌸
                    </p>
                  </div>
                ) : (
                  /* Back / Revealed Card */
                  <div className="h-full flex flex-col justify-between text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-pink-500 uppercase tracking-wider">
                        #{reason.id}
                      </span>
                      <span className="text-base">{reason.emoji}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-pink-950 font-cute leading-relaxed my-auto">
                      "{reason.text}"
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                      <Check size={12} />
                      <span>Always True</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Next Step Button */}
      <div className="mt-14 text-center">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sounds.playChime();
            onContinue();
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-pink-300/40 inline-flex items-center gap-2"
        >
          <span>Make Your Birthday Wish 🌟</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};
