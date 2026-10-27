import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AlertTriangle, CheckCircle, Copy, Search, ArrowLeft, Calendar, Bot, Sparkles, MessageCircle } from 'lucide-react';
import { getCompetitionBySlug, EVENT_META } from '../../data/technovisionData';

/* ── Floating particle ───────────────────────────────────────────── */
const Particle = ({ delay }) => {
  const x = Math.random() * 100;
  const size = Math.random() * 4 + 2;
  const duration = Math.random() * 3 + 3;

  return (
    <motion.div
      initial={{ y: '100vh', x: `${x}vw`, opacity: 0 }}
      animate={{ y: '-10vh', opacity: [0, 1, 0] }}
      transition={{ delay, duration, repeat: Infinity, ease: 'linear' }}
      className="fixed pointer-events-none z-0"
      style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(6,182,212,0.3)' }}
    />
  );
};

const TechnovisionConfirmation = () => {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('appId');
  const compSlug = searchParams.get('comp');
  const competition = compSlug ? getCompetitionBySlug(compSlug) : null;
  const [copied, setCopied] = useState(false);

  const submissionDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  /* Redirect if no appId */
  useEffect(() => {
    if (!appId) {
      window.location.replace('/events/technovision-2026');
    }
  }, [appId]);

  if (!appId) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appId);
      setCopied(true);
      toast.success('Application ID copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Fallback */
      const ta = document.createElement('textarea');
      ta.value = appId;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      toast.success('Application ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30">

      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Particle key={i} delay={i * 0.5} />
      ))}

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative mx-auto w-24 h-24"
          >
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/50">
              Registration Submitted!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Your registration has been successfully submitted. Save your Application ID below.
            </p>
          </motion.div>

          {/* Application ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] p-8 space-y-4"
          >
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Your Application ID</p>
            <div className="flex items-center justify-center gap-4">
              <span className="font-mono text-3xl md:text-4xl font-black text-cyan-500 tracking-wider select-all">
                {appId}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500/20'
              }`}
            >
              {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy Application ID</>}
            </button>
          </motion.div>

          {/* Registration Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/10 p-6 text-left"
          >
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Registration Summary</h3>
            <div className="space-y-3 text-sm">
              {competition && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Bot size={14} /> Competition</span>
                  <span className="font-bold">{competition.title}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Calendar size={14} /> Submitted</span>
                <span className="font-bold">{submissionDate}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Sparkles size={14} /> Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black tracking-widest uppercase border border-blue-500/20">
                  Submitted
                </span>
              </div>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="bg-amber-100 dark:bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-6 text-left text-amber-900 dark:text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle size={25} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-3">
                <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                  Important Notice
                </p>
                <p className="font-bold leading-relaxed">
                  All participants are required to register on the NDLI portal after completing their event registration.
                </p>
                <p className="font-bold leading-relaxed">
                  NDLI portal registration is compulsory to receive your participation certificates.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href={EVENT_META.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-all uppercase tracking-wider shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={18} /> Join WhatsApp Group
            </a>
            <Link
              to="/events/technovision-2026/track"
              className="flex items-center gap-2 bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all uppercase tracking-wider shadow-lg shadow-cyan-500/20"
            >
              <Search size={18} /> Track Application
            </Link>
            <Link
              to="/events/technovision-2026"
              className="flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all uppercase tracking-wider border border-slate-700"
            >
              <ArrowLeft size={18} /> Back to Competitions
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TechnovisionConfirmation;
