import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, ChevronDown, MessageCircle, Download,
  ExternalLink, Lightbulb, Bot, Trophy, ArrowRight, Mail, Phone, Sparkles,
  Volume2, VolumeX, Play, Pause, Instagram
} from 'lucide-react';
import { COMPETITIONS, EVENT_META } from '../../data/technovisionData';
import './TechnovisionCompetitions.css';
import technovisionPoster from '../../assets/events/technovision_2026/technovision_2026_poster.png';

// Cyber Ronin Artwork Assets
const CYBER_RONIN_BASE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260831_115955_2a9adb39-5e9b-4ced-96e2-6900eabe3de9.png&w=1920&q=85';
const CYBER_RONIN_REVEAL = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260831_123709_183f0065-efb2-4bb2-a849-13aaa5af2f3f.png&w=1920&q=85';

/* ── Category badge color map ──────────────────────────────────────── */
const badgeColors = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  cyan:    'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  violet:  'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
};

const tireAccents = ['#06b6d4', '#0ea5e9', '#a855f7'];
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const CompetitionTire = ({ comp, index, selected, isSpinning, rotation, onClick }) => (
  <button
    type="button"
    className="competition-tire-button"
    style={{ '--competition-accent': tireAccents[index % tireAccents.length] }}
    aria-label={`Spin tire for ${comp.title}`}
    aria-pressed={selected}
    onClick={onClick}
  >
    <span className="competition-tire-halo" aria-hidden="true" />
    <svg
      className={`competition-tire${isSpinning ? ' is-spinning' : ''}`}
      viewBox="0 0 240 240"
      aria-hidden="true"
      style={{
        transform: `rotate(${rotation || 0}deg)`,
        transition: 'transform 1.3s cubic-bezier(0.12, 0.8, 0.32, 1), filter 380ms ease',
        transformOrigin: '50% 50%',
      }}
    >
      <defs>
        <radialGradient id={`rubber-${comp.id}`} cx="42%" cy="35%">
          <stop offset="0" stopColor="#41464d" />
          <stop offset=".45" stopColor="#1b2025" />
          <stop offset=".85" stopColor="#080a0d" />
          <stop offset="1" stopColor="#30363d" />
        </radialGradient>
        <radialGradient id={`alloy-${comp.id}`} cx="35%" cy="28%">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset=".36" stopColor="#aeb8c2" />
          <stop offset=".72" stopColor="#46515c" />
          <stop offset="1" stopColor="#d5dce2" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="#07090c" stroke="#50565e" strokeWidth="2" />
      <circle cx="120" cy="120" r="104" fill={`url(#rubber-${comp.id})`} stroke="#101317" strokeWidth="5" />
      {Array.from({ length: 36 }, (_, tread) => (
        <g key={tread} transform={`rotate(${tread * 10} 120 120)`}>
          <rect x="115" y="8" width="10" height="6" rx="2" fill="#59616a" opacity=".62" />
          <path d="M111 18h18" stroke="#050608" strokeWidth="2" opacity=".75" />
        </g>
      ))}
      <circle cx="120" cy="120" r="86" fill="#101419" stroke="#050608" strokeWidth="5" />
      <circle cx="120" cy="120" r="77" fill={`url(#alloy-${comp.id})`} stroke="#222a31" strokeWidth="3" />
      <circle cx="120" cy="120" r="68" fill="#252c33" stroke="#d9e0e5" strokeWidth="1.5" />
      {Array.from({ length: 10 }, (_, spoke) => (
        <g key={spoke} transform={`rotate(${spoke * 36} 120 120)`}>
          <path d="M115 57 110 83 116 113 120 117 124 113 130 83 125 57Z" fill="#8e99a3" stroke="#273039" strokeWidth="2" />
          <path d="m118 64-3 21 5 23 2-23-2-21Z" fill="#e9eef2" opacity=".7" />
        </g>
      ))}
      <circle cx="120" cy="120" r="39" fill="#14191e" stroke="#d9e0e5" strokeWidth="2" />
      <circle cx="120" cy="120" r="31" fill={`url(#alloy-${comp.id})`} stroke="#161b20" strokeWidth="3" />
      {Array.from({ length: 5 }, (_, bolt) => {
        const angle = bolt * (Math.PI * 2 / 5) - Math.PI / 2;
        return (
          <circle
            key={bolt}
            cx={120 + Math.cos(angle) * 22}
            cy={120 + Math.sin(angle) * 22}
            r="3.2"
            fill="#222930"
            stroke="#e2e8ed"
            strokeWidth="1.5"
          />
        );
      })}
      <circle cx="120" cy="120" r="7" fill={tireAccents[index % tireAccents.length]} stroke="#f8fafc" strokeWidth="2" />
      <path d="M61 49A86 86 0 0 1 115 34" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".56" />
      <path d="M47 75A87 87 0 0 1 56 57" fill="none" stroke={tireAccents[index % tireAccents.length]} strokeWidth="2" strokeLinecap="round" opacity=".82" />
    </svg>
  </button>
);

