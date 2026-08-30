import React, { useState, useEffect } from 'react';
import { Activity, Globe, Shield, Sparkles, Cpu, Layers } from 'lucide-react';

const LOADING_STAGES = [
  { icon: Shield, text: "Resolving target domain & checking target safety..." },
  { icon: Activity, text: "Executing live traceroute network probes..." },
  { icon: Cpu, text: "Mapping intermediate ISP & backbone router hops..." },
  { icon: Layers, text: "Estimating physical GPS coordinates & subsea fiber paths..." },
  { icon: Globe, text: "Constructing your 3D physical data journey..." }
];

export default function CinematicLoading({ targetDomain }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex(prev => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
    }, 900); // 900ms per stage advance for cinematic feel

    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = LOADING_STAGES[currentStageIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-2xl animate-fade-in">
      
      {/* Background ambient glowing light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg glass-panel-glow p-8 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
        
        {/* Animated Data Particle Orbit ring */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow" />
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center shadow-glow-cyan">
            <ActiveIcon className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Target Domain Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tracing: {targetDomain || 'target domain'}</span>
        </div>

        {/* Current Stage Description */}
        <h3 className="font-display text-xl font-bold text-white mb-2 h-8 flex items-center justify-center">
          {LOADING_STAGES[currentStageIndex].text}
        </h3>

        <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
          Following your digital signal as it ignites subterranean and oceanic optical fiber lines.
        </p>

        {/* Stage Step Indicators */}
        <div className="flex items-center justify-center gap-2">
          {LOADING_STAGES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStageIndex 
                  ? 'w-8 bg-cyan-400 shadow-glow-cyan' 
                  : idx < currentStageIndex 
                    ? 'w-2 bg-cyan-800' 
                    : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
