import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Layers, Cpu, Shield, Wind, Brain, Radio, Microscope, User, Send, Plus, Globe, Loader2, Search, Filter, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api';
import { PROJECTS_DATA } from '../data/projectData';

/* ===================== ICON HELPER ===================== */
const ICONS = {
  shield: <Shield size={16} />,
  cpu: <Cpu size={16} />,
  brain: <Brain size={16} />,
  wind: <Wind size={16} />,
  radio: <Radio size={16} />,
  microscope: <Microscope size={16} />,
};

const getProjectIcon = (title) => {
  const t = title?.toLowerCase() || '';
  if (t.includes('robotic')) return ICONS.cpu;
  if (t.includes('plant') || t.includes('monitor')) return ICONS.microscope;
  if (t.includes('maze') || t.includes('ai')) return ICONS.brain;
  if (t.includes('quadcopter') || t.includes('drone')) return ICONS.wind;
  if (t.includes('gaming') || t.includes('gloves')) return ICONS.radio;
  if (t.includes('ctf') || t.includes('flag')) return ICONS.shield;
  if (t.includes('auction')) return ICONS.radio;
  if (t.includes('mail')) return ICONS.radio;
  return <Layers size={16} />;
};

const isSoftwareProject = (project) => {
  const tech = project?.tech || [];
  const hwKeywords = ['arduino','3d printing','3d','sensors','robotic','robotics','accelerometer','microcontroller','microcontrollers','blcd','motor','motors','flight','drone','servo','rf','hardware','iot'];
  return !tech.some(t => hwKeywords.some(k => t.toLowerCase().includes(k)));
};

