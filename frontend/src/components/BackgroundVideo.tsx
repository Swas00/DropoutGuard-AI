import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Video, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Zap, 
  Terminal, 
  Waves, 
  Volume2, 
  VolumeX, 
  Crosshair, 
  Tv, 
  Activity,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';

type VisualizerMode = 'neural' | 'hyperspace' | 'matrix' | 'aurora' | 'video';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Visualizer settings & modes
  const [activeMode, setActiveMode] = useState<VisualizerMode>('neural');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVideoLayer, setShowVideoLayer] = useState(true);
  const [videoSpeed, setVideoSpeed] = useState<number>(1.0);
  const [intensity, setIntensity] = useState<'subtle' | 'vivid'>('subtle');
  
  // HUD Overlays
  const [enableScanlines, setEnableScanlines] = useState(false);
  const [enableReticle, setEnableReticle] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  const [fps, setFps] = useState(60);

  // Mouse coordinate tracker for interactive canvas warping
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
    active: false,
  });

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Multi-Mode Canvas Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // FPS Meter trackers
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    // ----------------------------------------------------
    // MODE 1: Neural Synapse Constellation with Cursor Attraction
    // ----------------------------------------------------
    const particleCount = Math.min(80, Math.floor((width * height) / 20000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.3,
    }));

    // ----------------------------------------------------
    // MODE 2: Hyperspace 3D Warp Starfield
    // ----------------------------------------------------
    const starCount = 300;
    const stars = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      pz: width,
    }));

    // ----------------------------------------------------
    // MODE 3: Cyber Matrix Rain
    // ----------------------------------------------------
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const rainDrops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const matrixChars = '0123456789ABCDEF∆∑∏∂∫≈≠≤≥µΩλφψXAI';

    // ----------------------------------------------------
    // MODE 4: Harmonic Aurora Plasma
    // ----------------------------------------------------
    let auroraPhase = 0;

    // Main Render Loop
    const render = (time: number) => {
      // FPS measurement
      frameCount++;
      if (time - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = time;
      }
      lastTime = time;

      // Clear or trail
      if (activeMode === 'matrix') {
        ctx.fillStyle = 'rgba(3, 7, 18, 0.12)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // ==========================
      // EXECUTE SELECTED MODE
      // ==========================
      if (activeMode === 'neural') {
        // Render Neural Matrix
        const maxDist = 150;
        const mouseDist = 180;

        // Draw connections between nodes
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * (intensity === 'vivid' ? 0.35 : 0.15);
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }

          // Dynamic Cursor Magnetism
          if (mouseRef.current.active) {
            const cdx = particles[i].x - mouseRef.current.x;
            const cdy = particles[i].y - mouseRef.current.y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cdist < mouseDist) {
              const cAlpha = (1 - cdist / mouseDist) * (intensity === 'vivid' ? 0.6 : 0.3);
              ctx.strokeStyle = `rgba(6, 182, 212, ${cAlpha})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
              ctx.stroke();
            }
          }
        }

        // Draw Particle Nodes
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha * (intensity === 'vivid' ? 0.9 : 0.5)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (activeMode === 'hyperspace') {
        // Render 3D Warp Speed Starfield
        const cx = width / 2 + (mouseRef.current.active ? (mouseRef.current.x - width / 2) * 0.1 : 0);
        const cy = height / 2 + (mouseRef.current.active ? (mouseRef.current.y - height / 2) * 0.1 : 0);
        const speed = intensity === 'vivid' ? 14 : 8;

        for (const star of stars) {
          star.pz = star.z;
          star.z -= speed;

          if (star.z <= 0) {
            star.z = width;
            star.pz = width;
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
          }

          const k = 250 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          const pk = 250 / star.pz;
          const ppx = star.x * pk + cx;
          const ppy = star.y * pk + cy;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const size = Math.min(3, (1 - star.z / width) * 3);
            const alpha = Math.min(1, (1 - star.z / width) * 1.2);

            ctx.strokeStyle = `rgba(165, 180, 252, ${alpha})`;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(ppx, ppy);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        }

      } else if (activeMode === 'matrix') {
        // Render Cyber Matrix Rain
        ctx.fillStyle = intensity === 'vivid' ? '#22d3ee' : '#10b981';
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < rainDrops.length; i++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = i * fontSize;
          const y = rainDrops[i] * fontSize;

          // Glowing leader glyph
          ctx.fillStyle = '#ffffff';
          ctx.fillText(char, x, y);

          // Trail glyph
          ctx.fillStyle = intensity === 'vivid' ? 'rgba(34, 211, 238, 0.75)' : 'rgba(16, 185, 129, 0.7)';
          ctx.fillText(matrixChars[Math.floor(Math.random() * matrixChars.length)], x, y - fontSize);

          if (y > height && Math.random() > 0.975) {
            rainDrops[i] = 0;
          }
          rainDrops[i]++;
        }

      } else if (activeMode === 'aurora') {
        // Render Radiant Aurora Plasma Waves
        auroraPhase += 0.012;
        const waveCount = 3;

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const baseHeight = height * (0.45 + w * 0.15);
          ctx.moveTo(0, baseHeight);

          for (let x = 0; x <= width; x += 15) {
            const y = baseHeight + 
              Math.sin(x * 0.003 + auroraPhase + w * 1.5) * 60 +
              Math.cos(x * 0.006 - auroraPhase * 0.8) * 35;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, baseHeight - 50, 0, height);
          if (w === 0) {
            grad.addColorStop(0, intensity === 'vivid' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.12)');
            grad.addColorStop(1, 'transparent');
          } else if (w === 1) {
            grad.addColorStop(0, intensity === 'vivid' ? 'rgba(6, 182, 212, 0.22)' : 'rgba(6, 182, 212, 0.10)');
            grad.addColorStop(1, 'transparent');
          } else {
            grad.addColorStop(0, intensity === 'vivid' ? 'rgba(168, 85, 247, 0.20)' : 'rgba(168, 85, 247, 0.08)');
            grad.addColorStop(1, 'transparent');
          }
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [activeMode, intensity]);

  // Video playback sync
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    if (!videoRef.current) return;
    const nextSpeed = videoSpeed === 1.0 ? 1.5 : videoSpeed === 1.5 ? 0.5 : 1.0;
    videoRef.current.playbackRate = nextSpeed;
    setVideoSpeed(nextSpeed);
    soundFx.playClick();
  };

  const handleSoundToggle = () => {
    const newState = soundFx.toggle();
    setSoundEnabled(newState);
  };

  const handleModeSwitch = (mode: VisualizerMode) => {
    setActiveMode(mode);
    soundFx.playClick();
  };

  return (
    <>
      {/* Background Media Canvas & Video Underlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
        {/* Ambient Video Loop */}
        {showVideoLayer && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              intensity === 'vivid' ? 'opacity-35' : 'opacity-16'
            }`}
          >
            <source src="/background-video.webm" type="video/webm" />
          </video>
        )}

        {/* Dynamic Multi-Mode Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Multi-layered Radiant Aurora Lights */}
        <div className="absolute top-[-10%] left-[20%] w-[850px] h-[520px] bg-indigo-600/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[30%] right-[-5%] w-[650px] h-[480px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-5%] w-[750px] h-[550px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Cinematic Vignette Masks */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-[#030712]/75 to-[#030712]/95" />
      </div>

      {/* Retro CRT Scanline Grid & Sweeping Radar Beam */}
      {enableScanlines && (
        <>
          <div className="scanline-crt" />
          <div className="scanline-beam" />
        </>
      )}

      {/* Cyber Tactical HUD Reticle Overlay */}
      {enableReticle && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Top-Left Reticle */}
          <div className="absolute top-4 left-4 p-2 font-mono text-[10px] text-cyan-400/80 border-t-2 border-l-2 border-cyan-400/60 flex flex-col gap-0.5">
            <span>// APEX_HUD_01</span>
            <span className="text-[9px] text-slate-400">POS: 37.7749° N, 122.4194° W</span>
          </div>

          {/* Top-Right Reticle */}
          <div className="absolute top-4 right-4 p-2 font-mono text-[10px] text-cyan-400/80 border-t-2 border-r-2 border-cyan-400/60 text-right flex flex-col gap-0.5">
            <span>SYS_STABILITY: 99.8%</span>
            <span className="text-[9px] text-indigo-400">INFERENCE_SPEED: 8.4ms</span>
          </div>

          {/* Bottom-Right Reticle */}
          <div className="absolute bottom-4 right-4 p-2 font-mono text-[10px] text-indigo-400/80 border-b-2 border-r-2 border-indigo-400/60 text-right">
            <span>SECURE_CHANNELS // LOCKED</span>
          </div>

          {/* Center Tactical Crosshairs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-cyan-400/20 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-ping" />
          </div>
        </div>
      )}

      {/* Floating Ambient Cinema & Audio Master HUD Controller (Bottom-Left) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 print:hidden select-none">
        <div className="relative group">
          
          {/* Expanded Settings Flyout Panel */}
          {isControlsExpanded && (
            <div className="mb-2 p-3 rounded-2xl bg-[#070b14]/95 border border-white/[0.12] shadow-2xl backdrop-blur-2xl text-xs space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200 w-64 max-w-[calc(100vw-2rem)]">
              
              {/* Visualizer Mode Selection */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Visualizer Engine</span>
                  <span className="text-cyan-400 font-bold">{activeMode.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {(['neural', 'hyperspace', 'matrix', 'aurora', 'video'] as VisualizerMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleModeSwitch(mode)}
                      className={`p-1.5 rounded-lg text-[10px] font-mono capitalize text-center transition-all flex flex-col items-center gap-1 ${
                        activeMode === mode
                          ? 'bg-indigo-600 text-white shadow-neon-violet border border-indigo-400/50'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={`Switch to ${mode} mode`}
                    >
                      {mode === 'neural' && <Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
                      {mode === 'hyperspace' && <Zap className="w-3.5 h-3.5 text-amber-300" />}
                      {mode === 'matrix' && <Terminal className="w-3.5 h-3.5 text-emerald-300" />}
                      {mode === 'aurora' && <Waves className="w-3.5 h-3.5 text-purple-300" />}
                      {mode === 'video' && <Video className="w-3.5 h-3.5 text-rose-300" />}
                      <span className="text-[8px] truncate">{mode.slice(0, 4)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles Strip: Scanlines, Reticle, Video Speed, Intensity */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                <span className="text-slate-400">CRT Scanlines</span>
                <button
                  onClick={() => {
                    setEnableScanlines(!enableScanlines);
                    soundFx.playClick();
                  }}
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold transition-colors ${
                    enableScanlines
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {enableScanlines ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Tactical Reticle</span>
                <button
                  onClick={() => {
                    setEnableReticle(!enableReticle);
                    soundFx.playClick();
                  }}
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold transition-colors ${
                    enableReticle
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {enableReticle ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Video Speed</span>
                <button
                  onClick={handleSpeedChange}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px] font-bold"
                >
                  {videoSpeed}x
                </button>
              </div>

              {/* Engine Telemetry */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>FPS: <strong className="text-emerald-400">{fps}</strong></span>
                <span>GPU ACCEL: <strong className="text-indigo-400">ACTIVE</strong></span>
              </div>
            </div>
          )}

          {/* Main Bottom Glass Pill */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#070b14]/85 hover:bg-[#070b14]/95 border border-white/[0.12] shadow-2xl backdrop-blur-2xl transition-all text-xs text-slate-400">
            
            {/* Title / Expand Pill Toggle */}
            <button
              onClick={() => {
                setIsControlsExpanded(!isControlsExpanded);
                soundFx.playClick();
              }}
              className="flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 font-semibold text-[11px] text-slate-200 hover:text-indigo-400 transition-colors cursor-pointer"
              title="Expand Cinema & Audio Controller"
            >
              <Video className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline font-mono">CINEMA HUD</span>
              {isControlsExpanded ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              )}
            </button>

            <span className="w-[1px] h-3.5 bg-white/10" />

            {/* Video Play / Pause */}
            <button
              onClick={togglePlay}
              className={`p-1.5 rounded-full transition-colors ${
                isPlaying ? 'text-indigo-400 bg-indigo-500/15' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Video Layer Visibility */}
            <button
              onClick={() => {
                setShowVideoLayer(!showVideoLayer);
                soundFx.playClick();
              }}
              className={`p-1.5 rounded-full transition-colors ${
                showVideoLayer ? 'text-cyan-400 bg-cyan-500/15' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={showVideoLayer ? 'Hide Video Layer' : 'Show Video Layer'}
            >
              {showVideoLayer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            {/* Sound FX Synthesizer Toggle with Animated Equalizer Bars */}
            <button
              onClick={handleSoundToggle}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all text-[11px] font-mono font-bold ${
                soundEnabled
                  ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 shadow-glow-sm'
                  : 'text-slate-500 hover:text-slate-300 bg-slate-900/60'
              }`}
              title={soundEnabled ? 'Mute Cyber Sound FX' : 'Enable Procedural Cyber Sound FX'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="flex items-end gap-0.5 h-3 w-3">
                    <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-1" />
                    <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-2" />
                    <span className="w-0.5 bg-cyan-400 rounded-full eq-bar-3" />
                  </div>
                </>
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Intensity Toggle (Subtle / Vivid) */}
            <button
              onClick={() => {
                setIntensity(intensity === 'subtle' ? 'vivid' : 'subtle');
                soundFx.playClick();
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                intensity === 'vivid'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-neon-violet'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Ambient Render Intensity"
            >
              {intensity}
            </button>

          </div>
        </div>
      </div>
    </>
  );
};
