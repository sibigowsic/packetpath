import React from 'react';
import { Sparkles, Globe, Zap, Clock, ShieldCheck, Repeat, ArrowRight, Info } from 'lucide-react';
import { calculateSpeedOfLightStats } from '../utils/lightSpeedMath';

export default function EmotionalSummary({ routeData, onRestartJourney, onNewJourney }) {
  if (!routeData || !routeData.summary) return null;

  const { total_distance_km, total_hops, total_rtt_ms, countries } = routeData.summary;
  const speedStats = calculateSpeedOfLightStats(total_distance_km, total_rtt_ms);

  return (
    <div 
      aria-label="Journey Climax Summary Modal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="w-full max-w-2xl glass-panel-glow p-6 sm:p-8 rounded-3xl border border-cyan-500/40 text-center relative overflow-hidden shadow-2xl">
        
        {/* Background ambient lighting */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Climax Icon Header */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800/60 shadow-glow-cyan mb-4">
          <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
        </div>

        {/* Climax Statement */}
        <div className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
          "You pressed send."
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight max-w-xl mx-auto">
          In just{' '}
          <span className="text-cyan-400 font-mono underline decoration-cyan-500/40 underline-offset-4">
            {total_rtt_ms} milliseconds
          </span>,
          your data crossed approximately{' '}
          <span className="text-cyan-400 font-mono underline decoration-cyan-500/40 underline-offset-4">
            {total_distance_km.toLocaleString()} km
          </span>{' '}
          through{' '}
          <span className="text-cyan-400 font-mono underline decoration-cyan-500/40 underline-offset-4">
            {total_hops} network hops
          </span>.
        </h2>

        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
          Your digital message bridged continents, crossed physical subsea optic lines, and traversed global router switches faster than a human heartbeat.
        </p>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          
          <div className="glass-panel p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Distance</span>
            </div>
            <div className="font-mono text-xl font-bold text-white">
              {total_distance_km.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Network Hops</span>
            </div>
            <div className="font-mono text-xl font-bold text-white">
              {total_hops} <span className="text-xs font-normal text-slate-400">routers</span>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total RTT</span>
            </div>
            <div className="font-mono text-xl font-bold text-cyan-400">
              {total_rtt_ms} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
          </div>

          {/* Corrected Speed Metric Label & Explanatory Accuracy (User Requirement) */}
          <div className="glass-panel p-3 rounded-2xl border border-cyan-900/50 bg-cyan-950/30">
            <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate">Effective Speed</span>
            </div>
            <div className="font-mono text-xl font-bold text-cyan-300">
              {speedStats.percentageOfFiberSpeed}% <span className="text-xs font-normal text-slate-400">of c</span>
            </div>
          </div>

        </div>

        {/* Speed Metric Explanatory Accuracy Note */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 mb-6 flex items-start gap-2 text-left">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Journey Speed Comparison:</strong> Represents estimated effective propagation speed along physical fiber pathways relative to light speed in optical silica glass ($\approx 204,218\text{ km/s}$).
          </span>
        </div>

        {/* Countries Tag Bar */}
        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-300 mb-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-slate-500">Crossed:</span>
          {countries && countries.map((country) => (
            <span key={country} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              {country}
            </span>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRestartJourney}
            aria-label="Replay story journey"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          >
            <Repeat className="w-4 h-4 text-cyan-400" />
            <span>REPLAY STORY</span>
          </button>

          <button
            onClick={onNewJourney}
            aria-label="Trace another domain journey"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:opacity-95 text-gray-950 font-bold text-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all shadow-glow-cyan"
          >
            <span>TRACE ANOTHER JOURNEY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
