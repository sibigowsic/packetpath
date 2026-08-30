import React, { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { Layers, AlertCircle, Loader2 } from 'lucide-react';

const EARTH_NIGHT_URL = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const EARTH_TOPOLOGY_URL = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

export default function GlobeView({ hops, activeHopIndex, isJourneyActive, currentRouteLabel }) {
  const globeContainerRef = useRef(null);
  const globeInstanceRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const [textureStatus, setTextureStatus] = useState('loading'); // 'loading' | 'loaded' | 'fallback'
  const [showCableDisclaimer, setShowCableDisclaimer] = useState(true);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preload Earth night texture
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = EARTH_NIGHT_URL;

    img.onload = () => {
      if (isMounted) setTextureStatus('loaded');
    };

    img.onerror = () => {
      console.warn('Earth night texture CDN unavailable. Using stylized fallback mode.');
      if (isMounted) setTextureStatus('fallback');
    };

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize 3D Globe once
  useEffect(() => {
    if (!globeContainerRef.current) return;

    // Create Globe instance
    const globe = Globe()(globeContainerRef.current)
      .globeImageUrl(EARTH_NIGHT_URL)
      .bumpImageUrl(EARTH_TOPOLOGY_URL)
      .backgroundColor('#030712')
      .showAtmosphere(true)
      .atmosphereColor('#06b6d4')
      .atmosphereAltitude(0.18)
      
      // Router Hop Points & Glowing Packet Particle Head
      .pointsData([])
      .pointLat('lat')
      .pointLng('lng')
      .pointColor(d => d.isPacketHead ? '#00ffff' : (d.isCurrent ? '#22d3ee' : '#ffffff'))
      .pointAltitude(d => d.isPacketHead ? 0.05 : 0.02)
      .pointRadius(d => d.isPacketHead ? 1.2 : (d.isCurrent ? 0.75 : 0.4))
      .pointResolution(32)
      
      // Glowing Cyan Arcs with Packet Animation
      .arcsData([])
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor(() => ['#06b6d4', '#00ffff'])
      .arcDashLength(prefersReducedMotion ? 0.9 : 0.35)
      .arcDashGap(prefersReducedMotion ? 0.1 : 0.15)
      .arcDashInitialGap(() => Math.random())
      .arcDashAnimateTime(prefersReducedMotion ? 0 : 1500)
      .arcStroke(1.8)
      .arcAltitude(d => d.altitude || 0.15);

    // Initial camera position
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 1000);
    
    // Auto-rotate globe slowly when idle (unless reduced motion preferred)
    globe.controls().autoRotate = !prefersReducedMotion;
    globe.controls().autoRotateSpeed = 0.4;

    globeInstanceRef.current = globe;

    // Handle window resize dynamically
    const handleResize = () => {
      if (globeContainerRef.current && globeInstanceRef.current) {
        const { clientWidth, clientHeight } = globeContainerRef.current;
        globeInstanceRef.current.width(clientWidth).height(clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [prefersReducedMotion]);

  // Update Globe points & arcs data safely without unmounting canvas
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !hops || hops.length === 0) return;

    // Filter points up to activeHopIndex
    const visibleHops = hops.slice(0, activeHopIndex + 1);
    
    const pointData = visibleHops.map((hop, idx) => ({
      lat: hop.lat,
      lng: hop.lng,
      name: hop.city ? `${hop.city}, ${hop.country}` : hop.ip,
      isCurrent: idx === activeHopIndex,
      isPacketHead: idx === activeHopIndex, // Distinct Packet Particle Head
      hopNumber: hop.hop
    }));

    globe.pointsData(pointData);

    // Build arcs between consecutive visible hops
    const arcData = [];
    for (let i = 0; i < visibleHops.length - 1; i++) {
      const start = visibleHops[i];
      const end = visibleHops[i + 1];
      
      const distance = Math.hypot(end.lat - start.lat, end.lng - start.lng);
      const altitude = distance > 50 ? 0.35 : 0.15;

      arcData.push({
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
        altitude,
        color: ['#06b6d4', '#00ffff'],
        stroke: 1.8
      });
    }

    globe.arcsData(arcData);

    // Smoothly focus camera onto active packet head
    if (visibleHops.length > 0 && isJourneyActive) {
      const activeHop = visibleHops[visibleHops.length - 1];
      globe.controls().autoRotate = false;
      globe.pointOfView(
        { lat: activeHop.lat, lng: activeHop.lng, altitude: 1.8 },
        prefersReducedMotion ? 0 : 1200
      );
    }
  }, [hops, activeHopIndex, isJourneyActive, prefersReducedMotion]);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-gray-950 overflow-hidden flex items-center justify-center">
      
      {/* 3D Globe Canvas Container */}
      <div 
        ref={globeContainerRef} 
        aria-label="3D Interactive Earth Data Map"
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" 
      />

      {/* Texture Loading Overlay */}
      {textureStatus === 'loading' && (
        <div className="absolute top-4 right-4 z-20 glass-panel px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Loading 3D Earth Texture...</span>
        </div>
      )}

      {/* Fallback Texture Notification */}
      {textureStatus === 'fallback' && (
        <div className="absolute top-4 right-4 z-20 glass-panel px-3 py-1.5 rounded-lg border border-amber-800/50 text-[11px] font-mono text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Stylized Dark Globe Fallback Mode</span>
        </div>
      )}

      {/* Active Route Header Pill */}
      {isJourneyActive && currentRouteLabel && (
        <div className="absolute top-4 left-4 sm:left-6 z-20 glass-panel px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center gap-2 animate-slide-up shadow-glow-cyan">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider">Tracing:</span>
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-md">{currentRouteLabel}</span>
        </div>
      )}

      {/* Submarine Cable & Geolocation Accuracy Disclaimer */}
      {isJourneyActive && showCableDisclaimer && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-20 glass-panel p-3 rounded-xl border border-cyan-800/40 text-xs text-slate-300 shadow-lg animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Physical Infrastructure Note</span>
            </div>
            <button 
              onClick={() => setShowCableDisclaimer(false)} 
              aria-label="Dismiss physical infrastructure disclaimer"
              className="text-slate-400 hover:text-white text-[10px] font-mono"
            >
              [Dismiss]
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Submarine Cable Accuracy:</strong> Cable paths shown represent <span className="text-cyan-300 underline underline-offset-2">illustrative physical infrastructure</span>. Traceroutes identify network router IPs; physical optic cable routes are estimated mapping models.
          </p>
        </div>
      )}
    </div>
  );
}
