import React, { Suspense, memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import Spline from '@splinetool/react-spline'; // Removed static import
import Typewriter from 'typewriter-effect';
const Spline = React.lazy(() => import('@splinetool/react-spline'));
import FluxWavePopup from '../components/FluxWavePopup';
import TechnovisionPopup from '../components/TechnovisionPopup';

// Memoized Ticker for performance
const MarqueeTicker = memo(() => (
  <div className="animate-marquee whitespace-nowrap text-cyan-700 dark:text-cyan-400/60 will-change-transform">
    {[1, 2, 3].map((i) => (
      <React.Fragment key={i}>
        <span className="mx-6">Specialized in special things</span>
        <span className="mx-6 text-slate-400 opacity-30">//</span>
        <span className="mx-6">Technical Club Flux</span>
        <span className="mx-6 text-slate-400 opacity-30">//</span>
        <span className="mx-6">SATI Vidisha Unit_01</span>
        <span className="mx-6 text-slate-400 opacity-30">//</span>
      </React.Fragment>
    ))}
  </div>
));

const Home = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only load 3D model if width > 1024px (lg breakpoint)
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  return (
    <div className="relative min-h-dvh w-full bg-slate-50 dark:bg-[#030303] transition-colors duration-500 overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black flex flex-col pt-20 md:pt-28">
      
      {/* Technovision 2026 Poster Modal Popup */}
      <TechnovisionPopup />

      {/* ===== INJECTED ANIMATIONS ===== */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes grid-move { 0% { background-position: 0 0; } 100% { background-position: 0 40px; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes tracking-in-expand { 
          0% { letter-spacing: -0.5em; opacity: 0; } 
          40% { opacity: 0.6; } 100% { opacity: 1; } 
        }
        .animate-scan { animation: scan 3.5s linear infinite; }
        /* Optimized: will-change used only on desktop */
        @media (min-width: 1024px) {
          .animate-grid-move { animation: grid-move 1.5s linear infinite; will-change: background-position; }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .tagline-anim { animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both; }
      `}} />

      {/* ===== FIXED BACKGROUND LAYER ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Static Top Grid - Lowered opacity on mobile for better contrast */}
        <div className="absolute inset-0 opacity-10 md:opacity-15 dark:opacity-[0.07] md:dark:opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
            backgroundSize: 'clamp(30px, 5vw, 50px) 50px'
          }}
        />

        {/* Animated Perspective Grid - HIDDEN ON MOBILE/TABLET */}
        <div className="hidden lg:block absolute bottom-[-10%] w-[200%] left-[-50%] h-[60%]">
          <div className="absolute inset-0 opacity-20 dark:opacity-40 animate-grid-move"
            style={{
              backgroundImage: 'linear-gradient(to right, #06b6d4 1.5px, transparent 1.5px), linear-gradient(to bottom, #06b6d4 1.5px, transparent 1.5px)',
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg)',
              maskImage: 'linear-gradient(to top, black, transparent)'
            }}
          />
        </div>

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200/40 via-transparent to-slate-300/70 dark:from-black/40 dark:via-transparent dark:to-black/70" />
      </div>

      {/* ===== HERO CONTENT ===== */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* LEFT: TEXT CONTENT */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left z-20 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <Link
                  to="/events/technovision-2026"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-cyan-400/50 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-purple-600/20 rounded-full backdrop-blur-md hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all group cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase group-hover:text-cyan-300">
                    Technovision 2026 Live &rarr;
                  </span>
                </Link>

                <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 bg-cyan-500/5 rounded-full backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-cyan-600 dark:text-cyan-400 text-[10px] font-mono tracking-widest uppercase">
                    Neural Link Established
                  </span>
                </div>
              </div>

              <p className="tagline-anim text-cyan-600 dark:text-cyan-500/80 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold">
                Specialized in <span className="text-slate-900 dark:text-white transition-colors">impossible</span> things
              </p>
            </div>

            <h1 className="font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.85]">
              <span className="block text-7xl sm:text-8xl md:text-8xl xl:text-9xl">FLUX</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl xl:text-7xl bg-gradient-to-r from-cyan-600 via-slate-700 to-purple-600 dark:from-cyan-400 dark:via-white dark:to-purple-500 text-transparent bg-clip-text pb-2">
                ROBOTICS
              </span>
            </h1>

            <div className="max-w-md mx-auto lg:mx-0 text-sm md:text-base text-slate-600 dark:text-gray-400 leading-relaxed border-l-2 border-cyan-500 pl-4 min-h-[80px] flex items-center text-left">
              <Typewriter
                options={{ autoStart: true, loop: false, delay: 30, cursor: '_' }}
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(800)
                    .typeString('Designing the <span style="color: #06b6d4; font-weight: 600;">autonomous future</span>.')
                    .typeString('<br />A student-led collective at SATI Vidisha.')
                    .start();
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/login" className="px-8 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-cyan-500 text-white dark:text-black shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300">
                Buy Components
              </Link>
              <Link to="/projects" className="px-8 py-4 text-[10px] sm:text-xs font-semibold uppercase tracking-widest border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:border-cyan-500 hover:text-cyan-500 backdrop-blur-sm transition-all duration-300">
                Projects
              </Link>
            </div>
          </div>

          {/* RIGHT: THE 3D ROBOT - Hidden on Mobile to prevent lag */}
          <div className="relative hidden lg:flex h-[40vh] sm:h-[50vh] lg:h-[70vh] w-full items-center justify-center order-1 lg:order-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2/3 h-2/3 bg-cyan-500/20 dark:bg-cyan-500/10 blur-[100px] rounded-full animate-pulse" />
            </div>

            {/* Only render Spline on Desktop to save bandwidth on mobile */}
            {isDesktop && (
              <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                  <div className="text-cyan-600 dark:text-cyan-500 font-mono text-[10px] uppercase tracking-widest">Initialising_V-Model...</div>
                </div>
              }>
                <div className="w-full h-full lg:scale-110 cursor-grab active:cursor-grabbing relative z-10">
                  <Spline
                    className="w-full h-full"
                    scene="https://prod.spline.design/cjCHnZAtDbmavil4/scene.splinecode"
                  />
                </div>
              </Suspense>
            )}

            {/* Aesthetic Overlays */}
            <div className="absolute inset-4 pointer-events-none border border-black/5 dark:border-white/5 rounded-3xl z-20" />
            <div className="absolute top-4 left-4 right-4 h-[1px] bg-cyan-500/30 shadow-[0_0_15px_#06b6d4] z-30 animate-scan pointer-events-none" />
          </div>

        </div>
      </main>

      {/* ===== FOOTER TICKER ===== */}
      <footer className="w-full border-t border-slate-200 dark:border-white/5 bg-slate-100/90 dark:bg-black/90 backdrop-blur-md z-40 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase">
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-slate-100 dark:from-black to-transparent" />
            <div className="absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-slate-100 dark:from-black to-transparent" />
            <MarqueeTicker />
          </div>

          <div className="flex items-center gap-2 pl-4 md:pl-8 shrink-0 border-l border-slate-300 dark:border-white/10 text-slate-500 font-bold">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="hidden xs:inline">System_Online</span>
            <span className="xs:hidden">Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;