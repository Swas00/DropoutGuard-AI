import React, { useState } from 'react';
import { 
  UserPlus, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  SlidersHorizontal,
  Hash,
  GraduationCap
} from 'lucide-react';
import { api, Student } from '../lib/api';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onStudentAdded }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [semester, setSemester] = useState(3);
  const [attendance, setAttendance] = useState(72);
  const [previousGpa, setPreviousGpa] = useState(7.2);
  const [currentGpa, setCurrentGpa] = useState(6.8);
  const [assignmentRate, setAssignmentRate] = useState(70);
  const [internalMarks, setInternalMarks] = useState(65);
  const [backlogs, setBacklogs] = useState(1);
  const [engagement, setEngagement] = useState(68);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time local heuristic estimation for preview
  const estimateRisk = () => {
    let penalty = 0;
    if (attendance < 65) penalty += 35;
    else if (attendance < 75) penalty += 15;
    
    const diff = currentGpa - previousGpa;
    if (diff <= -0.5) penalty += 25;
    else if (diff < 0) penalty += 10;
    
    if (backlogs >= 2) penalty += 20;
    else if (backlogs === 1) penalty += 10;
    
    if (assignmentRate < 60) penalty += 15;
    else if (assignmentRate < 75) penalty += 8;

    if (engagement < 60) penalty += 12;
    
    const score = Math.min(96, Math.max(6, Math.round(penalty + (100 - attendance) * 0.15)));
    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (score >= 65) level = 'HIGH';
    else if (score >= 35) level = 'MEDIUM';
    return { score, level };
  };

  const preview = estimateRisk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        studentId: studentId.trim() || undefined,
        name: name.trim(),
        course,
        semester: Number(semester),
        attendance: Number(attendance),
        previousGpa: Number(previousGpa),
        currentGpa: Number(currentGpa),
        assignmentRate: Number(assignmentRate),
        internalMarks: Number(internalMarks),
        backlogs: Number(backlogs),
        engagement: Number(engagement)
      };

      const res = await api.createStudent(payload);
      onStudentAdded(res.student);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add student. Please verify all inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bento-box bg-[#0b1120] p-6 sm:p-8 space-y-6 z-10 border border-white/[0.16] shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-neon-indigo/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">Enroll & Provision Student Record</h3>
              <p className="text-xs text-slate-300 font-mono">Real-time ML risk scoring will automatically calibrate upon submission</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors border border-white/[0.08] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Real-Time Prediction Preview Pill */}
        <div className="p-3.5 rounded-2xl bg-[#070b14] border border-white/[0.12] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-200 font-medium">Estimated ML Early-Warning Risk:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              preview.level === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-neon-coral/20' :
              preview.level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-neon-amber/20' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-neon-emerald/20'
            }`}>
              {preview.score}% {preview.level} RISK TIER
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Identity Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 font-semibold mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Nair"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1">Student ID (Optional - Auto-Assigned)</label>
              <input
                type="text"
                placeholder="e.g. STU1251"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-white font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 font-semibold mb-1">Academic Program / Department *</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-white focus:outline-none focus:border-indigo-500/80 cursor-pointer"
              >
                <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                <option value="B.Tech Electronics & Comm">B.Tech Electronics & Comm</option>
                <option value="MCA">MCA (Computer Applications)</option>
                <option value="B.Tech Mechanical">B.Tech Mechanical</option>
                <option value="B.Tech Civil">B.Tech Civil</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1">Current Semester (1 - 8) *</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-white font-mono focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>

          {/* Academic Telemetry Metrics */}
          <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.12] space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
              Continuous Assessment Signals
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Attendance Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={attendance}
                  onChange={(e) => setAttendance(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#070b14] border border-white/[0.08] text-white font-mono focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Previous GPA (0-10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={previousGpa}
                  onChange={(e) => setPreviousGpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#070b14] border border-white/[0.08] text-white font-mono focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Current GPA (0-10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={currentGpa}
                  onChange={(e) => setCurrentGpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#070b14] border border-white/[0.08] text-white font-mono focus:border-indigo-500/80 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Assignment Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={assignmentRate}
                  onChange={(e) => setAssignmentRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#070b14] border border-white/[0.08] text-white font-mono focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Internal Marks (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={internalMarks}
                  onChange={(e) => setInternalMarks(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#070b14] border border-white/[0.08] text-white font-mono focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Course Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={backlogs}
                  onChange={(e) => setBacklogs(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#070b14] border border-white/[0.08] text-white font-mono focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">LMS Engagement (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={engagement}
                  onChange={(e) => setEngagement(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#070b14] border border-white/[0.08] text-white font-mono focus:border-indigo-500/80 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-shimmer group text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-neon-indigo/30"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Risk & Enrolling...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Enroll Student & Compute Risk</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
