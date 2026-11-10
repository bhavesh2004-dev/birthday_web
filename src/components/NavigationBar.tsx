import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cake, BookOpen, Heart, Mail, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavigationBarProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  isUnlocked: boolean;
  isModalOpen?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentStage,
  onSelectStage,
  isUnlocked,
  isModalOpen = false,
}) => {
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sounds.getIsMuted());
    setIsBgmPlaying(sounds.getIsBgmPlaying());

    const syncInterval = setInterval(() => {
      setIsBgmPlaying(sounds.getIsBgmPlaying());
      setIsMuted(sounds.getIsMuted());
    }, 1000);

    return () => clearInterval(syncInterval);
  }, []);

  const handleToggleVolume = () => {
    sounds.playPop();
    const nextMuted = !isMuted;
    sounds.setMuted(nextMuted);
    setIsMuted(nextMuted);
    setIsBgmPlaying(sounds.getIsBgmPlaying());
  };

  const navItems = [
    { stage: 1, label: '3D Cake', icon: Cake },
    { stage: 2, label: 'Birthday Letter', icon: Mail },
    { stage: 3, label: 'Love Quiz', icon: Heart },
    { stage: 4, label: 'Our Memories', icon: BookOpen },
  ];

  return (
    <>
      {/* Top Floating Volume Control (Clean Volume Icon Only - hidden when modal/video is open) */}
      {!isModalOpen && (
        <div className="fixed top-3 sm:top-4 right-3 sm:right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleToggleVolume}
            className={`p-2.5 sm:p-3 rounded-full backdrop-blur-md shadow-md border transition-all cursor-pointer flex items-center justify-center ${
              isMuted
                ? 'bg-white/85 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-white'
                : 'bg-white/95 border-pink-200 text-pink-600 hover:text-rose-600 hover:bg-pink-50 shadow-pink-200/50'
            }`}
            title={isMuted ? 'Turn Sound On 🎵' : 'Mute Sound 🔇'}
          >
            {isMuted ? (
              <VolumeX size={18} />
            ) : (
              <div className="relative flex items-center justify-center">
                <Volume2 size={18} className="text-pink-600" />
                {isBgmPlaying && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                )}
              </div>
            )}
          </motion.button>
        </div>
      )}

      {/* Bottom Floating Navigation Pill (Visible when unlocked and not in video or full modal) */}
      {isUnlocked && !isModalOpen && (
        <div className="fixed bottom-3 sm:bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-xl shadow-pink-200/40 max-w-full overflow-x-auto"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentStage === item.stage;

              return (
                <button
                  key={item.stage}
                  onClick={() => {
                    sounds.playPop();
                    onSelectStage(item.stage);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-pink-300/50'
                      : 'text-pink-800 hover:bg-pink-100/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-pink-500'} />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      )}
    </>
  );
};
