import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, MessageCircle, Info,
    ChevronDown, Trophy, Clock, Phone,
    Download, ExternalLink, Bot, Presentation, Lightbulb, Mail,
    Sparkles, Flame, ShieldAlert, ArrowRight, Play, Eye,
    Share2, Copy, Check, AlertTriangle, Users, CheckCircle2,
    Compass, ShieldCheck, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Assets
import bannerImg from '../assets/events/technovision_nov2026/banner.jpg';
import posterImg from '../assets/events/technovision_nov2026/poster.jpeg';

// Dynamic Gallery Photos from the recent temp assets
const rawGalleryImages = import.meta.glob(
    '../assets/events/technovision_nov2026/gallery/*.{jpg,jpeg,png}',
    { eager: true }
);
const galleryPhotos = Object.values(rawGalleryImages).map((m) => m.default || m);

// PDFs
import roboPdf from '../assets/events/technovision_nov2026/robo_rumble_rules.pdf';
import modelPdf from '../assets/events/technovision_nov2026/model_presentation_rulebook.pdf';
import walkingBotPdf from '../assets/events/technovision_nov2026/walking_bot_rules.pdf';
import wholeRulesPdf from '../assets/events/technovision_nov2026/whole_rules_book.pdf';

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/ITmlgvbmiM7Bu8GGWddYxc";

// Registration Form Component
import TechnovisionNovRegistration from '../components/TechnovisionNovRegistration';

const VIDEO_MP4_URL =
    "https://res.cloudinary.com/kgxykn6s/video/upload/lv_0_20261022104140.mp4";

// Registration closes 31 Oct 2026, 11:59 PM IST (explicit +05:30 offset so it is
// the same instant for every visitor regardless of their device timezone)
const REGISTRATION_DEADLINE = "2026-10-31T23:59:00+05:30";
const REGISTRATION_DEADLINE_MS = new Date(REGISTRATION_DEADLINE).getTime();

// True once the deadline passes; flips automatically without a page reload
const useRegistrationClosed = () => {
    const [closed, setClosed] = useState(() => Date.now() >= REGISTRATION_DEADLINE_MS);

    useEffect(() => {
        if (closed) return undefined;
        const interval = setInterval(() => {
            if (Date.now() >= REGISTRATION_DEADLINE_MS) setClosed(true);
        }, 1000);
        return () => clearInterval(interval);
    }, [closed]);

    return closed;
};

