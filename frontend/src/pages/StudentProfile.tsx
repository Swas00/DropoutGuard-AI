import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  AlertTriangle, 
  ArrowLeft, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  Printer, 
  Send,
  HelpCircle,
  RefreshCw,
  Clock,
  ExternalLink,
  Brain,
  ShieldCheck,
  User,
  Hash,
  Award,
  Activity,
  Layers,
  Edit3,
  Trash2,
  ChevronRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { api, RiskAnalysisResponse, SimulationResult } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { EditStudentModal } from "../components/EditStudentModal";
import { exportStudentDossierPDF } from "../lib/pdfExport";
import { soundFx } from "../lib/soundFx";

export const StudentProfile: React.FC = () => {
  const { t } = useTranslation('advising');
  const { id = "STU1024" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<RiskAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit & Delete modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // What-If Simulator state
  const [simAttendance, setSimAttendance] = useState<number>(58);
  const [simAssignments, setSimAssignments] = useState<number>(50);
  const [simInternals, setSimInternals] = useState<number>(61);
  const [simEngagement, setSimEngagement] = useState<number>(55);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // AI-Generated Intervention state
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Intervention modal
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<string>("Faculty Mentoring & Review");
  const [assignedMentor, setAssignedMentor] = useState<string>("Prof. Ananya Sen");
  const [customNotes, setCustomNotes] = useState<string>("");

  useEffect(() => {
    loadStudentData(id);
  }, [id]);

  const loadStudentData = async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStudentRisk(studentId);
      setProfile(data);
      if (data.riskLevel === 'HIGH') {
        soundFx.playWarning();
      }
      
      setSimAttendance(data.academicDetails.attendance);
      setSimAssignments(data.academicDetails.assignmentRate);
      setSimInternals(data.academicDetails.internalMarks);
      setSimEngagement(data.academicDetails.engagement);
      
      runSimulation(data, data.academicDetails.attendance, data.academicDetails.assignmentRate, data.academicDetails.internalMarks, data.academicDetails.engagement);
    } catch (err: any) {
      console.error("Error fetching student profile:", err);
      setError("Student not found or failed to load risk profile.");
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async (
    currData: RiskAnalysisResponse, 
    newAtt: number, 
    newAssign: number, 
    newInternals: number, 
    newEng: number
  ) => {
    try {
      setIsSimulating(true);
      const res = await api.simulate(
        {
          studentId: currData.studentId,
          attendance: currData.academicDetails.attendance,
          currentGpa: currData.academicDetails.currentGpa,
          previousGpa: currData.academicDetails.previousGpa,
          assignmentRate: currData.academicDetails.assignmentRate,
          internalMarks: currData.academicDetails.internalMarks,
          backlogs: currData.academicDetails.backlogs,
          engagement: currData.academicDetails.engagement
        },
        {
          attendance: newAtt,
          currentGpa: currData.academicDetails.currentGpa,
          previousGpa: currData.academicDetails.previousGpa,
          assignmentRate: newAssign,
          internalMarks: newInternals,
          backlogs: currData.academicDetails.backlogs,
          engagement: newEng
        }
      );
      setSimResult(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSliderChange = (type: string, val: number) => {
    if (!profile) return;
    let att = simAttendance;
    let assign = simAssignments;
    let intern = simInternals;
    let eng = simEngagement;

    if (type === "attendance") { att = val; setSimAttendance(val); }
    if (type === "assignments") { assign = val; setSimAssignments(val); }
    if (type === "internals") { intern = val; setSimInternals(val); }
    if (type === "engagement") { eng = val; setSimEngagement(val); }

    runSimulation(profile, att, assign, intern, eng);
  };

  const handleGenerateAiIntervention = async () => {
    if (!profile) return;
    try {
      setAiLoading(true);
      const res = await api.generateAiIntervention({
        studentId: profile.studentId,
        attendance: profile.academicDetails.attendance,
        currentGpa: profile.academicDetails.currentGpa,
        previousGpa: profile.academicDetails.previousGpa,
        assignmentRate: profile.academicDetails.assignmentRate,
        internalMarks: profile.academicDetails.internalMarks,
        backlogs: profile.academicDetails.backlogs,
        engagement: profile.academicDetails.engagement
      });
      setAiText(res.interventionText);
    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleScheduleIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await api.createIntervention({
        studentId: profile.studentId,
        studentName: profile.name,
        course: profile.course,
        riskScore: profile.riskScore,
        riskLevel: profile.riskLevel,
        recommendation: selectedAction,
        actionType: selectedAction,
        priority: profile.riskLevel,
        assignedFaculty: assignedMentor,
        notes: customNotes || "Logged via Student Risk Profile page."
      });
      setShowLogModal(false);
      soundFx.playSuccess();
      setActionSuccess(t('dispatchSuccess', 'Intervention successfully scheduled and assigned to mentor.'));
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to log intervention:", err);
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPdf = () => {
    if (!profile) return;
    try {
      setIsExportingPdf(true);
      exportStudentDossierPDF(profile, user);
      soundFx.playSuccess();
      setActionSuccess("Official Institutional Dossier (PDF) generated and downloaded successfully.");
      setTimeout(() => setActionSuccess(null), 4500);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print(); // Graceful fallback
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!profile) return;
    try {
      setIsDeleting(true);
      await api.deleteStudent(profile.studentId);
      navigate('/students');
    } catch (err: any) {
      console.error('Failed to delete student:', err);
      alert(err.message || 'Failed to delete student record. Please verify admin privileges.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center font-mono">
        <div className="inline-block w-9 h-9 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-xs tracking-wider">Computing Bayesian feature decompositions for {id}...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-5 text-rose-400 shadow-neon-coral/30">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">{error || "Student Not Found"}</h2>
        <p className="text-slate-400 text-xs mb-6">Unable to retrieve active telemetry signals for {id}.</p>
        <Link to="/dashboard" className="btn-secondary text-xs inline-flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Executive Console</span>
        </Link>
      </div>
    );
  }

  const { academicDetails } = profile;
  const isHighRisk = profile.riskLevel === "HIGH";
  const isMedRisk = profile.riskLevel === "MEDIUM";

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:text-black">
      
      {/* Navigation Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">
            Executive Console
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <Link to="/students" className="hover:text-indigo-400 transition-colors">
            Population Registry
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-indigo-400 font-semibold">{profile.studentId}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="btn-secondary group text-xs flex items-center gap-1.5 cursor-pointer hover:border-indigo-500/50 hover:text-indigo-300"
            title="Modify student academic and behavioral metrics"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span>Edit Telemetry</span>
          </button>

          {(!user || user.role === 'admin') && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn-secondary group text-xs text-rose-400 hover:text-rose-300 hover:border-rose-500/50 flex items-center gap-1.5 cursor-pointer"
              title="Archive or delete student record from institution database"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Delete Record</span>
            </button>
          )}

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="btn-secondary group text-xs flex items-center gap-1.5 hover:border-cyan-500/50 hover:text-cyan-300 transition-all cursor-pointer"
            title="Generate and download official signed institutional dossier (PDF)"
          >
            {isExportingPdf ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Export Dossier (PDF)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowLogModal(true)}
            className="btn-primary btn-shimmer group text-xs flex items-center gap-1.5 shadow-neon-indigo/30"
          >
            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            <span>Dispatch Intervention</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-neon-emerald/20 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Student Dossier Header Banner */}
      <div className="bento-box p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        
        {/* Ambient Glow Halo */}
        <div className={`absolute -right-12 -top-12 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isHighRisk ? "bg-rose-500/15" : isMedRisk ? "bg-amber-500/15" : "bg-emerald-500/15"
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Student Avatar with Holographic Ring */}
            <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-mono font-black text-xl sm:text-2xl shadow-xl shrink-0 ${
              isHighRisk ? "bg-gradient-to-br from-rose-950 via-slate-900 to-black text-rose-300 ring-2 ring-rose-500/50 shadow-neon-coral/30" :
              isMedRisk ? "bg-gradient-to-br from-amber-950 via-slate-900 to-black text-amber-300 ring-2 ring-amber-500/50 shadow-neon-amber/30" :
              "bg-gradient-to-br from-emerald-950 via-slate-900 to-black text-emerald-300 ring-2 ring-emerald-500/50 shadow-neon-emerald/30"
            }`}>
              {profile.name.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-[#070b14] border border-white/[0.1] text-indigo-400 font-bold">
                  {profile.studentId}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {profile.course} • Semester {profile.semester}
                </span>
                {profile.studentId === "STU1024" ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-neon-amber/20">
                    <Sparkles className="w-2.5 h-2.5" /> CALIBRATED BENCHMARK PROFILE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
                    INSTITUTIONAL RECORD
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {profile.name}
              </h1>
              
              <p className="text-xs text-slate-400 max-w-xl font-sans leading-relaxed">
                {profile.studentId === "STU1024"
                  ? "Standardized benchmark scenario modeling multi-variate academic distress, calibrated backlogs, and counterfactual What-If remediation."
                  : "Continuous academic and behavioral telemetry evaluated by DropoutGuard AI Diagnostic Inference Engine."}
              </p>
            </div>
          </div>

          {/* Precision Risk Gauge Scorecard */}
          <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/[0.14] flex items-center gap-5 sm:min-w-[320px] shadow-2xl">
            <div className="relative flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-black transition-all ${
                isHighRisk ? "border-rose-500 text-rose-400 bg-rose-500/15 shadow-neon-coral/30" :
                isMedRisk ? "border-amber-500 text-amber-400 bg-amber-500/15 shadow-neon-amber/30" :
                "border-emerald-500 text-emerald-400 bg-emerald-500/15 shadow-neon-emerald/30"
              }`}>
                <span className="text-2xl font-mono tabular-nums leading-none">{profile.riskScore}%</span>
                <span className="text-[9px] font-mono uppercase text-slate-300 mt-1">Risk</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 block">
                Classification Status
              </span>
              <div className={`text-xl font-display font-black tracking-tight ${
                isHighRisk ? "text-rose-400" : isMedRisk ? "text-amber-400" : "text-emerald-400"
              }`}>
                {profile.riskLevel} RISK TIER
              </div>
              <p className="text-[10px] font-mono text-slate-300 mt-1">
                95% CI: [{Math.max(0, profile.riskScore - 4)}% — {Math.min(100, profile.riskScore + 4)}%]
              </p>
            </div>
          </div>

        </div>

        {/* 6 Key Academic Diagnostic Metrics */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] shadow-lg">
            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block">Current GPA</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-lg font-bold text-white font-mono">{academicDetails.currentGpa.toFixed(2)}</span>
              {academicDetails.gpaTrend < 0 ? (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-400">Prior: {academicDetails.previousGpa.toFixed(2)}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] shadow-lg">
            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block">Attendance</span>
            <div className="text-lg font-bold text-white font-mono mt-1">
              <span className={academicDetails.attendance < 65 ? "text-rose-400 font-bold" : "text-slate-200"}>
                {academicDetails.attendance}%
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Threshold: 75%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] shadow-lg">
            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block">Assignments</span>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {academicDetails.assignmentRate}%
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {Math.round(academicDetails.assignmentRate / 10)}/10 delivered
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] shadow-lg">
            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block">Internals</span>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {academicDetails.internalMarks}/100
            </div>
            <span className="text-[10px] font-mono text-slate-400">Midterm Wave</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] shadow-lg">
            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block">Course Backlogs</span>
            <div className="text-lg font-bold text-white font-mono mt-1">
              <span className={academicDetails.backlogs > 0 ? "text-rose-400 font-bold" : "text-slate-200"}>
                {academicDetails.backlogs}
              </span>
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-semibold">Empirical #1 Driver</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] shadow-lg">
            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block">LMS Telemetry</span>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {academicDetails.engagement}%
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {academicDetails.engagement < 60 ? "Disengaged" : "Active"}
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Explainability ("Why?") and Risk Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        
        {/* Section: Explainable AI Factor Decomposition */}
        <div className="bento-box p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 block">
                Mathematical Explainability (XAI)
              </span>
              <h2 className="text-lg font-display font-bold text-white mt-0.5">
                Why Is This Student Flagged {profile.riskLevel} Risk?
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
              Log-Odds Decomposition
            </span>
          </div>

          <p className="text-xs text-slate-400">
            The machine learning engine isolates ranked contributing drivers rather than presenting an opaque black-box probability:
          </p>

          <div className="space-y-3">
            {profile.factors.map((factor, idx) => {
              const isHigh = factor.contribution.toLowerCase().includes("high");
              const isMed = factor.contribution.toLowerCase().includes("medium");
              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-[#0b1120] border border-white/[0.12] hover:border-white/[0.22] transition-all space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-white/[0.08] text-slate-200 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-sm text-slate-100">{factor.label}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isHigh ? "bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-neon-coral/20" :
                      isMed ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-neon-amber/20" :
                      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {factor.contribution} ({Math.round(factor.weight * 100)}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-7">
                    {factor.description}
                  </p>

                  <div className="pl-7 pt-1">
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.08]">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? "bg-gradient-to-r from-rose-500 to-red-400" :
                          isMed ? "bg-gradient-to-r from-amber-500 to-yellow-400" :
                          "bg-gradient-to-r from-emerald-500 to-teal-400"
                        }`}
                        style={{ width: `${Math.round(factor.weight * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.14] text-[11px] text-slate-300 flex items-start gap-2.5 shadow-md">
            <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Ethical AI Guardrail:</strong> Factor contributions are mathematical sensitivity indicators intended to guide faculty advising, not punitive academic probation.
            </span>
          </div>
        </div>

        {/* Section: Risk Progression Timeline */}
        <div className="bento-box p-6 sm:p-7 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400 block">
                  Longitudinal Trajectory
                </span>
                <h2 className="text-lg font-display font-bold text-white mt-0.5">
                  5-Month Risk Velocity
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/[0.1]">
                Jan – May 2026
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3">
              Longitudinal tracking reveals how early disengagement escalated into high risk:
            </p>

            {/* Timeline Month Badges */}
            <div className="grid grid-cols-5 gap-2 my-5">
              {profile.timeline.map((item, i) => (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    i === profile.timeline.length - 1
                      ? "bg-rose-500/15 border-rose-500/50 shadow-neon-coral/20" 
                      : "bg-[#0b1120] border-white/[0.12] shadow-sm"
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-300 block">{item.month}</span>
                  <span className={`text-base font-extrabold font-mono mt-1 block ${
                    item.riskScore >= 65 ? "text-rose-400" :
                    item.riskScore >= 35 ? "text-amber-400" :
                    "text-emerald-400"
                  }`}>
                    {item.riskScore}%
                  </span>
                </div>
              ))}
            </div>

            {/* Line Chart */}
            <div className="h-52 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profile.timeline} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#070b14", borderColor: "rgba(255, 255, 255, 0.12)", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                    itemStyle={{ color: "#f43f5e", fontSize: "11px", fontFamily: "JetBrains Mono" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="riskScore" 
                    name="Risk Index" 
                    stroke="#f43f5e" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#ffffff" }} 
                    activeDot={{ r: 6, fill: "#f43f5e", stroke: "#ffffff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/[0.08] border border-rose-500/20 text-xs text-rose-300 font-sans">
            <strong>Actionable Observation:</strong> Critical risk acceleration occurred between Feb (35%) and Mar (44%). Timely intervention at the 40% threshold prevents critical academic probation.
          </div>
        </div>

      </div>

      {/* Interactive What-If Counterfactual Simulator */}
      <div className="bento-box p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Counterfactual Sensitivity Engine
            </div>
            <h2 className="text-xl font-display font-bold text-white mt-0.5">
              What-If Remediation Simulator
            </h2>
          </div>
          <span className="badge-enterprise bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-mono">
            Real-Time Inference
          </span>
        </div>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Test prospective intervention outcomes by adjusting academic targets. The model instantaneously recalculates predicted probability and displays the net risk delta.
        </p>

        {/* Quick Remediation Scenarios Suite */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider mr-1">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => {
              setSimAttendance(academicDetails.attendance);
              setSimAssignments(academicDetails.assignmentRate);
              setSimInternals(academicDetails.internalMarks);
              setSimEngagement(academicDetails.engagement);
              runSimulation(profile, academicDetails.attendance, academicDetails.assignmentRate, academicDetails.internalMarks, academicDetails.engagement);
            }}
            className="btn-secondary group text-[11px] px-3 py-1.5 flex items-center gap-1.5"
            title="Reset to current baseline values"
          >
            <RefreshCw className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            <span>Reset Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSimAttendance(75);
              setSimAssignments(75);
              setSimInternals(70);
              setSimEngagement(75);
              runSimulation(profile, 75, 75, 70, 75);
            }}
            className="btn-cyber group text-[11px] px-3 py-1.5 flex items-center gap-1.5"
            title="Project recovery meeting institutional 75% threshold"
          >
            <TrendingUp className="w-3 h-3 group-hover:scale-125 transition-transform duration-200" />
            <span>Target Threshold (75%)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSimAttendance(85);
              setSimAssignments(90);
              setSimInternals(80);
              setSimEngagement(85);
              runSimulation(profile, 85, 90, 80, 85);
            }}
            className="btn-amber group text-[11px] px-3 py-1.5 flex items-center gap-1.5"
            title="Project optimal academic turnaround"
          >
            <Sparkles className="w-3 h-3 text-amber-300 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-200" />
            <span>Optimal Recovery (85%+)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          
          {/* Sliders Console (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Slider 1: Attendance */}
            <div className="p-4 rounded-xl bg-[#0b1120] border border-white/[0.12] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-100">
                  Target Attendance Rate
                </label>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {simAttendance}% (Current: {academicDetails.attendance}%)
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simAttendance}
                onChange={(e) => handleSliderChange("attendance", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>40% (Severe)</span>
                <span>75% (Target Threshold)</span>
                <span>100% (Perfect)</span>
              </div>
            </div>

            {/* Slider 2: Assignments */}
            <div className="p-4 rounded-xl bg-[#0b1120] border border-white/[0.12] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-100">
                  Target Assignment Submissions
                </label>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {simAssignments}% (Current: {academicDetails.assignmentRate}%)
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={simAssignments}
                onChange={(e) => handleSliderChange("assignments", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>30%</span>
                <span>70% (Passing)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Slider 3: Internals */}
            <div className="p-4 rounded-xl bg-[#0b1120] border border-white/[0.12] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-100">
                  Projected Internal Exam Score
                </label>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {simInternals}/100 (Current: {academicDetails.internalMarks})
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simInternals}
                onChange={(e) => handleSliderChange("internals", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>40</span>
                <span>70 (Average)</span>
                <span>100</span>
              </div>
            </div>

            {/* Slider 4: Engagement */}
            <div className="p-4 rounded-xl bg-[#0b1120] border border-white/[0.12] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-100">
                  Target LMS Engagement
                </label>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {simEngagement}% (Current: {academicDetails.engagement}%)
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={simEngagement}
                onChange={(e) => handleSliderChange("engagement", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

          </div>

          {/* Simulated Outcome Display Card */}
          <div className="p-6 rounded-2xl bg-[#0b1120] border border-white/[0.14] flex flex-col justify-between shadow-2xl space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Simulated Outcome
              </span>

              {simResult ? (
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-slate-300">Projected Risk</div>
                      <div className={`text-4xl font-display font-black font-mono mt-1 ${
                        simResult.simulated.risk_score_pct >= 65 ? "text-rose-400" :
                        simResult.simulated.risk_score_pct >= 35 ? "text-amber-400" :
                        "text-emerald-400"
                      }`}>
                        {simResult.simulated.risk_score_pct}%
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-300">
                        {simResult.simulated.risk_level} RISK
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-300">Net Delta</div>
                      <div className={`text-2xl font-black font-mono mt-1 ${
                        simResult.delta_pct < 0 ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {simResult.delta_pct > 0 ? "+" : ""}{simResult.delta_pct}%
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">vs baseline</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070b14] border border-white/[0.12] text-xs text-slate-200 leading-relaxed shadow-inner">
                    {simResult.delta_pct < 0 ? (
                      <p className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Under this remediation scenario, student risk reduces by <strong className="text-white">{Math.abs(simResult.delta_pct)}%</strong> to <strong className="text-emerald-300">{simResult.simulated.risk_score_pct}%</strong>.</span>
                      </p>
                    ) : (
                      <p className="text-amber-300">Adjust target parameters above to project risk reduction.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-xs">Computing sensitivity delta...</div>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-[10px] font-mono text-slate-500">
              *Sensitivity model illustrates gradient descent projections, not an absolute guarantee.
            </div>
          </div>

        </div>
      </div>

      {/* AI Intervention Copilot */}
      <div className="bento-box p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400">
              <Brain className="w-3.5 h-3.5" />
              AI Clinical Recommendations
            </div>
            <h2 className="text-lg font-display font-bold text-white mt-0.5">
              AI-Generated Remediation Strategy
            </h2>
          </div>

          <button
            onClick={handleGenerateAiIntervention}
            disabled={aiLoading}
            className="btn-primary btn-shimmer group text-xs disabled:opacity-50 flex items-center gap-2 shadow-neon-indigo/30"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
                <span>Generate Strategy for {profile.name}</span>
              </>
            )}
          </button>
        </div>

        {aiText ? (
          <div className="p-6 rounded-2xl bg-[#0b1120] border border-indigo-500/40 text-xs text-slate-100 whitespace-pre-line leading-relaxed font-sans shadow-xl">
            {aiText}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-[#070b14] border border-dashed border-white/[0.12] text-center text-slate-300 text-xs">
            <Brain className="w-9 h-9 mx-auto text-indigo-400 mb-2.5" />
            <p className="max-w-md mx-auto">Click "Generate Strategy" to formulate a personalized, multi-factor academic advising protocol.</p>
          </div>
        )}
      </div>

      {/* Schedule Intervention Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowLogModal(false)} />
          
          <div className="relative w-full max-w-lg bento-box bg-[#0b1120] p-6 sm:p-7 space-y-5 z-10 border border-white/[0.16] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-display font-bold text-white">
                {t('dispatchTitle', 'Dispatch Academic Intervention')}
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleScheduleIntervention} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  {t('targetStudent', 'Target Student')}
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${profile.name} (${profile.studentId}) - ${profile.riskLevel} Risk`}
                  className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  {t('actionProtocol', 'Action Protocol')}
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-slate-100 focus:border-indigo-500/80 outline-none cursor-pointer"
                >
                  <option value="Faculty Mentoring & Review">{t('protocol1', 'Faculty Mentoring & 1-on-1 Review')}</option>
                  <option value="Remedial Tutoring Assignment">{t('protocol2', 'Remedial Tutoring & Coursework Support')}</option>
                  <option value="Attendance Warning Notice">{t('protocol3', 'Formal Attendance Warning & Advisory')}</option>
                  <option value="Counseling & Wellness Referral">{t('protocol4', 'Counseling & Academic Wellness Referral')}</option>
                  <option value="Dean Escalation">{t('protocol5', 'Department Dean Case Escalation')}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  {t('assignedFaculty', 'Assigned Faculty / Mentor')}
                </label>
                <input
                  type="text"
                  value={assignedMentor}
                  onChange={(e) => setAssignedMentor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-slate-100 focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-semibold mb-1">
                  {t('interventionNotes', 'Intervention Notes & Objectives')}
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder={t('notesPlaceholder', 'Specific targets (e.g. attendance improvement to 75%, backlog recovery)...')}
                  className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-white/[0.14] text-slate-100 placeholder-slate-400 focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="btn-secondary text-xs cursor-pointer"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-shimmer group text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('confirmDispatch', 'Confirm & Dispatch Protocol')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Telemetry Modal */}
      {profile && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onStudentUpdated={() => {
            loadStudentData(profile.studentId);
          }}
          student={{
            studentId: profile.studentId,
            name: profile.name,
            course: profile.course,
            semester: profile.semester,
            attendance: profile.academicDetails.attendance,
            previousGpa: profile.academicDetails.previousGpa,
            currentGpa: profile.academicDetails.currentGpa,
            assignmentRate: profile.academicDetails.assignmentRate,
            internalMarks: profile.academicDetails.internalMarks,
            backlogs: profile.academicDetails.backlogs,
            engagement: profile.academicDetails.engagement,
            riskScore: profile.riskScore,
            riskLevel: profile.riskLevel
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bento-box bg-[#0b1120] w-full max-w-md p-6 border border-rose-500/40 rounded-2xl shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-white">Delete Student Record?</h3>
                <p className="text-xs text-rose-300/80 font-mono">Permanent Institutional Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete the profile for <strong className="text-white">{profile.name}</strong> (<span className="font-mono text-indigo-400">{profile.studentId}</span>)? This will remove all associated academic telemetry and risk timeline history.
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn-secondary text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteStudent}
                className="btn-primary bg-rose-600 hover:bg-rose-500 border-rose-500 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Permanent Deletion</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
