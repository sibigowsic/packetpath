import React, { useState } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, MapPin, ShieldCheck, Cpu, Info, AlertTriangle } from 'lucide-react';

export default function StorySidebar({
  hops,
  activeHopIndex,
  onSelectHop,
  isPlaying,
  onTogglePlay,
  currentSceneTitle,
  totalDistanceSoFar
}) {
  const [expandedHopId, setExpandedHopId] = useState(null);

  const toggleExpand = (hopNumber) => {
    setExpandedHopId(expandedHopId === hopNumber ? null : hopNumber);
  };

  const currentHop = hops[activeHopIndex];

  return (
    <aside 
      aria-label="Story Journey Timeline Sidebar"
      className="w-full h-full flex flex-col glass-panel border-r border-slate-800/80 bg-gray-950/95 overflow-hidden"
    >
      
      {/* Sidebar Header & Scene Progress Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              Story Journey Progress
            </span>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Hop {activeHopIndex + 1} of {hops.length}
          </span>
        </div>

        {/* Progress Bar (7 Scenes) */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex gap-0.5 p-0.5">
          {hops.map((hop, idx) => (
            <button
              key={hop.hop}
              onClick={() => onSelectHop(idx)}
              aria-label={`Hop ${hop.hop}: ${hop.storyTitle}`}
              className={`h-full flex-1 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 ${
                idx === activeHopIndex 
                  ? 'bg-cyan-400 shadow-glow-cyan' 
                  : idx < activeHopIndex 
                    ? 'bg-cyan-800' 
                    : 'bg-slate-700/50'
              }`}
            />
          ))}
        </div>

        {/* Controls Bar: Previous, Play/Pause, Next */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectHop(Math.max(0, activeHopIndex - 1))}
              disabled={activeHopIndex === 0}
              aria-label="Previous Hop"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? "Pause journey autoplay" : "Start journey autoplay"}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-colors shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Autoplay</span>
                </>
              )}
            </button>

            <button
              onClick={() => onSelectHop(Math.min(hops.length - 1, activeHopIndex + 1))}
              disabled={activeHopIndex === hops.length - 1}
              aria-label="Next Hop"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="font-mono text-xs text-cyan-300">
            {totalDistanceSoFar} km
          </div>
        </div>
      </div>

      {/* Active Scene Card */}
      {currentHop && (
        <div className="p-4 bg-gradient-to-b from-cyan-950/30 to-transparent border-b border-slate-800/60 animate-fade-in">
          
          <div className="inline-block px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-800/60 font-mono text-[11px] text-cyan-400 font-semibold mb-2">
            {currentHop.sceneTitle || `Scene ${currentHop.sceneIndex + 1}`}
          </div>

          <h3 className="font-display text-xl font-bold text-white mb-2 leading-tight">
            Hop {currentHop.hop} — {currentHop.storyTitle}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {currentHop.storyBody}
          </p>

          {/* Location & Operator Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium">Estimated Location:</span>
              </div>
              <span className="font-semibold text-white">
                {currentHop.city}, {currentHop.country}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium">Network Operator:</span>
              </div>
              <span className="font-mono text-cyan-300 truncate max-w-[180px]">
                {currentHop.org}
              </span>
            </div>
          </div>

          {/* Submarine Cable Disclaimer (if present) */}
          {currentHop.cableLabel && (
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-200/90 font-mono mb-3">
              💡 {currentHop.cableLabel}
            </div>
          )}

          {/* 3 Explicit Accuracy & Educational Badges (User Requirement) */}
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
            {currentHop.isRealNode && !currentHop.isFallbackCoordinates && (
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>REAL NETWORK DATA</span>
              </span>
            )}

            {currentHop.isLocationEstimated && !currentHop.isFallbackCoordinates && (
              <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800/60 text-sky-300 flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>ESTIMATED IP GEOLOCATION</span>
              </span>
            )}

            {currentHop.isFallbackCoordinates && (
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>ILLUSTRATIVE / FALLBACK VISUALIZATION</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Story History & Expandable Technical Detail Accordion */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h4 className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Hop-by-Hop Story History
        </h4>

        {hops.map((hop, idx) => {
          const isSelected = idx === activeHopIndex;
          const isExpanded = expandedHopId === hop.hop;

          return (
            <div
              key={hop.hop}
              className={`rounded-xl border transition-all duration-300 ${
                isSelected 
                  ? 'bg-slate-900 border-cyan-500/50 shadow-glow-cyan' 
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Hop Header Row */}
              <div 
                onClick={() => onSelectHop(idx)}
                className="p-3 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    isSelected ? 'bg-cyan-500 text-gray-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {hop.hop}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white truncate max-w-[160px] sm:max-w-[200px]">
                      {hop.storyTitle}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">
                      {hop.city}, {hop.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-cyan-400">
                    {hop.rtt_ms} ms
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(hop.hop);
                    }}
                    aria-label={`Toggle technical details for Hop ${hop.hop}`}
                    className="p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Technical Details Tray */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-800 bg-gray-950/70 text-xs font-mono space-y-1.5 animate-slide-up">
                  <div className="text-[10px] text-cyan-400 uppercase font-semibold tracking-wider">
                    Technical Specifications
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">IP Address:</span>
                    <span className="text-cyan-300">{hop.ip}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Lat / Lng:</span>
                    <span>{hop.lat.toFixed(4)}, {hop.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Autonomous System / Org:</span>
                    <span className="text-slate-200 truncate max-w-[160px]">{hop.org}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Round-Trip Latency:</span>
                    <span className="text-emerald-400">{hop.rtt_ms} ms</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
