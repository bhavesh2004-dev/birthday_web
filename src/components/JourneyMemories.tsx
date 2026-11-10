import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  Upload,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Film,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MEMORY_CARDS, MemoryItem } from '../data/memoriesData';
import { sounds } from '../utils/soundEffects';

interface JourneyMemoriesProps {
  onContinue?: () => void;
  onModalToggle?: (isOpen: boolean) => void;
}

type CategoryFilter = 'all' | 'college' | 'love' | 'surat' | 'thick_thin' | 'birthday';

export const JourneyMemories: React.FC<JourneyMemoriesProps> = ({ onContinue, onModalToggle }) => {
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>('/assets/journey_video.mp4');
  const [videoError, setVideoError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isBgmMuted, setIsBgmMuted] = useState(sounds.getIsMuted());

  const videoModalRef = useRef<HTMLDivElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize custom user uploads from localStorage (only accept actual base64 data URLs)
  const [images, setImages] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    MEMORY_CARDS.forEach((m) => {
      const stored = localStorage.getItem(m.storageKey);
      if (stored && stored.startsWith('data:image')) saved[m.storageKey] = stored;
    });
    return saved;
  });

  // Filter memories according to chosen chapter
  const filteredMemories = activeCategory === 'all'
    ? MEMORY_CARDS
    : MEMORY_CARDS.filter((m) => m.category === activeCategory);

  const selectedMemory = selectedMemoryIndex !== null ? MEMORY_CARDS[selectedMemoryIndex] : null;

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMemoryIndex === null) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setSelectedMemoryIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemoryIndex]);

  // Synchronize modal state so App.tsx can hide the bottom navigation bar when any modal is open
  const isAnyModalActive = isVideoModalOpen || selectedMemoryIndex !== null || isPhotoManagerOpen;
  useEffect(() => {
    onModalToggle?.(isAnyModalActive);
  }, [isAnyModalActive, onModalToggle]);

  // Lock background scroll when video modal is open
  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVideoModalOpen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleOpenVideoModal = () => {
    sounds.playPop();
    setIsVideoModalOpen(true);
    setVideoError(false);
    setIsVideoPlaying(true);
    setTimeout(() => {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.play().catch(() => {});
      }
    }, 150);
  };

  const handleCloseVideoModal = () => {
    sounds.playPop();
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
    setIsVideoModalOpen(false);
    setIsVideoPlaying(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoModalRef.current?.requestFullscreen) {
        videoModalRef.current.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleRewind = (seconds = 10) => {
    sounds.playPop();
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = Math.max(0, videoPlayerRef.current.currentTime - seconds);
    }
  };

  const handleForward = (seconds = 10) => {
    sounds.playPop();
    if (videoPlayerRef.current) {
      const dur = videoPlayerRef.current.duration || 999999;
      videoPlayerRef.current.currentTime = Math.min(dur, videoPlayerRef.current.currentTime + seconds);
    }
  };

  const handleTogglePlayPause = () => {
    sounds.playPop();
    if (videoPlayerRef.current) {
      if (videoPlayerRef.current.paused) {
        videoPlayerRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      } else {
        videoPlayerRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleToggleBgmInVideo = () => {
    sounds.playPop();
    const next = !isBgmMuted;
    sounds.setMuted(next);
    setIsBgmMuted(next);
  };

  // Keyboard shortcut navigation for video player (←, →, Space)
  useEffect(() => {
    if (!isVideoModalOpen) return;
    const handleVideoKeys = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleRewind(10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleForward(10);
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleTogglePlayPause();
      }
    };
    window.addEventListener('keydown', handleVideoKeys);
    return () => window.removeEventListener('keydown', handleVideoKeys);
  }, [isVideoModalOpen, isVideoPlaying]);

  const handleSelectVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setVideoError(false);
      sounds.playSparkle();
    }
  };

  const handleNext = () => {
    if (selectedMemoryIndex === null) return;
    sounds.playPop();
    setSelectedMemoryIndex((selectedMemoryIndex + 1) % MEMORY_CARDS.length);
  };

  const handlePrev = () => {
    if (selectedMemoryIndex === null) return;
    sounds.playPop();
    setSelectedMemoryIndex((selectedMemoryIndex - 1 + MEMORY_CARDS.length) % MEMORY_CARDS.length);
  };

  const handleHeartReaction = () => {
    sounds.playSparkle();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#ec4899', '#fbbf24'],
    });
  };

  const handleImageUpload = (storageKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        try {
          localStorage.setItem(storageKey, base64);
          setImages((prev) => ({ ...prev, [storageKey]: base64 }));
          sounds.playSparkle();
        } catch {
          alert('Image size is too large for browser storage. Please select a smaller photo.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhotos = () => {
    if (!window.confirm('Reset all photos to original defaults?')) return;
    MEMORY_CARDS.forEach((m) => {
      localStorage.removeItem(m.storageKey);
    });
    setImages({});
    sounds.playPop();
  };

  const categories: { key: CategoryFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All Moments', count: MEMORY_CARDS.length },
    { key: 'college', label: 'College 1st Year', count: 7 },
    { key: 'love', label: 'When Love Began', count: 16 },
    { key: 'surat', label: 'Surat Days & Rides', count: 8 },
    { key: 'thick_thin', label: 'Thick & Thin', count: 7 },
    { key: 'birthday', label: '22nd Birthday & Forever', count: 10 },
  ];

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 md:px-8 z-10 flex flex-col justify-center max-w-7xl mx-auto select-none">
      {/* 1. Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl md:text-7xl font-handwriting font-bold tracking-wide"
          style={{
            color: '#FF4D8D',
            textShadow: '0 2px 14px rgba(255, 77, 141, 0.22)',
          }}
        >
          Our Beautiful Moments Together
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-3 text-sm sm:text-base text-[#6B5B6D] max-w-2xl mx-auto font-sans leading-relaxed"
        >
          Every moment spent with you has been magical. Let's cherish these precious memories ...
        </motion.p>

        {/* Counter Badge */}
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200 shadow-xs">
            <Sparkles size={13} className="text-pink-500" />
            <span>48 Cherished Memories of Bitu & Bee</span>
          </span>

          <button
            onClick={() => {
              sounds.playPop();
              setIsPhotoManagerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-pink-700 hover:bg-pink-50 border border-pink-200 shadow-xs transition-all cursor-pointer"
          >
            <Camera size={13} />
            <span>Personalize Photos</span>
          </button>
        </div>

        {/* 2. Chapter / Timeline Filter Pills */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  sounds.playPop();
                  setActiveCategory(cat.key);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-300/50 scale-105'
                    : 'bg-white/85 text-pink-800 hover:bg-pink-50 border border-pink-200/80 shadow-xs'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Three-in-a-Row Responsive Grid Layout (Clean Photo Cards without Mismatching Descriptions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 w-full">
        {filteredMemories.map((item, index) => {
          const currentImg = images[item.storageKey] || item.defaultImage;
          const globalIndex = MEMORY_CARDS.findIndex((m) => m.id === item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: (index % 3) * 0.08 }}
              onClick={() => {
                sounds.playPop();
                setSelectedMemoryIndex(globalIndex);
              }}
              className="bg-white rounded-3xl p-4 sm:p-5 pb-4 shadow-[0_8px_25px_rgba(230,160,180,0.16)] border border-pink-100 flex flex-col justify-between hover:shadow-[0_16px_35px_rgba(230,140,170,0.28)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
            >
              <div>
                {/* Photo Frame in 4:5 Portrait Aspect Ratio */}
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-pink-50 mb-3.5 relative shadow-inner flex items-center justify-center">
                  <img
                    src={currentImg}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 [image-rendering:-webkit-optimize-contrast] contrast-[1.03] saturate-[1.04]"
                  />
                  {/* Time Tag Pill */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-pink-700 backdrop-blur-sm shadow-sm border border-pink-200/70">
                    {item.timeTag}
                  </div>
                </div>

                {/* Romantic Title in Pink Cursive Handwriting */}
                <h3
                  className="font-handwriting text-xl sm:text-2xl font-bold tracking-wide mb-1 text-center line-clamp-1"
                  style={{ color: '#FF4D8D' }}
                >
                  {item.title}
                </h3>
              </div>

              {/* Card Footer */}
              <div className="mt-2.5 pt-2 border-t border-pink-50 flex items-center justify-between text-[11px] text-pink-400 font-cute">
                <span>Moment #{item.id} of 48</span>
                <span className="flex items-center gap-1 text-pink-500 font-bold group-hover:translate-x-0.5 transition-transform">
                  View Full →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Journey Video Section (At the End of Memories Page) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 mb-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white text-center shadow-2xl shadow-pink-300/40 relative overflow-hidden max-w-4xl mx-auto"
      >
        {/* Soft Background Accents */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm mb-4">
            <Film size={14} className="text-pink-200" />
            <span>Our Journey in Motion • Special Birthday Film 🎬</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white mb-3">
            Bitu & Bee's Journey Film 🎥❤️
          </h3>

          <p className="text-sm sm:text-base text-pink-100 font-sans leading-relaxed mb-6 max-w-xl mx-auto">
            Some moments are too special to stay only in our camera roll. 🥹 So here's a little video of us, our smiles, our craziness, and all those moments I never want to forget. Bitu, grab some popcorn and watch our little story. 🤭🍿❤️
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenVideoModal}
            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white text-rose-600 hover:text-rose-700 font-black text-sm sm:text-base shadow-xl hover:shadow-2xl hover:bg-rose-50 transition-all cursor-pointer"
          >
            <Play size={18} className="fill-rose-600 text-rose-600" />
            <span>Watch Our Journey Film (Full Screen) 🎥✨</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 5. Full-Screen Lightbox Modal with Next/Prev Arrow Navigation */}
      <AnimatePresence>
        {selectedMemory && (
          <div
            onClick={() => {
              sounds.playPop();
              setSelectedMemoryIndex(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md cursor-pointer select-none"
          >
            {/* Top-Left Back Button to Minimize / Return to Gallery */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPop();
                setSelectedMemoryIndex(null);
              }}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-white/20 hover:bg-white/30 active:scale-95 border border-white/25 rounded-full transition-all cursor-pointer backdrop-blur-md shadow-lg z-50"
              title="Back to gallery (Esc or click outside)"
            >
              <ArrowLeft size={16} />
              <span>← Back to Memories</span>
            </button>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPop();
                setSelectedMemoryIndex(null);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 text-white/90 hover:text-white bg-white/20 hover:bg-white/30 rounded-full transition-all cursor-pointer z-50 backdrop-blur-md active:scale-95 shadow-lg border border-white/20"
              title="Close (Esc)"
            >
              <X size={22} />
            </button>

            {/* Previous Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/90 hover:text-white bg-white/15 hover:bg-white/30 rounded-full transition-all cursor-pointer z-50 backdrop-blur-sm shadow-lg hover:scale-110 active:scale-95"
              title="Previous photo (←)"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 text-white/90 hover:text-white bg-white/15 hover:bg-white/30 rounded-full transition-all cursor-pointer z-50 backdrop-blur-sm shadow-lg hover:scale-110 active:scale-95"
              title="Next photo (→)"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main Lightbox Content Card */}
            <motion.div
              key={selectedMemory.id}
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-pink-200 max-h-[92vh] overflow-y-auto text-center cursor-default"
            >
              {/* Full Image Frame (Crisp view handling portrait and landscape) */}
              <div className="relative w-full max-h-[62vh] flex items-center justify-center rounded-2xl overflow-hidden mb-4 bg-black/5 shadow-md">
                <img
                  src={images[selectedMemory.storageKey] || selectedMemory.defaultImage}
                  alt={selectedMemory.title}
                  className="max-h-[62vh] w-auto max-w-full object-contain mx-auto rounded-xl [image-rendering:-webkit-optimize-contrast] contrast-[1.02]"
                />
              </div>

              {/* Tag & Counter */}
              <div className="flex items-center justify-between text-xs font-bold text-pink-500 mb-1.5">
                <span className="uppercase tracking-wider">{selectedMemory.timeTag}</span>
                <span className="bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-cute">
                  Photo #{selectedMemory.id} of {MEMORY_CARDS.length}
                </span>
              </div>

              {/* Title in Pink Cursive Handwriting */}
              <h3
                className="text-2xl sm:text-3xl font-handwriting font-bold tracking-wide mb-3"
                style={{ color: '#FF4D8D' }}
              >
                {selectedMemory.title}
              </h3>

              {/* Modal Footer with Like & Navigation Controls */}
              <div className="bg-pink-50 p-3 sm:p-3.5 rounded-2xl border border-pink-200 flex items-center justify-between mt-2 flex-wrap gap-2">
                <button
                  onClick={handleHeartReaction}
                  className="flex items-center gap-1.5 text-xs font-cute text-pink-700 font-bold hover:text-pink-900 bg-white px-3.5 py-1.5 rounded-full border border-pink-200 shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  <Heart size={14} className="fill-pink-500 text-pink-500" />
                  <span>Send Love to this Memory ❤️</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setSelectedMemoryIndex(null);
                    }}
                    className="text-xs font-bold text-pink-600 hover:text-pink-800 bg-white px-3 py-1.5 rounded-full border border-pink-200 cursor-pointer transition-colors shadow-2xs hover:bg-pink-50"
                  >
                    ← Back to Grid
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrev}
                      className="p-1 text-pink-600 hover:text-pink-900 cursor-pointer"
                      title="Previous"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-[11px] font-bold text-pink-600">
                      {selectedMemory.id} / {MEMORY_CARDS.length}
                    </span>
                    <button
                      onClick={handleNext}
                      className="p-1 text-pink-600 hover:text-pink-900 cursor-pointer"
                      title="Next"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. In-App Photo Customizer Modal */}
      <AnimatePresence>
        {isPhotoManagerOpen && (
          <div
            onClick={() => {
              sounds.playPop();
              setIsPhotoManagerOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer select-none"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-xl bg-[#FFFDF9] border-2 border-pink-200 rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto cursor-default"
            >
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsPhotoManagerOpen(false);
                }}
                className="absolute top-4 right-4 p-2 text-pink-400 hover:text-pink-700 rounded-full hover:bg-pink-100 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 mb-2">
                  <Camera size={13} /> Customize Photos
                </span>
                <h3 className="text-2xl font-bold text-pink-950 font-display">
                  Manage Photos of Bitu & Bee 📸
                </h3>
                <p className="text-xs text-pink-700/80 mt-1">
                  All 48 photos are loaded! You can easily replace any photo with an original high-resolution version.
                </p>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {MEMORY_CARDS.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-white rounded-2xl border border-pink-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={images[m.storageKey] || m.defaultImage}
                        alt={m.title}
                        className="w-12 h-12 rounded-xl object-cover border border-pink-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-pink-950 line-clamp-1">
                          #{m.id}. {m.title}
                        </h4>
                        <span className="text-[10px] text-pink-600">{m.timeTag}</span>
                      </div>
                    </div>

                    <label className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-medium cursor-pointer shadow-sm transition-colors flex items-center gap-1 shrink-0">
                      <Upload size={12} /> Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(m.storageKey, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-pink-200">
                <button
                  onClick={handleResetPhotos}
                  className="text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Reset all to original photos
                </button>
                <button
                  onClick={() => setIsPhotoManagerOpen(false)}
                  className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-full shadow-sm cursor-pointer transition-colors"
                >
                  Done ✨
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Full-Screen Journey Video Theater Modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isVideoModalOpen && (
              <motion.div
                key="journey-video-theater-modal"
                ref={videoModalRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-5 text-white"
              >
              {/* Hidden Video File Selector */}
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleSelectVideoFile}
              />

              {/* Top Bar Navigation */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 w-full max-w-6xl mx-auto z-20 pb-2 border-b border-white/10">
                <button
                  onClick={handleCloseVideoModal}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 rounded-full transition-all cursor-pointer backdrop-blur-md shrink-0"
                >
                  <ArrowLeft size={16} />
                  <span>← Back to Memories</span>
                </button>

                <div className="text-center max-w-md mx-auto px-2">
                  <h4 className="text-xs sm:text-base font-bold font-display text-rose-300 line-clamp-1">
                    Bitu & Bee's Journey Film 🎬❤️
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/70 line-clamp-1">
                    Some moments are too special to stay only in our camera roll... 🥹🍿❤️
                  </p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* BGM Volume Toggle */}
                  <button
                    onClick={handleToggleBgmInVideo}
                    className="p-2 text-white/90 hover:text-white bg-white/15 hover:bg-white/25 rounded-full border border-white/20 transition-all cursor-pointer"
                    title={isBgmMuted ? 'Turn Song On 🎵' : 'Mute Song 🔇'}
                  >
                    {isBgmMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 rounded-full border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                    title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                  </button>

                  <button
                    onClick={handleCloseVideoModal}
                    className="p-2 text-white/80 hover:text-white bg-white/15 hover:bg-white/25 rounded-full border border-white/20 cursor-pointer"
                    title="Close Video"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Center Video Area (Optimized for Vertical Reel Cinema) */}
              <div className="flex-1 flex flex-col items-center justify-center my-auto py-1 sm:py-2 relative max-w-6xl w-full mx-auto overflow-hidden">
                {!videoError && customVideoUrl ? (
                  <div className="relative flex flex-col items-center justify-center w-full">
                    {/* Subtle Cinematic Ambient Backlight Glow */}
                    <div className="absolute w-[320px] sm:w-[440px] h-[480px] sm:h-[620px] bg-gradient-to-tr from-rose-500/25 via-pink-500/20 to-amber-400/15 blur-3xl -z-10 rounded-full scale-105 pointer-events-none animate-pulse" />

                    {/* Vertical Phone/Reel Cinema Container (9:16 Aspect Ratio) */}
                    <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] aspect-[9/16] max-h-[72vh] sm:max-h-[82vh] rounded-3xl overflow-hidden shadow-[0_20px_70px_rgba(244,63,94,0.35)] border-2 border-white/20 bg-black flex items-center justify-center">
                      <video
                        ref={videoPlayerRef}
                        src={customVideoUrl}
                        controls
                        autoPlay
                        playsInline
                        onError={() => setVideoError(true)}
                        onEnded={() => {
                          confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
                        }}
                        className="w-full h-full object-contain rounded-3xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md w-full bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 text-center backdrop-blur-md shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center mx-auto mb-4">
                      <Film size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      Journey Video Is Getting Ready! 🎬✨
                    </h4>
                    <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed">
                      Our special journey video is loaded and will play in high resolution vertical cinema!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
