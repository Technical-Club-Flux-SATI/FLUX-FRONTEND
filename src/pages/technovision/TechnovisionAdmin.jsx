import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Shield, Loader2, Search, Filter, ChevronDown, Users, FileText,
  CheckCircle, XCircle, Clock, Eye, Download, Trash2, AlertCircle,
  BarChart3, Bot, Calendar, Mail, Phone, RefreshCw, X, Timer
} from 'lucide-react';
import {
  verifyTechnovisionKey,
  fetchTechnovisionRegistrations,
  updateTechnovisionStatus,
  deleteTechnovisionRegistration,
  fetchTechnovisionStats,
  exportTechnovisionCSV,
} from '../../api';
import { COMPETITIONS, APP_STATUSES } from '../../data/technovisionData';

/* ── Status colors ───────────────────────────────────────────────── */
const statusColors = {
  SUBMITTED:    { bg: 'bg-blue-500/10',    text: 'text-blue-500',    border: 'border-blue-500/20' },
  UNDER_REVIEW: { bg: 'bg-amber-500/10',   text: 'text-amber-500',   border: 'border-amber-500/20' },
  APPROVED:     { bg: 'bg-emerald-500/10',  text: 'text-emerald-500', border: 'border-emerald-500/20' },
  WAITLISTED:   { bg: 'bg-orange-500/10',   text: 'text-orange-500',  border: 'border-orange-500/20' },
  REJECTED:     { bg: 'bg-red-500/10',      text: 'text-red-500',     border: 'border-red-500/20' },
  WITHDRAWN:    { bg: 'bg-slate-500/10',     text: 'text-slate-500',   border: 'border-slate-500/20' },
};

