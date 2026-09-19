import React from 'react';
import { ShieldAlert, Heart, ExternalLink, Cpu, Lock, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#030712]/90 backdrop-blur-2xl py-14 mt-24 text-slate-400 text-xs font-sans relative overflow-hidden">
      {/* Top ambient glowing line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shadow-[0_0_12px_rgba(99,102,241,0.6)]" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-neon-violet">
                <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight font-display">
                  DropoutGuard<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent ml-0.5">AI</span>
                </span>
                <span className="ml-2.5 badge-enterprise bg-indigo-500/10 text-indigo-300 border-indigo-500/30 font-mono text-[9px]">
                  ENTERPRISE v2.5
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 max-w-lg leading-relaxed text-xs">
              Institutional predictive intelligence and early-warning decision support platform for higher education. Detect disengagement patterns, explain root causes with empirical machine learning, and execute human-centered academic advising workflows.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 max-w-lg backdrop-blur-md">
              <span className="font-bold text-indigo-400">Ethical AI Mandate: </span>
              Predictive models quantify mathematical disengagement sensitivity to guide proactive faculty care; never used for automated punitive diagnoses or deterministic dismissals.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Platform Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Executive Console
                </Link>
              </li>
              <li>
                <Link to="/students" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Student Cohort Directory
                </Link>
              </li>
              <li>
                <Link to="/students/STU1024" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span>Benchmark Dossier (STU1024)</span>
                </Link>
              </li>
              <li>
                <Link to="/interventions" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Care Workflow Board
                </Link>
              </li>
              <li>
                <Link to="/student" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Student Academic Hub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4 font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-cyan-400" />
              <span>Compliance & Standards</span>
            </h4>
            <div className="space-y-2.5 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>FERPA Compliant Vault</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>SOC-2 Type II Architecture</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>UCI ML 4,424 Record Benchmark</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 font-mono">
                System Status: <span className="text-emerald-400 font-semibold">Operational (99.99% SLA)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <p>
            DropoutGuard AI © {new Date().getFullYear()} — Institutional Early Intervention System.
          </p>
          <div className="flex items-center gap-4">
            <span>Apex University Instance</span>
            <span>•</span>
            <span>Open Innovation Track</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
