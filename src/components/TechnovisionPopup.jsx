import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import posterImage from '../assets/events/technovision_nov2026/poster.jpeg';

const TechnovisionPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Show the popup shortly after the home page loads
  useEffect(() => {
    const openTimer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(openTimer);
  }, []);

  // Allow Esc to close while open
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const handleRegister = () => {
    setIsOpen(false);
    navigate('/events/technovision-nov-2026');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pt-20 sm:pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-label="Technovision 2026 registration"
            className="relative w-[92vw] max-w-[420px] max-h-[92vh] flex flex-col bg-[#0b0f19] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.45)] border border-cyan-500/40 z-10"
          >
            <button
              onClick={handleClose}
              aria-label="Close popup"
              className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white/80 hover:text-white transition-colors backdrop-blur-md"
            >
              <X size={22} />
            </button>

            <div
              className="relative w-full min-h-0 flex-1 overflow-hidden cursor-pointer group bg-black"
              onClick={handleRegister}
            >
              <img
                src={posterImage}
                alt="Technovision 2026 Poster"
                className="w-full h-full max-h-[62vh] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0f19] to-transparent pointer-events-none" />
            </div>

            <div className="p-4 sm:p-5 text-center space-y-3 border-t border-cyan-500/20">
              <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-[11px] sm:text-xs uppercase tracking-widest font-bold">
                <Calendar size={14} /> Registrations Open • Last Date 31 Oct
              </div>
              <button
                onClick={handleRegister}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 text-white font-black px-6 py-3 rounded-full uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/30 hover:brightness-110 transition-all"
              >
                Register Now <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TechnovisionPopup;