const StatusBadge = ({ status }) => {
  const c = statusColors[status] || statusColors.SUBMITTED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${c.bg} ${c.text} ${c.border}`}>
      {APP_STATUSES[status]?.label || status}
    </span>
  );
};

/* ── Stat Card ───────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color = 'cyan' }) => (
  <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{label}</span>
      <Icon size={16} className={`text-${color}-500`} />
    </div>
    <p className={`text-3xl font-black text-${color}-500`}>{value}</p>
  </div>
);

/* ── Key Verification Gate ───────────────────────────────────────── */
const KeyGate = ({ onVerified }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    try {
      await verifyTechnovisionKey(key.trim());
      sessionStorage.setItem('technovisionAdminKey', key.trim());
      toast.success('Access granted');
      onVerified();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid passkey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#050505] min-h-screen flex items-center justify-center px-6">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleVerify}
        className="relative z-10 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-10 max-w-md w-full space-y-6 text-center"
      >
        <div className="w-16 h-16 mx-auto bg-cyan-500/10 rounded-full flex items-center justify-center border-2 border-cyan-500/30">
          <Shield size={28} className="text-cyan-500" />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
          Technovision Admin
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Enter the admin passkey to access the dashboard</p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Enter passkey"
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-center font-mono tracking-widest focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 dark:text-white"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all uppercase tracking-wider disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Verify & Enter'}
        </button>
      </motion.form>
    </div>
  );
};

/* ── Detail Modal ────────────────────────────────────────────────── */
const DetailModal = ({ reg, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(reg.status);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (newStatus === reg.status) return;
    setUpdating(true);
    try {
      await updateTechnovisionStatus(reg._id, newStatus, '');
      toast.success(`Status updated to ${APP_STATUSES[newStatus]?.label || newStatus}`);
      onStatusUpdate(reg._id, newStatus);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xl font-black text-cyan-500 tracking-wider">{reg.applicationId}</p>
            <p className="text-xs text-slate-400 font-mono mt-1">{reg.competitionName || reg.competitionId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 dark:border-white/5 pt-5">
          <div><span className="text-slate-400 text-xs">Name</span><p className="font-bold">{reg.fullName}</p></div>
          <div><span className="text-slate-400 text-xs">Enrollment No</span><p className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{reg.enrollmentNo || 'N/A'}</p></div>
          <div><span className="text-slate-400 text-xs">Email</span><p className="font-bold text-xs break-all">{reg.email}</p></div>
          <div><span className="text-slate-400 text-xs">Phone</span><p className="font-bold">{reg.mobile}</p></div>
          <div><span className="text-slate-400 text-xs">College</span><p className="font-bold text-xs">{reg.college}</p></div>
          <div><span className="text-slate-400 text-xs">Branch</span><p className="font-bold">{reg.branch}</p></div>
          <div><span className="text-slate-400 text-xs">Year</span><p className="font-bold">{reg.academicYear}</p></div>
          <div><span className="text-slate-400 text-xs">Type</span><p className="font-bold capitalize">{reg.participationType}</p></div>
          {reg.teamName && <div><span className="text-slate-400 text-xs">Team</span><p className="font-bold">{reg.teamName}</p></div>}
          <div><span className="text-slate-400 text-xs">Project</span><p className="font-bold">{reg.projectName}</p></div>
          <div><span className="text-slate-400 text-xs">Submitted</span><p className="font-bold">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p></div>
        </div>

        {reg.projectDescription && (
          <div className="border-t border-slate-100 dark:border-white/5 pt-4">
            <span className="text-slate-400 text-xs">Description</span>
            <p className="text-sm mt-1">{reg.projectDescription}</p>
          </div>
        )}

        {reg.teamMembers && reg.teamMembers.length > 0 && (
          <div className="border-t border-slate-100 dark:border-white/5 pt-4">
            <span className="text-slate-400 text-xs">Team Members</span>
            <ul className="mt-1 space-y-1">
              {reg.teamMembers.map((m, i) => (
                <li key={i} className="text-sm">{m.name} {m.phone && `• ${m.phone}`}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Status Update */}
        <div className="border-t border-slate-100 dark:border-white/5 pt-5 space-y-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Update Status</label>
          <div className="flex gap-3">
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-cyan-500 dark:text-white"
            >
              {Object.entries(APP_STATUSES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <button
              onClick={handleUpdate}
              disabled={updating || newStatus === reg.status}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl font-bold text-sm hover:bg-cyan-500 transition-all disabled:opacity-50"
            >
              {updating ? <Loader2 size={16} className="animate-spin" /> : 'Update'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Admin Dashboard ────────────────────────────────────────── */
const TechnovisionAdmin = () => {
  const [verified, setVerified] = useState(!!sessionStorage.getItem('technovisionAdminKey'));
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterComp, setFilterComp] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedReg, setSelectedReg] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regsRes, statsRes] = await Promise.all([
        fetchTechnovisionRegistrations(),
        fetchTechnovisionStats().catch(() => ({ data: null })),
      ]);
      setRegistrations(regsRes.data?.registrations || regsRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        sessionStorage.removeItem('technovisionAdminKey');
        setVerified(false);
        toast.error('Session expired. Please re-enter the passkey.');
      } else {
        toast.error('Failed to load registrations');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verified) loadData();
  }, [verified]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteTechnovisionRegistration(id);
      setRegistrations(prev => prev.filter(r => r._id !== id));
      toast.success('Registration deleted');
    } catch (err) {
      toast.error('Failed to delete registration');
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
  };

  const handleExport = async () => {
    try {
      const response = await exportTechnovisionCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `technovision_registrations_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  /* ── Filtered & sorted data ────────────────────────────────────── */
  const filtered = useMemo(() => {
    let data = [...registrations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r =>
        (r.applicationId || '').toLowerCase().includes(q) ||
        (r.enrollmentNo || '').toLowerCase().includes(q) ||
        (r.fullName || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.teamName || '').toLowerCase().includes(q)
      );
    }

    if (filterComp !== 'all') {
      data = data.filter(r => r.competitionId === filterComp);
    }

    if (filterStatus !== 'all') {
      data = data.filter(r => r.status === filterStatus);
    }

    data.sort((a, b) => {
      const da = new Date(a.createdAt || 0);
      const db = new Date(b.createdAt || 0);
      return sortOrder === 'newest' ? db - da : da - db;
    });

    return data;
  }, [registrations, searchQuery, filterComp, filterStatus, sortOrder]);

  if (!verified) return <KeyGate onVerified={() => setVerified(true)} />;

  return (
    <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
              Technovision <span className="text-cyan-500">Admin</span>
            </h1>
            <p className="text-slate-400 text-sm font-mono mt-1">Registration Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all text-slate-400 hover:text-cyan-500" title="Refresh">
              <RefreshCw size={18} />
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/10 p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total" value={stats?.total ?? registrations.length} icon={FileText} color="cyan" />
            <StatCard label="Pending" value={stats?.pending ?? registrations.filter(r => r.status === 'SUBMITTED').length} icon={Clock} color="amber" />
            <StatCard label="Approved" value={stats?.approved ?? registrations.filter(r => r.status === 'APPROVED').length} icon={CheckCircle} color="emerald" />
            <StatCard label="Competitions" value={COMPETITIONS.length} icon={Bot} color="violet" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by ID, name, email, team..."
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 dark:text-white"
              />
            </div>
            <select value={filterComp} onChange={e => setFilterComp(e.target.value)} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-cyan-500 dark:text-white">
              <option value="all">All Competitions</option>
              {COMPETITIONS.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-cyan-500 dark:text-white">
              <option value="all">All Statuses</option>
              {Object.entries(APP_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-cyan-500 dark:text-white">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-cyan-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
              <FileText size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold">No registrations found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* ── Desktop Table ──────────────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <>
            {/* Desktop */}
            <div className="hidden lg:block bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    <th className="text-left p-4">App ID</th>
                    <th className="text-left p-4">Participant / Team</th>
                    <th className="text-left p-4">Competition</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(reg => (
                    <tr key={reg._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono text-sm font-bold text-cyan-500">{reg.applicationId}</td>
                      <td className="p-4">
                        <p className="font-bold text-sm">{reg.teamName || reg.fullName}</p>
                        <p className="text-xs text-slate-400">
                          {reg.enrollmentNo && <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold mr-1.5">{reg.enrollmentNo} •</span>}
                          {reg.email}
                        </p>
                      </td>
                      <td className="p-4 text-sm">{reg.competitionName || COMPETITIONS.find(c => c.slug === reg.competitionId)?.shortTitle || reg.competitionId}</td>
                      <td className="p-4 text-xs font-mono text-slate-400">{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                      <td className="p-4"><StatusBadge status={reg.status} /></td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedReg(reg)} className="p-2 rounded-lg hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-500 transition-colors" title="View Details">
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(reg._id)}
                            disabled={deleting === reg._id}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === reg._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filtered.map(reg => (
                <div key={reg._id} className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold text-cyan-500">{reg.applicationId}</p>
                      <p className="font-bold text-sm mt-1">{reg.teamName || reg.fullName}</p>
                      {reg.enrollmentNo && <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{reg.enrollmentNo}</p>}
                    </div>
                    <StatusBadge status={reg.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{reg.competitionName || COMPETITIONS.find(c => c.slug === reg.competitionId)?.shortTitle || reg.competitionId}</span>
                    <span>{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    <button onClick={() => setSelectedReg(reg)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500/10 text-cyan-500 text-xs font-bold hover:bg-cyan-500/20 transition-colors">
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => handleDelete(reg._id)}
                      disabled={deleting === reg._id}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Count */}
            <p className="text-center text-xs text-slate-400 font-mono mt-6">
              Showing {filtered.length} of {registrations.length} registrations
            </p>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReg && (
          <DetailModal
            reg={selectedReg}
            onClose={() => setSelectedReg(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnovisionAdmin;

