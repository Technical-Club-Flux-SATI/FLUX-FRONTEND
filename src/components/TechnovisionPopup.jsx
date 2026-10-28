import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import technovisionPoster from '../assets/events/technovision_2026/technovision_modal_poster.png';

const TechnovisionPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleNavigate = useCallback(() => {
    setIsOpen(false);
    navigate('/events/technovision-2026');
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Technovision 2026 Announcement"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-4xl my-auto z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.4)] border border-cyan-500/50 bg-[#07090e]"
          >
            <div className="pointer-events-none absolute -top-1 right-1 sm:-top-1 sm:right-1 z-20 h-16 w-16 rounded-full bg-[#07090e]/95 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.25)]" />
            <div className="pointer-events-none absolute -top-2 right-0 sm:-top-2 sm:right-0 z-20 h-20 w-20 rounded-full bg-[#07090e]" />
            <button
              onClick={handleClose}
              aria-label="Close Technovision announcement"
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 p-2 sm:p-2.5 bg-black/80 hover:bg-red-500/30 text-white/90 hover:text-white rounded-full border border-white/30 hover:border-red-400 transition-all backdrop-blur-md shadow-xl group focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
            >
              <X size={22} className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            <div
              onClick={handleNavigate}
              className="relative w-full cursor-pointer group select-none block overflow-hidden"
              title="Click to explore Technovision 2026"
            >
              <img
                src={technovisionPoster}
                onError={(event) => {
                  event.currentTarget.src = '/technovision_poster.png';
                }}
                alt="Technovision 2026 — Innovate, Build, Compete"
                className="w-full h-auto max-h-[82vh] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
              />

              <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 px-4 sm:px-6 flex items-center justify-between pointer-events-none z-20">
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 border border-cyan-500/40 text-[11px] font-mono text-cyan-400 backdrop-blur-md">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>FLUX TECHNICAL CLUB PRESENTS</span>
                </div>

                <div className="mx-auto sm:mx-0 pointer-events-auto">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleNavigate();
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 cursor-pointer"
                  >
                    <span>Explore Technovision</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TechnovisionPopup;