/* ── Competition Card ──────────────────────────────────────────────── */
const CompetitionCard = ({ comp, index, active, onCardClick }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Lightbulb': return <Lightbulb size={16} />;
      case 'Bot': return <Bot size={16} />;
      case 'Trophy': return <Trophy size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const countStr = `0${index + 1} / 0${COMPETITIONS.length}`;

  return (
    <div
      className={`competition-card${active ? ' is-active' : ''}`}
      style={{ '--competition-accent': tireAccents[index % tireAccents.length] }}
      onClick={onCardClick}
    >
      {/* Banner */}
      <div className="competition-card-banner">
        <img
          src={comp.banner}
          alt={comp.title}
          loading="lazy"
        />
        <div className="competition-card-icon" title={comp.title}>
          {getIcon(comp.icon)}
        </div>
        <div className="competition-card-count">
          {countStr}
        </div>
      </div>

      {/* Content */}
      <div className="competition-card-content">
        <span className="competition-card-category">
          <Sparkles size={11} />
          {comp.categoryBadge}
        </span>

        <h3>{comp.title}</h3>
        {comp.subtitle && (
          <span className="text-pink-500 font-black text-xs uppercase tracking-wider block -mt-1 mb-1">
            {comp.subtitle}
          </span>
        )}

        <p>{comp.shortDescription}</p>

        {/* Actions */}
        <div className="competition-card-actions" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/events/technovision-2026/${comp.slug}`}
            className="competition-link-secondary"
          >
            View Details
          </Link>
          <Link
            to={`/events/technovision-2026/register?competition=${comp.slug}`}
            className="competition-link-primary"
          >
            Register Now <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ── Main Landing Page ─────────────────────────────────────────────── */
const TechnovisionCompetitions = () => {
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [hoveredCompetition, setHoveredCompetition] = useState(null);
  const [tireRotations, setTireRotations] = useState({});
  const [spinningTires, setSpinningTires] = useState({});
  const activeCompetition = hoveredCompetition ?? selectedCompetition;

  const handleTireSpin = (compId, index) => {
    // Add 720 degrees to rotation on each click
    setTireRotations((prev) => ({
      ...prev,
      [compId]: (prev[compId] || 0) + 720,
    }));

    setSpinningTires((prev) => ({
      ...prev,
      [compId]: true,
    }));

    setSelectedCompetition(compId);

    // Subtle audio feedback using Web Audio API
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200 + index * 60, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // browser may require user gesture or audio policy, safe fallback
    }

    setTimeout(() => {
      setSpinningTires((prev) => ({
        ...prev,
        [compId]: false,
      }));
    }, 1300);
  };

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const scrollToCompetitions = () => {
    document.getElementById('competitions')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cyber Ronin Cursor Spotlight Reveal Effect
  useEffect(() => {
    const updateSpotlight = (clientX, clientY) => {
      const el = document.getElementById('cyber-ronin-reveal-bg');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const w = window.innerWidth;
      const radius = w < 480 ? 140 : w < 768 ? 200 : 280;
      const maskVal = `radial-gradient(circle ${radius}px at ${x}px ${y}px, #fff 0%, #fff 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, transparent 100%)`;
      el.style.webkitMaskImage = maskVal;
      el.style.maskImage = maskVal;
    };

    const handleMouseMove = (e) => updateSpotlight(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070504] text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">

      {/* ───── CYBER RONIN INTERACTIVE BACKGROUND ───── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Base Day Scene */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-105 opacity-60 dark:opacity-40"
          style={{ backgroundImage: `url('${CYBER_RONIN_BASE}')` }}
        />

        {/* Reveal Alternate Neon Cyber Scene with Cursor Spotlight */}
        <div
          id="cyber-ronin-reveal-bg"
          className="absolute inset-0 bg-cover bg-center opacity-90 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `url('${CYBER_RONIN_REVEAL}')`,
            WebkitMaskImage: 'radial-gradient(circle 0px at -999px -999px, #fff, transparent)',
            maskImage: 'radial-gradient(circle 0px at -999px -999px, #fff, transparent)',
          }}
        />

        {/* Cyberpunk Ambiance Gradients & HUD Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C45A18]/30 via-black/40 to-[#070504] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      </div>

      <div className="relative z-10">

        {/* ───── HERO SECTION ───── */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center space-y-8">

            {/* Status Pill */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]" />
              <span className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase drop-shadow">
                Technovision 2026
              </span>
            </MotionDiv>

            {/* Date & Venue Badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md text-cyan-400 px-5 py-2.5 rounded-full border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
            >
              <Calendar size={16} />
              <span className="text-sm font-bold uppercase tracking-wider">{EVENT_META.dates}</span>
              <span className="mx-2 text-cyan-500/40">|</span>
              <a
                href={EVENT_META.venueMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
              >
                <MapPin size={16} />
                <span className="text-sm font-bold uppercase tracking-wider">SATI College</span>
              </a>
            </MotionDiv>

            {/* Giant Heading */}
            <MotionH1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-[#FBDBAF] to-slate-400 drop-shadow-[0_4px_35px_rgba(0,0,0,0.6)]"
            >
              Technovision<span className="text-cyan-400">.</span>
            </MotionH1>

            {/* Tagline */}
            <MotionP
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg md:text-xl text-[#FBDBAF] font-mono tracking-wider drop-shadow-md"
            >
              Innovate. Build. Compete.
            </MotionP>

            {/* Intro */}
            <MotionP
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="max-w-2xl mx-auto text-slate-200 leading-relaxed drop-shadow-sm"
            >
              The premier technical fest of Samrat Ashok Technological Institute, organized by Technical Club <span className="text-cyan-400 font-bold">FLUX</span>. 
              Witness the clash of metal, code, and innovation across three high-octane competitions.
            </MotionP>

            {/* CTA */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <button
                onClick={scrollToCompetitions}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 text-lg"
              >
                Explore Competitions <ChevronDown size={20} />
              </button>
            </MotionDiv>

            {/* Technovision Hype Video Banner */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="group relative w-full max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.35)] border border-cyan-500/40 bg-black aspect-video md:h-[480px]"
            >
              <video
                ref={videoRef}
                src="/technovision_hype.mp4"
                poster={EVENT_META.heroImage}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Bottom Subtle Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070504] via-transparent to-transparent opacity-70 pointer-events-none" />

              {/* Top Left Hype Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 border border-cyan-500/40 backdrop-blur-md shadow-lg pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                  TECHNOVISION HYPE
                </span>
              </div>

              {/* Sound & Play Controls */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-black/75 hover:bg-black/95 text-white border border-cyan-500/40 backdrop-blur-md transition-all shadow-lg hover:border-cyan-400 hover:scale-105 active:scale-95 cursor-pointer"
                  title={isPlaying ? 'Pause video' : 'Play video'}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="text-cyan-400 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleSound}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/75 hover:bg-black/95 text-white text-xs font-mono border border-cyan-500/40 backdrop-blur-md transition-all shadow-lg hover:border-cyan-400 hover:scale-105 active:scale-95 cursor-pointer"
                  title={isMuted ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={16} className="text-red-400" />
                      <span className="hidden sm:inline">UNMUTE HYPE</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} className="text-cyan-400 animate-pulse" />
                      <span className="hidden sm:inline">MUTED AUDIO</span>
                    </>
                  )}
                </button>
              </div>
            </MotionDiv>

          </div>
        </section>

        {/* ───── COMPETITIONS SECTION ───── */}
        <section id="competitions" className="competition-section max-w-7xl mx-auto px-6 py-24 relative">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <span className="competition-section-eyebrow">Choose Your Arena</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
              Our <span className="text-cyan-400">Competitions</span>
            </h2>
            <p className="max-w-xl mx-auto text-[#FBDBAF]/80 font-mono text-sm tracking-wide drop-shadow">
              Three high-energy competitions designed to test your innovation, engineering, and robotics skills. Click any tire to spin!
            </p>
          </MotionDiv>

          <div className={`competition-network${activeCompetition ? ' has-active-competition' : ''}`}>
            <svg className="competition-trail" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
              <path className="competition-trail-base" d="M190 130 C390 130 410 200 600 200 S810 245 1010 245" />
              {COMPETITIONS.map((comp, index) => {
                const x = 190 + index * 410;
                const y = 130 + index * 57.5;
                const active = comp.id === activeCompetition;
                return (
                  <g key={comp.id}>
                    <path
                      className={`competition-trail-segment${active ? ' is-active' : ''}`}
                      style={{ '--competition-accent': tireAccents[index % tireAccents.length] }}
                      d={`M${x - 160} ${y - 28} Q${x} ${y} ${x + 160} ${y + 28}`}
                    />
                    {active && <circle className="competition-trail-light" cx={x} cy={y} r="5" />}
                  </g>
                );
              })}
            </svg>
            <div className="competition-grid">
              {COMPETITIONS.map((comp, index) => {
                const selected = comp.id === selectedCompetition;
                const active = comp.id === activeCompetition;
                const isSpinning = Boolean(spinningTires[comp.id]);
                const rotation = tireRotations[comp.id] || 0;

                return (
                  <div
                    key={comp.id}
                    className={`competition-column${active ? ' is-active' : ''}${selected ? ' is-selected' : ''}`}
                    style={{ '--competition-accent': tireAccents[index % tireAccents.length] }}
                    onMouseEnter={() => setHoveredCompetition(comp.id)}
                    onMouseLeave={() => setHoveredCompetition(null)}
                  >
                    <div className="competition-wheel-stage">
                      <CompetitionTire
                        comp={comp}
                        index={index}
                        selected={selected}
                        isSpinning={isSpinning}
                        rotation={rotation}
                        onClick={() => handleTireSpin(comp.id, index)}
                      />
                    </div>
                    <CompetitionCard
                      comp={comp}
                      index={index}
                      active={active}
                      onCardClick={() => handleTireSpin(comp.id, index)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── QUICK LINKS ───── */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={EVENT_META.whatsappGroup}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={20} /> Join WhatsApp Group
            </a>
            <a
              href="https://www.instagram.com/fluxsati/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-pink-500/20"
            >
              <Instagram size={20} /> Instagram
            </a>
            <a
              href={EVENT_META.rulebookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-slate-900/80 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/40 border border-white/15 backdrop-blur-md"
            >
              <Download size={20} /> All Events Rules
            </a>
            <Link
              to="/events/technovision-2026/track"
              className="flex items-center gap-2 bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors border border-white/15 backdrop-blur-md"
            >
              <ExternalLink size={20} /> Track Application
            </Link>
          </div>
        </section>

        {/* ───── CONTACT / QUERIES ───── */}
        <div className="text-center pb-12 border-t border-white/10 pt-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">Need Help?</p>
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-wider mb-6 text-white drop-shadow">
            For Queries <span className="text-cyan-400">Contact</span>
          </h2>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2 max-w-4xl mx-auto px-4">
              {EVENT_META.contacts.map((c) => (
                <a
                  key={c.phone}
                  href={`tel:+91${c.phone}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-400 transition-all font-mono text-xs sm:text-sm shadow-sm hover:scale-105 backdrop-blur-md"
                >
                  <Phone size={15} className="text-cyan-400 shrink-0" />
                  <span className="font-sans font-bold">{c.name}</span>
                  <span className="text-slate-400 font-mono">({c.displayPhone || c.phone})</span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href={`mailto:${EVENT_META.email}`} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors font-mono text-xs sm:text-sm">
                <Mail size={16} className="text-cyan-400" />
                <span>{EVENT_META.email}</span>
              </a>
              <span className="text-slate-600">•</span>
              <a href="/contact" className="text-[#FBDBAF] font-medium text-xs sm:text-sm hover:text-cyan-400 transition-colors">Contact Flux</a>
            </div>
          </div>
        </div>

        {/* ───── EVENT INFORMATION ───── */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,360px)_1fr] gap-10 items-center rounded-3xl border border-cyan-500/20 bg-black/40 p-6 md:p-10 shadow-[0_0_45px_rgba(6,182,212,0.12)]">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-cyan-400/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              <img
                src={technovisionPoster}
                alt="Technovision 2026 event poster"
                loading="lazy"
                className="block h-auto w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-7"
            >
              <div>
                <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Technical Fest 2026 • Samrat Ashok Tech. Institute
                </p>
                <h2 className="text-3xl font-black italic uppercase tracking-tight text-white md:text-5xl">
                  Clash of Metal <span className="text-cyan-400">&amp; Innovation</span>
                </h2>
              </div>

              <p className="leading-relaxed text-slate-300">
                Technovision returns this November with three premier high-adrenaline competitions:
                <strong className="text-[#FBDBAF]"> Model Presentation</strong>,
                <strong className="text-[#FBDBAF]"> Robo Rumble Arena</strong>, and the all-new
                <strong className="text-[#FBDBAF]"> Walking Bot without Wheels</strong> challenge.
                Open to students across all engineering branches, years, and outside institutions to
                prototype, battle, and win glory.
              </p>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-sm font-black uppercase tracking-wider text-cyan-400">
                    Universal Eligibility
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Open to 1st, 2nd, 3rd, and 4th-year students across all engineering, diploma,
                    and science branches.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-sm font-black uppercase tracking-wider text-cyan-400">
                    Free for Everyone
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Registration is completely free for all participants, SATI and external colleges
                    alike. No hidden fees.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-2 text-sm font-black uppercase tracking-wider text-cyan-400">
                    Direct Certificates &amp; Recognitions
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Every participant receives an official signed certificate from SATI Vidisha and
                    Club FLUX.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TechnovisionCompetitions;
