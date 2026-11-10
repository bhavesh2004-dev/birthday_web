import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FloatingHearts } from './components/FloatingHearts';
import { HeartIntro } from './components/HeartIntro';
import { PasswordGate } from './components/PasswordGate';
import { CakeStage } from './components/CakeStage';
import { LoveLetter } from './components/LoveLetter';
import { LoveQuiz } from './components/LoveQuiz';
import { JourneyMemories } from './components/JourneyMemories';
import { NavigationBar } from './components/NavigationBar';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentStage, setCurrentStage] = useState(1); // 1: Cake, 2: Letter, 3: Love Quiz, 4: Memories
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setCurrentStage(1);
    // Start gentle romantic BGM on first interaction
    setTimeout(() => {
      sounds.startBgm();
    }, 400);
  };

  const handleSelectStage = (stage: number) => {
    setIsModalOpen(false);
    setCurrentStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFF6F0] via-[#FDF0EE] to-[#FCE7F0] text-[#433240] overflow-x-hidden pb-20 sm:pb-24">
      {/* Background Floating Hearts, Stars & Particles */}
      <FloatingHearts />

      {/* Floating Audio Controls & Navigation Bar (hidden when video/modal is open) */}
      <NavigationBar
        currentStage={currentStage}
        onSelectStage={handleSelectStage}
        isUnlocked={isUnlocked}
        isModalOpen={isModalOpen}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!hasCompletedIntro ? (
            /* Stage -1: Beating Heart & Arrow Birthday Intro */
            <motion.div
              key="heart-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <HeartIntro onComplete={() => setHasCompletedIntro(true)} />
            </motion.div>
          ) : !isUnlocked ? (
            /* Stage 0: Password Gate */
            <motion.div
              key="password-gate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <PasswordGate onUnlock={handleUnlock} />
            </motion.div>
          ) : (
            /* Unlocked Experience */
            <motion.div
              key={`stage-${currentStage}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {currentStage === 1 && (
                <CakeStage onGoToLetter={() => handleSelectStage(2)} />
              )}
              {currentStage === 2 && (
                <LoveLetter onContinue={() => handleSelectStage(3)} />
              )}
              {currentStage === 3 && (
                <LoveQuiz onContinue={() => handleSelectStage(4)} />
              )}
              {currentStage === 4 && (
                <JourneyMemories
                  onContinue={() => handleSelectStage(1)}
                  onModalToggle={(open) => setIsModalOpen(open)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
