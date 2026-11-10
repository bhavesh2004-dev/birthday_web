import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface HeartIntroProps {
  onComplete: () => void;
}

type IntroPhase = 'ready' | 'shooting' | 'impact' | 'celebration';

export const HeartIntro: React.FC<HeartIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<IntroPhase>('ready');
  const heartRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const [targetDelta, setTargetDelta] = useState<{ x: number; y: number }>({ x: 260, y: -260 });

  // Recurring celebratory firecrackers in background during Celebration Phase
  useEffect(() => {
    if (phase !== 'celebration') return;

    const firecrackerInterval = setInterval(() => {
      // Firecracker burst from random spot in upper screen
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.12 + Math.random() * 0.45;
      confetti({
        particleCount: 38,
        startVelocity: 28,
        spread: 360,
        ticks: 55,
        origin: { x, y },
        colors: ['#FFD700', '#FF3E6C', '#FF85A2', '#FFA500', '#FFFFFF', '#FF5722'],
        shapes: ['circle', 'star'],
        gravity: 0.85,
        scalar: 1.15,
      });
    }, 700);

    return () => clearInterval(firecrackerInterval);
  }, [phase]);

  // Trigger Cupid's Arrow Shoot
  const handleShoot = () => {
    if (phase !== 'ready') return;

    // Calculate dynamic flight vector from arrow to center heart
    if (heartRef.current && arrowRef.current) {
      const hRect = heartRef.current.getBoundingClientRect();
      const aRect = arrowRef.current.getBoundingClientRect();
      const dx = (hRect.left + hRect.width / 2) - (aRect.left + aRect.width / 2);
      const dy = (hRect.top + hRect.height / 2) - (aRect.top + aRect.height / 2);
      setTargetDelta({ x: dx, y: dy });
    }

    // 1. Release arrow
    sounds.playSparkle();
    setPhase('shooting');

    // 2. Flight time until arrow strikes center heart
    setTimeout(() => {
      setPhase('impact');
      sounds.playChime();
      sounds.startBgm(); // Starts Dilruba Dilnasheen at celebration impact

      // Fiery Heart Pop sparks explosion
      confetti({
        particleCount: 100,
        spread: 130,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FF2E63', '#FF9F45', '#FFE15D', '#FF6B6B', '#FFFFFF', '#FFD700', '#FF5722'],
        shapes: ['circle', 'star'],
        startVelocity: 36,
      });

      // 3. Transition to Celebration Stage with "Happy Birthday Bitu ❤️"
      setTimeout(() => {
        setPhase('celebration');
        sounds.playFanfare();

        // Big dual firecracker cannons
        confetti({
          particleCount: 65,
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.65 },
          colors: ['#FF4D8D', '#FFD700', '#FF85A2', '#FF6347'],
        });
        confetti({
          particleCount: 65,
          angle: 120,
          spread: 65,
          origin: { x: 1, y: 0.65 },
          colors: ['#FF4D8D', '#FFD700', '#FF85A2', '#FF6347'],
        });
      }, 550);
    }, 420);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden select-none transition-colors duration-700">
      {/* Background Atmosphere */}
      {phase !== 'celebration' ? (
        /* Phase 1 & 2: Pure, soft romantic glowing backdrop */
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F7] via-[#FFEAF0] to-[#FFDDE6]">
          {/* Glowing Center Radial Aura behind Heart */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full bg-rose-400/25 blur-3xl pointer-events-none animate-pulse" />
          
          {/* Gentle Floating Sparkles */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <span className="absolute top-[22%] left-[28%] text-rose-400 text-sm animate-ping">✨</span>
            <span className="absolute top-[35%] right-[26%] text-pink-400 text-xs animate-pulse">💖</span>
            <span className="absolute bottom-[30%] left-[34%] text-rose-300 text-sm animate-bounce">🌸</span>
            <span className="absolute top-[28%] left-[70%] text-rose-400 text-sm animate-ping">✨</span>
          </div>
        </div>
      ) : (
        /* Phase 3: Vibrant Birthday Celebration Pink Backdrop with Firecrackers */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-br from-[#FF3366] via-[#FF4D8D] to-[#FF758F]"
        >
          {/* Background Ambient Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-900/30 blur-3xl" />
        </motion.div>
      )}

      {/* Fiery Heart Pop Explosion on Impact */}
      <AnimatePresence>
        {phase === 'impact' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0.9, 0], scale: [0.2, 1.9, 3.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.58, ease: 'easeOut' }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            {/* Fiery Corona Ring */}
            <div
              className="w-[130vw] h-[130vh] rounded-full"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(255, 235, 130, 0.95) 22%, rgba(255, 95, 45, 0.85) 45%, rgba(225, 29, 72, 0.6) 65%, transparent 75%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 1 & 2: Center Beating Heart & Pure Dhanush / Arrow */}
      {phase !== 'celebration' && (
        <div className="relative z-20 w-full max-w-4xl h-full flex flex-col items-center justify-between py-12 px-6">
          {/* Spacer */}
          <div className="h-6" />

          {/* Center Beating 3D Glossy Heart */}
          <div ref={heartRef} className="relative my-auto flex flex-col items-center justify-center">
            <motion.div
              animate={
                phase === 'ready'
                  ? {
                      scale: [1, 1.15, 1.03, 1.2, 1],
                      transition: {
                        repeat: Infinity,
                        duration: 1.25,
                        ease: 'easeInOut',
                      },
                    }
                  : phase === 'shooting'
                  ? { scale: [1, 1.15, 1] }
                  : { scale: [1.2, 1.5, 0], opacity: [1, 1, 0] }
              }
              className="relative cursor-pointer"
              onClick={handleShoot}
            >
              {/* Soft Pulsing Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-rose-500/25 blur-3xl -z-10" />

              {/* 3D Glossy Heart SVG */}
              <svg
                viewBox="0 0 100 95"
                className="w-40 h-40 sm:w-52 sm:h-52 drop-shadow-[0_15px_30px_rgba(244,63,94,0.45)]"
              >
                <defs>
                  {/* Glossy 3D Gradient */}
                  <radialGradient id="heart3DGrad" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#FFAEC8" />
                    <stop offset="35%" stopColor="#FF4D8D" />
                    <stop offset="80%" stopColor="#E60067" />
                    <stop offset="100%" stopColor="#A80044" />
                  </radialGradient>
                  {/* Specular Highlight */}
                  <radialGradient id="heartHighlight" cx="30%" cy="25%" r="35%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Heart Base Shape */}
                <path
                  d="M 50,28 
                     C 50,15 35,5 22,5 
                     C 10,5 0,16 0,30 
                     C 0,55 35,78 50,92 
                     C 65,78 100,55 100,30 
                     C 100,16 90,5 78,5 
                     C 65,5 50,15 50,28 Z"
                  fill="url(#heart3DGrad)"
                />

                {/* 3D Curved Specular Reflection */}
                <ellipse
                  cx="28"
                  cy="25"
                  rx="14"
                  ry="9"
                  fill="url(#heartHighlight)"
                  transform="rotate(-28 28 25)"
                />
              </svg>
            </motion.div>
          </div>

          {/* Bottom-Left Pure Dhanush & Arrow (No White Box, Clean Line Art) */}
          <div className="w-full flex items-center justify-start px-6 sm:px-16">
            <motion.div
              ref={arrowRef}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShoot}
              className="relative cursor-pointer transition-transform"
              style={{ filter: 'drop-shadow(0 4px 14px rgba(225, 29, 72, 0.25))' }}
              title="Click to shoot!"
            >
              {/* Dhanush (Bow) & Arrow SVG */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
                  {/* Dhanush Bow Curved Stave */}
                  <path
                    d="M 28,118 C 50,96 50,44 28,22"
                    fill="none"
                    stroke="#2E1C14"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  {/* Bow Tips Gold Accents */}
                  <circle cx="28" cy="22" r="3.2" fill="#D97706" />
                  <circle cx="28" cy="118" r="3.2" fill="#D97706" />

                  {/* Bowstring */}
                  <path
                    d="M 28,22 L 40,70 L 28,118"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.8"
                    strokeDasharray="2 1"
                  />
                </svg>

                {/* Flying Arrow */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={
                    phase === 'shooting'
                      ? {
                          x: [0, targetDelta.x * 0.5, targetDelta.x],
                          y: [0, targetDelta.y * 0.5, targetDelta.y],
                          scale: [1, 1.25, 1.3],
                          opacity: [1, 1, 0],
                          transition: { duration: 0.42, ease: 'easeIn' },
                        }
                      : {}
                  }
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-24 h-24 sm:w-32 sm:h-32 -rotate-45"
                  >
                    {/* Arrow Shaft */}
                    <line
                      x1="16"
                      y1="50"
                      x2="84"
                      y2="50"
                      stroke="#1F1610"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />

                    {/* Arrow Heart Tip */}
                    <path
                      d="M 84,50 L 70,41 L 73,50 L 70,59 Z"
                      fill="#E11D48"
                    />

                    {/* Arrow Fletchings */}
                    <path
                      d="M 20,50 L 12,40 M 26,50 L 18,40 M 20,50 L 12,60 M 26,50 L 18,60"
                      stroke="#332219"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* PHASE 3: Birthday Celebration Stage (Happy Birthday, Firecrackers & User's Quote) */}
      {phase === 'celebration' && (
        <div className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-8 text-center">
          {/* Center Main Birthday Wish Headline & Quote */}
          <div className="my-auto z-20 max-w-2xl flex flex-col items-center px-2">
            {/* Animated Big 3D Heart with Glow */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [1, 1.15, 1], rotate: 0 }}
              transition={{
                scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                default: { type: 'spring', damping: 12, stiffness: 120 },
              }}
              className="text-6xl sm:text-7xl mb-4 drop-shadow-2xl"
            >
              💖
            </motion.div>

            {/* Main Happy Birthday Headline */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black font-display text-white tracking-tight leading-tight drop-shadow-lg mb-6"
            >
              Happy Birthday <br />
              <span className="text-pink-100 font-cute drop-shadow-md">
                Bitu ❤️🎂
              </span>
            </motion.h1>

            {/* User's Exact Requested Heartfelt Quote */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="max-w-xl mx-auto p-5 sm:p-6 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl text-center"
            >
              <p className="text-base sm:text-lg md:text-xl font-cute text-white leading-relaxed tracking-wide drop-shadow-sm font-semibold">
                “Happiest Birthday, Bitu, my favourite person! ❤️🎂 Keep shining, keep growing, and keep smiling. No matter what, Bee will always be there for you. I love you so much, my Bitu. 🧿❤️”
              </p>
            </motion.div>
          </div>

          {/* Clean Bottom Action Button to Enter Password Gate (No Subtitle / Key Icon) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="z-20 mt-6 mb-8 flex flex-col items-center"
          >
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 20px 35px rgba(0,0,0,0.25)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sounds.playChime();
                onComplete();
              }}
              className="px-8 sm:px-12 py-4 sm:py-4.5 rounded-full bg-white text-rose-600 hover:text-rose-700 font-extrabold text-base sm:text-lg shadow-2xl flex items-center gap-3 transition-all cursor-pointer group"
            >
              <span>Enter Birthday Portal 🎁🔐</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
