import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackgroundVideo } from './components/BackgroundVideo';
import { CommandPalette } from './components/CommandPalette';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentList } from './pages/StudentList';
import { StudentProfile } from './pages/StudentProfile';
import { InterventionsPage } from './pages/InterventionsPage';
import { StudentFacingView } from './pages/StudentFacingView';
import { AuthPage } from './pages/AuthPage';
import { ModelMetricsModal } from './components/ModelMetricsModal';
import { Cpu, Command } from 'lucide-react';

export function App() {
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen relative bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
          {/* Animated High-Quality AI Network & Neural Background Layer */}
          <BackgroundVideo />

          {/* Foreground Application Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
            
            <main className="flex-1 pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/:id" element={<StudentProfile />} />
                <Route path="/interventions" element={<InterventionsPage />} />
                <Route path="/student" element={<StudentFacingView />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
              </Routes>
            </main>

          {/* Floating Quick Action for Hackathon Judges to Inspect ML Metrics */}
          <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 print:hidden flex items-center gap-2">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/80 shadow-lg backdrop-blur-md transition-all hover:scale-105"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span>Cmd Palette</span>
              <kbd className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1 py-0.2 rounded border border-slate-700">K</kbd>
            </button>

            <button
              onClick={() => setMetricsOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-xl shadow-emerald-500/25 border border-emerald-400/30 transition-all hover:scale-105 cursor-pointer"
              title="Inspect Machine Learning Model Evaluation & Metrics"
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">ML Model Metrics (0.925 ROC-AUC)</span>
              <span className="sm:hidden text-[11px] font-bold">ML Metrics</span>
            </button>
          </div>

          <CommandPalette 
            isOpen={commandPaletteOpen} 
            onClose={() => setCommandPaletteOpen(false)} 
            onOpenMetrics={() => setMetricsOpen(true)} 
          />

          <ModelMetricsModal isOpen={metricsOpen} onClose={() => setMetricsOpen(false)} />
          <Footer />
        </div>
      </div>
    </AuthProvider>
    </Router>
  );
}

export default App;

