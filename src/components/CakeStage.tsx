import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MetallicBalloon } from './MetallicBalloon';
import { CandleFlameOverlay } from './CandleFlameOverlay';
import { sounds } from '../utils/soundEffects';

interface CakeStageProps {
  onGoToLetter: () => void;
}

export const CakeStage: React.FC<CakeStageProps> = ({ onGoToLetter }) => {
  // Age locked strictly to 22 (no +/- buttons)
  const age = 22;
  const [isCandlesLit, setIsCandlesLit] = useState(true);
  const [showHugScene, setShowHugScene] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleBlowCandles = () => {
    if (!isCandlesLit) {
      // Relight
      sounds.playChime();
      setIsCandlesLit(true);
      setShowHugScene(false);
      return;
    }

    // Play gentle blow sound
    sounds.playBlow();
    setIsCandlesLit(false);

    // Multi-stage celebratory confetti explosion
    setTimeout(() => {
      sounds.playFanfare();
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#f472b6', '#fbbf24', '#c084fc', '#38bdf8', '#34d399', '#f43f5e'],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 85,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ['#ec4899', '#fde047', '#a855f7'],
      });
      confetti({
        particleCount: 85,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ['#ec4899', '#fde047', '#a855f7'],
      });
    }, 550);

    // Show the big Hug GIF screen in front!
    setTimeout(() => {
      setShowHugScene(true);
    }, 600);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-3 sm:px-6 py-6 sm:py-8 bg-transparent overflow-hidden select-none z-10">
      {/* 1. DREAMY ROMANTIC BACKGROUND AMBIANCE LIGHTS */}
      {/* Warm Golden-Pink Light Pool Centered on Cake */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] rounded-full bg-gradient-to-r from-pink-300/25 via-rose-200/30 to-amber-200/25 blur-3xl pointer-events-none -z-10" />

      {/* 2. FESTIVE HANGING FAIRY LIGHT BUNTING STRINGS ACROSS TOP CORNERS */}
      <div className="absolute top-0 inset-x-0 h-24 pointer-events-none z-20 overflow-hidden flex justify-between px-2 sm:px-8">
        {/* Left Fairy Light Arc */}
        <div className="relative w-48 sm:w-80 md:w-96 h-20">
          <svg className="w-full h-full text-amber-300/60" viewBox="0 0 300 70" fill="none">
            <path d="M 0 5 Q 150 65 300 15" stroke="rgba(245, 190, 160, 0.45)" strokeWidth="1.5" />
          </svg>
          {/* Glowing Fairy Bulbs */}
          {[
            { left: '15%', top: '26px', delay: '0s' },
            { left: '35%', top: '44px', delay: '0.4s' },
            { left: '55%', top: '48px', delay: '0.8s' },
            { left: '75%', top: '38px', delay: '0.2s' },
            { left: '92%', top: '22px', delay: '0.6s' },
          ].map((bulb, idx) => (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: bulb.left, top: bulb.top }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full bg-amber-200 shadow-[0_0_12px_#fbbf24] animate-pulse"
                style={{ animationDelay: bulb.delay, animationDuration: '2.4s' }}
              />
            </div>
          ))}
        </div>

        {/* Right Fairy Light Arc */}
        <div className="relative w-48 sm:w-80 md:w-96 h-20">
          <svg className="w-full h-full text-amber-300/60" viewBox="0 0 300 70" fill="none">
            <path d="M 0 15 Q 150 65 300 5" stroke="rgba(245, 190, 160, 0.45)" strokeWidth="1.5" />
          </svg>
          {/* Glowing Fairy Bulbs */}
          {[
            { left: '8%', top: '22px', delay: '0.5s' },
            { left: '25%', top: '38px', delay: '0.1s' },
            { left: '45%', top: '48px', delay: '0.7s' },
            { left: '65%', top: '44px', delay: '0.3s' },
            { left: '85%', top: '26px', delay: '0.9s' },
          ].map((bulb, idx) => (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: bulb.left, top: bulb.top }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full bg-amber-200 shadow-[0_0_12px_#fbbf24] animate-pulse"
                style={{ animationDelay: bulb.delay, animationDuration: '2.4s' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. TOP CENTER: Clean 22nd Birthday Celebration Badge */}
      <div
        className={`flex flex-col items-center space-y-1.5 z-20 transition-all duration-700 ${
          showHugScene ? 'opacity-20 blur-[1px]' : 'opacity-100'
        }`}
      >
        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#f3e5d8] shadow-[0_6px_25px_rgba(220,170,160,0.22)] ring-2 ring-pink-100"
        >
          <span className="text-sm sm:text-base font-serif font-semibold text-[#2d1e2f] tracking-wide">
            Turning
          </span>
          <span className="font-serif font-black text-2xl sm:text-3xl text-[#2d1e2f] tracking-tight">
            {age}
          </span>
          <span className="text-xl">🎂</span>
        </motion.div>

        {/* Sweet Birthday Tagline */}
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm font-handwriting text-pink-700 font-bold text-center drop-shadow-xs"
        >
          22 years of you, and I'm so lucky to be part of your story. ❤️
        </motion.p>
      </div>

      {/* 4. MAIN CENTER STAGE: Cake & Balloons Unified Composition */}
      <div
        className={`relative w-full max-w-4xl flex-1 flex items-center justify-center px-2 my-1 sm:my-2 z-10 transition-all duration-700 ${
          showHugScene ? 'opacity-15 blur-[2px] scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 xs:gap-3 sm:gap-6 md:gap-10 lg:gap-14 w-full">
          {/* Left 3D Metallic Foil Balloon: 2 */}
          <div className="shrink-0 z-20 pointer-events-auto">
            <MetallicBalloon digit={2} side="left" />
          </div>

          {/* Center: The Seamlessly Blended Looping Cake Video */}
          <div className="relative w-full max-w-[200px] xs:max-w-[240px] sm:max-w-[360px] md:max-w-[420px] aspect-square flex items-center justify-center shrink-0">
            {/* Ambient Warm Candlelight & Pink Light Aura */}
            <div className="absolute inset-0 bg-radial from-pink-300/35 via-rose-200/20 to-transparent blur-2xl rounded-full pointer-events-none scale-105" />

            {/* Cake Video with Radial Edge Mask for 100% Seamless Blend */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                maskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 46%, rgba(0,0,0,0.8) 60%, transparent 78%)',
                WebkitMaskImage: 'radial-gradient(ellipse 68% 68% at 50% 50%, black 46%, rgba(0,0,0,0.8) 60%, transparent 78%)',
              }}
            >
              <video
                ref={videoRef}
                src="/assets/cake-loop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain pointer-events-none select-none mix-blend-multiply"
              />
            </div>

            {/* Interactive Candle Flames & Extinguish Smoke */}
            <CandleFlameOverlay
              isLit={isCandlesLit}
              onBlow={handleBlowCandles}
            />
          </div>

          {/* Right 3D Metallic Foil Balloon: 2 */}
          <div className="shrink-0 z-20 pointer-events-auto">
            <MetallicBalloon digit={2} side="right" />
          </div>
        </div>
      </div>

      {/* 5. BIG SCREEN HUG GIF SCENE: Appears in front with high opacity when candles are blown! */}
      <AnimatePresence>
        {showHugScene && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-[#FFF1E8]/88 backdrop-blur-sm select-none"
          >
            {/* Top Glowing Romantic Title */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-pink-950 font-display mb-3 sm:mb-4 tracking-tight drop-shadow-sm flex items-center gap-2 text-center"
            >
              <span>Happy Birthday Bitu</span>
              <span className="text-red-500 animate-pulse">❤️</span>
            </motion.h2>

            {/* Big Screen Hug GIF with crisp border & shadow */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-72 sm:w-96 md:w-[440px] max-w-[90vw] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white shadow-pink-300/40"
            >
              <img
                src="/assets/hugs.gif"
                alt="Happy Birthday Bittu - Big Warm Hug"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Romantic Sweet Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-sm sm:text-base font-handwriting text-pink-700 font-bold mt-3 sm:mt-4 text-center max-w-md"
            >
              The biggest, warmest and tightest birthday hug from your Bee 🐝🫂💖
            </motion.p>

            {/* The Birthday Letter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sounds.playChime();
                onGoToLetter();
              }}
              className="mt-6 sm:mt-8 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-300/50 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Read Your Birthday Letter 💌</span>
              <ArrowRight size={18} />
            </motion.button>

            {/* Relight button if she wants to experience it again */}
           
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. BLOW CANDLES BUTTON (Positioned cleanly above bottom navigation bar) */}
      {!showHugScene && (
        <div className="flex flex-col items-center gap-2 z-20 mb-20 sm:mb-24 md:mb-28">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBlowCandles}
            className={`px-5 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-base max-w-[92vw] text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCandlesLit
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-[0_0_35px_rgba(244,114,182,0.65)] hover:shadow-[0_0_45px_rgba(244,114,182,0.85)] ring-4 ring-pink-200/90'
                : 'bg-amber-100 text-amber-900 border-2 border-amber-300 hover:bg-amber-200 shadow-md'
            }`}
          >
            {isCandlesLit ? (
              <>
                <Flame size={20} className="text-yellow-200 animate-pulse fill-yellow-200" />
                <span>Blow Out the Candles & Make a Wish! 🎂💨</span>
              </>
            ) : (
              <span>Candles Blown! (Tap to Relight 🔥)</span>
            )}
          </motion.button>
        </div>
      )}

      {/* 7. CORNER DECORATIONS (Pure static images) */}
      {/* Bottom-Left: 3 Stacked Pastel Gift Boxes */}
      <div
        className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-8 z-20 pointer-events-none select-none transition-opacity duration-500 ${
          showHugScene ? 'opacity-30' : 'opacity-90'
        }`}
      >
        <div className="relative w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center">
          <img
            src="/assets/gift_stack.png"
            alt="Gift Box"
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(200,150,170,0.25)] animate-float-slow"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom-Right: Glowing Fairy Star Jar */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 pointer-events-none select-none transition-opacity duration-500 ${
          showHugScene ? 'opacity-30' : 'opacity-90'
        }`}
      >
        <div className="relative w-14 h-20 sm:w-18 sm:h-24 flex items-center justify-center">
          <img
            src="/assets/star_jar.png"
            alt="Star Jar"
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(250,200,100,0.3)] animate-float-reverse"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};
