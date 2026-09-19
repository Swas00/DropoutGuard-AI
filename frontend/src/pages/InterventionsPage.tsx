import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  AlertTriangle, 
  Filter, 
  Plus, 
  Send,
  User,
  BookOpen,
  Calendar,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { api, Intervention } from '../lib/api';
import { useTranslation } from 'react-i18next';

export const InterventionsPage: React.FC = () => {
  const { t } = useTranslation('advising');
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadInterventions();
  }, []);

  const loadInterventions = async () => {
    try {
      setLoading(true);
      const data = await api.getInterventions();
      setInterventions(data);
    } catch (err) {
      console.error('Error loading interventions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'In-Progress' | 'Completed') => {
    try {
      setUpdatingId(id);
      const updated = await api.updateIntervention(id, { status: newStatus });
      setInterventions(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = interventions.filter(item => {
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const pendingCount = interventions.filter(i => i.status === 'Pending').length;
  const inProgressCount = interventions.filter(i => i.status === 'In-Progress').length;
  const completedCount = interventions.filter(i => i.status === 'Completed').length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-neon-indigo/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {t('workflowTitle', 'Advisory Care & Intervention Workflow')}
                </h1>
                <span className="badge-enterprise bg-indigo-500/10 text-indigo-300 border-indigo-500/30 font-mono">
                  {t('closedLoopBadge', 'Closed-Loop Protocol')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {t('workflowDesc', 'Faculty mentoring pipeline, action resolution statuses, and longitudinal case history tracking.')}
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/students/STU1024"
          className="btn-amber group text-xs flex items-center gap-2 self-start sm:self-auto shadow-neon-amber/20"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform duration-200 animate-pulse" />
          <span>{t('inspectCase', 'Inspect STU1024 Case Plan')}</span>
        </Link>
      </div>

      {/* Summary KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bento-box p-5 border-amber-500/20 bg-gradient-to-b from-amber-950/15 to-[#070b14]/90 flex items-center justify-between shadow-neon-amber/10">
          <div>
            <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider block">
              {t('pendingAction', 'Pending Action')}
            </span>
            <div className="text-3xl font-display font-black text-amber-300 font-mono mt-1">{pendingCount}</div>
            <p className="text-[10px] text-amber-300/70 mt-1 font-mono">
              {t('pendingDesc', 'Awaiting faculty contact')}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center border border-amber-500/30 shadow-neon-amber/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-box p-5 border-cyan-500/20 bg-gradient-to-b from-cyan-950/15 to-[#070b14]/90 flex items-center justify-between shadow-neon-cyan/10">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider block">
              {t('activeInProgress', 'Active In-Progress')}
            </span>
            <div className="text-3xl font-display font-black text-cyan-300 font-mono mt-1">{inProgressCount}</div>
            <p className="text-[10px] text-cyan-300/70 mt-1 font-mono">
              {t('inProgressDesc', 'Under active advising')}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shadow-neon-cyan/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-box p-5 border-emerald-500/20 bg-gradient-to-b from-emerald-950/15 to-[#070b14]/90 flex items-center justify-between shadow-neon-emerald/10">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
              {t('resolvedCases', 'Resolved Cases')}
            </span>
            <div className="text-3xl font-display font-black text-emerald-300 font-mono mt-1">{completedCount}</div>
            <p className="text-[10px] text-emerald-300/70 mt-1 font-mono">
              {t('resolvedDesc', 'Remediation successful')}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center border border-emerald-500/30 shadow-neon-emerald/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bento-box p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 pl-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('workflowFilters', 'Workflow Filters:')}</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#070b14]/90 border border-white/[0.08] text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80 cursor-pointer"
          >
            <option value="ALL">{t('filterStatusAll', 'All Statuses')} ({interventions.length})</option>
            <option value="Pending">{t('filterPending', 'Pending Only')} ({pendingCount})</option>
            <option value="In-Progress">{t('filterInProgress', 'In-Progress Only')} ({inProgressCount})</option>
            <option value="Completed">{t('filterCompleted', 'Completed Only')} ({completedCount})</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#070b14]/90 border border-white/[0.08] text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80 cursor-pointer"
          >
            <option value="ALL">{t('filterPriorityAll', 'All Risk Priorities')}</option>
            <option value="HIGH">{t('filterHigh', 'Critical High Risk')}</option>
            <option value="MEDIUM">{t('filterMedium', 'Elevated Risk')}</option>
            <option value="LOW">{t('filterLow', 'Low Risk')}</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono pr-1">
          Showing <span className="font-semibold text-slate-200">{filtered.length}</span> active intervention protocols
        </span>
      </div>

      {/* Interventions Kanban Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bento-box p-14 text-center text-slate-400 font-mono">
            <div className="flex items-center justify-center gap-3">
              <span className="inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
              <span>Loading verified advisory pipeline...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bento-box p-14 text-center text-slate-500 font-mono">
            No interventions match the selected criteria.
          </div>
        ) : (
          filtered.map((item) => {
            const isAnchor = item.studentId === 'STU1024';
            return (
              <div
                key={item.id}
                className={`bento-box p-5 sm:p-6 transition-all ${
                  isAnchor ? 'border-l-4 border-l-amber-500 bg-amber-500/[0.04]' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-black/60 border border-white/[0.08] text-indigo-400">
                        {item.studentId}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{item.studentName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({item.course})</span>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        item.priority === 'HIGH' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-neon-coral/20' :
                        item.priority === 'MEDIUM' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-neon-amber/20' :
                        'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.priority} PRIORITY ({item.riskScore}%)
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-medium pt-0.5">
                      Protocol: <span className="text-white font-semibold">{item.recommendation}</span>
                    </div>

                    <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                      {item.notes}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Advisor: <strong className="text-slate-300">{item.assignedFaculty}</strong></span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Initiated: {item.createdAt}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status Progression Controls */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/[0.08] shadow-inner">
                      <button
                        onClick={() => handleStatusChange(item.id, 'Pending')}
                        disabled={updatingId === item.id}
                        className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                          item.status === 'Pending'
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50 shadow-neon-amber/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                        }`}
                      >
                        {t('statusPending', 'Pending')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'In-Progress')}
                        disabled={updatingId === item.id}
                        className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                          item.status === 'In-Progress'
                            ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 shadow-neon-cyan/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                        }`}
                      >
                        {t('statusInProgress', 'In-Progress')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'Completed')}
                        disabled={updatingId === item.id}
                        className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                          item.status === 'Completed'
                            ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 shadow-neon-emerald/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                        }`}
                      >
                        {t('statusCompleted', 'Completed')}
                      </button>
                    </div>

                    <Link
                      to={`/students/${item.studentId}`}
                      className="btn-secondary group text-[11px] px-3 py-1.5 hover:border-indigo-500/50 hover:text-indigo-300 inline-flex items-center gap-1.5"
                    >
                      <span>Open Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
