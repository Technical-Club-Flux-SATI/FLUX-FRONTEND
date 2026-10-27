import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Send,
  User,
  Users,
  Phone,
  GraduationCap,
  Building,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Trophy,
  Download,
  MessageCircle,
  Sparkles,
  Bot,
  Lightbulb,
  Crosshair,
  Copy,
  Check,
  Share2,
  AlertTriangle,
  Flame,
  ArrowRight
} from "lucide-react";
import jsPDF from "jspdf";
import {
  registerTechnovisionNov,
} from "../api";

const EVENTS = [
  {
    id: "model",
    title: "Model Presentation",
    tagline: "Hardware, Working Models & Innovation",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-600",
    border: "border-amber-500/40",
    accent: "text-amber-500 dark:text-amber-400",
    badge: "Hardware & IoT",
    minMembers: 2,
    maxMembers: 4,
  },
  {
    id: "robo",
    title: "Robo Rumble",
    tagline: "High-Octane Hurdle & Combat Arena",
    icon: Crosshair,
    color: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/40",
    accent: "text-cyan-500 dark:text-cyan-400",
    badge: "Combat & Hurdle",
    minMembers: 2,
    maxMembers: 4,
  },
  {
    id: "botRacing",
    title: "Walking Bot",
    subtitle: "(Strictly No Wheels)",
    tagline: "Legged, Crawlers & Non-Wheeled Locomotion",
    icon: Bot,
    color: "from-purple-500 to-pink-600",
    border: "border-purple-500/40",
    accent: "text-purple-500 dark:text-purple-400",
    badge: "Strictly No Wheels",
    minMembers: 2,
    maxMembers: 4,
  },
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

// Date, time and venue shown on the pass for each event
const EVENT_SCHEDULE = {
  model: { date: "02 Nov 2026", time: "10:30 AM", venue: "216 Classroom" },
  robo: { date: "03 Nov 2026", time: "10:30 AM", venue: "SU Ground" },
  botRacing: { date: "02 Nov 2026", time: "10:30 AM", venue: "SU Ground" },
};
const getSchedule = (eventId) => EVENT_SCHEDULE[eventId] || EVENT_SCHEDULE.model;

// Only college email IDs are accepted (e.g. name29cse051@satiengg.in)
const COLLEGE_EMAIL_REGEX = /^[^\s@]+@satiengg\.in$/i;

const emptyMember = () => ({
  name: "",
  email: "",
  contact: "",
  college: "",
  branch: "",
  enrollmentNo: "",
  year: "1st Year",
});

// Unsent form data is kept on this device so a refresh or accidental close does not wipe it
const DRAFT_KEY = "technovisionNovRegDraft";
const DRAFT_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft || Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
};

const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // storage unavailable: nothing to clear
  }
};

