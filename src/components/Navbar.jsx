import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../slices/authSlices';
import { logout as logoutApi } from '../api';
import { Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, ChevronDown, Menu, X, MessageSquare, History, ShieldCheck } from 'lucide-react';
import fluxLogo from '/fluxlogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showMobileVersionDropdown, setShowMobileVersionDropdown] = useState(false);
  const [showMobileProfileDropdown, setShowMobileProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const versionDropdownRef = useRef(null);
  const mobileVersionDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(event.target)) {
        setShowVersionDropdown(false);
      }
      if (mobileVersionDropdownRef.current && !mobileVersionDropdownRef.current.contains(event.target)) {
        setShowMobileVersionDropdown(false);
      }
      if (mobileProfileDropdownRef.current && !mobileProfileDropdownRef.current.contains(event.target)) {
        setShowMobileProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Scroll Locking
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
    setShowVersionDropdown(false);
    setShowMobileVersionDropdown(false);
    setShowMobileProfileDropdown(false);
  }, [location]);

  // Theme Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try { await logoutApi(); } catch (err) { console.error(err); }
    finally {
      dispatch(logoutAction());
      setIsOpen(false);
      navigate('/login', { replace: true });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Learning', path: '/LearningHub' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-[150] transition-all duration-500 ${scrolled ? 'top-0' : 'top-0 lg:top-6'}`}>
        <div className={`mx-auto transition-all duration-700 ${scrolled ? 'max-w-full' : 'max-w-full lg:max-w-7xl px-0 lg:px-6'}`}>
          <div className={`relative flex items-center justify-between h-16 sm:h-20 px-4 sm:px-8 lg:px-10 transition-all duration-500 
            ${scrolled
              ? 'bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-gray-200 dark:border-cyan-500/30'
              : 'bg-white/90 dark:bg-black/80 lg:dark:bg-white/[0.03] backdrop-blur-md border-b lg:border border-gray-200 dark:border-white/10 lg:rounded-2xl shadow-lg lg:shadow-2xl'}`}>

            {/* --- LOGO SECTION (Restored Desktop Animations) --- */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-4 group relative shrink-0 z-[160]"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center group">
                {/* Engineering Grid / Orbit Ring */}
                <div className="absolute inset-0 border-[1px] border-cyan-500/20 rounded-full group-hover:border-cyan-500/50 group-hover:scale-125 transition-all duration-500"></div>

                {/* Rotating Tech Bracket - Only visible on hover */}
                <div className="absolute inset-[-4px] border-t-2 border-l-2 border-cyan-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 ease-in-out hidden lg:block"></div>

                {/* Logo Image with Glitch/Glow effect */}
                <div className="relative overflow-hidden">
                  <img
                    src={fluxLogo}
                    alt="Flux"
                  // className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 object-contain z-10 
                  //          lg:filter lg:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]
                  //          group-hover:scale-110 group-hover:brightness-125
                  //          transition-all duration-300"
                  />

                  {/* Technical "Scanline" Overlay (Desktop Only) */}
                  <div className="absolute inset-0 w-full h-[2px] bg-cyan-400/50 -translate-y-10 group-hover:animate-[scan_1.5s_ease-in-out_infinite] pointer-events-none hidden lg:block"></div>
                </div>
              </div>

              {/* Brand Text: Hidden on mobile, only logo appears */}
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-black dark:text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter leading-none uppercase">FLUX</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${userInfo ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></span>
                </div>
                <span className="text-[8px] lg:text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-[0.2em] lg:tracking-[0.3em] uppercase mt-0.5 font-bold">TECHNICAL CLUB</span>
              </div>
            </Link>

            {/* --- DESKTOP NAVIGATION (Restored Hover Animations) --- */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all group overflow-hidden ${
                      location.pathname === link.path
                        ? 'text-cyan-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {/* Sliding Text Effect */}
                    <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-full block">
                      {link.name}
                    </span>
                    <span className="absolute inset-0 z-10 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-cyan-400">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* --- RIGHT TOOLS --- */}
            <div className="flex items-center gap-2 sm:gap-4 z-[160]">

              <div className="hidden xl:flex items-center gap-4">
                {/* Version Control Dropdown */}
                <div className="relative" ref={versionDropdownRef}>
                  <button
                    onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    className={`px-3 py-1.5 rounded-xl border transition-all group flex items-center gap-2 ${location.pathname === '/old-site'
                      ? 'border-purple-500/30 bg-purple-500/10 text-purple-500'
                      : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
                      }`}
                    title="Switch Version"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 ${location.pathname === '/old-site' ? 'text-purple-500' : 'text-cyan-500'} group-hover:rotate-[-45deg] transition-transform duration-300 w-3.5 h-3.5`}
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 21H3v-5" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {location.pathname === '/old-site' ? 'v1.0' : 'v2.0'}
                    </span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${showVersionDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showVersionDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in duration-200">
                      <div className="p-2 space-y-1">
                        <div className="px-4 py-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Version</span>
                        </div>

                        {/* v1.0 Legacy Link */}
                        <Link
                          to="/old-site"
                          onClick={() => setShowVersionDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${location.pathname === '/old-site'
                            ? 'bg-purple-500/10 text-purple-500 cursor-default'
                            : 'hover:bg-purple-500/10 text-gray-500 dark:text-gray-400 hover:text-purple-500'
                            }`}
                        >
                          <div className={`w-2 h-2 rounded-full transition-colors ${location.pathname === '/old-site' ? 'bg-purple-500' : 'bg-gray-400 group-hover:bg-purple-500'
                            }`}></div>
                          <span className="text-xs font-bold uppercase">v1.0 Legacy</span>
                        </Link>

                        {/* v2.0 Current Link */}
                        <Link
                          to="/"
                          onClick={() => setShowVersionDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${location.pathname !== '/old-site'
                            ? 'bg-cyan-500/10 text-cyan-500 cursor-default'
                            : 'hover:bg-cyan-500/10 text-gray-500 dark:text-gray-400 hover:text-cyan-500'
                            }`}
                        >
                          {location.pathname !== '/old-site' ? (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-cyan-500 transition-colors"></div>
                          )}
                          <span className="text-xs font-bold uppercase">v2.0 Current</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={toggleTheme} className="p-2 rounded-full border border-cyan-500/20 hover:bg-cyan-500/10 transition-colors">
                  {isDark ? <Sun size={18} className="text-cyan-400" /> : <Moon size={18} className="text-cyan-600" />}
                </button>

                {userInfo ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-cyan-500/50 transition-all group max-w-[180px]"
                    >
                      <UserIcon size={16} className="text-cyan-500 shrink-0" />
                      <span className="text-[10px] font-bold dark:text-white uppercase tracking-widest truncate">{userInfo.name}</span>
                      <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in duration-200">
                        <div className="p-2 space-y-1">
                          {userInfo.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold transition-all border border-purple-500/20"
                            >
                              <ShieldCheck size={16} />
                              <span className="text-xs font-bold uppercase">Admin Panel</span>
                            </Link>
                          )}
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-500/10 dark:text-gray-300 hover:text-cyan-500 transition-all">
                            <LayoutDashboard size={16} />
                            <span className="text-xs font-bold uppercase">Dashboard</span>
                          </Link>
                          <Link to="/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-500/10 dark:text-gray-300 hover:text-cyan-500 transition-all">
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold uppercase">Group Chat</span>
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all">
                            <LogOut size={16} />
                            <span className="text-xs font-bold uppercase">Terminate</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="px-4 py-2 border border-cyan-500/30 text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em] rounded-sm hover:border-cyan-400 transition-all">
                    System_Access
                  </Link>
                )}
              </div>

              <div className="xl:hidden relative mr-2" ref={mobileVersionDropdownRef}>
                <button
                  onClick={() => setShowMobileVersionDropdown(!showMobileVersionDropdown)}
                  className={`px-2 py-1.5 rounded-lg border transition-all group flex items-center gap-1.5 ${location.pathname === '/old-site'
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-500'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
                    }`}
                  title="Switch Version"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 ${location.pathname === '/old-site' ? 'text-purple-500' : 'text-cyan-500'} group-hover:rotate-[-45deg] transition-transform duration-300 w-3.5 h-3.5`}
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 21H3v-5" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {location.pathname === '/old-site' ? 'v1.0' : 'v2.0'}
                  </span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${showMobileVersionDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showMobileVersionDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in duration-200 z-[200]">
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Select Version</span>
                      </div>

                      {/* v1.0 Legacy Link */}
                      <Link
                        to="/old-site"
                        onClick={() => setShowMobileVersionDropdown(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all group ${location.pathname === '/old-site'
                          ? 'bg-purple-500/10 text-purple-500 cursor-default'
                          : 'hover:bg-purple-500/10 text-gray-500 dark:text-gray-400 hover:text-purple-500'
                          }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${location.pathname === '/old-site' ? 'bg-purple-500' : 'bg-gray-400 group-hover:bg-purple-500'
                          }`}></div>
                        <span className="text-[10px] font-bold uppercase">v1.0 Legacy</span>
                      </Link>

                      {/* v2.0 Current Link */}
                      <Link
                        to="/"
                        onClick={() => setShowMobileVersionDropdown(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all group ${location.pathname !== '/old-site'
                          ? 'bg-cyan-500/10 text-cyan-500 cursor-default'
                          : 'hover:bg-cyan-500/10 text-gray-500 dark:text-gray-400 hover:text-cyan-500'
                          }`}
                      >
                        {location.pathname !== '/old-site' ? (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                          </span>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-cyan-500 transition-colors"></div>
                        )}
                        <span className="text-[10px] font-bold uppercase">v2.0 Current</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE THEME TOGGLE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
                className="xl:hidden p-2 rounded-lg text-cyan-500 hover:bg-cyan-500/10 active:scale-95 transition-all mr-1"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>

              {/* MOBILE PROFILE MENU (Mobile Only - Beside Toggle) */}
              <div className="xl:hidden relative mr-1" ref={mobileProfileDropdownRef}>
                {userInfo ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMobileProfileDropdown(!showMobileProfileDropdown);
                    }}
                    className="p-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 flex items-center justify-center text-cyan-500 active:scale-95 transition-all relative"
                    title={userInfo.name}
                  >
                    <UserIcon size={20} className="text-cyan-500" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"></span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="p-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-cyan-500/30 text-cyan-500 active:scale-95 transition-all flex items-center justify-center"
                    title="Sign In"
                  >
                    <UserIcon size={20} />
                  </Link>
                )}

                {showMobileProfileDropdown && userInfo && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in duration-200 z-[200]">
                    <div className="p-3 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                      <p className="text-xs font-black text-black dark:text-white uppercase truncate">{userInfo.name}</p>
                      <p className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest">{userInfo.role || 'Member'}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {userInfo.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowMobileProfileDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold transition-all border border-purple-500/20 text-xs uppercase"
                        >
                          <ShieldCheck size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setShowMobileProfileDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 dark:text-gray-300 hover:text-cyan-500 transition-all text-xs font-bold uppercase"
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/chat"
                        onClick={() => setShowMobileProfileDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 dark:text-gray-300 hover:text-cyan-500 transition-all text-xs font-bold uppercase"
                      >
                        <MessageSquare size={16} />
                        <span>Group Chat</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowMobileProfileDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-all text-xs font-bold uppercase"
                      >
                        <LogOut size={16} />
                        <span>Terminate</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE TOGGLE - MENU BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="xl:hidden relative p-2 text-cyan-500 active:scale-90 transition-transform rounded-lg hover:bg-cyan-500/10"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE/TABLET MENU (Simple Grid Layout) --- */}
      <div className={`fixed inset-0 w-full h-screen bg-white dark:bg-black z-[140] transition-transform duration-300 xl:hidden ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col h-full pt-24 px-6 pb-10">

          {/* Mobile Navigation Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-16 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 active:bg-cyan-500/10 active:text-cyan-500 text-slate-800 dark:text-white"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Clean Mobile Drawer Footer */}
          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-bold">
              FLUX TECHNICAL CLUB
            </p>
            <p className="text-[9px] font-mono text-gray-400 dark:text-gray-500 uppercase mt-1">
              Engineered for Excellence
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;