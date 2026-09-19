import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  HeartHandshake, 
  UserCheck, 
  Activity, 
  Search, 
  Command, 
  Sparkles,
  ChevronDown,
  LogIn,
  LogOut,
  Shield,
  GraduationCap,
  User,
  Check,
  Zap,
  Volume2,
  VolumeX,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { LanguageSwitcher } from './LanguageSwitcher';
import { soundFx } from '../lib/soundFx';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout, quickLoginDemo } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(soundFx.isEnabled());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Automatically close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleSound = () => {
    const next = soundFx.toggle();
    setIsSoundOn(next);
  };

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Overview', shortLabel: 'Overview', icon: Sparkles },
    { to: '/dashboard', label: 'Executive Console', shortLabel: 'Dashboard', icon: LayoutDashboard },
    { to: '/students', label: 'Student Directory', shortLabel: 'Directory', icon: Users },
    { to: '/interventions', label: 'Care Workflow', shortLabel: 'Care Flow', icon: HeartHandshake },
    { to: '/student', label: 'Student Portal', shortLabel: 'Portal', icon: UserCheck },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'ADMIN',
          bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
          icon: Shield,
          gradient: 'from-indigo-600 via-purple-600 to-violet-700'
        };
      case 'faculty':
        return {
          label: 'FACULTY',
          bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
          icon: GraduationCap,
          gradient: 'from-cyan-600 via-teal-600 to-indigo-700'
        };
      case 'student':
        return {
          label: 'STUDENT',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          icon: User,
          gradient: 'from-emerald-600 via-teal-600 to-cyan-700'
        };
      default:
        return {
          label: 'GUEST',
          bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
          icon: User,
          gradient: 'from-slate-600 to-slate-700'
        };
    }
  };

  const roleMeta = getRoleBadge(user?.role);

  const getInitials = (name?: string) => {
    if (!name) return 'DG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#030712]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl transition-all">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link 
                to="/" 
                className="flex items-center gap-2.5 sm:gap-3 group"
                onClick={() => soundFx.playClick()}
              >
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-neon-violet group-hover:shadow-glow-md transition-all duration-300 group-hover:scale-105 shrink-0">
                  <div className="w-full h-full bg-[#030712] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-indigo-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-sm sm:text-base font-extrabold tracking-tight text-white font-display whitespace-nowrap">
                      DropoutGuard<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-black ml-0.5">AI</span>
                    </span>
                    <span className="hidden sm:inline-flex text-[9px] uppercase font-mono font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm whitespace-nowrap">
                      ENTERPRISE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide hidden 2xl:block">
                    Apex University • Office of Student Retention & Academic Care
                  </p>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links (Visible on md: >= 768px) */}
            <nav className="hidden md:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => soundFx.playClick()}
                    onMouseEnter={() => soundFx.playHover()}
                    className={`relative flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-cyan-500/15 border border-indigo-500/30 shadow-glow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05] hover:border hover:border-white/[0.08] hover:-translate-y-0.5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {/* Always visible responsive label: short label on md/lg, full label on xl */}
                    <span className="inline xl:hidden">{link.shortLabel}</span>
                    <span className="hidden xl:inline">{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Desktop Action Cluster (Visible on md: >= 768px) */}
            <div className="hidden md:flex items-center gap-2 xl:gap-2.5 shrink-0">
              
              {/* Quick Search / Command Palette Button */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenCommandPalette();
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="flex items-center gap-2 px-2.5 xl:px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-indigo-500/40 text-xs text-slate-400 hover:text-slate-100 transition-all duration-200 cursor-pointer shadow-inner group hover:shadow-glow-sm"
                title="Quick search students or run command (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span className="hidden xl:inline text-[11px] font-medium">Search...</span>
                <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded group-hover:border-indigo-500/40 group-hover:text-slate-200">
                  <Command className="w-2.5 h-2.5" /> K
                </kbd>
              </button>

              {/* STU1024 Benchmark Student Pill (Desktop xl+) */}
              <Link
                to="/students/STU1024"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-mono transition-all group shadow-sm whitespace-nowrap"
                title="Open Calibrated Benchmark Student (STU1024 - Kavya Sharma)"
              >
                <Activity className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
                <span className="text-[11px] font-bold">STU1024</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 font-bold">
                  78%
                </span>
              </Link>

              {/* Audio FX Toggle Button */}
              <button
                onClick={toggleSound}
                onMouseEnter={() => soundFx.playHover()}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSoundOn
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-glow-sm'
                    : 'bg-slate-900/80 border-white/[0.08] text-slate-500 hover:text-slate-300'
                }`}
                title={isSoundOn ? 'Mute Sound FX' : 'Enable Cyber Sound FX'}
              >
                {isSoundOn ? (
                  <div className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <div className="flex items-end gap-0.5 h-2.5 w-2">
                      <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-1" />
                      <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-3" />
                    </div>
                  </div>
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Regional Multi-Language Selector */}
              <LanguageSwitcher />

              {/* User Account / Profile Menu */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer group"
                    aria-label="User Account Menu"
                  >
                    <div className={`w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-gradient-to-tr ${roleMeta.gradient} flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-white/15 shadow-sm group-hover:ring-indigo-400/50 transition-all shrink-0`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="hidden xl:block text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate max-w-[100px]">
                          {user.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${roleMeta.bg}`}>
                          {roleMeta.label}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#070b14]/98 backdrop-blur-3xl border border-white/[0.12] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* Active Profile Info Card */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${roleMeta.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0`}>
                            {getInitials(user.name)}
                          </div>
                          <div className="overflow-hidden flex-1">
                            <div className="text-sm font-semibold text-white truncate">{user.name}</div>
                            {user.designation ? (
                              <div className="text-[11px] text-indigo-300 font-medium truncate">{user.designation}</div>
                            ) : (
                              <div className="text-xs text-slate-400 font-mono truncate">{user.email}</div>
                            )}
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${roleMeta.bg}`}>
                                {user.role.toUpperCase()}
                              </span>
                              {user.identifier && (
                                <span className="text-[9px] font-mono text-slate-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
                                  {user.identifier}
                                </span>
                              )}
                            </div>
                            {user.institutionName && (
                              <div className="text-[10px] text-slate-400 font-mono truncate mt-1">
                                {user.institutionName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Persona Switcher for Instant Evaluation */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between px-2 mb-1.5">
                          <span className="text-[11px] font-mono font-semibold uppercase text-slate-400 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" /> Switch Role Persona
                          </span>
                          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full border border-indigo-500/20">1-Click Live</span>
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={async () => {
                              await quickLoginDemo('admin');
                              setIsProfileOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              user.role === 'admin'
                                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                                : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Shield className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="font-medium">Administrator (Dean Thorne)</span>
                            </div>
                            {user.role === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </button>

                          <button
                            onClick={async () => {
                              await quickLoginDemo('faculty');
                              setIsProfileOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              user.role === 'faculty'
                                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                                : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="font-medium">Faculty Mentor (Prof. Sen)</span>
                            </div>
                            {user.role === 'faculty' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>

                          <button
                            onClick={async () => {
                              await quickLoginDemo('student');
                              setIsProfileOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              user.role === 'student'
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-medium">Student (Aarav Sharma)</span>
                            </div>
                            {user.role === 'student' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        </div>
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-2 border-t border-white/[0.06]">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out Session</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="btn-primary btn-shimmer text-xs py-1.5 px-3 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

            </div>

            {/* Right: Mobile & Tablet Top Bar (Visible on < md screens) */}
            <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Quick Search Button (Mobile) */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenCommandPalette();
                }}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Search students or command (Ctrl+K)"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-slate-300" />
              </button>

              {/* Audio FX Toggle Button (Mobile) */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSoundOn
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900/80 border-white/[0.08] text-slate-400'
                }`}
                title={isSoundOn ? 'Mute' : 'Unmute'}
                aria-label="Toggle Sound"
              >
                {isSoundOn ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Regional Multi-Language Selector (Mobile) */}
              <LanguageSwitcher />

              {/* User Avatar (If authenticated on mobile) */}
              {user && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr ${roleMeta.gradient} flex items-center justify-center text-white text-[11px] font-bold ring-1 ring-white/20 cursor-pointer shrink-0`}
                  title={`Signed in as ${user.name}`}
                  aria-label="View Account Menu"
                >
                  {getInitials(user.name)}
                </button>
              )}

              {/* Mobile Hamburger Drawer Toggle */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                  isMobileMenuOpen
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25'
                }`}
                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-rose-400" />
                ) : (
                  <Menu className="w-4 h-4 text-indigo-400" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Full-Screen Mobile Slide-Down Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-[#030712]/98 backdrop-blur-3xl border-t border-white/[0.08] overflow-y-auto px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200 shadow-2xl">
            
            {/* 1. Mobile User Profile / Auth Action Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${roleMeta.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}>
                        {getInitials(user.name)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{roleMeta.label} • {user.department || user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-500/15 rounded-xl transition-colors cursor-pointer"
                      title="Sign Out Session"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1-Click Role Persona Switcher for Mobile */}
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400" /> Instant Role Persona
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={async () => {
                          await quickLoginDemo('admin');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-xl text-[11px] font-mono text-center border transition-all cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-indigo-500/25 text-indigo-300 border-indigo-500/50 font-bold'
                            : 'bg-slate-900/80 text-slate-400 border-white/[0.06]'
                        }`}
                      >
                        Admin
                      </button>
                      <button
                        onClick={async () => {
                          await quickLoginDemo('faculty');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-xl text-[11px] font-mono text-center border transition-all cursor-pointer ${
                          user.role === 'faculty'
                            ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 font-bold'
                            : 'bg-slate-900/80 text-slate-400 border-white/[0.06]'
                        }`}
                      >
                        Faculty
                      </button>
                      <button
                        onClick={async () => {
                          await quickLoginDemo('student');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-xl text-[11px] font-mono text-center border transition-all cursor-pointer ${
                          user.role === 'student'
                            ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 font-bold'
                            : 'bg-slate-900/80 text-slate-400 border-white/[0.06]'
                        }`}
                      >
                        Student
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Institutional Access</div>
                      <div className="text-xs text-slate-400">Sign in to evaluate role-specific dashboards</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setAuthModalTab('login');
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn-primary py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalTab('register');
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Register</span>
                    </button>
                  </div>
                  {/* Quick test demo persona shortcuts for unauthenticated judges */}
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" /> 1-Click Demo Evaluation:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={async () => {
                          await quickLoginDemo('admin');
                          setIsMobileMenuOpen(false);
                        }}
                        className="py-1.5 px-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono text-center cursor-pointer"
                      >
                        Admin
                      </button>
                      <button
                        onClick={async () => {
                          await quickLoginDemo('faculty');
                          setIsMobileMenuOpen(false);
                        }}
                        className="py-1.5 px-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono text-center cursor-pointer"
                      >
                        Faculty
                      </button>
                      <button
                        onClick={async () => {
                          await quickLoginDemo('student');
                          setIsMobileMenuOpen(false);
                        }}
                        className="py-1.5 px-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono text-center cursor-pointer"
                      >
                        Student
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Command Palette / Search Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-300 transition-all cursor-pointer shadow-inner"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-indigo-400" />
                <span className="font-medium text-slate-200">Quick search students or command...</span>
              </div>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* 3. Benchmark STU1024 Quick Link Card */}
            <Link
              to="/students/STU1024"
              onClick={() => {
                soundFx.playClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-white font-mono">STU1024 • Kavya Sharma</div>
                  <div className="text-[10px] text-amber-300/80">Benchmark Student Case Study</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/25 text-[10px] font-mono font-bold text-amber-200 border border-amber-500/40">
                78% High Risk
              </span>
            </Link>

            {/* 4. Primary Navigation Console Links */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2">
                Navigation Console
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => {
                      soundFx.playClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-cyan-500/20 text-white border border-indigo-500/40 shadow-glow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/[0.04] text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{link.label}</span>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-cyan-400" />}
                  </Link>
                );
              })}
            </div>

            {/* 5. Institutional Footer */}
            <div className="pt-4 border-t border-white/[0.06] text-center">
              <p className="text-[10px] text-slate-500 font-mono">
                DropoutGuard AI Enterprise • Apex University
              </p>
              <p className="text-[9px] text-slate-600 font-mono mt-0.5">
                Office of Student Retention & Academic Care
              </p>
            </div>

          </div>
        )}
      </header>

      {/* Mobile Persistent Bottom Navigation Dock (Visible on < md screens when minimized) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/95 backdrop-blur-3xl border-t border-white/[0.1] shadow-[0_-8px_30px_rgba(0,0,0,0.85)] px-2 py-1.5"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => soundFx.playClick()}
                className={`flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-white/[0.06] shadow-glow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 text-indigo-400' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'text-white font-bold' : ''}`}>
                  {link.shortLabel}
                </span>
                {isActive && (
                  <span className="w-1 h-1 bg-cyan-400 rounded-full mt-0.5 shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Auth Modal for Sign In / Register */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalTab}
      />
    </>
  );
};
