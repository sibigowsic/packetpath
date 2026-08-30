import React from 'react';
import { Activity, Sparkles, Compass } from 'lucide-react';

export default function Navbar({ 
  isDemoMode, 
  setIsDemoMode, 
  onResetState, 
  hasActiveJourney,
  networkStatusLabel,
  statusBadgeColor 
}) {
  
  // Badge color mapping
  const getBadgeStyle = () => {
    if (statusBadgeColor === 'amber' || isDemoMode) {
      return 'bg-amber-950/90 text-amber-400 border-amber-800/60';
    }
    if (statusBadgeColor === 'cyan') {
      return 'bg-cyan-950/90 text-cyan-400 border-cyan-800/60';
    }
    return 'bg-emerald-950/90 text-emerald-400 border-emerald-800/60';
  };

  const getDotStyle = () => {
    if (statusBadgeColor === 'amber' || isDemoMode) return 'bg-amber-400';
    if (statusBadgeColor === 'cyan') return 'bg-cyan-400';
    return 'bg-emerald-400';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b border-slate-800/80 bg-gray-950/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity */}
        <button 
          onClick={onResetState}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-glow-cyan">
            <div className="w-full h-full bg-gray-950 rounded-[11px] flex items-center justify-center group-hover:bg-gray-900 transition-colors">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-wide">PacketPath</span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                Follow Your Data
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Visualizing the physical journey behind every packet</p>
          </div>
        </button>

        {/* Network Status Indicator & Mode Navigation */}
        <div className="flex items-center gap-3">
          
          {/* Prominent Network Status Indicator (User Requirement) */}
          {hasActiveJourney && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wide shadow-sm animate-fade-in ${getBadgeStyle()}`}>
              <div className={`w-2 h-2 rounded-full animate-ping ${getDotStyle()}`} />
              <span>{networkStatusLabel || (isDemoMode ? '● DEMO / SIMULATED JOURNEY' : '● LIVE NETWORK TRACE')}</span>
            </div>
          )}

          {hasActiveJourney && (
            <button
              onClick={onResetState}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>New Journey</span>
            </button>
          )}

          {/* Mode Switch Pill */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setIsDemoMode(false)}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !isDemoMode 
                  ? 'bg-cyan-500 text-gray-950 shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Trace</span>
            </button>

            <button
              onClick={() => setIsDemoMode(true)}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                isDemoMode 
                  ? 'bg-cyan-500 text-gray-950 shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Mode</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