const TechnovisionNovRegistration = ({ preselectedEvent = "model", onEventChange }) => {
  const [draft] = useState(loadDraft);
  const [selectedEventId, setSelectedEventId] = useState(preselectedEvent);
  const currentEvent = EVENTS.find((e) => e.id === selectedEventId) || EVENTS[0];

  const [teamSize, setTeamSize] = useState(() => {
    const saved = Number(draft?.teamSize);
    if (
      Number.isInteger(saved) &&
      saved >= (currentEvent.minMembers || 2) &&
      saved <= currentEvent.maxMembers
    ) {
      return saved;
    }
    return currentEvent.minMembers || 2;
  });
  const [teamName, setTeamName] = useState(
    typeof draft?.teamName === "string" ? draft.teamName : ""
  );

  // Leader state
  const [leader, setLeader] = useState({
    name: "",
    email: "",
    contact: "",
    college: "",
    branch: "",
    enrollmentNo: "",
    year: "1st Year",
    ...(draft?.leader && typeof draft.leader === "object" ? draft.leader : {}),
  });

  // Additional members state
  const [teamMembers, setTeamMembers] = useState(() =>
    Array.isArray(draft?.teamMembers)
      ? draft.teamMembers.map((m) => ({ ...emptyMember(), ...(m && typeof m === "object" ? m : {}) }))
      : []
  );

  // Non-wheel declaration
  const [noWheelConfirmed, setNoWheelConfirmed] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Synchronize event changes
  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    if (onEventChange) onEventChange(eventId);
    const ev = EVENTS.find((e) => e.id === eventId);
    if (ev) {
      if (teamSize > ev.maxMembers) {
        setTeamSize(ev.maxMembers);
      } else if (teamSize < ev.minMembers) {
        setTeamSize(ev.minMembers);
      }
    }
  };

  // Synchronize when preselectedEvent prop changes
  useEffect(() => {
    if (preselectedEvent && preselectedEvent !== selectedEventId) {
      handleSelectEvent(preselectedEvent);
    }
  }, [preselectedEvent]);

  // Adjust team members array size when teamSize changes
  useEffect(() => {
    const additionalNeeded = Math.max(0, teamSize - 1);
    setTeamMembers((prev) => {
      const next = [...prev];
      while (next.length < additionalNeeded) next.push(emptyMember());
      while (next.length > additionalNeeded) next.pop();
      return next;
    });
  }, [teamSize]);

  // Save the draft while the form is being filled
  useEffect(() => {
    if (submittedData) return undefined;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ savedAt: Date.now(), teamSize, teamName, leader, teamMembers })
        );
      } catch {
        // storage unavailable or full: skip saving
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [teamSize, teamName, leader, teamMembers, submittedData]);

  const updateLeader = (field, value) => {
    setLeader((prev) => ({ ...prev, [field]: value }));
  };

  const updateMember = (index, field, value) => {
    setTeamMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Submit Registration with smart auto-scrolling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Please enter your Team Name.");
      document.getElementById("reg-team-name")?.focus();
      document.getElementById("reg-team-name")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!leader.name.trim()) {
      toast.error("Please enter Team Leader full name.");
      document.getElementById("reg-leader-name")?.focus();
      document.getElementById("reg-leader-name")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!/^\d{10}$/.test(leader.contact.trim())) {
      toast.error("Please enter a valid 10-digit WhatsApp number for the leader.");
      document.getElementById("reg-leader-contact")?.focus();
      document.getElementById("reg-leader-contact")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!leader.college.trim()) {
      toast.error("Please enter the college name for the leader.");
      document.getElementById("reg-leader-college")?.focus();
      document.getElementById("reg-leader-college")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!leader.branch.trim()) {
      toast.error("Please enter the branch for the leader.");
      document.getElementById("reg-leader-branch")?.focus();
      document.getElementById("reg-leader-branch")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!leader.email.trim() || !COLLEGE_EMAIL_REGEX.test(leader.email.trim())) {
      toast.error("Please enter the leader's college email ID ending with @satiengg.in. Personal email IDs are not accepted.");
      document.getElementById("reg-leader-email")?.focus();
      document.getElementById("reg-leader-email")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!leader.enrollmentNo.trim()) {
      toast.error("Please enter the Enrollment Number for the leader.");
      document.getElementById("reg-leader-enrollment")?.focus();
      document.getElementById("reg-leader-enrollment")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (selectedEventId === "botRacing" && (teamSize < 2 || teamSize > 4)) {
      toast.error("Walking Bot allows a minimum of 2 and maximum of 4 members in the team.");
      return;
    }

    if ((selectedEventId === "model" || selectedEventId === "robo") && (teamSize < 2 || teamSize > 4)) {
      toast.error("This event allows a minimum of 2 and maximum of 4 members in the team.");
      return;
    }

    if (selectedEventId === "botRacing" && !noWheelConfirmed) {
      toast.error("Please confirm that your bot complies with the No-Wheel rule.");
      document.getElementById("reg-nowheel-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Check additional members
    for (let i = 0; i < teamMembers.length; i++) {
      const m = teamMembers[i];
      if (
        !m.name.trim() ||
        !m.email.trim() ||
        !m.contact.trim() ||
        !m.college.trim() ||
        !m.branch.trim() ||
        !m.enrollmentNo.trim()
      ) {
        toast.error(`Please complete all fields (including Enrollment No.) for Member #${i + 2}.`);
        document.getElementById(`reg-member-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!/^\d{10}$/.test(m.contact.trim())) {
        toast.error(`Please enter a valid 10-digit contact number for Member #${i + 2}.`);
        document.getElementById(`reg-member-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!COLLEGE_EMAIL_REGEX.test(m.email.trim())) {
        toast.error(`Member #${i + 2} must use a college email ID ending with @satiengg.in. Personal email IDs are not accepted.`);
        document.getElementById(`reg-member-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        eventId: selectedEventId,
        teamName: teamName.trim(),
        teamSize,
        leaderName: leader.name.trim(),
        leaderEmail: leader.email.trim(),
        leaderContact: leader.contact.trim(),
        leaderCollege: leader.college.trim(),
        leaderBranch: leader.branch.trim(),
        leaderEnrollmentNo: leader.enrollmentNo.trim(),
        leaderYear: leader.year,
        teamMembers: teamMembers.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim(),
          contact: m.contact.trim(),
          college: m.college.trim(),
          branch: m.branch.trim(),
          enrollmentNo: m.enrollmentNo.trim(),
          year: m.year,
        })),
      };

      const res = await registerTechnovisionNov(payload);
      toast.success(
        res.data?.recovered
          ? "You were already registered. Here is your existing pass."
          : "🎉 Registration Confirmed! Your official entry pass is ready."
      );
      clearDraft();
      setSubmittedData({
        ...(res.data?.recovered && res.data?.data ? res.data.data : payload),
        eventName: currentEvent.title,
        ticketId: res.data?.ticketId,
      });

      // Scroll to pass screen
      setTimeout(() => {
        document.getElementById("registration-portal")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      const status = err.response?.status;
      console.error("Technovision registration failed:", status || err.code, err.message);
      if (!err.response || status >= 500) {
        const reason = !err.response
          ? "We could not reach the registration server. Check your internet connection."
          : "The registration server is busy right now.";
        toast.error(
          `${reason} Your details are saved on this device. Please try again in a moment. If it keeps failing, contact the organizers: Devansh 9302276804, Dhananjay 9238138023, Devanshu 7024019720, Mrinal 9752639678 or flux.club@satiengg.in. If you already submitted once, trying again is safe.`,
          { duration: 10000 }
        );
      } else {
        const msg = err.response?.data?.message || err.message || "Registration failed. Try again.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Copy Ticket ID
  const handleCopyTicket = () => {
    if (!submittedData?.ticketId) return;
    navigator.clipboard.writeText(submittedData.ticketId);
    setCopiedTicket(true);
    toast.success("Ticket ID copied to clipboard!");
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  // Build the pass PDF (all member details included)
  const buildPassPdf = () => {
      const members = [
        {
          label: "TEAM LEADER",
          name: submittedData.leaderName,
          enrollmentNo: submittedData.leaderEnrollmentNo,
          email: submittedData.leaderEmail,
          contact: submittedData.leaderContact,
          college: submittedData.leaderCollege,
          branch: submittedData.leaderBranch,
          year: submittedData.leaderYear,
        },
        ...(submittedData.teamMembers || []).map((m, idx) => ({
          label: `MEMBER ${idx + 2}`,
          ...m,
        })),
      ];

      const PERSON_HEIGHT = 50;
      const boxTop = 75;
      const boxHeight = 28 + members.length * PERSON_HEIGHT;
      const pageHeight = boxTop + boxHeight + 28;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [140, pageHeight],
      });

      // Background
      doc.setFillColor(11, 15, 25);
      doc.rect(0, 0, 140, pageHeight, "F");

      // Cyber Top Header
      doc.setFillColor(6, 182, 212);
      doc.rect(0, 0, 140, 15, "F");

      doc.setTextColor(5, 5, 5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("TECHNOVISION '26 — OFFICIAL REGISTRATION PASS", 70, 10, { align: "center" });

      // Title
      doc.setTextColor(6, 182, 212);
      doc.setFontSize(18);
      doc.text(submittedData.eventName.toUpperCase(), 70, 32, { align: "center" });

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      const sched = getSchedule(submittedData.eventId);
      doc.text(`${sched.date.toUpperCase()}, ${sched.time} | ${sched.venue.toUpperCase()}, SATI VIDISHA`, 70, 40, { align: "center" });

      // Ticket ID Box
      doc.setFillColor(17, 24, 39);
      doc.setDrawColor(6, 182, 212);
      doc.roundedRect(15, 48, 110, 20, 3, 3, "FD");

      doc.setTextColor(245, 158, 11);
      doc.setFontSize(8);
      doc.text("TICKET ID", 70, 56, { align: "center" });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(submittedData.ticketId, 70, 64, { align: "center" });

      // Team Details Box
      doc.setFillColor(17, 24, 39);
      doc.roundedRect(15, boxTop, 110, boxHeight, 3, 3, "F");

      doc.setTextColor(6, 182, 212);
      doc.setFontSize(10);
      doc.text("TEAM INFORMATION", 22, boxTop + 10);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(`Team Name:  ${submittedData.teamName}`, 22, boxTop + 19);
      doc.text(`Total Members:  ${submittedData.teamSize}`, 22, boxTop + 26);

      members.forEach((p, idx) => {
        let y = boxTop + 37 + idx * PERSON_HEIGHT;
        doc.setTextColor(6, 182, 212);
        doc.setFontSize(9);
        doc.text(p.label, 22, y);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        [
          `Name:  ${p.name || "-"}`,
          `Enrollment No:  ${p.enrollmentNo || "-"}`,
          `Email:  ${p.email || "-"}`,
          `Contact:  ${p.contact || "-"}`,
          `College:  ${p.college || "-"}`,
          `Branch & Year:  ${p.branch || "-"} (${p.year || "-"})`,
        ].forEach((line) => {
          y += 6;
          doc.text(doc.splitTextToSize(line, 98)[0], 22, y);
        });
      });

      // Footer
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.text(`Present this pass at ${sched.venue} during check-in.`, 70, pageHeight - 14, { align: "center" });
      doc.text("Technical Club Flux — Samrat Ashok Technological Institute", 70, pageHeight - 8, { align: "center" });

      return doc;
  };

  // Download E-Ticket as PDF
  const handleDownloadTicket = () => {
    if (!submittedData) return;

    try {
      buildPassPdf().save(`Technovision26_Pass_${submittedData.ticketId}.pdf`);
      toast.success("E-Ticket PDF downloaded!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF. You can screenshot this ticket.");
    }
  };

  // Send the pass PDF (share sheet with file on supported devices, else download + WhatsApp text)
  const handleSharePass = async () => {
    if (!submittedData) return;
    const msg = `🎉 We just registered team *${submittedData.teamName}* for *Technovision '26* (${submittedData.eventName}) at SATI Vidisha!
🎫 Ticket ID: *${submittedData.ticketId}*
Please find the registration pass (PDF) attached.`;

    try {
      const doc = buildPassPdf();
      const fileName = `Technovision26_Pass_${submittedData.ticketId}.pdf`;
      const file = new File([doc.output("blob")], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Technovision '26 Pass", text: msg });
        return;
      }

      // Fallback: browser cannot share files, so save the PDF and open WhatsApp to attach it
      doc.save(fileName);
      toast.success("Pass PDF downloaded. Attach it in the WhatsApp chat that opens.");
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    } catch (err) {
      if (err?.name === "AbortError") return; // user closed the share sheet
      console.error("Share pass error:", err);
      toast.error("Could not send the pass PDF. Please use Download Pass instead.");
    }
  };

  // Determine current active step for the progress indicator
  const getActiveStep = () => {
    if (submittedData) return 5;
    if (teamName.trim() && leader.name.trim() && leader.email.trim()) {
      return teamSize > 1 ? 4 : 3;
    }
    if (teamName.trim()) return 3;
    if (selectedEventId) return 2;
    return 1;
  };

  const activeStep = getActiveStep();

  return (
    <div id="registration-portal" className="relative scroll-mt-24">
      {/* Glow Effect Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-amber-500/20 rounded-[2.5rem] blur-2xl opacity-60 pointer-events-none" />

      <div className="relative bg-white/95 dark:bg-[#08080c]/95 border border-slate-200 dark:border-cyan-500/30 rounded-[1.75rem] sm:rounded-[2.5rem] p-3.5 sm:p-8 md:p-14 shadow-2xl backdrop-blur-xl transition-colors duration-300">
        
        {/* Holographic Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-cyan-500/30 text-[11px] sm:text-xs font-mono tracking-widest uppercase mb-2 sm:mb-3 font-bold">
            <Sparkles size={13} className="animate-spin text-cyan-500 dark:text-cyan-400" />
            Official Fast-Track Registration
          </div>
          <h2 className="text-2xl min-[360px]:text-3xl sm:text-5xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
            Register for <span className="text-cyan-500 dark:text-cyan-400">Technovision '26</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base mt-1.5 sm:mt-2">
            Select your competition, complete your team details, and download your entry pass. Registration is free for everyone.
          </p>

          {/* Registration Stepper Bar */}
          {!submittedData && (
            <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 pb-1 sm:pb-2 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between max-w-lg mx-auto px-1 sm:px-2">
                {[
                  { num: 1, label: "Arena" },
                  { num: 2, label: "Team" },
                  { num: 3, label: "Leader" },
                  { num: 4, label: teamSize > 1 ? "Members" : "Review" },
                ].map((s) => {
                  const isDone = activeStep > s.num;
                  const isCurrent = activeStep === s.num;
                  return (
                    <div key={s.num} className="flex flex-col items-center gap-1 sm:gap-1.5 flex-1 relative">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold transition-all duration-300 ${
                          isDone
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : isCurrent
                            ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/40 ring-4 ring-cyan-500/20 scale-110"
                            : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {isDone ? <Check size={13} /> : s.num}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-semibold ${
                        isCurrent ? "text-cyan-600 dark:text-cyan-400 font-bold" : "text-slate-600 dark:text-slate-400"
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ================= SUCCESS PASS SCREEN ================= */}
        <AnimatePresence>
          {submittedData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto bg-slate-900/95 dark:bg-black/90 border border-cyan-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-white"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Registration Successfully Confirmed!
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                  {submittedData.eventName}
                </h3>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-slate-950/80 border border-cyan-500/40 rounded-2xl p-5 text-left space-y-3 font-mono text-xs sm:text-sm shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">TICKET ID</span>
                    <span className="text-amber-400 font-bold text-base sm:text-lg tracking-wider">
                      {submittedData.ticketId}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyTicket}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all"
                  >
                    {copiedTicket ? (
                      <>
                        <Check size={14} className="text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy ID
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">TEAM NAME</span>
                  <span className="text-white font-bold">{submittedData.teamName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">TEAM LEADER</span>
                  <div className="text-right">
                    <span className="text-cyan-300 font-bold block">{submittedData.leaderName}</span>
                    {submittedData.leaderEnrollmentNo && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Enr: {submittedData.leaderEnrollmentNo}
                      </span>
                    )}
                  </div>
                </div>
                {submittedData.teamMembers && submittedData.teamMembers.length > 0 && (
                  <div className="border-b border-white/10 pb-2 space-y-1">
                    <span className="text-slate-400 text-xs block">TEAM MEMBERS</span>
                    {submittedData.teamMembers.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-0.5 text-slate-300">
                        <span>• {m.name} ({m.branch})</span>
                        {m.enrollmentNo && <span className="text-[10px] text-cyan-400 font-mono">Enr: {m.enrollmentNo}</span>}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">COLLEGE</span>
                  <span className="text-white">{submittedData.leaderCollege}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">DATE & VENUE</span>
                  <span className="text-white">
                    {getSchedule(submittedData.eventId).date}, {getSchedule(submittedData.eventId).time} | {getSchedule(submittedData.eventId).venue}, SATI
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SQUAD SIZE</span>
                  <span className="text-white font-bold">{submittedData.teamSize} Member(s)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadTicket}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3.5 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 text-sm"
                >
                  <Download size={16} /> Download Pass (PDF)
                </button>

                <button
                  onClick={handleSharePass}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3.5 rounded-xl font-bold hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/20 text-sm"
                >
                  <Share2 size={16} /> Send Pass (PDF)
                </button>
              </div>

              <div className="pt-2">
                <a
                  href="https://chat.whatsapp.com/ITmlgvbmiM7Bu8GGWddYxc?mode=gi_t"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                >
                  <MessageCircle size={14} /> Join Official Technovision WhatsApp Community →
                </a>
              </div>

              <button
                onClick={() => {
                  setSubmittedData(null);
                  setTeamName("");
                }}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 pt-2 inline-block"
              >
                ← Register another team or event
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= MAIN REGISTRATION FORM ================= */}
        {!submittedData && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. SELECT EVENT */}
            <div className="space-y-4">
              <label className="text-xs font-mono tracking-widest uppercase text-cyan-600 dark:text-cyan-400 flex items-center gap-2 font-bold">
                <Trophy size={16} /> 1. Select Competition Arena
              </label>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {EVENTS.map((ev) => {
                  const Icon = ev.icon;
                  const isSelected = selectedEventId === ev.id;
                  return (
                    <button
                      type="button"
                      key={ev.id}
                      onClick={() => handleSelectEvent(ev.id)}
                      className={`relative p-2 md:p-5 rounded-xl md:rounded-2xl border text-center md:text-left transition-all duration-300 flex flex-col items-center md:items-stretch justify-center md:justify-between gap-1 md:gap-0 ${
                        isSelected
                          ? `bg-cyan-50 dark:bg-cyan-950/20 ${ev.border} shadow-[0_0_25px_rgba(6,182,212,0.25)] md:scale-[1.02] ring-2 ring-cyan-500/30`
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-cyan-500/40 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-cyan-500 text-black shadow-md"
                              : "bg-slate-200 dark:bg-black/40 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <Icon className={`w-4 h-4 md:w-6 md:h-6 ${isSelected ? "text-black" : ev.accent}`} />
                        </div>
                        <span className="hidden md:inline-block text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold">
                          Max {ev.maxMembers} Members
                        </span>
                      </div>

                      <div className="md:mt-4">
                        <span className="hidden md:block text-[10px] font-mono tracking-wider uppercase text-cyan-600 dark:text-cyan-400 font-bold mb-1">
                          {ev.badge}
                        </span>
                        <h4 className="text-[11px] leading-tight md:text-lg md:leading-normal font-black uppercase tracking-tight text-slate-900 dark:text-white">
                          {ev.title}{" "}
                          {ev.subtitle && (
                            <span className="hidden md:block text-xs font-bold text-pink-500 dark:text-pink-400 normal-case">
                              {ev.subtitle}
                            </span>
                          )}
                        </h4>
                        <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-1">{ev.tagline}</p>
                      </div>

                      {isSelected && (
                        <div className="hidden md:block absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile summary of the selected arena */}
              <p className="md:hidden text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentEvent.title}:</span>{" "}
                {currentEvent.tagline}.
                {currentEvent.subtitle && (
                  <span className="font-bold text-pink-500 dark:text-pink-400"> {currentEvent.subtitle}</span>
                )}{" "}
                Max {currentEvent.maxMembers} members per team.
              </p>
            </div>

            {/* 2. TEAM SIZE & TEAM NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              {/* Team Size Selector */}
              <div className="space-y-3">
                <label className="text-xs font-mono tracking-widest uppercase text-cyan-600 dark:text-cyan-400 flex items-center gap-2 font-bold">
                  <Users size={16} /> 2. Squad Size (Including Leader)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {Array.from(
                    { length: currentEvent.maxMembers - currentEvent.minMembers + 1 },
                    (_, i) => currentEvent.minMembers + i
                  ).map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setTeamSize(num)}
                      className={`flex-1 min-w-[60px] py-3 rounded-xl border text-sm font-bold font-mono transition-all ${
                        teamSize === num
                          ? "bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30 scale-105"
                          : "bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40"
                      }`}
                    >
                      {num} {num === 2 ? "Duo" : num === 3 ? "Trio" : "Squad"}
                    </button>
                  ))}
                </div>
                {selectedEventId === "botRacing" ? (
                  <p className="text-[11px] text-pink-500 dark:text-pink-400 font-mono font-medium">
                    * Walking Bot allows a minimum of 2 and maximum of 4 members per team.
                  </p>
                ) : (
                  <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-medium">
                    * {currentEvent.title} allows a minimum of 2 and maximum of 4 members per team.
                  </p>
                )}
              </div>

              {/* Team Name */}
              <div className="space-y-3">
                <label className="text-xs font-mono tracking-widest uppercase text-cyan-600 dark:text-cyan-400 flex items-center gap-2 font-bold">
                  <ShieldCheck size={16} /> Team Name *
                </label>
                <input
                  id="reg-team-name"
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., CyberKnights, MechWalkers, Team Volt"
                  className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-sm transition-colors shadow-sm"
                />
              </div>
            </div>

            {/* 3. TEAM LEADER DETAILS */}
            <div id="reg-leader-details" className="p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3 sm:pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 dark:text-white tracking-tight">
                      3. Team Leader Details
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">Primary contact & squad representative</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Leader Name */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-bold">
                    Full Name *
                  </label>
                  <input
                    id="reg-leader-name"
                    type="text"
                    required
                    value={leader.name}
                    onChange={(e) => updateLeader("name", e.target.value)}
                    placeholder="Enter leader full name"
                    className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                  />
                </div>

                {/* Leader Enrollment No */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-bold">
                    Enrollment No. <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="reg-leader-enrollment"
                    type="text"
                    required
                    value={leader.enrollmentNo}
                    onChange={(e) => updateLeader("enrollmentNo", e.target.value.toUpperCase())}
                    placeholder="e.g., 0108CS221001 / Roll No *"
                    className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                  />
                </div>

                {/* Leader Contact */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-bold">
                    WhatsApp Contact Number *
                  </label>
                  <input
                    id="reg-leader-contact"
                    type="tel"
                    required
                    maxLength={10}
                    value={leader.contact}
                    onChange={(e) => updateLeader("contact", e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                  />
                </div>

                {/* Leader Email */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-bold">
                    Email Address *
                  </label>
                  <input
                    id="reg-leader-email"
                    type="email"
                    required
                    value={leader.email}
                    onChange={(e) => updateLeader("email", e.target.value)}
                    placeholder="yourname29cse051@satiengg.in"
                    className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                  />
                </div>

                {/* Leader College */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-bold">
                    College / Institute Name *
                  </label>
                  <input
                    id="reg-leader-college"
                    type="text"
                    required
                    value={leader.college}
                    onChange={(e) => updateLeader("college", e.target.value)}
                    placeholder="e.g., SATI Vidisha, UIT RGPV, etc."
                    className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                  />
                </div>

                {/* Leader Branch & Year */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-bold">
                      Branch *
                    </label>
                    <input
                      id="reg-leader-branch"
                      type="text"
                      required
                      value={leader.branch}
                      onChange={(e) => updateLeader("branch", e.target.value)}
                      placeholder="e.g., CSE, ME, EE"
                      className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 sm:mb-1.5 font-bold">
                      Year *
                    </label>
                    <select
                      value={leader.year}
                      onChange={(e) => updateLeader("year", e.target.value)}
                      className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. ADDITIONAL TEAM MEMBERS (IF TEAM SIZE > 1) */}
            {teamMembers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-cyan-500 dark:text-cyan-400" />
                  <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white tracking-tight">
                    4. Additional Squad Members ({teamMembers.length})
                  </h3>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((member, idx) => (
                    <div
                      id={`reg-member-${idx}`}
                      key={idx}
                      className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 sm:space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5 sm:pb-3">
                        <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                          Squad Member #{idx + 2}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400">All fields required</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 font-bold">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={member.name}
                            onChange={(e) => updateMember(idx, "name", e.target.value)}
                            placeholder="Member full name"
                            className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 font-bold">
                            Enrollment No. <span className="text-red-500 font-bold">*</span>
                          </label>
                          <input
                            id={`reg-member-enrollment-${idx}`}
                            type="text"
                            required
                            value={member.enrollmentNo}
                            onChange={(e) => updateMember(idx, "enrollmentNo", e.target.value.toUpperCase())}
                            placeholder="e.g., 0108ME221045 / Roll No *"
                            className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 font-bold">
                            Contact Number *
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={member.contact}
                            onChange={(e) => updateMember(idx, "contact", e.target.value.replace(/\D/g, ""))}
                            placeholder="Mobile number"
                            className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 font-bold">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={member.email}
                            onChange={(e) => updateMember(idx, "email", e.target.value)}
                            placeholder="member29cse051@satiengg.in"
                            className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 font-bold">
                            College Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={member.college}
                            onChange={(e) => updateMember(idx, "college", e.target.value)}
                            placeholder="College name"
                            className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          <div>
                            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 font-bold">
                              Branch *
                            </label>
                            <input
                              type="text"
                              required
                              value={member.branch}
                              onChange={(e) => updateMember(idx, "branch", e.target.value)}
                              placeholder="e.g., ME, CSE"
                              className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-2.5 sm:px-4 py-2 sm:py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1 font-bold">
                              Year *
                            </label>
                            <select
                              value={member.year}
                              onChange={(e) => updateMember(idx, "year", e.target.value)}
                              className="w-full bg-white dark:bg-black/60 border border-slate-300 dark:border-white/15 rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 text-xs sm:text-sm shadow-sm"
                            >
                              {YEARS.map((y) => (
                                <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SPECIAL COMPLIANCE FOR WALKING BOT */}
            {selectedEventId === "botRacing" && (
              <div id="reg-nowheel-box" className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-500/40 space-y-3">
                <div className="flex items-start gap-3">
                  <Bot size={22} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-purple-900 dark:text-purple-300">
                      Strict Rule: No Wheels or Circular Rotating Locomotion
                    </h4>
                    <p className="text-xs text-purple-800 dark:text-purple-200/80 leading-relaxed">
                      All bots must move via legged linkages (Theo Jansen, Klann), crawling, inchworm, or sliding
                      mechanisms. The use of round wheels or circular rollers for movement will result in
                      immediate arena disqualification.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={noWheelConfirmed}
                    onChange={(e) => setNoWheelConfirmed(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-mono text-purple-950 dark:text-purple-200 font-bold">
                    I confirm our robot complies strictly with the non-wheel locomotion requirement.
                  </span>
                </label>
              </div>
            )}

            {/* NDLI portal notice */}
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <AlertTriangle size={26} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                  Important Notice
                </span>
                <p className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100 leading-relaxed">
                  All participants are required to register on the NDLI portal after completing their event registration.
                </p>
                <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
                  NDLI portal registration is compulsory to receive your participation certificates.
                </p>
              </div>
            </div>

            {/* 6. SUBMIT BUTTON */}
            <div className="pt-4 text-center space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-w-[300px] bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 text-white px-10 py-4 rounded-2xl font-black text-sm tracking-widest uppercase hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] inline-flex items-center justify-center gap-3 min-h-[48px]"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting Registration...
                  </>
                ) : (
                  <>
                    <Flame size={18} /> Complete & Claim Team Pass <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TechnovisionNovRegistration;
