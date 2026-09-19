import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  Building2,
  Phone,
  Hash,
  MapPin,
  GraduationCap,
  BellRing
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, quickLoginDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Basic credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Institutional Affiliation
  const [role, setRole] = useState<'admin' | 'faculty' | 'student'>('faculty');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [institutionName, setInstitutionName] = useState('Apex University of Technology');
  const [campus, setCampus] = useState('Main Technology Campus');
  
  // Role-Specific Customizations
  const [designation, setDesignation] = useState('Assistant Professor & Lead Mentor');
  const [identifier, setIdentifier] = useState('FAC-CS-2026');
  const [specialization, setSpecialization] = useState('Artificial Intelligence & Student Retention');
  const [officeLocation, setOfficeLocation] = useState('Block B, Room 304');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: 'admin' | 'faculty' | 'student') => {
    setRole(newRole);
    if (newRole === 'admin') {
      setDesignation('Dean of Academic Affairs');
      setIdentifier('EMP-ADM-001');
      setSpecialization('Institutional Retention & Policy');
      setOfficeLocation('Senate Hall, Room 101');
    } else if (newRole === 'student') {
      setDesignation('Undergraduate Scholar (Year 3)');
      setIdentifier('STU1024');
      setSpecialization('Computer Science & Engineering');
      setOfficeLocation('Hostel Block C, Room 214');
    } else {
      setDesignation('Assistant Professor & Lead Mentor');
      setIdentifier('FAC-CS-2026');
      setSpecialization('Artificial Intelligence & Student Retention');
      setOfficeLocation('Block B, Room 304');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccessMsg('Authentication successful! Welcome back.');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        await register({ 
          name, 
          email, 
          password, 
          role, 
          department,
          institutionName,
          campus,
          designation,
          identifier,
          phone,
          specialization,
          officeLocation,
          notificationsEnabled
        });
        setSuccessMsg('Enterprise profile provisioned! Welcome to DropoutGuard AI.');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = async (persona: 'admin' | 'faculty' | 'student') => {
    setError(null);
    setLoading(true);
    try {
      await quickLoginDemo(persona);
      setSuccessMsg(`Switched persona to ${persona.toUpperCase()} successfully.`);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to switch demo persona.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full ${mode === 'register' ? 'max-w-2xl' : 'max-w-lg'} bg-[#0b1120] p-6 sm:p-8 space-y-5 z-10 border border-white/[0.16] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 transition-all`}>
        
        {/* Header with Brand */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-0.5 shadow-neon-indigo/30">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                {mode === 'login' ? 'Institutional Sign In' : 'Create Enterprise Academic Account'}
              </h3>
              <p className="text-xs text-slate-300 font-mono">Apex University • Office of Student Retention</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#070b14] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center text-xs transition-all border border-white/[0.12] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1-Click Demo Personas Bar */}
        <div className="p-3.5 rounded-2xl bg-[#070b14] border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              1-Click Demo Evaluation Personas
            </span>
            <span className="text-[10px] font-mono text-slate-400">Instant Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickSwitch('admin')}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-white/[0.12] hover:border-indigo-400 text-left transition-all group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-300 truncate">Dean Thorne</div>
              <div className="text-[9px] font-mono text-indigo-400">ADMIN (DEAN)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSwitch('faculty')}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-white/[0.12] hover:border-cyan-400 text-left transition-all group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300 truncate">Prof. Sen</div>
              <div className="text-[9px] font-mono text-cyan-400">FACULTY</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSwitch('student')}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#0e172a] hover:bg-[#1e293b] border border-white/[0.12] hover:border-amber-400 text-left transition-all group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 truncate">Aarav (STU1024)</div>
              <div className="text-[9px] font-mono text-amber-400">STUDENT</div>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#070b14] border border-white/[0.12]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-neon-indigo/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-neon-indigo/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Account (Customized Details)
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in shadow-neon-emerald/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {mode === 'register' ? (
            <>
              {/* Section 1: Role Selector */}
              <div>
                <label className="block text-slate-200 font-semibold mb-1.5">
                  Select Institutional Role & Access Tier *
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('faculty')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'faculty'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-neon-cyan/20'
                        : 'bg-[#070b14] border-white/[0.12] text-slate-300 hover:border-white/[0.25]'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span className="font-semibold block text-[11px]">Faculty / Mentor</span>
                    <span className="text-[9px] text-slate-400 font-mono">Advisory Pipeline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'admin'
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-neon-indigo/20'
                        : 'bg-[#070b14] border-white/[0.12] text-slate-300 hover:border-white/[0.25]'
                    }`}
                  >
                    <Award className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                    <span className="font-semibold block text-[11px]">Dean / Admin</span>
                    <span className="text-[9px] text-slate-400 font-mono">Full Executive Suite</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-neon-amber/20'
                        : 'bg-[#070b14] border-white/[0.12] text-slate-300 hover:border-white/[0.25]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <span className="font-semibold block text-[11px]">Student Scholar</span>
                    <span className="text-[9px] text-slate-400 font-mono">Wellness Hub</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Personal Identity & Credentials */}
              <div className="p-3.5 rounded-xl bg-[#070b14] border border-white/[0.12] space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                  1. Identity & Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Rajesh Mehra"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Institutional Email *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="name@apex.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Institutional Affiliation */}
              <div className="p-3.5 rounded-xl bg-[#070b14] border border-white/[0.12] space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  2. University Affiliation
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">University / College Name *</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Campus / Branch Location</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={campus}
                        onChange={(e) => setCampus(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department / Academic Unit *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Section 4: Role-Specific Details & Credentials */}
              <div className="p-3.5 rounded-xl bg-[#070b14] border border-white/[0.12] space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  3. Designation, ID & Specialization
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {role === 'student' ? 'Academic Program / Year' : 'Academic Designation / Title *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {role === 'student' ? 'Student Roll / Enrollment ID *' : 'Employee / Faculty ID *'}
                    </label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Specialization / Domain Focus</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Data Science, Machine Learning"
                      className="w-full px-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Office / Cabin Location</label>
                    <input
                      type="text"
                      value={officeLocation}
                      onChange={(e) => setOfficeLocation(e.target.value)}
                      placeholder="e.g. Science Block, Room 402"
                      className="w-full px-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 bg-[#070b14] border-white/[0.2] focus:ring-indigo-500"
                    />
                    <span className="text-[11px]">
                      Enable real-time email alerts when a student in my cohort enters the Critical High Risk tier (&gt;65%).
                    </span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* Login Fields */
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@apex.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070b14] border border-white/[0.14] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#070b14] border border-white/[0.14] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary btn-shimmer py-3 text-xs sm:text-sm font-bold shadow-neon-indigo/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Institutional Authentication...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In to Executive Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Complete Registration & Provision Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-white/[0.08] text-center text-[11px] text-slate-400 font-mono">
          Protected by FERPA & SOC-2 Enterprise Compliance Protocol.
        </div>

      </div>
    </div>
  );
};
