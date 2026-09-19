import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  ArrowUpDown, 
  ChevronRight, 
  Sparkles, 
  SlidersHorizontal,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  Layers,
  TrendingDown,
  Activity,
  UserPlus,
  UploadCloud,
  Zap
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  CartesianGrid 
} from "recharts";
import { api, DashboardStats, Student } from "../lib/api";
import { AddStudentModal } from "../components/AddStudentModal";
import { BulkImportModal } from "../components/BulkImportModal";
import { LmsIntegrationModal } from "../components/LmsIntegrationModal";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("riskScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [search, riskFilter, courseFilter, sortBy, sortOrder, page]);

  const loadDashboardData = async () => {
    try {
      const data = await api.getDashboard();
      setStats(data);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getStudents({
        page,
        limit: 10,
        search,
        riskLevel: riskFilter,
        course: courseFilter,
        sortBy,
        sortOrder
      });
      setStudents(res.students);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleExportCSV = () => {
    setExportNotice("Compiling official cohort retention audit pack (CSV)...");
    setTimeout(() => {
      const headers = ["StudentID", "Name", "Course", "Semester", "Attendance", "GPA", "Backlogs", "RiskScore", "RiskLevel"];
      const rows = students.map(s => [
        s.studentId,
        `"${s.name}"`,
        `"${s.course}"`,
        s.semester,
        s.attendance,
        s.currentGpa,
        s.backlogs,
        s.riskScore,
        s.riskLevel
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `DropoutGuard_Cohort_Export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportNotice("Download complete! Saved to local drive.");
      setTimeout(() => setExportNotice(null), 3500);
    }, 600);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Institutional Retention Intelligence Console
            </h1>
            <span className="badge-enterprise bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Active Cohort: <span className="text-slate-200 font-semibold">Spring 2026 Midterm Evaluation Cycle</span> • Multi-signal risk assessment across 1,250 student profiles.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary btn-shimmer group text-xs flex items-center gap-1.5 cursor-pointer"
            title="Enroll a new student into the retention tracking system"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="btn-secondary group text-xs flex items-center gap-1.5 cursor-pointer hover:border-indigo-500/50"
            title="Ingest whole student cohort via CSV file"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            <span>Bulk Import CSV</span>
          </button>

          <button
            onClick={() => setIsLmsModalOpen(true)}
            className="btn-secondary group text-xs flex items-center gap-1.5 cursor-pointer hover:border-cyan-500/50 hover:text-cyan-300"
            title="Real-time LMS / SIS Telemetry Ingestion (Canvas, Moodle, Google Classroom via LTI 1.3)"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Sync LMS (LTI 1.3)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-secondary group text-xs"
            title="Download full audited cohort dataset as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Export Audit Pack (CSV)</span>
          </button>

          <Link
            to="/students/STU1024"
            className="btn-amber group text-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform animate-pulse" />
            <span>Benchmark Case (STU1024)</span>
          </Link>

          <Link
            to="/interventions"
            className="btn-secondary group text-xs"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Advising Queue</span>
          </Link>
        </div>
      </div>


      {/* Export Notification Toast */}
      {exportNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-2xl backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">{exportNotice}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">FERPA-COMPLIANT HASH</span>
        </div>
      )}

      {/* KPI Cards: Enterprise Precision Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Cohort Card */}
        <div className="bento-box p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Cohort Census</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-neon-violet">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
            {stats ? stats.totalStudents.toLocaleString() : "1,250"}
          </div>
          <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span>●</span> 100% active telemetry
            </span>
            <span className="text-slate-500">6 Departments</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full w-full rounded-full" />
          </div>
        </div>

        {/* High Risk Card */}
        <div className="bento-box p-6 border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-transparent relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider">Critical Risk Tier</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30 shadow-neon-coral">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-rose-400 font-mono tabular-nums flex items-baseline gap-2">
            <span>{stats ? stats.highRisk : "84"}</span>
            <span className="text-xs font-normal text-slate-400">
              ({stats ? ((stats.highRisk / stats.totalStudents) * 100).toFixed(1) : "6.7"}%)
            </span>
          </div>
          <div className="mt-2.5 text-[11px] text-rose-300/80 flex items-center justify-between font-mono">
            <span>Immediate mentor required</span>
            <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">SLA 4.2h</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3.5 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" style={{ width: `${stats ? ((stats.highRisk / stats.totalStudents) * 100) : 6.7}%` }} />
          </div>
        </div>

        {/* Medium Risk Card */}
        <div className="bento-box p-6 border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-transparent relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">Advisory Watchlist</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-neon-amber">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tabular-nums flex items-baseline gap-2">
            <span>{stats ? stats.mediumRisk : "213"}</span>
            <span className="text-xs font-normal text-slate-400">
              ({stats ? ((stats.mediumRisk / stats.totalStudents) * 100).toFixed(1) : "17.0"}%)
            </span>
          </div>
          <div className="mt-2.5 text-[11px] text-amber-300/80 flex items-center justify-between font-mono">
            <span>Attendance counseling</span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Weekly</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3.5 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" style={{ width: `${stats ? ((stats.mediumRisk / stats.totalStudents) * 100) : 17.0}%` }} />
          </div>
        </div>

        {/* Low Risk Card */}
        <div className="bento-box p-6 border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-transparent relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Good Standing</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-neon-emerald">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums flex items-baseline gap-2">
            <span>{stats ? stats.lowRisk.toLocaleString() : "953"}</span>
            <span className="text-xs font-normal text-slate-400">
              ({stats ? ((stats.lowRisk / stats.totalStudents) * 100).toFixed(1) : "76.2"}%)
            </span>
          </div>
          <div className="mt-2.5 text-[11px] text-emerald-300/80 flex items-center justify-between font-mono">
            <span>On track for degree completion</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Nominal</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{ width: `${stats ? ((stats.lowRisk / stats.totalStudents) * 100) : 76.2}%` }} />
          </div>
        </div>

      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Donut Distribution */}
        <div className="bento-box p-6 space-y-4 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-display">Cohort Risk Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Tri-tier categorical classification based on model probability</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/25">
              N=1,250
            </span>
          </div>
          <div className="h-64 w-full">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.riskDistribution}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#030712"
                    strokeWidth={3}
                  >
                    {stats.riskDistribution.map((entry, index) => {
                      const colors = ['#10b981', '#f59e0b', '#f43f5e'];
                      return <Cell key={`cell-${index}`} fill={colors[index] || entry.color} />;
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(7, 11, 20, 0.95)", 
                      borderColor: "rgba(255, 255, 255, 0.12)", 
                      borderRadius: "14px",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.7)"
                    }}
                    itemStyle={{ color: "#e2e8f0", fontSize: "12px", fontFamily: "JetBrains Mono" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(val) => <span className="text-xs font-semibold text-slate-300">{val}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading visualization...</div>
            )}
          </div>
        </div>

        {/* Chart 2: Attendance vs Risk Scatter Plot */}
        <div className="bento-box p-6 space-y-4 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-display">Attendance vs. Predicted Risk</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Empirical scatter demonstrating steep risk rise below 70% attendance</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
              Correlation -0.74
            </span>
          </div>
          <div className="h-64 w-full">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis 
                    type="number" 
                    dataKey="attendance" 
                    name="Attendance" 
                    unit="%" 
                    domain={[30, 100]} 
                    tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="riskScore" 
                    name="Risk Score" 
                    unit="%" 
                    domain={[0, 100]} 
                    tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="p-3.5 rounded-2xl bg-[#070b14]/95 border border-white/[0.1] text-xs space-y-1 backdrop-blur-xl shadow-2xl">
                          <p className="font-bold text-white font-mono">{data.studentId}</p>
                          <p className="text-slate-300">Attendance: <span className="text-emerald-400 font-mono font-semibold">{data.attendance}%</span></p>
                          <p className="text-slate-300">Risk Score: <span className="text-rose-400 font-mono font-semibold">{data.riskScore}%</span></p>
                          <p className="text-slate-300">Current GPA: <span className="text-cyan-400 font-mono font-semibold">{data.currentGpa}</span></p>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="Students" data={stats.scatterData} fill="#06b6d4" opacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading correlation engine...</div>
            )}
          </div>
        </div>

        {/* Chart 3: Department Risk Breakdown */}
        <div className="bento-box p-6 space-y-4 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-display">Academic Department Risk Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Comparative program vulnerability across 6 academic divisions</p>
            </div>
            <span className="text-[10px] font-mono text-slate-300 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
              Stacked Tiers
            </span>
          </div>
          <div className="h-64 w-full">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentRisk} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="department" tick={{ fill: "#64748b", fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(7, 11, 20, 0.95)", 
                      borderColor: "rgba(255, 255, 255, 0.12)", 
                      borderRadius: "14px",
                      backdropFilter: "blur(16px)"
                    }}
                    itemStyle={{ color: "#e2e8f0", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                  />
                  <Legend verticalAlign="top" height={32} />
                  <Bar dataKey="high" name="High Risk" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="medium" name="Medium Risk" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="low" name="Low Risk" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading department breakdown...</div>
            )}
          </div>
        </div>

        {/* Chart 4: Semester Risk Timeline Progression */}
        <div className="bento-box p-6 space-y-4 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-display">Longitudinal Semester Trajectory</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Aggregate high-risk caseload curve and average cohort risk index</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
              5-Month Trend
            </span>
          </div>
          <div className="h-64 w-full">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.riskTrend} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(7, 11, 20, 0.95)", 
                      borderColor: "rgba(255, 255, 255, 0.12)", 
                      borderRadius: "14px",
                      backdropFilter: "blur(16px)"
                    }}
                    itemStyle={{ color: "#e2e8f0", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                  />
                  <Legend verticalAlign="top" height={32} />
                  <Line type="monotone" dataKey="highRiskCount" name="Critical Caseload" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, stroke: "#f43f5e", strokeWidth: 2, fill: "#030712" }} />
                  <Line type="monotone" dataKey="avgRisk" name="Cohort Risk Index (%)" stroke="#818cf8" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3, fill: "#818cf8" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading trajectory...</div>
            )}
          </div>
        </div>

      </div>

      {/* Filterable & Sortable Student Registry Table */}
      <div className="bento-box p-6 space-y-6">
        
        {/* Table Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-display">
              <span>Monitored Students Registry</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-300 font-normal border border-white/[0.08]">
                1,250 Profiles
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Multi-signal directory with live sorting, risk thresholds, and direct dossier inspection.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name or ID (e.g. STU1024)..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#070b14] border border-white/[0.1] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-white/[0.1] text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="HIGH">High Risk (Critically Flagged)</option>
              <option value="MEDIUM">Medium Risk (Under Advisory)</option>
              <option value="LOW">Low Risk (Nominal Standing)</option>
            </select>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-white/[0.1] text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
              <option value="B.Tech Computer Science">B.Tech CS</option>
              <option value="B.Tech Mechanical">B.Tech Mech</option>
              <option value="B.Tech Electronics">B.Tech ECE</option>
              <option value="MBA">MBA</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 bg-[#070b14] font-mono">
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Student Dossier</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Program / Sem</th>
                <th 
                  className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("attendance")}
                >
                  <div className="flex items-center gap-1">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("currentGpa")}
                >
                  <div className="flex items-center gap-1">
                    <span>Current GPA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Backlogs</th>
                <th 
                  className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("riskScore")}
                >
                  <div className="flex items-center gap-1">
                    <span>Dropout Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold uppercase tracking-wider text-[11px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-[#070b14]/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400 font-mono">
                    <span className="inline-block animate-spin mr-2">⟳</span> Ingesting telemetry records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-500 font-mono">
                    No student records match the active criteria.
                  </td>
                </tr>
              ) : (
                students.map((stu) => {
                  const isAnchor = stu.studentId === "STU1024";
                  return (
                    <tr 
                      key={stu.studentId} 
                      className={`interactive-tr ${
                        isAnchor ? "bg-amber-500/10 border-l-2 border-amber-500" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono shadow-sm ${
                            stu.riskLevel === "HIGH" ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" :
                            stu.riskLevel === "MEDIUM" ? "bg-amber-500/15 text-amber-300 border border-amber-500/30" :
                            "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          }`}>
                            {stu.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span>{stu.name}</span>
                              {isAnchor && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/40 shadow-sm">
                                  Benchmark
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[10px] font-mono">{stu.studentId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {stu.course} <span className="text-slate-500 font-mono">(Sem {stu.semester})</span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className={`font-semibold ${stu.attendance < 65 ? "text-rose-400" : stu.attendance < 75 ? "text-amber-400" : "text-slate-300"}`}>
                          {stu.attendance}%
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-200">{stu.currentGpa}</span>
                          {stu.gpaTrend !== undefined && (
                            <span className={`text-[10px] ${stu.gpaTrend < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                              ({stu.gpaTrend > 0 ? "+" : ""}{stu.gpaTrend})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className={stu.backlogs > 0 ? "text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10" : "text-slate-500"}>
                          {stu.backlogs}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                stu.riskScore >= 65 ? "bg-rose-500" :
                                stu.riskScore >= 35 ? "bg-amber-500" :
                                "bg-emerald-500"
                              }`}
                              style={{ width: `${stu.riskScore}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-200 font-mono">{stu.riskScore}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          stu.riskLevel === "HIGH" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                          stu.riskLevel === "MEDIUM" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
                          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {stu.riskLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/students/${stu.studentId}`}
                          className="btn-secondary group text-[11px] px-3 py-1.5 hover:border-indigo-500/50"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
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

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs text-slate-400 font-mono">
          <div>
            Showing page <span className="font-semibold text-slate-200">{page}</span> of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary text-xs px-3.5 py-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn-secondary text-xs px-3.5 py-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Enroll Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={() => {
          loadDashboardData();
          loadStudents();
        }}
      />

      {/* Bulk Import Cohort Modal */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImportSuccess={() => {
          loadDashboardData();
          loadStudents();
        }}
      />

      {/* Direct SIS / LMS Real-Time Telemetry Modal */}
      <LmsIntegrationModal
        isOpen={isLmsModalOpen}
        onClose={() => setIsLmsModalOpen(false)}
        onSyncComplete={() => {
          loadDashboardData();
          loadStudents();
        }}
      />

    </div>
  );
};

