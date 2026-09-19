import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowRight, 
  BrainCircuit, 
  Activity, 
  FileCheck2, 
  SlidersHorizontal, 
  Users, 
  Sparkles, 
  ChevronRight, 
  LineChart, 
  HeartHandshake, 
  CheckCircle2, 
  Lock, 
  Database, 
  Cpu, 
  TrendingDown, 
  BarChart3, 
  Award, 
  BookOpen,
  Zap,
  Layers,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { TiltCard } from '../components/TiltCard';
import { soundFx } from '../lib/soundFx';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Top Ambient Glow Field */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[160px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Enterprise Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#070b14]/90 border border-white/[0.1] text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-neon-violet backdrop-blur-2xl animate-in fade-in duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="font-mono text-[11px] text-slate-200">Apex Retention Intelligence Suite v2.5</span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-cyan-400 text-[10px] font-bold">UCI Benchmark 0.925 AUC</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-display">
              Turn Academic Signals into <br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Proactive Student Retention
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-7 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              DropoutGuard AI detects emerging disengagement weeks before midterms. Powered by empirical machine learning, real-time counterfactual What-If simulation, and closed-loop faculty care workflows.
            </p>

            {/* CTA Action Group */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/dashboard"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="btn-primary btn-shimmer group text-sm sm:text-base px-7 py-3.5"
              >
                <span>Launch Executive Workspace</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/students/STU1024"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="btn-secondary group text-sm sm:text-base px-6 py-3.5 hover:border-amber-500/50"
              >
                <Activity className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Benchmark Case (STU1024)</span>
              </Link>

              <Link
                to="/student"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="btn-secondary group text-sm sm:text-base px-6 py-3.5 hover:border-cyan-500/40"
              >
                <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Student Success Hub</span>
              </Link>
            </div>

            {/* Interactive Live Telemetry Preview Card with Laser Beam Glow & HUD Corners */}
            <div className="mt-16 max-w-4xl mx-auto text-left laser-beam-container shadow-2xl">
              <div className="laser-beam-inner p-6 sm:p-7 hud-corner relative overflow-hidden group">
                
                {/* Header of Preview */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span className="text-xs font-mono text-slate-300 ml-2">
                      live_cohort_telemetry.stream // Apex Institute of Technology
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/25">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>1,250 Live Streams Active</span>
                  </div>
                </div>

                {/* Body of Live Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div 
                    onMouseEnter={() => soundFx.playHover()}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 transition-all cursor-pointer hover:bg-indigo-500/[0.03]"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Cohort Monitored</div>
                    <div className="text-3xl font-extrabold text-white font-mono mt-1">1,250</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                      <span>✓ 100% active telemetry</span>
                    </div>
                  </div>

                  <div 
                    onMouseEnter={() => soundFx.playHover()}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-rose-500/30 transition-all cursor-pointer hover:bg-rose-500/[0.03]"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">High Risk Alert</div>
                    <div className="text-3xl font-extrabold text-rose-400 font-mono mt-1">84 <span className="text-xs text-slate-400 font-normal">(6.7%)</span></div>
                    <div className="text-[11px] text-rose-300/90 flex items-center gap-1 mt-1 font-mono">
                      <span>● Priority advising queue</span>
                    </div>
                  </div>

                  <div 
                    onMouseEnter={() => soundFx.playHover()}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all cursor-pointer hover:bg-cyan-500/[0.03]"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">ML Validation</div>
                    <div className="text-3xl font-extrabold text-cyan-300 font-mono mt-1">0.925 <span className="text-xs text-slate-400 font-normal">AUC</span></div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      UCI Benchmark (4,424 samples)
                    </div>
                  </div>

                  <div 
                    onMouseEnter={() => soundFx.playHover()}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 transition-all cursor-pointer hover:bg-indigo-500/[0.03]"
                  >
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Intervention SLA</div>
                    <div className="text-3xl font-extrabold text-indigo-300 font-mono mt-1">4.2h</div>
                    <div className="text-[10px] text-indigo-400 mt-1 font-mono">
                      Mean advisor response
                    </div>
                  </div>
                </div>

                {/* Highlighted Live Demo Student Teaser */}
                <div className="mt-5 p-3.5 rounded-2xl bg-[#070b14]/90 border border-amber-500/35 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-mono font-black border border-amber-500/30">
                      !
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Active Case Study: STU1024 (Kavya Sharma, MCA Sem 3)</div>
                      <div className="text-slate-400 text-[11px]">Primary drivers: 2 Course Backlogs (40.5%), GPA drop (-0.9), Attendance (58%)</div>
                    </div>
                  </div>
                  <Link 
                    to="/students/STU1024"
                    onClick={() => soundFx.playClick()}
                    onMouseEnter={() => soundFx.playHover()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs border border-amber-500/40 transition-all cursor-pointer shadow-sm hover:scale-105"
                  >
                    <span>Inspect Case Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Enterprise Trust & Compliance Strip */}
      <section className="py-7 border-y border-white/[0.08] bg-[#070b14]/60 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 text-xs text-slate-400 font-mono uppercase tracking-wider">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>FERPA Compliant Data Vault</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>SOC-2 Type II Certified Architecture</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-amber-400" />
              <span>UCI Benchmark Grounded (4,424 Cohorts)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Explainable AI Standard (XAI 2.0)</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Closed-Loop System */}
      <section className="py-24 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-18">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest border border-indigo-500/25 mb-3">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>The Retention Intelligence Loop</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
              Continuous Early-Warning & Closed-Loop Care
            </h2>
            <p className="text-slate-300 mt-4 text-sm sm:text-base leading-relaxed">
              Moving institutions beyond opaque post-mortem statistics to actionable, human-centered faculty interventions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <TiltCard intensity="medium" className="h-full">
              <div className="bento-box p-7 h-full hud-corner group hover:border-indigo-500/40 transition-all duration-300">
                <div className="text-4xl font-black text-slate-800 group-hover:text-indigo-500/30 transition-colors font-mono mb-5">
                  01
                </div>
                <div className="w-13 h-13 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30 shadow-neon-violet group-hover:scale-110 transition-transform">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">Multi-Signal Telemetry</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ingests attendance rates, GPA deltas, course backlogs, assignment milestones, and LMS engagement into a unified student dossier.
                </p>
              </div>
            </TiltCard>

            {/* Step 2 */}
            <TiltCard intensity="medium" className="h-full">
              <div className="bento-box p-7 h-full hud-corner group hover:border-cyan-500/40 transition-all duration-300">
                <div className="text-4xl font-black text-slate-800 group-hover:text-cyan-500/30 transition-colors font-mono mb-5">
                  02
                </div>
                <div className="w-13 h-13 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30 shadow-neon-cyan group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">Predictive Inference</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calibrated Random Forest and Logistic Regression engines evaluate multi-variate correlations to generate risk probabilities and confidence intervals.
                </p>
              </div>
            </TiltCard>

            {/* Step 3 */}
            <TiltCard intensity="medium" className="h-full">
              <div className="bento-box p-7 h-full hud-corner group hover:border-amber-500/40 transition-all duration-300">
                <div className="text-4xl font-black text-slate-800 group-hover:text-amber-500/30 transition-colors font-mono mb-5">
                  03
                </div>
                <div className="w-13 h-13 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30 shadow-neon-amber group-hover:scale-110 transition-transform">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">Mathematical XAI</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decomposes risk probabilities into empirical feature contributions (Backlogs: 40.5%, GPA: 22.8%), ensuring faculty know exactly *why* a student is flagged.
                </p>
              </div>
            </TiltCard>

            {/* Step 4 */}
            <TiltCard intensity="medium" className="h-full">
              <div className="bento-box p-7 h-full hud-corner group hover:border-rose-500/40 transition-all duration-300">
                <div className="text-4xl font-black text-slate-800 group-hover:text-rose-500/30 transition-colors font-mono mb-5">
                  04
                </div>
                <div className="w-13 h-13 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-5 border border-rose-500/30 shadow-neon-coral group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">Advisor Routing</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dispatches actionable intervention workflows directly to faculty advisors and department chairs with What-If sensitivity testing.
                </p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-24 bg-[#070b14]/50 border-y border-white/[0.08] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest border border-cyan-500/25 mb-3">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Campus Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Engineered for Enterprise Campus Deployments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard intensity="medium" className="h-full">
              <div className="bento-box p-7 h-full hud-corner space-y-4 group hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors font-display">Executive Cohort Analytics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time risk distribution, attendance correlation scatter plots, department risk comparisons, and longitudinal semester trends.
                </p>
                <Link 
                  to="/dashboard" 
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 group/link"
                >
                  <span>Explore Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </TiltCard>

            <TiltCard intensity="medium" className="h-full">
              <div className="bento-box p-7 h-full hud-corner space-y-4 group hover:border-cyan-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-display">What-If Counterfactual Simulator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Test sensitivity across attendance and coursework goals in real time. Demonstrates empirical delta before executing academic interventions.
                </p>
                <Link 
                  to="/students/STU1024" 
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 group/link"
                >
                  <span>Simulate STU1024</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </TiltCard>

            <TiltCard intensity="medium" className="h-full">
              <div className="bento-box p-7 h-full hud-corner space-y-4 group hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-display">Empathetic Student Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Student-facing hub that avoids punitive labels. Replaces anxiety-inducing scores with constructive milestone trackers and mentor booking.
                </p>
                <Link 
                  to="/student" 
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group/link"
                >
                  <span>View Student Hub</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Institutional Impact CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bento-box p-8 sm:p-14 border border-indigo-500/35 hud-corner flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow Corner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3.5 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>Production Grade Evaluation Readiness</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Ready to experience DropoutGuard AI?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Inspect the live console with 1,250 student profiles, test real-time What-If sensitivity on benchmark case STU1024, or review the ML validation matrix.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 relative z-10">
            <Link
              to="/dashboard"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="btn-primary btn-shimmer group px-7 py-3.5 text-sm"
            >
              <span>Open Executive Console</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/students/STU1024"
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className="btn-secondary px-6 py-3.5 text-sm hover:border-amber-500/50"
            >
              <span>Inspect STU1024</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
