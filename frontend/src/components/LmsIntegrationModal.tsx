import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight, 
  Activity, 
  Sliders, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { api, LmsConnector, LmsSyncResult } from '../lib/api';
import { soundFx } from '../lib/soundFx';

interface LmsIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const LmsIntegrationModal: React.FC<LmsIntegrationModalProps> = ({ 
  isOpen, 
  onClose,
  onSyncComplete 
}) => {
  const [connectors, setConnectors] = useState<LmsConnector[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('canvas');
  const [loading, setLoading] = useState(true);
  
  // Handshake test state
  const [testingHandshake, setTestingHandshake] = useState(false);
  const [handshakeResult, setHandshakeResult] = useState<any | null>(null);

  // Sync execution state
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<number>(0);
  const [syncResult, setSyncResult] = useState<LmsSyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync History
  const [syncHistory, setSyncHistory] = useState<LmsSyncResult[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [connData, histData] = await Promise.all([
        api.getLmsConnectors(),
        api.getLmsSyncHistory()
      ]);
      setConnectors(connData);
      setSyncHistory(histData);
    } catch (err: any) {
      console.error('Failed to load LMS data:', err);
      setError(err.message || 'Failed to connect to LMS connector gateway.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentConnector = connectors.find(c => c.id === selectedProvider) || connectors[0];

  const handleTestHandshake = async () => {
    if (!currentConnector) return;
    try {
      setTestingHandshake(true);
      setHandshakeResult(null);
      setError(null);
      const res = await api.testLmsConnection(currentConnector.id);
      setHandshakeResult(res);
      soundFx.playSuccess();
    } catch (err: any) {
      setError(err.message || 'Connection test failed.');
    } finally {
      setTestingHandshake(false);
    }
  };

  const handleExecuteSync = async () => {
    if (!currentConnector) return;
    try {
      setSyncing(true);
      setSyncResult(null);
      setError(null);
      
      // Animated sync pipeline steps
      setSyncStep(1); // Handshake
      await new Promise(r => setTimeout(r, 600));
      
      setSyncStep(2); // Ingesting course submissions
      await new Promise(r => setTimeout(r, 700));

      setSyncStep(3); // Daily attendance logs
      await new Promise(r => setTimeout(r, 700));

      setSyncStep(4); // ML inference & risk recalculation
      const result = await api.triggerLmsSync(currentConnector.id, 30);
      
      setSyncStep(5); // Complete
      await new Promise(r => setTimeout(r, 400));

      setSyncResult(result);
      soundFx.playSuccess();
      
      // Refresh history and connectors
      const [updatedConns, updatedHist] = await Promise.all([
        api.getLmsConnectors(),
        api.getLmsSyncHistory()
      ]);
      setConnectors(updatedConns);
      setSyncHistory(updatedHist);

      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Real-time sync failed.');
    } finally {
      setSyncing(false);
      setSyncStep(0);
    }
  };

  const getProviderIcon = (id: string) => {
    switch (id) {
      case 'canvas': return Layers;
      case 'moodle': return BookOpen;
      case 'google_classroom': return GraduationCap;
      case 'banner': return Building2;
      default: return Activity;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal */}
      <div className="relative w-full max-w-5xl bento-box bg-[#0b1120] p-6 sm:p-8 space-y-6 z-10 border border-white/[0.16] shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-neon-cyan/20">
              <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-display font-bold text-white tracking-tight">
                  Direct SIS / LMS Telemetry Connectors
                </h3>
                <span className="badge-enterprise bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-mono">
                  LTI 1.3 Advantage
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Automated continuous sync for student attendance, assignment submissions, and LMS gradebooks.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center text-xs transition-all border border-white/[0.08] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Provider Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {connectors.map((c) => {
            const Icon = getProviderIcon(c.id);
            const isSelected = c.id === selectedProvider;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedProvider(c.id);
                  setHandshakeResult(null);
                  setSyncResult(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-indigo-500/15 border-indigo-500/60 shadow-neon-indigo/20 ring-1 ring-indigo-500/50'
                    : 'bg-black/40 border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/[0.06] text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {c.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-white truncate">{c.shortName}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{c.protocol}</div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>Synced: {c.syncedCount}</span>
                  <span className="text-indigo-400">{c.autoSyncInterval}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Connector Detail Panel */}
        {currentConnector && (
          <div className="bento-box p-6 space-y-5 border-white/[0.1] bg-[#070b14]/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
              <div>
                <h4 className="text-base font-display font-bold text-white flex items-center gap-2">
                  <span>{currentConnector.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    Live Telemetry Connector
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Endpoint: <span className="text-slate-300">{currentConnector.endpointUrl}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestHandshake}
                  disabled={testingHandshake || syncing}
                  className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:border-cyan-500/50 hover:text-cyan-300"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${testingHandshake ? 'animate-spin' : ''}`} />
                  <span>{testingHandshake ? 'Testing Ping...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExecuteSync}
                  disabled={syncing}
                  className="btn-primary btn-shimmer group text-xs flex items-center gap-2 shadow-neon-indigo/30 cursor-pointer disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 ${syncing ? 'animate-bounce text-amber-300' : 'group-hover:rotate-12 transition-transform'}`} />
                  <span>{syncing ? 'Executing Sync...' : 'Sync Real-Time Telemetry Now'}</span>
                </button>
              </div>
            </div>

            {/* Handshake Verified Alert */}
            {handshakeResult && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-neon-emerald/20 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{handshakeResult.message}</span>
                </div>
                <span className="font-mono font-bold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">
                  Latency: {handshakeResult.latencyMs}
                </span>
              </div>
            )}

            {/* Live Sync Progress Animation */}
            {syncing && (
              <div className="p-5 rounded-2xl bg-black/60 border border-indigo-500/40 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                    Automated Ingestion Pipeline Active
                  </span>
                  <span className="text-slate-400">Step {syncStep} of 5</span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-[10px] font-mono">
                  <div className={`p-2 rounded-xl text-center border ${syncStep >= 1 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/[0.02] border-white/[0.04] text-slate-500'}`}>
                    1. LTI Auth
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${syncStep >= 2 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/[0.02] border-white/[0.04] text-slate-500'}`}>
                    2. Roster Sync
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${syncStep >= 3 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/[0.02] border-white/[0.04] text-slate-500'}`}>
                    3. Attendance Logs
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${syncStep >= 4 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/[0.02] border-white/[0.04] text-slate-500'}`}>
                    4. ML Inference
                  </div>
                  <div className={`p-2 rounded-xl text-center border ${syncStep >= 5 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-white/[0.02] border-white/[0.04] text-slate-500'}`}>
                    5. Synchronized
                  </div>
                </div>
              </div>
            )}

            {/* Sync Completed Results */}
            {syncResult && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#070b14] to-indigo-950/40 border border-emerald-500/40 space-y-4 animate-in fade-in shadow-neon-emerald/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{syncResult.message}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">ID: {syncResult.id}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Records Synchronized</span>
                    <div className="text-xl font-bold font-mono text-white mt-1">{syncResult.recordsProcessed} Students</div>
                    <span className="text-[10px] text-emerald-400 font-mono">Telemetry updated</span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Attendance Telemetry Delta</span>
                    <div className="text-xl font-bold font-mono text-cyan-300 mt-1">{syncResult.attendanceDeltaAvg}</div>
                    <span className="text-[10px] text-cyan-400 font-mono">From LMS check-in logs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Risk Transitions</span>
                    <div className="text-sm font-bold font-mono text-slate-200 mt-1.5 flex items-center gap-3">
                      <span className="text-rose-400">+{syncResult.riskTransitions.toCritical} Critical</span>
                      <span className="text-emerald-400">-{syncResult.riskTransitions.toLow} De-escalated</span>
                    </div>
                  </div>
                </div>

                {syncResult.sampleUpdates && syncResult.sampleUpdates.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Sample Student Real-Time Updates:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {syncResult.sampleUpdates.map((s) => (
                        <div key={s.studentId} className="p-2.5 rounded-xl bg-[#0b101e] border border-white/[0.06] flex items-center justify-between">
                          <div>
                            <span className="text-slate-200 font-bold">{s.name}</span>
                            <span className="text-slate-500 text-[10px] ml-1.5">({s.studentId})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[11px]">{s.oldAttendance}% ➔ <strong className="text-cyan-300">{s.newAttendance}%</strong></span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              s.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              s.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {s.newRiskScore}% {s.riskLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Config Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Target Synchronized Courses</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentConnector.courseIds.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-white/[0.06] text-indigo-300 font-mono text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">LTI 1.3 Client Identifier</span>
                <div className="font-mono text-slate-200 truncate mt-1">{currentConnector.clientId}</div>
                <div className="text-[10px] text-slate-500 font-mono">Token: {currentConnector.tokenMasked}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Automated Ingestion Frequency</span>
                <div className="font-mono text-emerald-400 font-semibold mt-1">
                  Every {currentConnector.autoSyncInterval.toLowerCase()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Last: {new Date(currentConnector.lastSyncTime).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sync Audit History Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              LMS Ingestion Audit History
            </span>
            <span className="text-[10px] font-mono text-slate-500">{syncHistory.length} Recorded Syncs</span>
          </div>

          <div className="bento-box p-0 overflow-hidden border-white/[0.12] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[560px]">
                <thead className="bg-[#070b14] text-[10px] font-mono uppercase tracking-wider text-slate-300 border-b border-white/[0.1]">
                  <tr>
                    <th className="py-2.5 px-4">Provider</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Records</th>
                    <th className="py-2.5 px-3">Attendance Delta</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono text-[11px] bg-[#0b1120]">
                  {syncHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span>{item.providerName}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 text-[10px]">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-100">
                        {item.recordsProcessed} students
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                        {item.attendanceDeltaAvg}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
