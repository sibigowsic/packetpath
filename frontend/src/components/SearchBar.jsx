import React, { useState } from 'react';
import { Search, Send, Sparkles, Shield, Globe } from 'lucide-react';
import { DEMO_ROUTES } from '../data/demoRoutes';

export default function SearchBar({ onSubmit, isLoading, isHero, onSelectDemoRoute, isDemoMode }) {
  const [domainInput, setDomainInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    
    let cleanDomain = domainInput.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    onSubmit(cleanDomain);
  };

  return (
    <div className={`w-full transition-all duration-700 ${
      isHero ? 'max-w-2xl mx-auto px-4 py-8' : 'w-full max-w-lg'
    }`}>
      {isHero && (
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono mb-4">
            <Globe className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Interactive 3D Physical Internet Map</span>
          </div>
          
          {/* Priority 1 First 5-Second Headline Requirement */}
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            When you press send,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-glow-cyan">
              your data begins a journey you never see.
            </span>
          </h1>

          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Follow your digital packet in real-time as it travels through Wi-Fi routers, underground fiber cables, and ocean floor subsea optic wires.
          </p>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`relative flex items-center rounded-2xl transition-all duration-300 ${
          isHero 
            ? 'glass-panel-glow p-2 ring-1 ring-cyan-500/30 focus-within:ring-cyan-400 shadow-glow-cyan-strong' 
            : 'glass-panel p-1.5 border border-slate-800 focus-within:border-cyan-500/50'
        }`}>
          <div className="pl-3 pr-2 text-cyan-400">
            <Search className={`transition-transform duration-300 ${isHero ? 'w-6 h-6' : 'w-4 h-4'}`} />
          </div>

          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder={isHero ? "Enter domain (e.g. netflix.com, github.com)..." : "Enter domain to trace..."}
            disabled={isLoading}
            aria-label="Enter target domain name"
            className={`w-full bg-transparent text-white placeholder-slate-500 focus:outline-none font-medium ${
              isHero ? 'text-lg py-2' : 'text-sm py-1'
            }`}
          />

          {/* Main CTA Button: FOLLOW YOUR DATA */}
          <button
            type="submit"
            disabled={isLoading || !domainInput.trim()}
            aria-label="Follow your data journey"
            className={`flex items-center gap-2 font-bold uppercase tracking-wider rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all ${
              isHero 
                ? 'px-6 py-3 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-gray-950 hover:opacity-95 shadow-lg shadow-cyan-500/25 disabled:opacity-50' 
                : 'px-3.5 py-1.5 bg-cyan-500 text-gray-950 hover:bg-cyan-400 text-xs font-semibold disabled:opacity-50'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>FOLLOW YOUR DATA</span>
                <Send className={isHero ? 'w-4 h-4' : 'w-3 h-3'} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Demo Journeys (Hero view) */}
      {isHero && (
        <div className="mt-8 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Or explore pre-mapped cross-continental presentation journeys:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => onSelectDemoRoute(route)}
                aria-label={`Start demo journey for ${route.domain}`}
                className="glass-panel p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 text-left group focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 hover:shadow-glow-cyan"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-cyan-400 group-hover:text-white transition-colors">
                    {route.domain}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{route.summary.total_distance_km} km</span>
                </div>
                <p className="text-xs text-slate-300 truncate">{route.label}</p>
              </button>
            ))}
          </div>

          {/* Privacy Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Privacy Note: Uses approximate IP geolocation for origin points. Location permissions are never required.</span>
          </div>
        </div>
      )}
    </div>
  );
}
