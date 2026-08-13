"use client";

import React, { useEffect, useState } from "react";
import { Theme, backdropThemes } from "@/lib/background/backgroundConfig";
import { TopographicGrid } from "./TopographicGrid";
import { SignalArcs } from "./SignalArcs";
import { AmbientNodes } from "./AmbientNodes";
import { CoordinateMarks } from "./CoordinateMarks";

interface DynamicBackdropProps {
  theme: Theme;
}

export function DynamicBackdrop({ theme }: DynamicBackdropProps) {
  const t = backdropThemes[theme];
  
  // Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    // Track mouse with low-friction event listener
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Normalize to -1 to 1 based on window center
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = (e.clientY / window.innerHeight) * 2 - 1;
          setMousePos({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isReducedMotion]);

  // Compute parallax offsets (max 15px movement)
  const layer1X = mousePos.x * -5;
  const layer1Y = mousePos.y * -5;
  
  const layer2X = mousePos.x * 10;
  const layer2Y = mousePos.y * 10;
  
  const layer3X = mousePos.x * -15;
  const layer3Y = mousePos.y * -15;

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-1000 z-0"
      style={{ backgroundColor: t.baseColor }}
    >
      {/* Mathematical Noise Layer */}
      <div 
        className="absolute inset-0 opacity-[var(--noise-opacity)] mix-blend-overlay transition-opacity duration-1000"
        style={{ 
          "--noise-opacity": t.noiseOpacity,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        } as React.CSSProperties}
      />

      {/* Layer 1: Topographic Grid (Moves slightly opposite) */}
      <div 
        className="absolute inset-[-5%] w-[110%] h-[110%] transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${layer1X}px, ${layer1Y}px, 0)` }}
      >
        <TopographicGrid theme={t} reducedMotion={isReducedMotion} />
      </div>

      {/* Layer 2: Signal Arcs (Moves with mouse) */}
      <div 
        className="absolute inset-[-5%] w-[110%] h-[110%] transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${layer2X}px, ${layer2Y}px, 0)` }}
      >
        <SignalArcs theme={t} reducedMotion={isReducedMotion} />
      </div>

      {/* Layer 3: Ambient Nodes (Moves fast opposite) */}
      <div 
        className="absolute inset-[-5%] w-[110%] h-[110%] transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${layer3X}px, ${layer3Y}px, 0)` }}
      >
        <AmbientNodes theme={t} reducedMotion={isReducedMotion} />
      </div>

      {/* Static Overlay: Coordinate Marks */}
      <div className="absolute inset-0 transition-opacity duration-1000 opacity-80">
        <CoordinateMarks theme={t} />
      </div>
    </div>
  );
}
