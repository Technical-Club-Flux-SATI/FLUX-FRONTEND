import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info, Bot, Clock, Trophy, ChevronDown, Download, ArrowRight,
  ArrowLeft, Lightbulb, Users, Shield, Target, Ruler, HelpCircle,
  CheckCircle, Image as ImageIcon, X, ExternalLink, Wrench, AlertTriangle,
  Phone, Mail
} from 'lucide-react';
import { getCompetitionBySlug, EVENT_META } from '../../data/technovisionData';

/* ── Icon resolver (comp data stores icon name as string) ─────────── */
const iconMap = { Lightbulb, Bot, Target };
const resolveIcon = (comp) => {
  if (comp.iconImage) return <img src={comp.iconImage} alt={comp.title} className="w-8 h-8 rounded-full object-cover" />;
  const Icon = iconMap[comp.icon] || Bot;
  return <Icon size={28} />;
};

/* ── Category color classes ────────────────────────────────────────── */
const catColors = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
};

/* ── FAQ Accordion ─────────────────────────────────────────────────── */
const FAQItem = ({ q, a }) => (
  <details className="group bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
      <span className="font-bold text-lg">{q}</span>
      <ChevronDown className="transition-transform group-open:rotate-180 text-cyan-500 shrink-0 ml-4" size={20} />
    </summary>
    <div className="px-6 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
      {a}
    </div>
  </details>
);

