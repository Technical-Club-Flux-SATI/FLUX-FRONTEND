import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Lock, Key, Users, Search, RefreshCw, FileSpreadsheet,
  Download, ExternalLink, Trash2, ArrowLeft, LogOut,
  CheckCircle2, AlertTriangle, ShieldCheck, Trophy, Bot,
  Lightbulb, Phone, Mail, GraduationCap, Building2,
  Calendar, Copy, Check, ChevronDown, ChevronUp, Loader2, Sparkles
} from 'lucide-react';
import {
  verifyTechnovisionAdminKey,
  fetchTechnovisionRegistrations,
  deleteTechnovisionRegistration
} from '../api';

const EVENT_CONFIG = {
  model: {
    label: 'Model Presentation',
    color: 'amber',
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: Lightbulb
  },
  robo: {
    label: 'Robo Rumble',
    color: 'cyan',
    bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    icon: Trophy
  },
  botRacing: {
    label: 'Walking Bot',
    color: 'purple',
    bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    icon: Bot
  }
};

const TechnovisionNovAdminPortal = () => {
  const [adminKey, setAdminKey] = useState('');
  const [unlocked, setUnlocked] = useState(
    !!sessionStorage.getItem('technovisionAdminKey')
  );
  const [keyInput, setKeyInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Keep the organizer page out of search engines
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Active key from sessionStorage or state
  const activeKey = useMemo(() => {
    return adminKey || sessionStorage.getItem('technovisionAdminKey') || '';
  }, [adminKey, unlocked]);

  // Load registrations from backend
  const loadRegistrations = useCallback(async (keyToUse = activeKey, silent = false) => {
    if (!keyToUse) return;
    setLoading(true);
    try {
      const res = await fetchTechnovisionRegistrations(keyToUse);
      if (res.data?.success) {
        setRegistrations(res.data.data || []);
        if (!silent) toast.success(`Loaded ${res.data.count || res.data.data?.length || 0} registrations`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired or invalid key. Please unlock again.');
        sessionStorage.removeItem('technovisionAdminKey');
        setUnlocked(false);
      } else {
        toast.error(err.response?.data?.message || 'Could not load registrations.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeKey]);

  useEffect(() => {
    if (unlocked && activeKey) {
      loadRegistrations(activeKey, true);
    }
  }, [unlocked, activeKey, loadRegistrations]);

  // Handle Unlock
  const handleUnlock = async (e) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setUnlockError('Please enter the organizer admin key.');
      return;
    }

    setIsVerifying(true);
    setUnlockError('');

    try {
      await verifyTechnovisionAdminKey(trimmed);
      sessionStorage.setItem('technovisionAdminKey', trimmed);
      setAdminKey(trimmed);
      setUnlocked(true);
      toast.success('Admin key verified! Welcome.');
      loadRegistrations(trimmed, false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid admin key. Please try again.';
      setUnlockError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logout / Lock
  const handleLock = () => {
    sessionStorage.removeItem('technovisionAdminKey');
    setAdminKey('');
    setKeyInput('');
    setUnlocked(false);
    setRegistrations([]);
    toast.success('Admin portal locked.');
  };

  // Handle Delete Single Record
  const handleDelete = async (id, teamName) => {
    if (!window.confirm(`Are you sure you want to delete registration for "${teamName}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteTechnovisionRegistration(id, activeKey);
      setRegistrations((prev) => prev.filter((r) => r._id !== id));
      toast.success(`Deleted registration for ${teamName}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setDeletingId(null);
    }
  };

  // Copy Ticket ID
  const handleCopyTicket = (ticketId) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedId(ticketId);
    toast.success(`Copied ${ticketId}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      // Event filter
      if (eventFilter !== 'all' && item.eventId !== eventFilter) return false;

      // College filter
      if (collegeFilter === 'sati') {
        const isSati = (item.leaderCollege || '').toLowerCase().includes('sati') ||
          (item.leaderCollege || '').toLowerCase().includes('samrat ashok');
        if (!isSati) return false;
      } else if (collegeFilter === 'external') {
        const isSati = (item.leaderCollege || '').toLowerCase().includes('sati') ||
          (item.leaderCollege || '').toLowerCase().includes('samrat ashok');
        if (isSati) return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      const inLeader =
        (item.ticketId || '').toLowerCase().includes(q) ||
        (item.teamName || '').toLowerCase().includes(q) ||
        (item.leaderName || '').toLowerCase().includes(q) ||
        (item.leaderEmail || '').toLowerCase().includes(q) ||
        (item.leaderContact || '').toLowerCase().includes(q) ||
        (item.leaderCollege || '').toLowerCase().includes(q) ||
        (item.leaderEnrollmentNo || '').toLowerCase().includes(q) ||
        (item.leaderBranch || '').toLowerCase().includes(q);

      const inMembers = (item.teamMembers || []).some(
        (m) =>
          (m.name || '').toLowerCase().includes(q) ||
          (m.email || '').toLowerCase().includes(q) ||
          (m.contact || '').toLowerCase().includes(q) ||
          (m.enrollmentNo || '').toLowerCase().includes(q)
      );

      return inLeader || inMembers;
    });
  }, [registrations, eventFilter, collegeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = registrations.length;
    const modelCount = registrations.filter((r) => r.eventId === 'model').length;
    const roboCount = registrations.filter((r) => r.eventId === 'robo').length;
    const botRacingCount = registrations.filter((r) => r.eventId === 'botRacing').length;
    const satiCount = registrations.filter((r) =>
      (r.leaderCollege || '').toLowerCase().includes('sati') ||
      (r.leaderCollege || '').toLowerCase().includes('samrat ashok')
    ).length;
    const externalCount = total - satiCount;

    return { total, modelCount, roboCount, botRacingCount, satiCount, externalCount };
  }, [registrations]);

  // Export to Excel / CSV format
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast.error('No registrations found to export.');
      return;
    }

    const formatCell = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      // Neutralise spreadsheet formula injection from user-supplied text
      if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Ticket ID',
      'Event Name',
      'Team Name',
      'Team Size',
      'Leader Name',
      'Leader Email',
      'Leader Contact',
      'Leader College',
      'Leader Branch',
      'Leader Year',
      'Leader Enrollment No',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Contact',
      'Member 2 College',
      'Member 2 Branch',
      'Member 2 Year',
      'Member 2 Enrollment',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Contact',
      'Member 3 College',
      'Member 3 Branch',
      'Member 3 Year',
      'Member 3 Enrollment',
      'Member 4 Name',
      'Member 4 Email',
      'Member 4 Contact',
      'Member 4 College',
      'Member 4 Branch',
      'Member 4 Year',
      'Member 4 Enrollment',
      'All Members Combined',
      'Status',
      'Registration Timestamp'
    ];

    const rows = filteredRegistrations.map((item) => {
      const eventName = EVENT_CONFIG[item.eventId]?.label || item.eventId;
      const m2 = item.teamMembers?.[0] || {};
      const m3 = item.teamMembers?.[1] || {};
      const m4 = item.teamMembers?.[2] || {};

      const combinedMembers = (item.teamMembers || [])
        .map((m, i) => `[M${i + 2}] ${m.name || '—'} (${m.contact || ''}, ${m.college || ''}, Enroll: ${m.enrollmentNo || 'N/A'})`)
        .join('; ');

      const registeredTime = item.createdAt || item.registeredAt;
      const formattedDate = registeredTime
        ? new Date(registeredTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : '';

      return [
        formatCell(item.ticketId || ''),
        formatCell(eventName),
        formatCell(item.teamName || ''),
        formatCell(item.teamSize || '1'),
        formatCell(item.leaderName || ''),
        formatCell(item.leaderEmail || ''),
        formatCell(item.leaderContact || ''),
        formatCell(item.leaderCollege || ''),
        formatCell(item.leaderBranch || ''),
        formatCell(item.leaderYear || ''),
        formatCell(item.leaderEnrollmentNo || ''),
        formatCell(m2.name || ''),
        formatCell(m2.email || ''),
        formatCell(m2.contact || ''),
        formatCell(m2.college || ''),
        formatCell(m2.branch || ''),
        formatCell(m2.year || ''),
        formatCell(m2.enrollmentNo || ''),
        formatCell(m3.name || ''),
        formatCell(m3.email || ''),
        formatCell(m3.contact || ''),
        formatCell(m3.college || ''),
        formatCell(m3.branch || ''),
        formatCell(m3.year || ''),
        formatCell(m3.enrollmentNo || ''),
        formatCell(m4.name || ''),
        formatCell(m4.email || ''),
        formatCell(m4.contact || ''),
        formatCell(m4.college || ''),
        formatCell(m4.branch || ''),
        formatCell(m4.year || ''),
        formatCell(m4.enrollmentNo || ''),
        formatCell(combinedMembers),
        formatCell(item.status || 'confirmed'),
        formatCell(formattedDate)
      ];
    });

    // \uFEFF is UTF-8 Byte Order Mark, crucial for Excel to recognize utf-8 formatting correctly
    const csvContent = '\uFEFF' + [headers.map(formatCell).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `Technovision_Nov_2026_Registrations_${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredRegistrations.length} team registrations to Excel!`);
  };

  // Unique candidates across ALL registrations (ignores filters), keyed by email.
  // Leaders and team members are both included. Oldest record wins; blank
  // fields are filled from later records of the same email.
  const uniqueCandidates = useMemo(() => {
    const byEmail = new Map();
    const add = (name, email, scholarNo, year) => {
      const key = String(email || '').trim().toLowerCase();
      if (!key) return;
      const clean = (v) => String(v ?? '').trim();
      const existing = byEmail.get(key);
      if (!existing) {
        byEmail.set(key, { name: clean(name), email: key, scholarNo: clean(scholarNo), year: clean(year) });
        return;
      }
      if (!existing.name) existing.name = clean(name);
      if (!existing.scholarNo) existing.scholarNo = clean(scholarNo);
      if (!existing.year) existing.year = clean(year);
    };

    [...registrations]
      .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      .forEach((r) => {
        add(r.leaderName, r.leaderEmail, r.leaderEnrollmentNo, r.leaderYear);
        (r.teamMembers || []).forEach((m) => add(m.name, m.email, m.enrollmentNo, m.year));
      });

    return Array.from(byEmail.values());
  }, [registrations]);

  // Download unique candidates (Name, Email, Scholar No, Year) as CSV
  const handleExportUniqueCandidates = () => {
    if (uniqueCandidates.length === 0) {
      toast.error('No candidates found to export.');
      return;
    }

    const formatCell = (val) => {
      let str = String(val ?? '');
      // Neutralise spreadsheet formula injection from user-supplied text
      if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = ['Name', 'Email ID', 'Scholar Number', 'Year'];
    const rows = uniqueCandidates.map((c) =>
      [c.name, c.email, c.scholarNo, c.year].map(formatCell).join(',')
    );

    const csvContent = '﻿' + [headers.map(formatCell).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Technovision_Nov_2026_Unique_Candidates_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${uniqueCandidates.length} unique candidates!`);
  };

  // ==========================================
  // UNLOCKED SCREEN: RENDER DASHBOARD
  // ==========================================
  if (unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07080d] text-slate-900 dark:text-white pt-24 pb-16 px-3 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Top Bar Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Link
                  to="/events/technovision-nov-2026"
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <ArrowLeft size={14} /> Back To Public Event Page
                </Link>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> Key Authenticated
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight font-['Russo_One',sans-serif]">
                Technovision '26 <span className="text-cyan-500">Admin Portal</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                Live participant database, team tracking & one-click spreadsheet download.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => loadRegistrations(activeKey, false)}
                disabled={loading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                title="Refresh registrations"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-500' : ''} />
                Refresh
              </button>

              <button
                onClick={handleExportCSV}
                disabled={filteredRegistrations.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50"
                title="Export current view to Excel-compatible CSV"
              >
                <FileSpreadsheet size={15} /> Export Excel / CSV ({filteredRegistrations.length})
              </button>

              <button
                onClick={handleExportUniqueCandidates}
                disabled={uniqueCandidates.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
                title="Download unique candidates (by email): Name, Email, Scholar No, Year"
              >
                <Users size={15} /> Unique Candidates ({uniqueCandidates.length})
              </button>

              <button
                onClick={handleLock}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold uppercase tracking-wider transition-all"
                title="Lock portal"
              >
                <LogOut size={14} /> Lock
              </button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Total Registrations
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 dark:text-white flex items-center justify-between">
                <span>{stats.total}</span>
                <Users size={22} className="text-cyan-500 opacity-60" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Model Presentation
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1 text-amber-600 dark:text-amber-400 flex items-center justify-between">
                <span>{stats.modelCount}</span>
                <Lightbulb size={22} className="text-amber-500 opacity-60" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block">
                Robo Rumble
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1 text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
                <span>{stats.roboCount}</span>
                <Trophy size={22} className="text-cyan-500 opacity-60" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                Walking Bot (No Wheels)
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1 text-purple-600 dark:text-purple-400 flex items-center justify-between">
                <span>{stats.botRacingCount}</span>
                <Bot size={22} className="text-purple-500 opacity-60" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                SATI / External
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 dark:text-white flex items-center justify-between">
                <span>{stats.satiCount} <span className="text-xs font-normal text-slate-400">/ {stats.externalCount}</span></span>
                <Building2 size={22} className="text-emerald-500 opacity-60" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Ticket ID, Team, Leader name, mobile, email, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Event Filter */}
              <div className="flex items-center bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
                {[
                  { id: 'all', label: 'All Arenas' },
                  { id: 'model', label: 'Model' },
                  { id: 'robo', label: 'Robo' },
                  { id: 'botRacing', label: 'Walking Bot' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setEventFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      eventFilter === tab.id
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* College Filter */}
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Colleges</option>
                <option value="sati">SATI Vidisha Only</option>
                <option value="external">External Colleges</option>
              </select>
            </div>
          </div>

          {/* Registrations List / Table */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 size={36} className="animate-spin text-cyan-500 mx-auto" />
              <p className="text-sm font-mono text-slate-500">Loading registrations...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/15 p-8 bg-white/40 dark:bg-white/[0.02]">
              <Users size={40} className="mx-auto text-slate-400 mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No registrations match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try clearing search filters or check if registrations have been submitted on the public page.
              </p>
              {(searchQuery || eventFilter !== 'all' || collegeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setEventFilter('all');
                    setCollegeFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>Showing {filteredRegistrations.length} team(s)</span>
                <span>Click team card to expand member details</span>
              </div>

              {filteredRegistrations.map((item) => {
                const isExpanded = expandedTeamId === item._id;
                const cfg = EVENT_CONFIG[item.eventId] || {
                  label: item.eventId,
                  bg: 'bg-slate-500/10 text-slate-600 border-slate-500/30'
                };
                const EventIcon = cfg.icon || Trophy;

                return (
                  <div
                    key={item._id}
                    className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden transition-all duration-200 hover:border-cyan-500/30"
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedTeamId(isExpanded ? null : item._id)}
                      className="p-4 sm:p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Left: Ticket ID, Event Badge & Team Name */}
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
                        {/* Copyable Ticket ID */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyTicket(item.ticketId);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/10 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-cyan-500/50 transition-colors"
                          title="Click to copy Ticket ID"
                        >
                          {copiedId === item.ticketId ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} className="text-slate-400" />
                          )}
                          <span>{item.ticketId}</span>
                        </button>

                        {/* Event Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${cfg.bg}`}>
                          <EventIcon size={12} /> {cfg.label}
                        </span>

                        {/* Team Name & Size */}
                        <div>
                          <h4 className="text-base sm:text-lg font-black uppercase text-slate-900 dark:text-white">
                            {item.teamName}
                          </h4>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-mono">
                          {item.teamSize} Member{Number(item.teamSize) !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Right: Leader Quick Info, Date & Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/5">
                        <div className="text-left lg:text-right">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Leader: {item.leaderName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {item.leaderContact} • {item.leaderCollege}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item._id, item.teamName);
                            }}
                            disabled={deletingId === item._id}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete this record"
                          >
                            <Trash2 size={16} />
                          </button>
                          
                          <div className="p-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details Accordion */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-black/30 p-4 sm:p-6 space-y-6"
                        >
                          {/* Leader Full Details */}
                          <div>
                            <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold mb-3 flex items-center gap-1.5">
                              <ShieldCheck size={14} /> Team Leader Specifications
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Full Name</span>
                                <span className="font-bold text-slate-900 dark:text-white">{item.leaderName}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Email Address</span>
                                <a href={`mailto:${item.leaderEmail}`} className="text-cyan-600 dark:text-cyan-400 font-mono underline block truncate">
                                  {item.leaderEmail}
                                </a>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Phone / WhatsApp</span>
                                <a href={`tel:${item.leaderContact}`} className="font-mono text-slate-900 dark:text-white hover:text-cyan-500">
                                  {item.leaderContact}
                                </a>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">College</span>
                                <span className="font-bold text-slate-900 dark:text-white block truncate">{item.leaderCollege}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Branch</span>
                                <span className="text-slate-800 dark:text-slate-200">{item.leaderBranch}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Current Year</span>
                                <span className="text-slate-800 dark:text-slate-200">{item.leaderYear}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Enrollment No</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{item.leaderEnrollmentNo || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Registered At</span>
                                <span className="font-mono text-[11px] text-slate-500">
                                  {item.createdAt || item.registeredAt ? new Date(item.createdAt || item.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Team Members List */}
                          <div>
                            <h5 className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold mb-3 flex items-center gap-1.5">
                              <Users size={14} /> Additional Team Members ({item.teamMembers?.length || 0})
                            </h5>

                            {!item.teamMembers || item.teamMembers.length === 0 ? (
                              <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-white/40 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                                Solo participant registration (No additional members).
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {item.teamMembers.map((m, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 text-xs"
                                  >
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-1.5">
                                      <span className="font-bold text-slate-900 dark:text-white">
                                        Member {idx + 2}: {m.name}
                                      </span>
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                                        {m.year || 'Student'}
                                      </span>
                                    </div>
                                    <div className="space-y-0.5 text-[11px]">
                                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <Phone size={11} className="text-slate-400" /> {m.contact || 'No phone'}
                                      </p>
                                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <Mail size={11} className="text-slate-400" /> {m.email || 'No email'}
                                      </p>
                                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <Building2 size={11} className="text-slate-400" /> {m.college || '—'}
                                      </p>
                                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <GraduationCap size={11} className="text-slate-400" /> {m.branch || '—'} {m.enrollmentNo ? `• (${m.enrollmentNo})` : ''}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // LOCKED SCREEN: KEY ENTRY FORM
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#07080d] text-slate-900 dark:text-white pt-20 pb-12 font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/events/technovision-nov-2026"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <ArrowLeft size={14} /> Return to Technovision Event Page
          </Link>
        </div>

        {/* Lock Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d14] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight font-['Russo_One',sans-serif]">
              Technovision <span className="text-cyan-500">Admin</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your event organizer security key to access live participant database and Excel export.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 font-bold block">
                Organizer Security Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter admin security key..."
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (unlockError) setUnlockError('');
                  }}
                  autoFocus
                  className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
                />
                <Key size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {unlockError && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30">
                <AlertTriangle size={14} className="shrink-0" /> {unlockError}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying || !keyInput.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 min-h-[46px]"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying Access...
                </>
              ) : (
                <>
                  <Lock size={15} /> Unlock Admin Portal
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-[11px] font-mono text-slate-400">
              Authorized organizers only • Club FLUX SATI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnovisionNovAdminPortal;
