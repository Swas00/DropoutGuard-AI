import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpDown, Eye, Users, AlertTriangle, UserPlus, UploadCloud, ChevronLeft, ChevronRight, Sparkles, SlidersHorizontal, Zap } from 'lucide-react';
import { api, Student } from '../lib/api';
import { AddStudentModal } from '../components/AddStudentModal';
import { BulkImportModal } from '../components/BulkImportModal';
import { LmsIntegrationModal } from '../components/LmsIntegrationModal';

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('ALL');
  const [course, setCourse] = useState('ALL');
  const [semester, setSemester] = useState('ALL');
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [search, riskLevel, course, semester, sortBy, sortOrder, page]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getStudents({
        page,
        limit: 15,
        search,
        riskLevel,
        course,
        semester,
        sortBy,
        sortOrder
      });
      setStudents(res.students);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* Directory Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-neon-indigo/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Student Population Registry
                </h1>
                <span className="badge-enterprise bg-indigo-950/60 text-indigo-300 border-indigo-800/60 font-mono">
                  {totalCount} Total Records
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Global cohort intelligence with multi-variate filters, risk indexing, and direct case dossier access.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary btn-shimmer text-xs flex items-center gap-1.5 cursor-pointer shadow-neon-indigo/30"
            title="Enroll a single student record with automated ML risk scoring"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer hover:border-cyan-500/50 hover:text-cyan-300"
            title="Upload CSV cohort with instant batch risk indexing"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            <span>Bulk Import CSV</span>
          </button>

          <button
            onClick={() => setIsLmsModalOpen(true)}
            className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer hover:border-indigo-500/50 hover:text-indigo-300"
            title="Connect directly to Canvas, Moodle, Google Classroom via LTI 1.3 Advantage"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync LMS (LTI 1.3)</span>
          </button>

          <Link
            to="/students/STU1024"
            className="btn-amber group text-xs flex items-center gap-1.5 shadow-neon-amber/20"
            title="Open Calibrated Benchmark Student (STU1024 - Kavya Sharma)"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform duration-200 animate-pulse" />
            <span>Benchmark: STU1024</span>
          </Link>
        </div>
      </div>

      {/* Multi-Parameter Filters */}
      <div className="bento-box p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 pr-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filters</span>
        </div>

        <div className="relative flex-1 min-w-[180px] w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student ID, name, or keywords..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
        </div>

        <select
          value={riskLevel}
          onChange={(e) => { setRiskLevel(e.target.value); setPage(1); }}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-xs text-slate-200 focus:outline-none focus:border-indigo-500/80 transition-all cursor-pointer"
        >
          <option value="ALL">All Risk Tiers</option>
          <option value="HIGH">High Risk Tier</option>
          <option value="MEDIUM">Medium Risk Tier</option>
          <option value="LOW">Low Risk Tier</option>
        </select>

        <select
          value={course}
          onChange={(e) => { setCourse(e.target.value); setPage(1); }}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-xs text-slate-200 focus:outline-none focus:border-indigo-500/80 transition-all cursor-pointer"
        >
          <option value="ALL">All Academic Programs</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="B.Tech Computer Science">B.Tech Computer Science</option>
          <option value="B.Tech Mechanical">B.Tech Mechanical</option>
          <option value="B.Tech Electronics">B.Tech Electronics</option>
          <option value="MBA">MBA</option>
        </select>

        <select
          value={semester}
          onChange={(e) => { setSemester(e.target.value); setPage(1); }}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#0b1120] border border-white/[0.14] text-xs text-slate-200 focus:outline-none focus:border-indigo-500/80 transition-all cursor-pointer"
        >
          <option value="ALL">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
        </select>
      </div>

      {/* Directory Table */}
      <div className="bento-box overflow-hidden border border-white/[0.12] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-white/[0.12] text-slate-300 bg-[#0b1120] font-mono">
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Student</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Program & Sem</th>
                <th 
                  className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('attendance')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('currentGpa')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Current GPA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Backlogs</th>
                <th 
                  className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('riskScore')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Predicted Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold uppercase tracking-wider text-[11px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-[#070b14]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-mono">
                    <div className="flex items-center justify-center gap-3">
                      <span className="inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Fetching verified telemetry records...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 font-mono">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  const isAnchor = s.studentId === 'STU1024';
                  return (
                    <tr
                      key={s.studentId}
                      className={`interactive-tr transition-colors ${
                        isAnchor ? 'bg-amber-500/[0.08] hover:bg-amber-500/[0.12] border-l-2 border-amber-500' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono shadow-sm ${
                            s.riskLevel === 'HIGH' ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30 shadow-neon-coral/20' :
                            s.riskLevel === 'MEDIUM' ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30 shadow-neon-amber/20' :
                            'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 shadow-neon-emerald/20'
                          }`}>
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span>{s.name}</span>
                              {isAnchor && (
                                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Benchmark
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[10px] font-mono">{s.studentId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="font-medium text-slate-200">{s.course}</span>{' '}
                        <span className="text-slate-500 font-mono text-[11px]">(Sem {s.semester})</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className={`font-semibold ${s.attendance < 65 ? 'text-rose-400' : s.attendance < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {s.attendance}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-semibold text-slate-200">{s.currentGpa.toFixed(2)}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className={s.backlogs > 0 ? 'text-rose-400 font-bold px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30' : 'text-slate-500'}>
                          {s.backlogs}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.05]">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                s.riskScore >= 65 ? 'bg-gradient-to-r from-rose-500 to-red-400' :
                                s.riskScore >= 35 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                                'bg-gradient-to-r from-emerald-500 to-teal-400'
                              }`}
                              style={{ width: `${s.riskScore}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-200 font-mono text-xs">{s.riskScore}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide ${
                          s.riskLevel === 'HIGH' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                          s.riskLevel === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {s.riskLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/students/${s.studentId}`}
                          className="btn-secondary group text-[11px] px-3 py-1.5 hover:border-indigo-500/50 hover:text-indigo-300 inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                          <span>Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-white/[0.08] text-xs text-slate-400 font-mono bg-black/20">
          <div>
            Showing <span className="font-semibold text-slate-200">{students.length}</span> of {totalCount} records (Page {page} of {totalPages})
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Single Student Enrollment Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={() => {
          loadStudents();
        }}
      />

      {/* Cohort Bulk CSV Ingestion Modal */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImportSuccess={() => {
          loadStudents();
        }}
      />

      {/* Direct SIS / LMS Real-Time Telemetry Modal */}
      <LmsIntegrationModal
        isOpen={isLmsModalOpen}
        onClose={() => setIsLmsModalOpen(false)}
        onSyncComplete={() => {
          loadStudents();
        }}
      />

    </div>
  );
};
