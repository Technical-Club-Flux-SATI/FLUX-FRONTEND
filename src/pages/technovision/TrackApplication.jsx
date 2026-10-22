import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search, Loader2, AlertCircle, CheckCircle, Clock,
  ArrowLeft, Calendar, Bot, Users, FileText, XCircle,
  HelpCircle, Timer
} from 'lucide-react';
import { trackTechnovisionApp } from '../../api';
import { APP_STATUSES } from '../../data/technovisionData';

/* ── Status color map ────────────────────────────────────────────── */
const statusColors = {
  SUBMITTED:    { bg: 'bg-blue-500/10',    text: 'text-blue-500',    border: 'border-blue-500/20',    dot: 'bg-blue-500' },
  UNDER_REVIEW: { bg: 'bg-amber-500/10',   text: 'text-amber-500',   border: 'border-amber-500/20',   dot: 'bg-amber-500' },
  APPROVED:     { bg: 'bg-emerald-500/10',  text: 'text-emerald-500', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  WAITLISTED:   { bg: 'bg-orange-500/10',   text: 'text-orange-500',  border: 'border-orange-500/20',  dot: 'bg-orange-500' },
  REJECTED:     { bg: 'bg-red-500/10',      text: 'text-red-500',     border: 'border-red-500/20',     dot: 'bg-red-500' },
  WITHDRAWN:    { bg: 'bg-slate-500/10',     text: 'text-slate-500',   border: 'border-slate-500/20',   dot: 'bg-slate-500' },
};

/* ── Status icon map ─────────────────────────────────────────────── */
const statusIcons = {
  SUBMITTED: FileText,
  UNDER_REVIEW: Clock,
  APPROVED: CheckCircle,
  WAITLISTED: Timer,
  REJECTED: XCircle,
  WITHDRAWN: AlertCircle,
};

/* ── Timeline Step ───────────────────────────────────────────────── */
const TIMELINE_STEPS = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED'];

const StatusTimeline = ({ currentStatus, statusHistory }) => {
  const currentIdx = TIMELINE_STEPS.indexOf(currentStatus);
  const isTerminal = ['REJECTED', 'WAITLISTED', 'WITHDRAWN'].includes(currentStatus);

  return (
    <div className="space-y-0">
      {TIMELINE_STEPS.map((status, i) => {
        const isPast = i < currentIdx || (i === currentIdx && !isTerminal);
        const isCurrent = status === currentStatus && !isTerminal;
        const isFuture = i > currentIdx || (isTerminal && i > 0);
        const historyEntry = statusHistory?.find(h => h.status === status);
        const colors = statusColors[status];
        const Icon = statusIcons[status];

        return (
          <div key={status} className="flex gap-4">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                isPast || isCurrent ? `${colors.border} ${colors.bg}` : 'border-slate-300 dark:border-white/10 bg-white dark:bg-white/5'
              }`}>
                {isPast ? (
                  <CheckCircle size={14} className={colors.text} />
                ) : isCurrent ? (
                  <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`} />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/20" />
                )}
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div className={`w-0.5 h-10 ${isPast ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10 border-l border-dashed border-slate-300 dark:border-white/10'}`} />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <p className={`font-bold text-sm ${isPast || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {APP_STATUSES[status]?.label || status}
              </p>
              {historyEntry?.timestamp && (
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {new Date(historyEntry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              )}
              {!historyEntry && isFuture && (
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Pending</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Terminal status (if rejected/waitlisted/withdrawn) */}
      {isTerminal && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${statusColors[currentStatus].border} ${statusColors[currentStatus].bg}`}>
              {React.createElement(statusIcons[currentStatus], { size: 14, className: statusColors[currentStatus].text })}
            </div>
          </div>
          <div>
            <p className={`font-bold text-sm ${statusColors[currentStatus].text}`}>
              {APP_STATUSES[currentStatus]?.label}
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              {APP_STATUSES[currentStatus]?.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────────────── */
const TrackApplication = () => {
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (e) => {
    e?.preventDefault();
    const id = appId.trim().toUpperCase();
    if (!id) {
      toast.error('Please enter your Application ID');
      return;
    }

    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const { data } = await trackTechnovisionApp(id);
      setResult(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error(err?.response?.data?.message || 'Failed to fetch application status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentColors = result?.status ? statusColors[result.status] || statusColors.SUBMITTED : null;

  return (
    <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30">

      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Back Link */}
          <Link
            to="/events/technovision-2026"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors mb-8 text-sm font-bold"
          >
            <ArrowLeft size={16} /> Back to Competitions
          </Link>

          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/50">
              Track Application
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Enter your Application ID to check your registration status
            </p>
          </div>

          {/* Search Box */}
          <motion.form
            onSubmit={handleTrack}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 md:p-8 space-y-4"
          >
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={appId}
                onChange={e => setAppId(e.target.value.toUpperCase())}
                placeholder="e.g. TV26-MP-A7K92"
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-lg font-mono font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-3.5 rounded-xl font-bold hover:bg-cyan-500 transition-all uppercase tracking-wider shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Searching...</> : <><Search size={18} /> Track Status</>}
            </button>
            <p className="text-[10px] text-slate-400 font-mono text-center">Application IDs start with TV26-</p>
          </motion.form>

          {/* Results */}
          <AnimatePresence mode="wait">
            {/* Not Found */}
            {notFound && (
              <motion.div
                key="notfound"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl p-10 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                  <HelpCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Not Found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No application found with this ID. Please check your Application ID and try again.
                </p>
              </motion.div>
            )}

            {/* Found */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 space-y-6"
              >
                {/* Application Overview */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl p-6 md:p-8 space-y-6">

                  {/* App ID + Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Application ID</p>
                      <p className="font-mono text-2xl font-black text-cyan-500 tracking-wider">{result.applicationId}</p>
                    </div>
                    {currentColors && (
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black tracking-widest uppercase border ${currentColors.bg} ${currentColors.text} ${currentColors.border}`}>
                        <span className={`w-2 h-2 rounded-full ${currentColors.dot} ${result.status === 'SUBMITTED' || result.status === 'UNDER_REVIEW' ? 'animate-pulse' : ''}`} />
                        {APP_STATUSES[result.status]?.label || result.status}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-slate-100 dark:border-white/5 pt-6">
                    {result.competitionName && (
                      <div className="flex items-start gap-3">
                        <Bot size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-slate-400 text-xs">Competition</p>
                          <p className="font-bold">{result.competitionName}</p>
                        </div>
                      </div>
                    )}
                    {(result.applicantName || result.teamName) && (
                      <div className="flex items-start gap-3">
                        <Users size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-slate-400 text-xs">{result.teamName ? 'Team' : 'Applicant'}</p>
                          <p className="font-bold">{result.teamName || result.applicantName}</p>
                        </div>
                      </div>
                    )}
                    {result.enrollmentNo && (
                      <div className="flex items-start gap-3">
                        <FileText size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-slate-400 text-xs">Enrollment Number</p>
                          <p className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{result.enrollmentNo}</p>
                        </div>
                      </div>
                    )}
                    {result.submittedAt && (
                      <div className="flex items-start gap-3">
                        <Calendar size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-slate-400 text-xs">Submitted</p>
                          <p className="font-bold">{new Date(result.submittedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                        </div>
                      </div>
                    )}
                    {result.updatedAt && (
                      <div className="flex items-start gap-3">
                        <Clock size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-slate-400 text-xs">Last Updated</p>
                          <p className="font-bold">{new Date(result.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl p-6 md:p-8">
                  <h3 className="text-lg font-black italic uppercase tracking-wider text-cyan-500 mb-6 flex items-center gap-2">
                    <Clock size={18} /> Status Timeline
                  </h3>
                  <StatusTimeline currentStatus={result.status} statusHistory={result.statusHistory} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;

