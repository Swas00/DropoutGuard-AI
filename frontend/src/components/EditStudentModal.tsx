import React, { useState } from 'react';
import { 
  Edit3, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  SlidersHorizontal, 
  Save 
} from 'lucide-react';
import { api, Student } from '../lib/api';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onStudentUpdated: (updated: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student, onStudentUpdated }) => {
  const [course, setCourse] = useState(student.course);
  const [semester, setSemester] = useState(student.semester);
  const [attendance, setAttendance] = useState(student.attendance);
  const [previousGpa, setPreviousGpa] = useState(student.previousGpa);
  const [currentGpa, setCurrentGpa] = useState(student.currentGpa);
  const [assignmentRate, setAssignmentRate] = useState(student.assignmentRate);
  const [internalMarks, setInternalMarks] = useState(student.internalMarks);
  const [backlogs, setBacklogs] = useState(student.backlogs);
  const [engagement, setEngagement] = useState(student.engagement);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updates = {
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

      const res = await api.updateStudent(student.studentId, updates);
      onStudentUpdated(res.student);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update student telemetry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bento-box bg-[#070b14]/95 p-6 sm:p-8 space-y-6 z-10 border border-white/[0.12] shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-neon-cyan/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">Modify Academic Telemetry</h3>
              <p className="text-xs text-slate-400 font-mono">
                {student.name} ({student.studentId}) • Baseline Risk: {student.riskScore}% ({student.riskLevel})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors border border-white/[0.08] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Academic Program / Department</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500/80 cursor-pointer"
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
              <label className="block text-slate-300 font-semibold mb-1">Current Semester (1 - 8)</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.08] text-white font-mono focus:outline-none focus:border-indigo-500/80"
              />
            </div>
          </div>

          {/* Academic Telemetry Metrics */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
              Updated Assessment Signals
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
                  <span>Recalculating Risk...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update & Recalculate Risk</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