/* ===================== OPTIMIZED CARD COMPONENT ===================== */
const ProjectCard = memo(({ project }) => {
  const gitUrl = project.git || project.githubLink;
  const liveUrl = project.live || project.liveLink;
  const techList = project.tech || project.techStack || [];
  const author = project.submittedBy || 'Lead Developer';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 flex flex-col group transition-colors duration-300 shadow-sm h-full transform-gpu"
    >
      <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-4 relative bg-zinc-900 dark:bg-black">
        {project.img ? (
          <img
            src={project.img}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={project.title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-950/40 via-slate-900 to-black p-4 text-center">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
              {getProjectIcon(project.title)}
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">Community Project</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="absolute top-3 left-3 p-2 bg-white dark:bg-black/80 rounded-xl text-cyan-600 border border-white/10 z-10">
          {getProjectIcon(project.title)}
        </div>
      </div>

      <div className="px-1 flex-1 flex flex-col">
        <h3 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase mb-1">
          {project.title}
        </h3>

        {/* REMOVED line-clamp-2 TO SHOW FULL DESCRIPTION */}
        <p className="text-[11px] md:text-xs text-slate-500 dark:text-gray-400 font-medium mb-3">
          {project.description}
        </p>

        <div className="flex items-center gap-2 mb-4 bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
          <User size={12} className="text-cyan-500" />
          <span className="text-[9px] md:text-[10px] font-bold text-slate-600 dark:text-gray-300 uppercase truncate">
            {author}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-5">
          {techList.map((t, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-cyan-500/5 text-[9px] font-mono text-cyan-600 dark:text-cyan-400 rounded border border-cyan-500/10">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          {project.report ? (
            <a
              href={project.report}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black py-2.5 md:py-3 rounded-xl font-bold text-[10px] uppercase transition-colors"
            >
              <Globe size={12} /> <span>{project.reportLabel || 'Report'}</span>
            </a>
          ) : (
            <button
              onClick={() => toast.error("Report not available for this project")}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900/60 dark:bg-white/10 text-white/80 dark:text-black/60 py-2.5 md:py-3 rounded-xl font-bold text-[10px] uppercase transition-colors"
            >
              <Globe size={12} /> <span>Report</span>
            </button>
          )}

          {gitUrl ? (
            <a
              href={gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 md:p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:text-cyan-500 transition-colors"
              title="View Source"
            >
              <Github size={16} />
            </a>
          ) : (
            <button
              onClick={() => toast("GitHub not available for this project")}
              className="p-2.5 md:p-3 bg-slate-100/40 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 transition-colors"
            >
              <Github size={16} />
            </button>
          )}

          {liveUrl && isSoftwareProject(project) ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Live Demo"
              aria-label="Live Demo"
              className="p-2.5 md:p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/5 transition-colors flex items-center justify-center text-emerald-500 dark:text-emerald-300"
            >
              <Globe size={16} />
            </a>
          ) : (
            isSoftwareProject(project) && (
              <button
                onClick={() => toast("Live demo not available for this project")}
                className="p-2.5 md:p-3 bg-emerald-50/10 dark:bg-transparent rounded-xl border border-emerald-500/10 text-emerald-200/40 transition-colors"
              >
                <Globe size={16} />
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
});

/* ===================== MAIN APP ===================== */
const FluxProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [formData, setFormData] = useState({
    submittedBy: '', email: '', title: '', description: '', techStack: '', githubLink: '', liveLink: ''
  });

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const res = await API.get('/projects?approved=true');
        const dbData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const approvedFromDb = dbData.filter(p => p.isApproved || p.status === 'approved');

        const formattedDb = approvedFromDb.map(p => ({
          _id: p._id,
          title: p.title,
          description: p.description,
          tech: p.techStack || p.tech || [],
          git: p.githubLink || p.git,
          live: p.liveLink || p.live,
          submittedBy: p.submittedBy,
          date: p.createdAt ? p.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          popularity: p.popularity || 85,
          img: p.img || null
        }));

        setProjects([...formattedDb, ...(PROJECTS_DATA || [])]);
      } catch (err) {
        console.error("Error fetching projects from registry:", err);
        if (PROJECTS_DATA) setProjects(PROJECTS_DATA);
      }
    };

    fetchApprovedProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const query = searchQuery.toLowerCase();
    const techItems = project.tech || project.techStack || [];
    return (
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      techItems.some(t => t.toLowerCase().includes(query)) ||
      project.submittedBy?.toLowerCase().includes(query)
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOption === "latest") return new Date(b.date) - new Date(a.date);
    if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortOption === "popular") return b.popularity - a.popularity;
    return 0;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      techStack: formData.techStack.split(',').map(item => item.trim())
    };

    try {
      const res = await API.post('/projects', payload);
      if (res.status === 201 || res.status === 200) {
        toast.success("Proposal Sent to Registry! Awaiting Admin Approval.", {
          style: { background: '#0c0c0c', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
          iconTheme: { primary: '#06b6d4', secondary: '#fff' }
        });
        setFormData({
          submittedBy: '', email: '', title: '', description: '',
          techStack: '', githubLink: '', liveLink: ''
        });
      }
    } catch (err) {
      console.error("Transmission Error:", err);
      toast.error(err.response?.data?.message || "Deployment Failed: System Busy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 pt-24 md:pt-32 pb-20 px-4 md:px-6 font-sans overflow-x-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />

      <header className="max-w-6xl mx-auto mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            <Layers size={14} /> System Registry
          </div>
          <h1 className="text-4xl xs:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Our <br className="sm:hidden" />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Projects</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-stretch md:items-center">
          {/* Sort Dropdown */}
          <div className="relative z-20">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 bg-white dark:bg-white/5 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-mono text-slate-500 dark:text-slate-300 hover:border-cyan-500/50 hover:text-cyan-500 transition-all w-full md:min-w-[160px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span className="capitalize">{sortOption === 'latest' ? 'Newest First' : sortOption === 'oldest' ? 'Oldest First' : 'Most Popular'}</span>
              </div>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden p-1 min-w-[160px] z-50"
                >
                  {['latest', 'popular', 'oldest'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortOption(opt);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${sortOption === opt
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      {opt === 'latest' ? 'Newest First' : opt === 'oldest' ? 'Oldest First' : 'Most Popular'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Search size={16} className="text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 items-stretch">
          <AnimatePresence mode="popLayout">
            {sortedProjects.map((p, index) => (
              <ProjectCard key={p.title || index} project={p} />
            ))}
          </AnimatePresence>

          <div
            onClick={() => document.getElementById('simple-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer hover:border-cyan-500/50 transition-all bg-white/50 dark:bg-white/[0.01] min-h-[350px]"
          >
            <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-500 mb-4"><Plus size={28} /></div>
            <span className="text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-widest text-center">Contribute to Archive</span>
          </div>
        </section>

        {sortedProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 mb-24 text-center space-y-4">
            <Search size={48} className="text-slate-300 dark:text-white/10" />
            <p className="text-slate-500 dark:text-white/30 font-mono text-sm">No projects found matching "{searchQuery}"</p>
          </div>
        )}

        <section id="simple-form" className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#0c0c0c] p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16" />
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
              <Send size={24} className="text-cyan-500" /> Submit Proposal
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold tracking-widest ml-1 text-slate-400">Collaborator</label>
                  <input type="text" required placeholder="Full Name" value={formData.submittedBy} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold tracking-widest ml-1 text-slate-400">Communication</label>
                  <input type="email" required placeholder="Email Address" value={formData.email} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold tracking-widest ml-1 text-slate-400">Identification</label>
                <input type="text" required placeholder="Project Title" value={formData.title} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold tracking-widest ml-1 text-slate-400">Manifesto</label>
                <textarea required placeholder="Briefly explain the project goals..." rows="4" value={formData.description} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold tracking-widest ml-1 text-slate-400">Technology Stack</label>
                <input type="text" placeholder="e.g. React, Python, AWS" value={formData.techStack} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all" onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="url" placeholder="Source Code URL" value={formData.githubLink} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm outline-none focus:border-cyan-500 transition-all" onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} />
                <input type="url" placeholder="Deployment URL" value={formData.liveLink} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm outline-none focus:border-cyan-500 transition-all" onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 py-4 md:py-5 rounded-2xl font-black uppercase text-[11px] md:text-xs tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] ${isSubmitting ? 'bg-slate-700 cursor-not-allowed opacity-70' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Transmitting Data...</span>
                  </>
                ) : (
                  <span>Initialize Deployment</span>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>

      <footer className="mt-20 text-center text-slate-400 text-[10px] uppercase tracking-[0.4em] font-bold">
        Flux Archive © 2026 // Decentralized Registry
      </footer>
    </div>
  );
};

export default FluxProjects;