// Countdown Timer Component with Urgency Escalation
const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        totalDays: 0,
        isExpired: false
    });

    useEffect(() => {
        const updateCountdown = () => {
            const difference = new Date(targetDate) - new Date();
            if (difference <= 0) {
                setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00", totalDays: 0, isExpired: true });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
                totalDays: days,
                isExpired: false
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (timeLeft.isExpired) {
        return (
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-3 rounded-2xl my-4 font-mono font-bold text-sm">
                <AlertTriangle size={18} /> Registrations are officially closed. Stay tuned for live event matches!
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1.5 min-[360px]:gap-2 sm:gap-4 my-3 sm:my-4">
            {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINS", value: timeLeft.minutes },
                { label: "SECS", value: timeLeft.seconds },
            ].map((unit, idx) => (
                <div
                    key={idx}
                    className="flex flex-col items-center px-2 min-[360px]:px-3 sm:px-5 py-1.5 min-[360px]:py-2 sm:py-3 rounded-xl sm:rounded-2xl min-w-[56px] min-[360px]:min-w-[65px] sm:min-w-[85px] border bg-black/60 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                >
                    <span className="text-xl min-[360px]:text-2xl sm:text-4xl font-black font-mono text-cyan-400">
                        {unit.value}
                    </span>
                    <span className="text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
                        {unit.label}
                    </span>
                </div>
            ))}
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-700 dark:text-amber-300 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Registration ends 31 Oct, 11:59 PM IST. Officially closes after this.</span>
            </div>
        </div>
    );
};

const SECTION_TONES = {
    cyan: 'text-cyan-600 dark:text-cyan-400',
    amber: 'text-amber-600 dark:text-amber-400',
    purple: 'text-purple-900 dark:text-purple-300',
};

// Collapsed dropdown below lg, always-open block on lg and above
const CollapsibleSection = ({ title, icon, tone = 'cyan', wrapClass = '', children }) => {
    const [open, setOpen] = useState(false);
    const toneClass = SECTION_TONES[tone];
    return (
        <div className={wrapClass}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className={`lg:hidden w-full flex items-center justify-between gap-2 text-left text-xs font-mono uppercase tracking-widest font-bold min-h-[32px] ${toneClass}`}
            >
                <span className="flex items-center gap-2">{icon} {title}</span>
                <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <h4 className={`hidden lg:flex text-sm font-mono uppercase tracking-widest items-center gap-2 mb-3 font-bold ${toneClass}`}>
                {icon} {title}
            </h4>
            <div className={`${open ? 'block pt-2.5' : 'hidden'} lg:block lg:pt-0`}>
                {children}
            </div>
        </div>
    );
};

const TechnovisionNov2026 = () => {
    const [activeTab, setActiveTab] = useState('botRacing'); // default highlights the exciting new competition
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const registrationClosed = useRegistrationClosed();
    const swiperRef = useRef(null);
    const galleryWrapRef = useRef(null);
    const galleryInViewRef = useRef(false);
    const videoRef = useRef(null);

    // Audio unlock listener for browser autoplay policy
    useEffect(() => {
        const unlockAudio = () => {
            document.querySelectorAll('.technovision-gallery-swiper video').forEach((videoEl) => {
                if (galleryInViewRef.current && !videoEl.paused && videoEl.muted) {
                    videoEl.muted = false;
                }
            });
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);
        window.addEventListener('keydown', unlockAudio);

        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
    }, []);

    // Set page title and meta
    useEffect(() => {
        document.title = "Technovision '26 | SATI Vidisha - Official Battle Arena & Registrations";
    }, []);

    // Listen for scroll to toggle sticky mobile bar with earlier trigger
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowStickyBar(true);
            } else {
                setShowStickyBar(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const events = {
        model: {
            id: 'model',
            title: 'Model Presentation',
            tag: 'Hardware & Innovation',
            badge: 'Open Innovation',
            icon: <Lightbulb size={26} />,
            color: 'amber',
            pdfLink: modelPdf,
            description: "Demonstrate a working hardware prototype, robotics system, or IoT solution to an expert jury.",
            highlight: "Working model required. Live Q&A and jury scoring.",
            rules: [
                "Project must be a safe, working hardware or scientific model.",
                "Original work only. Plagiarism or pre-bought kits lead to disqualification.",
                "No explosive, hazardous, or high-risk chemical components.",
                "Team size: 2 to 4 members."
            ],
            prizes: [
                "Winner & Runner-Up: Trophies + Goodies",
                "Participation Certificates for all attendees"
            ],
            timeline: [
                { time: "31 Oct 2026, 11:59 PM IST", event: "Registration Deadline" },
                { time: "02 Nov 2026 (10 AM - 5 PM)", event: "Event Date & Time" },
                { time: "216 Classroom", event: "Location" }
            ]
        },
        robo: {
            id: 'robo',
            title: 'Robo Rumble',
            tag: 'Combat & Hurdle Arena',
            badge: 'High Voltage',
            icon: <Trophy size={26} />,
            color: 'cyan',
            pdfLink: roboPdf,
            description: "Custom robots take on hurdles, rugged terrain, and knockout matches in a combat arena.",
            highlight: "Weight cap: 1.5 kg. Max voltage: 12V.",
            notice: "All bots must be completed by 30 October. A screening round will be held on 31 October. Only 15 shortlisted teams will be selected for Robo Rumble.",
            rules: [
                "Bot weight must not exceed 1.5 kg.",
                "Bot must fit within 20 x 20 x 20 cm at match start.",
                "Maximum 12V DC. Wired or wireless control allowed.",
                "Team size: 2 to 4 members."
            ],
            prizes: [
                "Top-3 Teams: Trophies, Certificates & Goodies",
                "Participation Certificates for all teams"
            ],
            timeline: [
                { time: "31 Oct 2026, 11:59 PM IST", event: "Registration Deadline" },
                { time: "03 Nov 2026 (10 AM - 2 PM)", event: "Event Date & Time" },
                { time: "IT Garden", event: "Location" }
            ]
        },
        botRacing: {
            id: 'botRacing',
            title: 'Walking Bot',
            subtitle: '(Strictly No Wheels)',
            tag: 'Locomotion Innovation',
            badge: 'Strictly No Wheels',
            icon: <Bot size={26} />,
            color: 'purple',
            pdfLink: walkingBotPdf,
            description: "Obstacle sprint for custom robots built strictly without wheels, using legged linkages or crawlers.",
            highlight: "🛑 No wheels allowed. Legged linkages, inchworms & crawlers only.",
            notice: "All bots must be completed by 30 October. A screening round will be held on 31 October. Only 15 shortlisted teams will be selected for Walking Bot.",
            rules: [
                "NO wheels or circular rolling elements for movement.",
                "Allowed: Theo Jansen/Klann linkages, walkers, inchworms, crawlers, sliding linkages.",
                "Bot must cross the multi-terrain obstacle track in minimum time. Power supply up to 12V DC.",
                "Team size: 2 to 4 members."
            ],
            prizes: [
                "Fastest Bot Winner: Trophy, Goodies & Certificate",
                "Innovation in Locomotion Award",
                "Participation Certificates for all builders"
            ],
            timeline: [
                { time: "31 Oct 2026, 11:59 PM IST", event: "Registration Deadline" },
                { time: "02 Nov 2026 (2:30 PM - 5 PM)", event: "Event Date & Time" },
                { time: "IT Garden", event: "Location" }
            ]
        }
    };

    const currentEvent = events[activeTab];

    // Mixed Gallery Items: 14 recent event photos + 1 video in the middle
    const midIndex = Math.floor(galleryPhotos.length / 2);
    const galleryItems = [
        ...galleryPhotos.slice(0, midIndex).map((src) => ({
            type: 'image',
            src,
        })),
        {
            type: 'video',
            src: VIDEO_MP4_URL,
        },
        ...galleryPhotos.slice(midIndex).map((src) => ({
            type: 'image',
            src,
        })),
    ];

    const handleSlideMedia = (swiper) => {
        if (!swiper) return;

        // Gallery off-screen: keep it still and silent
        if (!galleryInViewRef.current) {
            document.querySelectorAll('.technovision-gallery-swiper video').forEach((videoEl) => {
                videoEl.pause();
            });
            if (swiper.autoplay && swiper.autoplay.running) {
                swiper.autoplay.stop();
            }
            return;
        }

        const activeSlide = swiper.slides?.[swiper.activeIndex] || document.querySelector('.technovision-gallery-swiper .swiper-slide-active');
        const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

        // Pause any video not on the main screen
        document.querySelectorAll('.technovision-gallery-swiper video').forEach((videoEl) => {
            if (videoEl !== activeVideo) {
                videoEl.pause();
            }
        });

        if (activeVideo) {
            // When video is on the main screen: stop swiper autoplay to allow viewing
            if (swiper.autoplay && swiper.autoplay.running) {
                swiper.autoplay.stop();
            }

            if (activeVideo.paused) {
                activeVideo.currentTime = 0;
                activeVideo.muted = false;
                activeVideo.volume = 1;
                const playPromise = activeVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.log("Unmuted autoplay restricted by browser policy, fallback to muted:", err);
                        activeVideo.muted = true;
                        activeVideo.play().catch(() => {});
                    });
                }
            }
        } else {
            // When images are on the main screen: ensure auto-rotation is running
            if (swiper.autoplay && !swiper.autoplay.running) {
                swiper.autoplay.start();
            }
        }
    };

    // Run the gallery (auto-rotation + video) only while it is visible on screen
    useEffect(() => {
        const el = galleryWrapRef.current;
        if (!el) return undefined;
        if (typeof IntersectionObserver === 'undefined') {
            galleryInViewRef.current = true;
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                galleryInViewRef.current = entry.isIntersecting;
                handleSlideMedia(swiperRef.current);
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const scrollToRegistration = (eventId) => {
        const targetEvent = eventId || activeTab;
        setActiveTab(targetEvent);
        const el = document.getElementById('registration-portal');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Social Share Handler
    const handleShareWhatsApp = () => {
        const text = `🔥 Technovision '26 is LIVE at SATI Vidisha!
⚔️ Robo Rumble Combat Arena
🤖 Walking Bot (Strictly No Wheels)
💡 Working Model Presentation
🏆 Trophies, Goodies & Direct Certificates for All!

Register your team now before slots close (Deadline: 31 Oct, 11:59 PM IST):
${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        toast.success("Page link copied! Share with your classmates.");
        setTimeout(() => setCopiedLink(false), 2500);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Technovision '26 | SATI Vidisha",
                    text: "Join our team for Technovision '26! Robo Rumble, Walking Bot (No Wheels) & Model Presentation. Free registration for everyone.",
                    url: window.location.href,
                });
            } catch (err) {
                // user canceled or not supported
            }
        } else {
            handleShareWhatsApp();
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden w-full">

            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* ================= STICKY MOBILE REGISTER BAR ================= */}
            <AnimatePresence>
                {showStickyBar && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-3 left-3 right-3 z-40 sm:hidden"
                    >
                        <div className="bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl border border-cyan-500/50 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.3)] flex items-center justify-between gap-2">
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider truncate">
                                    Technovision '26
                                </span>
                                <span className="text-xs font-black text-white truncate">
                                    02 - 03 Nov • SATI
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={handleShareWhatsApp}
                                    className="p-2.5 rounded-xl bg-white/10 text-emerald-400 hover:bg-white/20 transition-colors"
                                    title="Share on WhatsApp"
                                >
                                    <Share2 size={16} />
                                </button>
                                <button
                                    onClick={() => scrollToRegistration()}
                                    className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30"
                                >
                                    <Flame size={14} className="text-amber-300 animate-pulse" /> Register Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10">

                {/* ================= HERO SECTION ================= */}
                <section className="relative pt-20 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-6">
                    {/* Live Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4 px-2"
                    >
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] min-[360px]:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold text-center">
                            {registrationClosed ? 'Registrations Closed' : 'Registrations Live Now • Open for All Colleges'}
                        </span>
                    </motion.div>

                    <div className="max-w-7xl mx-auto text-center space-y-4 sm:space-y-5">
                        
                        {/* Event Date & Location Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-md shadow-cyan-500/10"
                        >
                            <Calendar size={15} className="text-cyan-500" />
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                                02 - 03 Nov 2026
                            </span>
                            <span className="text-cyan-500/40 hidden sm:inline">|</span>
                            <a
                                href="https://maps.app.goo.gl/fTdZm1HhBHnK9JYEA"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                            >
                                <MapPin size={15} className="text-cyan-500" />
                                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                                    IT Garden, SATI Vidisha
                                </span>
                            </a>
                        </motion.div>

                        {/* Mega Title with Cyber Font & Screen Clamping */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-3xl min-[360px]:text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none font-['Russo_One',sans-serif] bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-white dark:to-white/60 break-words px-2"
                        >
                            Technovision<span className="text-cyan-500">.</span>
                        </motion.h1>

                        <p className="text-xs min-[360px]:text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium px-2">
                            The flagship technical battleground returns. 3 arena competitions, non-wheeled robotics engineering, and game-changing technical prototypes.
                        </p>

                        {/* 3 Arena Quick-Jump Pills */}
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-1 px-1">
                            {[
                                { id: 'model', label: '💡 Model Presentation', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10' },
                                { id: 'robo', label: '⚔️ Robo Rumble', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10' },
                                { id: 'botRacing', label: '🤖 Walking Bot (No Wheels)', color: 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10' },
                            ].map((pill) => (
                                <button
                                    key={pill.id}
                                    onClick={() => {
                                        setActiveTab(pill.id);
                                        const el = document.getElementById('arenas-section');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`px-2.5 min-[360px]:px-3.5 py-1 min-[360px]:py-1.5 rounded-full border text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-transform hover:scale-105 ${pill.color}`}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>

                        {/* Live Countdown Timer */}
                        <div className="pt-1 sm:pt-2">
                            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-cyan-400/90 block mb-1">
                                ⏳ Official Registration Closes In:
                            </span>
                            <CountdownTimer targetDate={REGISTRATION_DEADLINE} />
                        </div>

                        {/* Hero Banner Image with Cyber Tech Frame */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="group relative w-full max-w-5xl mx-auto mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)] border border-cyan-500/30 bg-black"
                        >
                            {/* Cyber Corners */}
                            <div className="absolute top-0 left-0 w-8 sm:w-16 h-8 sm:h-16 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-cyan-400 rounded-tl-2xl sm:rounded-tl-3xl z-20 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-8 sm:w-16 h-8 sm:h-16 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-cyan-400 rounded-tr-2xl sm:rounded-tr-3xl z-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-8 sm:w-16 h-8 sm:h-16 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-cyan-400 rounded-bl-2xl sm:rounded-bl-3xl z-20 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-8 sm:w-16 h-8 sm:h-16 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-cyan-400 rounded-br-2xl sm:rounded-br-3xl z-20 pointer-events-none" />

                            {/* Scanning Laser Line */}
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_4px_rgba(6,182,212,0.9)] z-20 pointer-events-none"
                            />

                            {/* HUD Badges */}
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 hidden min-[480px]:flex flex-col gap-1 z-20 pointer-events-none">
                                <span className="text-[10px] sm:text-xs font-mono text-cyan-300 font-bold bg-black/70 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded border border-cyan-500/40 backdrop-blur-md">
                                    FLUX-TECHNOVISION-NOV26
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400/80 text-right">SYSTEM.ONLINE</span>
                            </div>

                            <img
                                src={bannerImg}
                                alt="Technovision Official Banner"
                                className="w-full h-auto object-cover max-h-[500px] hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Responsive Call to Action Buttons */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-3 pt-3 sm:pt-4 max-w-3xl mx-auto w-full px-1">
                            <button
                                onClick={() => scrollToRegistration()}
                                className="col-span-2 sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-cyan-500/30 text-xs sm:text-sm min-h-[44px] sm:min-h-[48px]"
                            >
                                <Flame size={16} className="text-amber-300" /> Register Your Team Now
                            </button>

                            <a
                                href={WHATSAPP_GROUP_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#25D366] text-white px-3 sm:px-6 py-2.5 sm:py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-all shadow-md text-xs sm:text-sm min-h-[40px] sm:min-h-[48px]"
                            >
                                <MessageCircle size={15} /> Join WhatsApp Group
                            </a>

                            <a
                                href={wholeRulesPdf}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-300 hover:text-black dark:hover:text-white px-2 sm:px-6 py-2.5 sm:py-4 rounded-xl font-bold leading-tight text-center transition-all border border-slate-200 dark:border-white/10 text-xs sm:text-sm min-h-[40px] sm:min-h-[48px]"
                            >
                                <Download size={15} /> Complete Rulebook (PDF)
                            </a>
                        </div>
                    </div>
                </section>

                {/* ================= KEY METRICS & CREDIBILITY BAR ================= */}
                <section className="hidden md:block max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-md">
                        <div className="text-center p-2 sm:p-3">
                            <h3 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black text-cyan-600 dark:text-cyan-400 font-mono">Open</h3>
                            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-0.5 sm:mt-1">All Institutions</p>
                            <span className="text-[10px] sm:text-[11px] text-slate-500">All Colleges & Branches</span>
                        </div>
                        <div className="text-center p-2 sm:p-3">
                            <h3 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black text-purple-600 dark:text-purple-400 font-mono">3</h3>
                            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-0.5 sm:mt-1">Battle Arenas</p>
                            <span className="text-[10px] sm:text-[11px] text-slate-500">Hardware, Combat & Walking Bots</span>
                        </div>
                        <div className="text-center p-2 sm:p-3">
                            <h3 className="text-xl min-[360px]:text-2xl sm:text-3xl lg:text-4xl font-black text-amber-500 font-mono">Exciting</h3>
                            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-0.5 sm:mt-1">Rewards & Goodies</p>
                            <span className="text-[10px] sm:text-[11px] text-slate-500">Trophies & Tech Swag</span>
                        </div>
                        <div className="text-center p-2 sm:p-3">
                            <h3 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100%</h3>
                            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-0.5 sm:mt-1">Verified Certs</p>
                            <span className="text-[10px] sm:text-[11px] text-slate-500">Official SATI & FLUX Certs</span>
                        </div>
                    </div>
                </section>

                {/* ================= POSTER & OVERVIEW ================= */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
                        {/* Interactive Glitch Poster (Hover Triggered) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="group relative max-w-[220px] min-[360px]:max-w-[260px] sm:max-w-sm mx-auto cursor-pointer"
                        >
                            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.3)] bg-black border border-cyan-500/40">
                                <img
                                    src={posterImg}
                                    alt="Technovision '26 Official Poster"
                                    className="w-full h-auto object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 cyber-glitch-hover-1 mix-blend-color-dodge z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <img src={posterImg} alt="Glitch effect" className="w-full h-full object-cover filter contrast-150 brightness-125 sepia-[0.5] hue-rotate-[-30deg]" />
                                </div>
                                <div className="absolute inset-0 cyber-glitch-hover-2 mix-blend-exclusion z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <img src={posterImg} alt="Glitch effect 2" className="w-full h-full object-cover filter contrast-125 brightness-150 sepia-[0.3] hue-rotate-[90deg] translate-x-2" />
                                </div>
                            </div>
                            <p className="text-center text-[10px] sm:text-[11px] font-mono text-slate-500 mt-1.5 sm:mt-2">
                                Hover over poster to inspect cyber scan
                            </p>
                        </motion.div>

                        {/* Overview Text */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
                                <Sparkles size={15} /> Technical Fest 2026 • Samrat Ashok Tech. Institute
                            </div>
                            <h2 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black italic uppercase tracking-tighter font-['Russo_One',sans-serif] text-slate-900 dark:text-white">
                                Clash of <span className="text-cyan-500 dark:text-cyan-400">Metal & Innovation</span>
                            </h2>
                            <p className="text-xs sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                                Technovision returns this November with three premier high-adrenaline competitions: <strong>Model Presentation</strong>, <strong>Robo Rumble Arena</strong>, and the all-new <strong>Walking Bot without Wheels</strong> challenge. Open to students across all engineering branches, years, and outside institutions to prototype, battle, and win glory.
                            </p>

                            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                                {[
                                    { title: "Universal Eligibility", desc: "Open to 1st, 2nd, 3rd, and 4th-year students across all engineering, diploma, and science branches." },
                                    { title: "Free for Everyone", desc: "Registration is completely free for all participants, SATI and external colleges alike. No hidden fees." },
                                    { title: "Direct Certificates & Recognitions", desc: "Every participant receives an official signed certificate from SATI Vidisha and Club FLUX." },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase">{item.title}</h4>
                                            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= MIXED MEDIA GALLERY (PHOTOS + VIDEO) ================= */}
                <section className="max-w-7xl mx-auto px-3 sm:px-6 py-10 sm:py-16 border-t border-slate-200 dark:border-white/10">
                    <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-purple-500/30 text-[11px] sm:text-xs font-mono tracking-widest uppercase mb-2 sm:mb-3 font-bold">
                            <Eye size={13} /> Flashback & Official Video Recap
                        </div>
                        <h2 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black italic tracking-tighter uppercase font-['Russo_One',sans-serif] text-slate-900 dark:text-white">
                            Past Year <span className="text-purple-600 dark:text-purple-400">Highlights</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2 px-2">
                            Swipe through real action shots from previous Technovision arenas. Watch our 30-second official teaser right in the middle!
                        </p>
                    </div>

                    {/* Swiper Slider with Visible Styled Controls */}
                    <div className="relative" ref={galleryWrapRef}>
                        <Swiper
                            modules={[Navigation, Pagination, Keyboard, Autoplay]}
                            spaceBetween={16}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
                            breakpoints={{
                                640: { slidesPerView: 1.5, spaceBetween: 20 },
                                1024: { slidesPerView: 2.2, spaceBetween: 24 }
                            }}
                            centeredSlides={true}
                            navigation
                            pagination={{ clickable: true, dynamicBullets: true }}
                            keyboard={{ enabled: true }}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            onSlideChange={(swiper) => {
                                handleSlideMedia(swiper);
                            }}
                            onSlideChangeTransitionEnd={(swiper) => {
                                handleSlideMedia(swiper);
                            }}
                            className="w-full pb-12 sm:pb-14 technovision-gallery-swiper"
                        >
                            {galleryItems.map((item, idx) => (
                                <SwiperSlide key={idx} className="flex justify-center">
                                    <div className="w-full h-[280px] min-[360px]:h-[320px] sm:h-[440px] bg-slate-950 rounded-2xl sm:rounded-3xl border border-cyan-500/30 overflow-hidden relative shadow-2xl flex items-center justify-center p-1.5 sm:p-2 group">
                                        {item.type === 'video' ? (
                                            <div className="w-full h-full relative rounded-xl sm:rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                                                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 bg-purple-600 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest uppercase flex items-center gap-1 shadow-lg pointer-events-none">
                                                    <Play size={10} /> Video Recap
                                                </div>

                                                <video
                                                    ref={videoRef}
                                                    src={item.src}
                                                    controls
                                                    playsInline
                                                    preload="metadata"
                                                    className="w-full h-full object-contain rounded-xl sm:rounded-2xl bg-black"
                                                    onEnded={() => {
                                                        if (swiperRef.current) {
                                                            swiperRef.current.slideNext();
                                                            if (swiperRef.current.autoplay) {
                                                                swiperRef.current.autoplay.start();
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-black">
                                                <img
                                                    src={item.src}
                                                    alt="Technovision Arena Highlight"
                                                    loading="lazy"
                                                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>

                {/* ================= 3 COMPETITIONS SHOWCASE ================= */}
                <section id="arenas-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-10 sm:py-16 border-t border-slate-200 dark:border-white/10 scroll-mt-20">
                    <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
                            Interactive Arena Selector
                        </span>
                        <h2 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black italic tracking-tighter uppercase mt-1 font-['Russo_One',sans-serif] text-slate-900 dark:text-white">
                            The 3 <span className="text-cyan-500 dark:text-cyan-400">Arenas</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                            Click a competition mode below to inspect match rules, eligibility, prizes, and match timeline.
                        </p>
                    </div>

                    {/* Game-Mode Style Arena Selector Cards */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-10">
                        {Object.values(events).map((ev) => {
                            const isSelected = activeTab === ev.id;
                            return (
                                <button
                                    key={ev.id}
                                    onClick={() => setActiveTab(ev.id)}
                                    className={`relative p-2 sm:p-5 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-all duration-300 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-0 ${
                                        isSelected
                                            ? 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-500 text-cyan-900 dark:text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.25)] sm:scale-[1.02] ring-2 ring-cyan-500/40'
                                            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:border-cyan-500/40'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 min-w-0">
                                        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-[26px] sm:[&>svg]:h-[26px] ${
                                            isSelected ? 'bg-cyan-500 text-black shadow-md' : 'bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-300'
                                        }`}>
                                            {ev.icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="hidden sm:block text-[10px] font-mono tracking-wider uppercase text-cyan-600 dark:text-cyan-400 font-bold truncate">
                                                {ev.badge}
                                            </span>
                                            <h4 className="text-[11px] leading-tight sm:leading-normal sm:text-base md:text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white sm:truncate">
                                                {ev.title}
                                            </h4>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="hidden sm:block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Detailed Tab Card (Fixed Light & Dark Contrast) */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEvent.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="bg-white dark:bg-[#0c0d14] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-cyan-500/30 p-3.5 min-[360px]:p-4 sm:p-10 lg:p-12 shadow-2xl space-y-4 sm:space-y-10"
                        >
                            {/* Card Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6 border-b border-slate-200 dark:border-white/10 pb-4 sm:pb-8">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
                                        {currentEvent.tag}
                                    </span>
                                    <h3 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white mt-1 font-['Russo_One',sans-serif]">
                                        {currentEvent.title}{' '}
                                        {currentEvent.subtitle && (
                                            <span className="text-lg sm:text-2xl text-pink-600 dark:text-pink-400 font-bold block sm:inline">
                                                {currentEvent.subtitle}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-300 font-mono mt-1">
                                        {currentEvent.highlight}
                                    </p>
                                </div>

                                <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => scrollToRegistration(currentEvent.id)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-2 sm:px-6 leading-tight text-center py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-cyan-500/25 min-h-[44px]"
                                    >
                                        Register For This Event <ArrowRight size={14} />
                                    </button>

                                    {currentEvent.pdfLink ? (
                                        <a
                                            href={currentEvent.pdfLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Rulebook (PDF)"
                                            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white flex-1 sm:flex-none px-2 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs leading-tight text-center transition-all border border-slate-300 dark:border-slate-700 min-h-[44px]"
                                        >
                                            <Download size={14} /> <span>Rulebook (PDF)</span>
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            aria-label="Rulebook (PDF)"
                                            onClick={() => toast(`${currentEvent.title} rulebook will be available soon.`)}
                                            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white flex-1 sm:flex-none px-2 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs leading-tight text-center transition-all border border-slate-300 dark:border-slate-700 min-h-[44px]"
                                        >
                                            <Download size={14} /> <span>Rulebook (PDF)</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-10">
                                {/* Left Column: About & Rules */}
                                <div className="space-y-3 lg:space-y-8">
                                    {currentEvent.notice && (
                                        <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-red-400 dark:border-red-500/50">
                                            <AlertTriangle size={20} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                                                    Important Notice
                                                </span>
                                                <p className="text-xs sm:text-sm font-bold text-red-950 dark:text-red-100 leading-relaxed">
                                                    {currentEvent.notice}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Timeline chips (mobile / tablet only; full box shows on lg) */}
                                    <div className="grid grid-cols-3 gap-1.5 lg:hidden">
                                        {currentEvent.timeline.map((item, idx) => (
                                            <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center min-w-0">
                                                <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">
                                                    {item.event}
                                                </span>
                                                <span className="block text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-300 leading-tight mt-1 break-words">
                                                    {item.time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <CollapsibleSection
                                        title="About The Competition"
                                        icon={<Info size={16} />}
                                        wrapClass="p-3 lg:p-0 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 lg:border-0 lg:bg-transparent lg:rounded-none"
                                    >
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm lg:text-base">
                                            {currentEvent.description}
                                        </p>
                                    </CollapsibleSection>

                                    <CollapsibleSection
                                        title="Key Rules & Regulations"
                                        icon={<ShieldAlert size={16} />}
                                        wrapClass="p-3 lg:p-0 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 lg:border-0 lg:bg-transparent lg:rounded-none"
                                    >
                                        <ul className="space-y-2.5">
                                            {currentEvent.rules.map((rule, idx) => (
                                                <li key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-2 shrink-0" />
                                                    <span>{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CollapsibleSection>

                                    {/* Special Mechanism Callout for Walking Bot */}
                                    {currentEvent.id === 'botRacing' && (
                                        <CollapsibleSection
                                            title="Accepted Locomotion Inspirations"
                                            icon={<Bot size={16} />}
                                            tone="purple"
                                            wrapClass="p-3 lg:p-5 rounded-xl lg:rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/40"
                                        >
                                            <p className="text-xs text-purple-800 dark:text-purple-200/90 leading-relaxed">
                                                Theo Jansen leg linkages, Klann linkages, bipedal or quadruped walkers,
                                                peristaltic / inchworm crawlers, and linear slide skating mechanisms. Any wheel usage results in immediate disqualification.
                                            </p>
                                        </CollapsibleSection>
                                    )}
                                </div>

                                {/* Right Column: Timeline & Prizes */}
                                <div className="space-y-3 lg:space-y-6">
                                    {/* Timeline Box (lg only) */}
                                    <div className="hidden lg:block p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
                                        <h4 className="text-sm font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-2 font-bold">
                                            <Clock size={16} /> Arena Timeline
                                        </h4>
                                        <div className="space-y-3 font-mono text-xs sm:text-sm">
                                            {currentEvent.timeline.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2.5 last:border-0 last:pb-0">
                                                    <span className="text-slate-600 dark:text-slate-400">{item.event}</span>
                                                    <span className="font-bold text-cyan-600 dark:text-cyan-300">{item.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Prize Pool Box */}
                                    <CollapsibleSection
                                        title="Rewards & Recognition"
                                        icon={<Trophy size={16} />}
                                        tone="amber"
                                        wrapClass="p-3 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30"
                                    >
                                        <ul className="space-y-2">
                                            {currentEvent.prizes.map((p, idx) => (
                                                <li key={idx} className="flex items-start gap-2.5 text-slate-800 dark:text-amber-200/90 text-sm">
                                                    <Trophy size={14} className="text-amber-500 mt-1 shrink-0" />
                                                    <span>{p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CollapsibleSection>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </section>

                {/* ================= UNIFIED REGISTRATION SECTION ================= */}
                <section className="max-w-5xl mx-auto px-3 sm:px-6 py-10 sm:py-16 border-t border-slate-200 dark:border-white/10">
                    {registrationClosed ? (
                        <div id="registration-portal" className="text-center p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-red-50 dark:bg-red-950/30 border-2 border-red-400 dark:border-red-500/50 space-y-2">
                            <AlertTriangle size={32} className="mx-auto text-red-600 dark:text-red-400" />
                            <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight font-['Russo_One',sans-serif] text-red-700 dark:text-red-300">
                                Registration Closed
                            </h2>
                            <p className="text-xs sm:text-sm text-red-900 dark:text-red-100 font-medium">
                                Registration officially closed on 31 Oct 2026, 11:59 PM IST. Thank you for your interest in Technovision '26.
                            </p>
                        </div>
                    ) : (
                        <TechnovisionNovRegistration
                            preselectedEvent={activeTab}
                            onEventChange={(newEventId) => setActiveTab(newEventId)}
                        />
                    )}
                </section>

                {/* ================= FAQS ================= */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-200 dark:border-white/10">
                    <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-center mb-10 font-['Russo_One',sans-serif] text-slate-900 dark:text-white">
                        Frequently Asked <span className="text-cyan-500 dark:text-cyan-400">Questions</span>
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Are students from other colleges eligible to participate?",
                                a: "Yes! Technovision welcomes participation from all colleges, universities, and polytechnics across India. Cross-college teams are also fully permitted."
                            },
                            {
                                q: "Can a team participate in more than one competition?",
                                a: "Yes, you can register for multiple events (e.g., both Robo Rumble and Model Presentation) provided your team members can manage the match schedule."
                            },
                            {
                                q: "What is the rule for Walking Bot without Wheels?",
                                a: "Your robot must race without using wheels or circular rollers for movement. Accepted mechanisms include Theo Jansen leg linkages, Klann linkages, walkers, inchworms, crawlers, and sliding linkages."
                            },
                            {
                                q: "Is there any registration fee?",
                                a: "Registration is completely free for everyone, including SATI students and external college teams. There are no hidden fees."
                            },
                            {
                                q: "Will certificates be provided to all team members?",
                                a: "Yes! Every registered team member who participates will receive an official Certificate of Participation from SATI Vidisha and Club FLUX. Winners receive trophies and certificates of excellence."
                            },
                            {
                                q: "Can 1st-year students with no prior robotics experience join?",
                                a: "Absolutely! Technovision is designed as an inclusive learning arena. 1st-year students are strongly encouraged to participate in Model Presentation or team up with seniors for Robo Rumble."
                            }
                        ].map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-colors"
                            >
                                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none">
                                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{faq.q}</span>
                                    <ChevronDown className="transition-transform duration-300 group-open:rotate-180 text-cyan-500 dark:text-cyan-400 shrink-0 ml-3" />
                                </summary>
                                <div className="px-5 sm:px-6 pb-6 text-slate-600 dark:text-gray-300 leading-relaxed text-sm border-t border-slate-100 dark:border-white/5 pt-3">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ================= ORGANIZED BY & CONTACT SECTION ================= */}
                <section className="text-center py-16 px-4 sm:px-6 border-t border-slate-200 dark:border-white/10 mb-8 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold mb-3">
                        <ShieldCheck size={16} /> Official Technical Club FLUX • SATI Vidisha
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight mb-3 font-['Russo_One',sans-serif] text-slate-900 dark:text-white">
                        Have Questions or Need Help?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto mb-8">
                        Get in direct touch with the student organizing committee for rule clarifications, arena dimensions, or accommodation guidance.
                    </p>

                    <div className="flex flex-col items-center gap-6">
                        <a
                            href="mailto:flux.club@satiengg.in"
                            className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-mono text-sm font-bold bg-cyan-500/10 px-5 py-2.5 rounded-full border border-cyan-500/30"
                        >
                            <Mail size={16} /> flux.club@satiengg.in
                        </a>

                        {/* Student Coordinator Quick-Call Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg">
                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between gap-2">
                                <div className="text-left min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Devansh Patel</h4>
                                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block truncate">Management Head, Technovision</span>
                                </div>
                                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                                    <a
                                        href="tel:+919302276804"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                                        title="Call Devansh"
                                    >
                                        <Phone size={15} />
                                    </a>
                                    <a
                                        href="https://wa.me/919302276804"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                                        title="WhatsApp Devansh"
                                    >
                                        <MessageCircle size={15} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between gap-2">
                                <div className="text-left min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Dhananjay Rawat</h4>
                                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block truncate">Software Head, Technovision</span>
                                </div>
                                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                                    <a
                                        href="tel:+919238138023"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                                        title="Call Dhananjay"
                                    >
                                        <Phone size={15} />
                                    </a>
                                    <a
                                        href="https://wa.me/919238138023"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                                        title="WhatsApp Dhananjay"
                                    >
                                        <MessageCircle size={15} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between gap-2">
                                <div className="text-left min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Devanshu Vishwakarma</h4>
                                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block truncate">Co-Convenor, Technovision</span>
                                </div>
                                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                                    <a
                                        href="tel:+917024019720"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                                        title="Call Devanshu"
                                    >
                                        <Phone size={15} />
                                    </a>
                                    <a
                                        href="https://wa.me/917024019720"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                                        title="WhatsApp Devanshu"
                                    >
                                        <MessageCircle size={15} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between gap-2">
                                <div className="text-left min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Mrinal Rangare</h4>
                                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block truncate">Media Head, Technovision</span>
                                </div>
                                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                                    <a
                                        href="tel:+919752639678"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                                        title="Call Mrinal"
                                    >
                                        <Phone size={15} />
                                    </a>
                                    <a
                                        href="https://wa.me/919752639678"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 min-[360px]:p-2.5 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                                        title="WhatsApp Mrinal"
                                    >
                                        <MessageCircle size={15} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Venue Google Maps Navigation */}
                        <div className="pt-2">
                            <a
                                href="https://maps.app.goo.gl/fTdZm1HhBHnK9JYEA"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
                            >
                                <MapPin size={16} className="text-cyan-400 dark:text-cyan-600" /> Open IT Garden Directions on Google Maps
                            </a>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
};

export default TechnovisionNov2026;