/* ── Lightbox ──────────────────────────────────────────────────────── */
const Lightbox = ({ src, alt, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10">
      <X size={32} />
    </button>
    <motion.img
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      src={src}
      alt={alt}
      className="max-w-full max-h-[90vh] object-contain rounded-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </motion.div>
);

/* ── Section Heading Component ─────────────────────────────────────── */
const SectionHead = ({ icon: Icon, children }) => (
  <h3 className="text-xl font-black italic uppercase tracking-wider text-cyan-500 mb-4 flex items-center gap-2">
    <Icon size={20} /> {children}
  </h3>
);

/* ── Main Component ────────────────────────────────────────────────── */
const CompetitionDetails = () => {
  const { slug } = useParams();
  const comp = getCompetitionBySlug(slug);
  const [lightboxImg, setLightboxImg] = useState(null);

  /* 404 state */
  if (!comp) {
    return (
      <div className="bg-slate-50 dark:bg-[#050505] min-h-screen flex items-center justify-center text-center px-6">
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <HelpCircle size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            Competition Not Found
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            The competition you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/events/technovision-2026"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all"
          >
            <ArrowLeft size={18} /> Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  const color = catColors[comp.categoryColor] || catColors.cyan;

  return (
    <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30">

      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10">

        {/* ── Top Header matching Screenshot 1 ────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  to="/events/technovision-2026"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-cyan-500 transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft size={14} /> Technovision 2026
                </Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${color}`}>
                  {comp.categoryBadge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter flex flex-wrap items-baseline gap-2 md:gap-3">
                <span>{comp.title}</span>
                {comp.subtitle && (
                  <span className="text-pink-500 font-black tracking-normal">
                    {comp.subtitle}
                  </span>
                )}
              </h1>

              {comp.tagline && (
                <p className="text-sm md:text-base font-mono text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1.5 pt-2">
                  {comp.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={`/events/technovision-2026/register?competition=${comp.slug}`}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-7 py-3.5 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-500 transition-all uppercase tracking-wider shadow-lg shadow-cyan-500/25 text-xs sm:text-sm"
              >
                Register For This Event <ArrowRight size={16} />
              </Link>

              {comp.pdfRulebook && (
                <a
                  href={comp.pdfRulebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 px-5 py-3.5 rounded-xl font-bold transition-all uppercase tracking-wider border border-slate-300 dark:border-white/15 text-xs sm:text-sm shadow-sm"
                >
                  <Download size={16} /> Rulebook (PDF)
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Details Grid ────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Left Column (3/5) ── */}
            <div className="lg:col-span-3 space-y-10">

              {/* Important Notice */}
              {comp.notice && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50/70 dark:bg-red-950/20 border border-red-300 dark:border-red-500/40 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono text-xs font-black tracking-widest uppercase mb-2">
                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0" />
                    <span>IMPORTANT NOTICE</span>
                  </div>
                  <p className="text-slate-800 dark:text-red-100 font-bold text-sm md:text-base leading-relaxed">
                    {comp.notice}
                  </p>
                </motion.div>
              )}

              {/* Overview */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="text-xs md:text-sm font-mono font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-2 mb-3">
                  <Info size={16} className="text-cyan-500 shrink-0" /> ABOUT THE COMPETITION
                </h3>
                <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">{comp.overview}</p>
              </motion.div>

              {/* Key Rules & Regulations */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="text-xs md:text-sm font-mono font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-2 mb-4">
                  <Shield size={16} className="text-cyan-500 shrink-0" /> KEY RULES & REGULATIONS
                </h3>
                <ul className="space-y-3">
                  {comp.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                      <span className="text-cyan-500 font-bold text-base leading-none shrink-0">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Objectives */}
              {comp.objectives && comp.objectives.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionHead icon={Target}>Objectives</SectionHead>
                  <ul className="space-y-3">
                    {comp.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-400">
                        <CheckCircle size={16} className="text-cyan-500 mt-1 shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Eligibility */}
              {comp.eligibility && comp.eligibility.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionHead icon={Users}>Eligibility & Participation</SectionHead>
                  <ul className="space-y-3 mb-4">
                    {comp.eligibility.map((e, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase">Type</span>
                      <p className="font-bold text-sm capitalize">{comp.participationType === 'both' ? 'Individual / Team' : comp.participationType}</p>
                    </div>
                    <div className="px-4 py-2 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase">Team Size</span>
                      <p className="font-bold text-sm">{comp.minTeamSize} – {comp.maxTeamSize} members</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Equipment */}
              {comp.equipment && comp.equipment.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionHead icon={Wrench}>Equipment Requirements</SectionHead>
                  <ul className="space-y-3">
                    {comp.equipment.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Judging Criteria */}
              {comp.judgingCriteria && comp.judgingCriteria.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionHead icon={Ruler}>Judging Criteria</SectionHead>
                  <ul className="space-y-3">
                    {comp.judgingCriteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-400">
                        <CheckCircle size={16} className="text-cyan-500 mt-1 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* ── Right Column (2/5) ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Timeline Card & Sidebar Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {comp.arenaTimeline ? (
                  <div className="bg-cyan-50/30 dark:bg-white/5 p-6 rounded-2xl border border-cyan-200/80 dark:border-cyan-500/20 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-black uppercase tracking-widest">
                      <Clock size={16} />
                      <span>ARENA TIMELINE</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">Registration Deadline</span>
                        <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{comp.arenaTimeline.registrationDeadline}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">Event Date & Time</span>
                        <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{comp.arenaTimeline.eventDateTime}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">Location</span>
                        <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{comp.arenaTimeline.location}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <SectionHead icon={Clock}>Event Timeline</SectionHead>
                    <div className="space-y-4">
                      {comp.timeline.map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 last:border-0 pb-3 last:pb-0">
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">{item.date}</span>
                          <span className="font-bold text-slate-900 dark:text-white text-right text-sm">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prize Pool / Rewards & Recognition */}
                <div className="bg-amber-50/40 dark:bg-amber-950/10 p-6 rounded-2xl border border-amber-200/80 dark:border-amber-500/20 shadow-sm">
                  <h3 className="text-xs md:text-sm font-mono font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-4 flex items-center gap-2">
                    <Trophy size={16} /> {comp.rewards ? 'REWARDS & RECOGNITION' : 'PRIZE POOL'}
                  </h3>
                  <ul className="space-y-3">
                    {(comp.rewards || comp.prizes || []).map((prize, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-amber-100/90 text-sm">
                        <Trophy size={15} className="text-amber-500 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{prize}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Official Competition Poster */}
                {comp.banner && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                        <ImageIcon size={14} /> OFFICIAL EVENT POSTER
                      </h4>
                      <button
                        type="button"
                        onClick={() => setLightboxImg(comp.banner)}
                        className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        title="Click to view full poster in high resolution"
                      >
                        <ExternalLink size={12} /> Full Screen
                      </button>
                    </div>
                    <div
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg bg-black/5 dark:bg-black/40 cursor-pointer"
                      onClick={() => setLightboxImg(comp.banner)}
                      title="Click to view full poster"
                    >
                      <img
                        src={comp.banner}
                        alt={`${comp.title} Official Poster`}
                        className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="bg-black/80 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                          <ExternalLink size={13} /> Click to View Full Screen
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 font-mono">
                      Click poster to enlarge full screen
                    </p>
                  </div>
                )}

                {/* Gallery */}
                {comp.gallery && comp.gallery.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xs md:text-sm font-mono font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-4 flex items-center gap-2">
                      <ImageIcon size={16} /> GALLERY
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {comp.gallery.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setLightboxImg(img)}
                          className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105"
                        >
                          <img src={img} alt={`${comp.title} ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* For Queries Contact Card */}
                <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                  <h4 className="text-xs font-mono font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <Phone size={14} /> FOR QUERIES CONTACT
                  </h4>
                  <div className="space-y-2">
                    {EVENT_META.contacts.map((c) => (
                      <a
                        key={c.phone}
                        href={`tel:+91${c.phone}`}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-xs transition-colors"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                        <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">({c.displayPhone || c.phone})</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Register CTA */}
                <Link
                  to={`/events/technovision-2026/register?competition=${comp.slug}`}
                  className="mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-500 transition-all uppercase tracking-wider shadow-lg shadow-cyan-500/25 text-xs sm:text-sm"
                >
                  Register for {comp.shortTitle} <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── FAQs ────────────────────────────────────────────────── */}
        {comp.faqs && comp.faqs.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-200 dark:border-white/10">
            <h2 className="text-3xl font-black italic uppercase tracking-tight text-center mb-12">
              Frequently Asked <span className="text-cyan-500">Questions</span>
            </h2>
            <div className="space-y-4">
              {comp.faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom CTA ──────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-cyan-500/10 rounded-3xl border border-cyan-500/20 p-10 space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">
              Ready to <span className="text-cyan-500">Compete</span>?
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Register now and secure your spot in {comp.title}. Limited slots available.
            </p>
            <Link
              to={`/events/technovision-2026/register?competition=${comp.slug}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 text-lg"
            >
              Register Now <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && <Lightbox src={lightboxImg} alt={comp.title} onClose={() => setLightboxImg(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default CompetitionDetails;

