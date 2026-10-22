import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User, Users, Mail, Phone, GraduationCap, Building2, BookOpen,
  Bot, FileText, ChevronRight, ChevronLeft, Check, Loader2,
  AlertCircle, ClipboardList, Plus, Trash2, ArrowLeft, Shield
} from 'lucide-react';
import { COMPETITIONS, ACADEMIC_YEARS, getCompetitionBySlug } from '../../data/technovisionData';
import { registerTechnovision } from '../../api';

/* ── Validation helpers ──────────────────────────────────────────── */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

/* ── Step definitions ────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Participant Info', icon: User },
  { id: 2, label: 'Competition & Team', icon: Bot },
  { id: 3, label: 'Review & Submit', icon: ClipboardList },
];

/* ── Progress Bar ────────────────────────────────────────────────── */
const ProgressBar = ({ currentStep, completedSteps }) => (
  <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-10">
    {STEPS.map((step, i) => {
      const isCompleted = completedSteps.includes(step.id);
      const isActive = currentStep === step.id;
      const Icon = step.icon;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-2 relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
              isActive ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' :
              'bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-400'
            }`}>
              {isCompleted ? <Check size={18} /> : <Icon size={18} />}
            </div>
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-center leading-tight ${
              isActive ? 'text-cyan-500' : isCompleted ? 'text-emerald-500' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mt-[-20px] rounded-full transition-all ${
              isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'
            }`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ── Form Field ──────────────────────────────────────────────────── */
const Field = ({ label, error, children, required }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

/* ── Input classes ───────────────────────────────────────────────── */
const inputCls = (hasError) =>
  `w-full bg-white dark:bg-white/5 border ${hasError ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500`;

/* ── Main Registration Component ─────────────────────────────────── */
const TechnovisionRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedSlug = searchParams.get('competition') || '';

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  /* Step 1 fields */
  const [fullName, setFullName] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');

  /* Step 2 fields */
  const [selectedComp, setSelectedComp] = useState(preselectedSlug);
  const [participationType, setParticipationType] = useState('individual');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ name: '', phone: '' }]);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [consent, setConsent] = useState(false);

  const competition = getCompetitionBySlug(selectedComp);

  /* Auto-set participation type based on competition */
  useEffect(() => {
    if (competition) {
      if (competition.participationType === 'team') setParticipationType('team');
      else setParticipationType('individual');
    }
  }, [selectedComp]);

  /* ── Validation ──────────────────────────────────────────────── */
  const validateStep1 = () => {
    const e = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = 'Full name is required (min 2 characters)';
    if (!enrollmentNo.trim()) e.enrollmentNo = 'Enrollment number is required';
    if (!validateEmail(email)) e.email = 'Please enter a valid email address';
    if (!validatePhone(mobile)) e.mobile = 'Please enter a valid 10-digit mobile number';
    if (!college.trim()) e.college = 'College / Institution name is required';
    if (!branch.trim()) e.branch = 'Branch / Department is required';
    if (!year) e.year = 'Please select your academic year';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!selectedComp) e.selectedComp = 'Please select a competition';
    if (!projectName.trim()) e.projectName = 'Project / Robot / Model name is required';
    if (participationType === 'team') {
      if (!teamName.trim()) e.teamName = 'Team name is required';
      const invalidMembers = teamMembers.some(m => !m.name.trim());
      if (invalidMembers) e.teamMembers = 'Please fill in all team member names';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Navigation ──────────────────────────────────────────────── */
  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(Math.min(step + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (s) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Team member management ──────────────────────────────────── */
  const maxExtraMembers = competition ? competition.maxTeamSize - 1 : 3;

  const addMember = () => {
    if (teamMembers.length < maxExtraMembers) {
      setTeamMembers([...teamMembers, { name: '', phone: '' }]);
    }
  };

  const removeMember = (idx) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== idx));
    }
  };

  const updateMember = (idx, field, value) => {
    const updated = [...teamMembers];
    updated[idx] = { ...updated[idx], [field]: value };
    setTeamMembers(updated);
  };

  /* ── Submit ──────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!consent) {
      toast.error('Please confirm consent before submitting.');
      return;
    }
    setSubmitting(true);

    const payload = {
      fullName: fullName.trim(),
      enrollmentNo: enrollmentNo.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      college: college.trim(),
      branch: branch.trim(),
      academicYear: year,
      competitionId: selectedComp,
      participationType,
      teamName: participationType === 'team' ? teamName.trim() : '',
      teamMembers: participationType === 'team' ? teamMembers.filter(m => m.name.trim()) : [],
      projectName: projectName.trim(),
      projectDescription: projectDesc.trim(),
    };

    try {
      const { data } = await registerTechnovision(payload);
      toast.success('Registration submitted successfully!');
      navigate(`/events/technovision-2026/confirmation?appId=${encodeURIComponent(data.applicationId)}&comp=${selectedComp}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.join(', ') || err.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const completedSteps = [];
  if (step > 1) completedSteps.push(1);
  if (step > 2) completedSteps.push(2);

  /* ── Slide animation ─────────────────────────────────────────── */
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };
  const [direction, setDirection] = useState(0);

  useEffect(() => { setDirection(0); }, []);

  const handleNext = () => { setDirection(1); nextStep(); };
  const handlePrev = () => { setDirection(-1); prevStep(); };

  return (
    <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/events/technovision-2026"
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors text-sm font-bold"
            >
              <ArrowLeft size={16} /> Back to Competitions
            </Link>

            <Link
              to="/admin/events/technovision-2026"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold uppercase tracking-wider hover:bg-purple-500/20 transition-all shadow-sm"
              title="View all registered participants"

              
            >
              <Shield size={14} />
              <span>Admin Dashboard</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/50">
              Registration
            </h1>
            {competition && (
              <p className="text-cyan-600 dark:text-cyan-400 font-mono text-sm uppercase tracking-wider">
                {competition.title}
              </p>
            )}
          </div>

          {/* Progress */}
          <ProgressBar currentStep={step} completedSteps={completedSteps} />

          {/* Form Card */}
          <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="p-6 md:p-10"
              >

                {/* ═══════ STEP 1 ═══════ */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-black italic uppercase tracking-wider text-cyan-500 flex items-center gap-2">
                      <User size={20} /> Participant Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Full Name" error={errors.fullName} required>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className={inputCls(errors.fullName)} />
                      </Field>

                      <Field label="Enrollment Number" error={errors.enrollmentNo} required>
                        <input
                          type="text"
                          value={enrollmentNo}
                          onChange={e => setEnrollmentNo(e.target.value.toUpperCase())}
                          placeholder="e.g. 0108IT221001 / Scholar No."
                          className={inputCls(errors.enrollmentNo)}
                        />
                      </Field>

                      <Field label="Email Address" error={errors.email} required>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls(errors.email)} />
                      </Field>

                      <Field label="Mobile Number" error={errors.mobile} required>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">+91</span>
                          <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" className={`${inputCls(errors.mobile)} pl-12`} />
                        </div>
                      </Field>

                      <Field label="College / Institution" error={errors.college} required>
                        <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="Your college name" className={inputCls(errors.college)} />
                      </Field>

                      <Field label="Branch / Department" error={errors.branch} required>
                        <input type="text" value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. Computer Science" className={inputCls(errors.branch)} />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Academic Year" error={errors.year} required>
                          <select value={year} onChange={e => setYear(e.target.value)} className={inputCls(errors.year)}>
                            <option value="">Select year</option>
                            {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </Field>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════ STEP 2 ═══════ */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-black italic uppercase tracking-wider text-cyan-500 flex items-center gap-2">
                      <Bot size={20} /> Competition & Team
                    </h2>

                    {/* Competition Selector */}
                    <Field label="Competition" error={errors.selectedComp} required>
                      {preselectedSlug && competition ? (
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-500">
                            <Bot size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{competition.title}</p>
                            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">{competition.categoryBadge}</p>
                          </div>
                        </div>
                      ) : (
                        <select value={selectedComp} onChange={e => setSelectedComp(e.target.value)} className={inputCls(errors.selectedComp)}>
                          <option value="">Select a competition</option>
                          {COMPETITIONS.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
                        </select>
                      )}
                    </Field>

                    {/* Participation Type */}
                    {competition && (
                      <Field label="Participation Type">
                        <div className="flex gap-4">
                          {(competition.participationType === 'individual' || competition.participationType === 'both') && (
                            <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              participationType === 'individual' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200 dark:border-white/10 hover:border-cyan-500/30'
                            }`}>
                              <input type="radio" name="partType" value="individual" checked={participationType === 'individual'} onChange={() => setParticipationType('individual')} className="hidden" />
                              <User size={18} className={participationType === 'individual' ? 'text-cyan-500' : 'text-slate-400'} />
                              <span className="font-bold text-sm">{competition.participationLabels?.individual || 'Individual'}</span>
                            </label>
                          )}
                          {(competition.participationType === 'team' || competition.participationType === 'both') && (
                            <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              participationType === 'team' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200 dark:border-white/10 hover:border-cyan-500/30'
                            }`}>
                              <input type="radio" name="partType" value="team" checked={participationType === 'team'} onChange={() => setParticipationType('team')} className="hidden" />
                              <Users size={18} className={participationType === 'team' ? 'text-cyan-500' : 'text-slate-400'} />
                              <span className="font-bold text-sm">{competition.participationLabels?.team || 'Team'}</span>
                            </label>
                          )}
                        </div>
                      </Field>
                    )}

                    {/* Team Details */}
                    {participationType === 'team' && (
                      <div className="space-y-5 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                        <Field label="Team Name" error={errors.teamName} required>
                          <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Your team name" className={inputCls(errors.teamName)} />
                        </Field>

                        <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
                          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">Team Leader: {fullName || 'You'} ({email || 'your email'})</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Team Members {errors.teamMembers && <span className="text-red-500 text-xs font-normal ml-2">{errors.teamMembers}</span>}
                            </label>
                            {teamMembers.length < maxExtraMembers && (
                              <button type="button" onClick={addMember} className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:text-cyan-400 transition-colors">
                                <Plus size={14} /> Add Member
                              </button>
                            )}
                          </div>
                          {teamMembers.map((m, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input type="text" value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} placeholder={`Member ${i + 2} name`} className={inputCls(false)} />
                                <input type="tel" value={m.phone} onChange={e => updateMember(i, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Phone (optional)" className={inputCls(false)} />
                              </div>
                              {teamMembers.length > 1 && (
                                <button type="button" onClick={() => removeMember(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-0.5">
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                          <p className="text-[10px] text-slate-400 font-mono">Max {maxExtraMembers} additional members • Team size: {competition?.minTeamSize}–{competition?.maxTeamSize}</p>
                        </div>
                      </div>
                    )}

                    {/* Project Details */}
                    <Field label="Project / Robot / Model Name" error={errors.projectName} required>
                      <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Name of your project or robot" className={inputCls(errors.projectName)} />
                    </Field>

                    <Field label="Short Project Description">
                      <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value.slice(0, 500))} placeholder="Brief description of your project (optional)" rows={4} className={inputCls(false)} />
                      <p className="text-[10px] text-slate-400 text-right font-mono">{projectDesc.length}/500</p>
                    </Field>
                  </div>
                )}

                {/* ═══════ STEP 3 ═══════ */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-black italic uppercase tracking-wider text-cyan-500 flex items-center gap-2">
                      <ClipboardList size={20} /> Review & Submit
                    </h2>

                    {/* Participant Info Review */}
                    <div className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Participant Information</h3>
                        <button onClick={() => goToStep(1)} className="text-cyan-500 text-xs font-bold hover:underline">Edit</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div><span className="text-slate-400 text-xs">Name:</span> <p className="font-bold">{fullName}</p></div>
                        <div><span className="text-slate-400 text-xs">Enrollment No:</span> <p className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{enrollmentNo}</p></div>
                        <div><span className="text-slate-400 text-xs">Email:</span> <p className="font-bold">{email}</p></div>
                        <div><span className="text-slate-400 text-xs">Mobile:</span> <p className="font-bold">+91 {mobile}</p></div>
                        <div><span className="text-slate-400 text-xs">College:</span> <p className="font-bold">{college}</p></div>
                        <div><span className="text-slate-400 text-xs">Branch:</span> <p className="font-bold">{branch}</p></div>
                        <div><span className="text-slate-400 text-xs">Year:</span> <p className="font-bold">{year}</p></div>
                      </div>
                    </div>

                    {/* Competition & Team Review */}
                    <div className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Competition & Team</h3>
                        <button onClick={() => goToStep(2)} className="text-cyan-500 text-xs font-bold hover:underline">Edit</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div><span className="text-slate-400 text-xs">Competition:</span> <p className="font-bold">{competition?.title || selectedComp}</p></div>
                        <div><span className="text-slate-400 text-xs">Type:</span> <p className="font-bold">{competition?.participationLabels?.[participationType] || participationType}</p></div>
                        {participationType === 'team' && (
                          <div><span className="text-slate-400 text-xs">Team:</span> <p className="font-bold">{teamName}</p></div>
                        )}
                        <div><span className="text-slate-400 text-xs">Project Name:</span> <p className="font-bold">{projectName}</p></div>
                      </div>
                      {participationType === 'team' && teamMembers.filter(m => m.name.trim()).length > 0 && (
                        <div>
                          <span className="text-slate-400 text-xs">Team Members:</span>
                          <ul className="mt-1 space-y-1">
                            <li className="text-sm font-bold text-cyan-500">{fullName} (Leader)</li>
                            {teamMembers.filter(m => m.name.trim()).map((m, i) => (
                              <li key={i} className="text-sm">{m.name} {m.phone && `• ${m.phone}`}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {projectDesc && (
                        <div><span className="text-slate-400 text-xs">Description:</span> <p className="text-sm mt-1">{projectDesc}</p></div>
                      )}
                    </div>

                    {/* Privacy & Consent */}
                    <div className="space-y-4 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Your information will be used solely for event registration and communication purposes by the organizing team of Technovision 2026 (Technical Club FLUX, SATI Vidisha). 
                        We will not share your personal data with third parties.
                      </p>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          I confirm that the information provided is accurate and I agree to the event rules and guidelines.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation Buttons ───────────────────────────────── */}
            <div className="px-6 md:px-10 pb-8 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button onClick={handlePrev} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-cyan-500/50 hover:text-cyan-500 transition-all">
                  <ChevronLeft size={16} /> Previous
                </button>
              ) : <div />}

              {step < 3 ? (
                <button onClick={handleNext} className="flex items-center gap-2 bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all uppercase tracking-wider shadow-lg shadow-cyan-500/20">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !consent}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-500 transition-all uppercase tracking-wider shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Check size={18} /> Submit Registration</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnovisionRegister;

