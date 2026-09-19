import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  HeartHandshake, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Sparkles,
  Award,
  Bell,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StudentFacingView: React.FC = () => {
  const { t } = useTranslation('wellness');
  const { user } = useAuth();
  const [meetingRequested, setMeetingRequested] = useState(false);

  const studentName = user?.name ? user.name.split(' ')[0] : 'Aarav';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Supportive Hero Banner */}
      <div className="bento-box p-8 sm:p-10 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-emerald-500/10" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="badge-enterprise bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-mono inline-flex items-center gap-1.5 shadow-neon-emerald/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('badge', 'Student Academic Wellness Hub')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            {t('welcomeTitle', 'Welcome back, {{name}}!', { name: studentName })}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {t('welcomeDesc', 'Your personalized academic progress dashboard. Track your semester milestones, access recommended learning resources, and connect directly with your academic mentors whenever you need guidance.')}
          </p>
        </div>

        {/* Current Academic Status Spotlight */}
        <div className="mt-8 p-6 rounded-2xl bg-[#0b1120] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl relative z-10">
          <div>
            <span className="text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider block">
              {t('academicStanding', 'Semester Academic Standing')}
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-2xl sm:text-3xl font-display font-black text-emerald-400 font-mono">
                {t('goodStanding', 'GOOD STANDING')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                {t('onTrack', 'On Track')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              {t('semesterMeta', 'Semester 4 • B.Tech Computer Science • Current Cumulative GPA: {{gpa}}', { gpa: '8.42' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMeetingRequested(true)}
              className="btn-primary btn-shimmer group text-xs flex items-center gap-2 shadow-neon-indigo/30 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>{t('connectAdvisor', 'Connect with Faculty Advisor')}</span>
            </button>
          </div>
        </div>
      </div>

      {meetingRequested && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-neon-emerald/20 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {t('sessionRequested', 'Advisory session requested with {{advisor}}. A Google Calendar invitation has been dispatched to your student email.', { advisor: 'Prof. Ramesh Rao' })}
            </span>
          </div>
          <button 
            onClick={() => setMeetingRequested(false)}
            className="text-slate-400 hover:text-white ml-3 font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Core Academic Pulse Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bento-box p-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            {t('attendanceRate', 'Attendance Rate')}
          </span>
          <div className="text-3xl font-display font-bold font-mono text-emerald-400">84%</div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.04]">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: '84%' }} />
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {t('targetAttendance', 'Target: 75%+')}
          </span>
        </div>

        <div className="bento-box p-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            {t('courseworkDelivered', 'Coursework Delivered')}
          </span>
          <div className="text-3xl font-display font-bold font-mono text-cyan-400">9/10</div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.04]">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500" style={{ width: '90%' }} />
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {t('courseworkDue', '1 due next week')}
          </span>
        </div>

        <div className="bento-box p-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            {t('midtermStanding', 'Midterm Standing')}
          </span>
          <div className="text-3xl font-display font-bold font-mono text-emerald-400">88/100</div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.04]">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: '88%' }} />
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {t('topCohort', 'Top 15% of cohort')}
          </span>
        </div>

        <div className="bento-box p-5 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            {t('creditProgression', 'Credit Progression')}
          </span>
          <div className="text-3xl font-display font-bold font-mono text-indigo-400">72 / 120</div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.04]">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full transition-all duration-500" style={{ width: '60%' }} />
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {t('degreeComplete', '60% Degree Complete')}
          </span>
        </div>
      </div>

      {/* Action Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bento-box p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-neon-indigo/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                {t('studyCirclesTitle', 'Recommended Peer Study Circles')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('studyCirclesDesc', 'Collaborative learning groups for your current courses')}
              </p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] flex items-center justify-between hover:bg-[#11182c] hover:border-indigo-500/40 transition-all cursor-pointer">
              <span className="font-medium text-slate-200">{t('course1', 'CS-401: Distributed Algorithms')}</span>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{t('course1Time', 'Meets Tuesdays 5 PM')}</span>
            </li>
            <li className="p-3.5 rounded-xl bg-[#0b1120] border border-white/[0.12] flex items-center justify-between hover:bg-[#11182c] hover:border-indigo-500/40 transition-all cursor-pointer">
              <span className="font-medium text-slate-200">{t('course2', 'CS-405: Database Internals')}</span>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{t('course2Time', 'Meets Thursdays 4 PM')}</span>
            </li>
          </ul>
        </div>

        <div className="bento-box p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-neon-cyan/10">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">
                {t('deansProgramTitle', "Dean's Mentorship Program")}
              </h3>
              <p className="text-xs text-slate-400">
                {t('deansProgramDesc', 'Exclusive 1-on-1 career and research advising')}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0b1120] border border-white/[0.12] text-xs text-slate-300 space-y-3.5 leading-relaxed">
            <p>
              {t('deansProgramText', 'Your current academic momentum qualifies you for undergraduate research fellowships with the CS Department faculty.')}
            </p>
            <button
              onClick={() => setMeetingRequested(true)}
              className="btn-cyber group text-xs flex items-center gap-2 cursor-pointer"
            >
              <span>{t('scheduleConsultation', 'Schedule Research Consultation')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
