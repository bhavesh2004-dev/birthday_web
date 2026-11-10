import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../utils/soundEffects';

interface MetallicBalloonProps {
  digit: string | number;
  side: 'left' | 'right';
  className?: string;
}

export const MetallicBalloon: React.FC<MetallicBalloonProps> = ({
  digit,
  side,
  className = '',
}) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const handleTap = () => {
    sounds.playPop();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 700);
  };

  const digitStr = digit.toString();
  const isTwo = digitStr === '2';
  const isThree = digitStr === '3';

  // Exact 3D photorealistic foil balloon assets
  let balloonSrc = '';
  if (isTwo) {
    balloonSrc = side === 'left' ? '/assets/balloon_left_2.png' : '/assets/balloon_right_2.png';
  } else if (isThree) {
    balloonSrc = '/assets/balloon_right_3.png';
  }

  return (
    <motion.div
      className={`relative select-none cursor-pointer flex flex-col items-center group ${className}`}
      onClick={handleTap}
      animate={
        isBouncing
          ? { scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, -8, 8, -4, 0] }
          : {
              y: side === 'left' ? [0, -16, 0] : [-8, 8, -8],
              rotate: side === 'left' ? [-3, 3, -3] : [3, -3, 3],
            }
      }
      transition={
        isBouncing
          ? { duration: 0.65 }
          : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
      }
      whileHover={{ scale: 1.08 }}
      title="Tap balloon! 🎈"
    >
      <div className="relative w-16 h-24 xs:w-20 xs:h-30 sm:w-36 sm:h-52 md:w-48 md:h-64 flex items-center justify-center">
        {/* Soft shadow underneath floating balloon */}
        <div className="absolute -bottom-6 w-24 sm:w-32 h-6 bg-pink-400/25 blur-xl rounded-full" />

        {balloonSrc ? (
          /* Exact Photorealistic 3D Metallic Foil Balloon Image */
          <img
            src={balloonSrc}
            alt={`Foil Balloon ${digit}`}
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(236,72,153,0.35)] select-none pointer-events-none"
            draggable={false}
          />
        ) : (
          /* Fallback for other digits */
          <div className="relative text-7xl sm:text-8xl md:text-9xl font-serif font-black tracking-tighter select-none flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(236,72,153,0.35)]">
            <span
              className="block select-none"
              style={{
                background:
                  'linear-gradient(135deg, #FFF0F5 0%, #FFB6C1 20%, #F472B6 40%, #DB2777 65%, #BE185D 85%, #FFD1DC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {digit}
            </span>
          </div>
        )}

        {/* Delicate trailing ribbon */}
        <svg
          className="absolute top-[94%] w-6 h-16 sm:h-24 text-pink-300 opacity-60 pointer-events-none"
          viewBox="0 0 24 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12,0 Q7,25 16,50 T11,100" />
        </svg>
      </div>
    </motion.div>
  );
};
