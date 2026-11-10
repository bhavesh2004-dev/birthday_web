import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CandleFlameOverlayProps {
  isLit: boolean;
  onBlow?: () => void;
}

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  vx: number;
  vy: number;
}

export const CandleFlameOverlay: React.FC<CandleFlameOverlayProps> = ({ isLit, onBlow }) => {
  const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([]);

  // 5 Candle flame coordinates precisely positioned on the 5 candle wicks of the cake
  const candles = [
    { id: 0, x: 37.5, y: 29.5, delay: 0.0, scale: 0.95 },
    { id: 1, x: 43.8, y: 26.5, delay: 0.18, scale: 1.0 },
    { id: 2, x: 50.0, y: 24.2, delay: 0.06, scale: 1.08 },
    { id: 3, x: 56.2, y: 26.5, delay: 0.24, scale: 1.0 },
    { id: 4, x: 62.5, y: 29.5, delay: 0.12, scale: 0.95 },
  ];

  // Spawn realistic smoke plumes when blown
  useEffect(() => {
    if (!isLit) {
      const newParticles: SmokeParticle[] = [];
      let pid = 0;

      candles.forEach((c) => {
        for (let i = 0; i < 7; i++) {
          newParticles.push({
            id: pid++,
            x: c.x + (Math.random() - 0.5) * 2,
            y: c.y - 1,
            scale: 0.5 + Math.random() * 0.6,
            opacity: 0.85,
            vx: (Math.random() - 0.5) * 0.7,
            vy: -0.9 - Math.random() * 1.3,
          });
        }
      });

      setSmokeParticles(newParticles);

      const interval = setInterval(() => {
        setSmokeParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx + Math.sin(p.y * 0.12) * 0.4,
              y: p.y + p.vy,
              scale: p.scale * 1.045,
              opacity: p.opacity - 0.024,
            }))
            .filter((p) => p.opacity > 0)
        );
      }, 40);

      const timer = setTimeout(() => {
        clearInterval(interval);
        setSmokeParticles([]);
      }, 2800);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setSmokeParticles([]);
    }
  }, [isLit]);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-20"
      onClick={onBlow}
    >
      {/* 1. Global Ambient Candlelight Aura: Bathes top cake tier in warm golden glow */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.75, 0.95, 0.72, 0.92, 0.75],
              scale: [0.98, 1.03, 0.97, 1.02, 0.98],
            }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.4 } }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 w-72 sm:w-88 h-44 rounded-full blur-2xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(254, 215, 170, 0.8) 0%, rgba(251, 146, 60, 0.35) 45%, rgba(254, 240, 138, 0) 75%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. Realistic 5 Candle Flame SVG Overlays with natural flicker & glowing aura */}
      <AnimatePresence>
        {isLit && (
          <>
            {candles.map((candle) => (
              <div
                key={candle.id}
                className="absolute flex flex-col items-center pointer-events-auto cursor-pointer"
                style={{
                  left: `${candle.x}%`,
                  top: `${candle.y}%`,
                  transform: 'translate(-50%, -100%)',
                }}
                onClick={onBlow}
                title="Tap to blow out candle! 🎂"
              >
                {/* Organic Flame Flickering & Dancing Motion */}
                <motion.div
                  animate={{
                    scaleY: [1, 1.14, 0.94, 1.1, 1],
                    scaleX: [1, 0.92, 1.06, 0.95, 1],
                    skewX: [-1.8, 2.2, -1.6, 1.8, -1.8],
                    y: [0, -1.2, 0.5, -0.8, 0],
                    filter: [
                      'drop-shadow(0 0 10px rgba(255,160,20,0.85)) drop-shadow(0 0 20px rgba(255,120,0,0.45))',
                      'drop-shadow(0 0 14px rgba(255,180,30,0.95)) drop-shadow(0 0 26px rgba(255,140,10,0.55))',
                      'drop-shadow(0 0 9px rgba(255,150,15,0.8)) drop-shadow(0 0 18px rgba(255,110,0,0.4))',
                      'drop-shadow(0 0 12px rgba(255,175,25,0.9)) drop-shadow(0 0 24px rgba(255,130,5,0.5))',
                      'drop-shadow(0 0 10px rgba(255,160,20,0.85)) drop-shadow(0 0 20px rgba(255,120,0,0.45))',
                    ],
                  }}
                  transition={{
                    duration: 0.65 + candle.delay * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: 'bottom center' }}
                  className="relative flex items-center justify-center"
                >
                  {/* High Fidelity SVG Teardrop Flame */}
                  <svg
                    width="26"
                    height="42"
                    viewBox="0 0 26 42"
                    className="overflow-visible"
                    style={{
                      transform: `scale(${candle.scale})`,
                      transformOrigin: 'bottom center',
                    }}
                  >
                    <defs>
                      {/* Outer Flame Gradient: deep vermilion to fiery amber to yellow */}
                      <linearGradient id={`flameOuter-${candle.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#EA580C" stopOpacity="0.95" />
                        <stop offset="35%" stopColor="#F97316" />
                        <stop offset="70%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.98" />
                      </linearGradient>

                      {/* Inner Hot Core: warm amber through brilliant lemon to pure white */}
                      <linearGradient id={`flameInner-${candle.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="35%" stopColor="#FEF08A" />
                        <stop offset="80%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                      </linearGradient>

                      {/* Blue Oxygen Base */}
                      <radialGradient id={`flameBase-${candle.id}`} cx="50%" cy="80%" r="50%">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Radiant Golden Glow Aura behind flame */}
                    <circle cx="13" cy="20" r="13" fill="#FBBF24" opacity="0.32" className="blur-xs" />

                    {/* Realistic Outer Flame Teardrop Silhouette */}
                    <path
                      d="M 13 2 C 10.8 9.5 4.5 18 4.5 25.5 C 4.5 31.8 8.4 36.5 13 36.5 C 17.6 36.5 21.5 31.8 21.5 25.5 C 21.5 18 15.2 9.5 13 2 Z"
                      fill={`url(#flameOuter-${candle.id})`}
                    />

                    {/* Inner White-Hot Luminous Core Teardrop */}
                    <path
                      d="M 13 11 C 11.6 15.5 8 21 8 26.5 C 8 30.5 10.2 34 13 34 C 15.8 34 18 30.5 18 26.5 C 18 21 14.4 15.5 13 11 Z"
                      fill={`url(#flameInner-${candle.id})`}
                    />

                    {/* Ethereal Blue Flame Base */}
                    <ellipse cx="13" cy="34" rx="4.5" ry="2.2" fill={`url(#flameBase-${candle.id})`} />

                    {/* Delicate Dark Wick */}
                    <path d="M 13 33 L 13 40" stroke="#241426" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </motion.div>
              </div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* 3. Realistic Rising White Smoke Wisps when blown out */}
      {smokeParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none bg-gradient-to-t from-gray-400 via-gray-200 to-transparent blur-[1.5px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${14 * p.scale}px`,
            height: `${14 * p.scale}px`,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
