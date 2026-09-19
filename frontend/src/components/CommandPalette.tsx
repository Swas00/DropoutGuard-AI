import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  HeartHandshake, 
  UserCheck, 
  Activity, 
  Cpu, 
  SlidersHorizontal, 
  ArrowRight,
  Sparkles,
  Command,
  FileText
} from 'lucide-react';
import { api, Student } from '../lib/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMetrics?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onOpenMetrics }) => {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      loadQuickStudents();
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const loadQuickStudents = async () => {
    try {
      const res = await api.getStudents({ limit: 12, sortBy: 'riskScore', sortOrder: 'desc' });
      setStudents(res.students || []);
    } catch (e) {
      console.error(e);
    }
  };

  const quickNav = [
    { name: 'Executive Overview', path: '/dashboard', icon: LayoutDashboard, category: 'Analytics' },
    { name: 'Demo Benchmark Student (STU1024)', path: '/students/STU1024', icon: Activity, category: 'Evaluation' },
    { name: 'Student Directory (1,250 Records)', path: '/students', icon: Users, category: 'Data' },
    { name: 'Active Interventions Board', path: '/interventions', icon: HeartHandshake, category: 'Workflows' },
    { name: 'Student Academic Portal', path: '/student', icon: UserCheck, category: 'Portals' },
  ];

  const filteredNav = quickNav.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.studentId.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.course.toLowerCase().includes(query.toLowerCase())
  );

  const totalItems = filteredNav.length + filteredStudents.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (totalItems || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % (totalItems || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSelectedItem();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalItems, filteredNav, filteredStudents]);

  const executeSelectedItem = () => {
    if (selectedIndex < filteredNav.length) {
      const target = filteredNav[selectedIndex];
      navigate(target.path);
      onClose();
    } else {
      const studentIdx = selectedIndex - filteredNav.length;
      const s = filteredStudents[studentIdx];
      if (s) {
        navigate(`/students/${s.studentId}`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Command Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, student name (e.g. Kavya), or ID (STU1024)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs"
              title="Close (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4">
          {/* Navigation Section */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation & Tools
              </div>
              <div className="space-y-1">
                {filteredNav.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions (e.g. Model Metrics) */}
          {onOpenMetrics && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Machine Learning Inspection
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenMetrics();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span>Inspect UCI ML Validation & Metrics (0.925 ROC-AUC)</span>
                </div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  Model Card
                </span>
              </button>
            </div>
          )}

          {/* Students Match Section */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Students Telemetry</span>
                <span className="font-mono text-slate-500">{filteredStudents.length} matches</span>
              </div>
              <div className="space-y-1">
                {filteredStudents.map((s, idx) => {
                  const globalIdx = filteredNav.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <button
                      key={s.studentId}
                      onClick={() => {
                        navigate(`/students/${s.studentId}`);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {s.studentId}
                        </span>
                        <span className="font-semibold text-white">{s.name}</span>
                        <span className="text-slate-400 text-xs hidden sm:inline">({s.course}, Sem {s.semester})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.riskLevel === 'HIGH' 
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                            : s.riskLevel === 'MEDIUM'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {s.riskScore}% {s.riskLevel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">No matches found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "STU1024", "Kavya", or "Dashboard"</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">↵</kbd> select</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400/80">DropoutGuard OmniSearch</span>
        </div>
      </div>
    </div>
  );
};
