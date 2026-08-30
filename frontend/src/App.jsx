import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import GlobeView from './components/GlobeView';
import StorySidebar from './components/StorySidebar';
import EmotionalSummary from './components/EmotionalSummary';
import CinematicLoading from './components/CinematicLoading';
import { DEMO_ROUTES } from './data/demoRoutes';
import { normalizeJourneyData } from './utils/journeyAdapter';
import { calculateHaversineDistance } from './utils/haversine';
import { Info } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isHero, setIsHero] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [targetDomain, setTargetDomain] = useState('');
  const [errorNotification, setErrorNotification] = useState(null);

  // Active Journey Data
  const [activeRoute, setActiveRoute] = useState(null);
  const [activeHopIndex, setActiveHopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEmotionalSummary, setShowEmotionalSummary] = useState(false);

  const timerRef = useRef(null);

  // Select a preset demo route
  const handleSelectDemoRoute = (demoRoute) => {
    const normalized = normalizeJourneyData(demoRoute, demoRoute.domain);
    setActiveRoute(normalized);
    setActiveHopIndex(0);
    setIsHero(false);
    setIsPlaying(true);
    setShowEmotionalSummary(false);
  };

  // Handle Domain Search Submit
  const handleDomainSubmit = async (domain) => {
    setTargetDomain(domain);
    setIsLoading(true);
    setErrorNotification(null);

    const matchedDemo = DEMO_ROUTES.find(r => r.domain.toLowerCase() === domain.toLowerCase());

    if (isDemoMode || matchedDemo) {
      setTimeout(() => {
        setIsLoading(false);
        const routeToUse = matchedDemo || DEMO_ROUTES[0];
        handleSelectDemoRoute(routeToUse);
      }, 1800);
      return;
    }

    // Call Live Traceroute API backend endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s cold-start timeout

      const response = await fetch(`${API_BASE_URL}/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server status ${response.status}`);
      }

      const liveData = await response.json();
      setIsLoading(false);
      
      const normalized = normalizeJourneyData(liveData, domain);
      
      if (normalized.isDemoFallback) {
        setErrorNotification("Live network tracing isn't available from this environment. Switching to interactive demonstration journey.");
      }

      setActiveRoute(normalized);
      setActiveHopIndex(0);
      setIsHero(false);
      setIsPlaying(true);
      setShowEmotionalSummary(false);

    } catch (err) {
      console.warn('Live traceroute backend call failed:', err);
      setIsLoading(false);
      
      setErrorNotification("Live network tracing isn't available from this environment. Switching to interactive demonstration journey.");
      
      setTimeout(() => {
        handleSelectDemoRoute(DEMO_ROUTES[0]);
      }, 1000);
    }
  };

  // Autoplay Timer Stagger Logic (Advances story scene per hop)
  useEffect(() => {
    if (isPlaying && activeRoute && activeRoute.hops) {
      timerRef.current = setTimeout(() => {
        if (activeHopIndex < activeRoute.hops.length - 1) {
          setActiveHopIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
          setTimeout(() => {
            setShowEmotionalSummary(true);
          }, 800);
        }
      }, 1600);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, activeHopIndex, activeRoute]);

  // Reset to Hero Landing Page
  const handleResetState = () => {
    setIsHero(true);
    setIsPlaying(false);
    setActiveRoute(null);
    setActiveHopIndex(0);
    setShowEmotionalSummary(false);
    setErrorNotification(null);
  };

  // Cumulative distance calculation up to activeHopIndex
  const calculateDistanceSoFar = () => {
    if (!activeRoute || !activeRoute.hops) return 0;
    let dist = 0;
    for (let i = 0; i < activeHopIndex && i < activeRoute.hops.length - 1; i++) {
      const h1 = activeRoute.hops[i];
      const h2 = activeRoute.hops[i + 1];
      dist += calculateHaversineDistance(h1.lat, h1.lng, h2.lat, h2.lng);
    }
    return dist;
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col overflow-hidden text-slate-100 font-sans selection:bg-cyan-500 selection:text-gray-950">
      
      {/* Cinematic Loading Overlay */}
      {isLoading && <CinematicLoading targetDomain={targetDomain} />}

      {/* Top Navbar */}
      <Navbar
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onResetState={handleResetState}
        hasActiveJourney={!isHero}
        networkStatusLabel={activeRoute?.networkStatusLabel}
        statusBadgeColor={activeRoute?.statusBadgeColor}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-16 relative flex flex-col">
        
        {/* Friendly Error / Fallback Notification Banner */}
        {errorNotification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-panel px-4 py-2.5 rounded-2xl border border-amber-500/50 bg-gray-950/90 text-amber-300 text-xs flex items-center gap-2.5 shadow-2xl animate-slide-up max-w-lg">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-relaxed">{errorNotification}</span>
            <button onClick={() => setErrorNotification(null)} className="ml-2 font-mono text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* HERO LANDING STATE */}
        {isHero ? (
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 min-h-[calc(100vh-4rem)]">
            
            {/* Background 3D Globe preview canvas */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
              <GlobeView
                hops={DEMO_ROUTES[0].hops}
                activeHopIndex={4}
                isJourneyActive={false}
                currentRouteLabel="Preview Mode"
              />
            </div>

            {/* Centered Hero Search Bar */}
            <div className="relative z-10 w-full">
              <SearchBar
                onSubmit={handleDomainSubmit}
                isLoading={isLoading}
                isHero={true}
                onSelectDemoRoute={handleSelectDemoRoute}
                isDemoMode={isDemoMode}
              />
            </div>

          </div>
        ) : (
          /* JOURNEY STATE: Split View */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 grid-rows-[42vh_1fr] lg:grid-rows-none h-[calc(100vh-4rem)] overflow-hidden">
            
            {/* Story Sidebar */}
            <div className="lg:col-span-4 h-full order-2 lg:order-1 relative z-20 overflow-hidden">
              <StorySidebar
                hops={activeRoute ? activeRoute.hops : []}
                activeHopIndex={activeHopIndex}
                onSelectHop={(idx) => {
                  setActiveHopIndex(idx);
                  setIsPlaying(false);
                }}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                currentSceneTitle={activeRoute?.hops[activeHopIndex]?.sceneTitle}
                totalDistanceSoFar={calculateDistanceSoFar()}
              />
            </div>

            {/* 3D Globe Visualization */}
            <div className="lg:col-span-8 h-full order-1 lg:order-2 relative z-10">
              <GlobeView
                hops={activeRoute ? activeRoute.hops : []}
                activeHopIndex={activeHopIndex}
                isJourneyActive={true}
                currentRouteLabel={activeRoute?.label || activeRoute?.destinationName}
              />
            </div>

          </div>
        )}

      </main>

      {/* Emotional Summary Climax Modal */}
      {showEmotionalSummary && activeRoute && (
        <EmotionalSummary
          routeData={activeRoute}
          onRestartJourney={() => {
            setShowEmotionalSummary(false);
            setActiveHopIndex(0);
            setIsPlaying(true);
          }}
          onNewJourney={handleResetState}
        />
      )}

    </div>
  );
}
