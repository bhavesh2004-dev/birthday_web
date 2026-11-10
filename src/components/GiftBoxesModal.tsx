import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface GiftBoxesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoveGift {
  id: number;
  color: string;
  boxColor: string;
  ribbonColor: string;
  title: string;
  badge: string;
  description: string;
  perk: string;
  isOpened: boolean;
}

export const GiftBoxesModal: React.FC<GiftBoxesProps> = ({ isOpen, onClose }) => {
  const [gifts, setGifts] = useState<LoveGift[]>([
    {
      id: 1,
      color: 'from-amber-200 to-yellow-300',
      boxColor: 'bg-[#FFEAA7] border-amber-300',
      ribbonColor: 'bg-rose-400',
      badge: 'Golden Voucher 🎟️',
      title: 'Midnight Food & Long Drive Escapade',
      description: 'Redeemable anytime Bitu craves ice cream, maggi, or a late-night peaceful drive to clear her mind. Bee will be ready in 5 mins flat!',
      perk: 'Valid: 24/7, 365 Days • Non-negotiable yes from Bee',
      isOpened: false,
    },
    {
      id: 2,
      color: 'from-pink-200 to-rose-300',
      boxColor: 'bg-[#FFD1DC] border-pink-300',
      ribbonColor: 'bg-amber-400',
      badge: 'Cuddle Pass 🧸',
      title: 'Unlimited Forehead Kisses & Cozy Hugs',
      description: 'Guarantees the warmest bear hugs, forehead kisses, and gentle back rubs whenever Bitu is tired, sad, grumpy, or just wants extra pampering.',
      perk: 'Lifetime Validity • Infinite redemptions',
      isOpened: false,
    },
    {
      id: 3,
      color: 'from-purple-200 to-indigo-300',
      boxColor: 'bg-[#DCD0FF] border-purple-300',
      ribbonColor: 'bg-emerald-400',
      badge: 'King’s Surrender 👑',
      title: 'The "Bitu Is Always Right" 24h Pass',
      description: 'Bee forfeits all rights to argue or defend his silly jokes for an entire day. Bitu chooses the movies, songs, food, and decisions!',
      perk: 'Ultra Rare • Handle with mischievous power',
      isOpened: false,
    },
  ]);

  const handleOpenGift = (id: number) => {
    sounds.playChime();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fbbf24', '#c084fc', '#34d399'],
    });

    setGifts((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isOpened: true } : g))
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#FFF9F5] border-2 border-pink-200 rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
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

          {/* Modal Header */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-600 mb-2">
              <Gift size={14} /> Bee's Birthday Gift Stash
            </span>
            <h3 className="text-2xl font-bold text-pink-900 font-display">
              Unwrap Your Birthday Surprises! 🎁
            </h3>
            <p className="text-sm text-pink-700/80 mt-1">
              Tap each gift box to untie the ribbon and claim your vouchers!
            </p>
          </div>

          {/* 3 Gift Cards */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {gifts.map((gift) => (
              <motion.div
                key={gift.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => !gift.isOpened && handleOpenGift(gift.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  gift.isOpened
                    ? 'bg-white border-pink-200 shadow-md'
                    : `${gift.boxColor} border-dashed hover:shadow-lg hover:border-pink-400`
                }`}
              >
                {!gift.isOpened ? (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-2xl">
                        🎁
                      </div>
                      <div>
                        <h4 className="font-semibold text-pink-950 font-cute text-base">
                          Gift Box #{gift.id}
                        </h4>
                        <p className="text-xs text-pink-700">
                          Tap to untie ribbon & reveal voucher! ✨
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-pink-500 text-white text-xs font-medium rounded-full shadow-sm animate-pulse">
                      Open Me!
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        {gift.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 size={13} /> Unlocked
                      </span>
                    </div>
                    <h4 className="font-bold text-pink-950 text-base mb-1">
                      {gift.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-relaxed">
                      {gift.description}
                    </p>
                    <div className="text-[11px] font-medium text-pink-600 bg-pink-50 p-2 rounded-xl flex items-center gap-1.5">
                      <Heart size={12} className="text-pink-500 fill-pink-500 shrink-0" />
                      <span>{gift.perk}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-sm rounded-full shadow-md shadow-pink-300/40 transition-all"
            >
              Keep Vouchers in Heart 💕
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
