"use client";

import React from "react";

export function SignalArcs({ theme, reducedMotion }: { theme: any; reducedMotion: boolean }) {
  // SVG arcs representing orbital paths / radio signals
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .bg-arc { fill: none; stroke: ${theme.signalColor}; opacity: ${theme.signalOpacity}; transition: all 1s ease; }
        .bg-arc-text { fill: ${theme.signalColor}; font-family: monospace; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; opacity: ${theme.signalOpacity * 1.5}; transition: all 1s ease; }
        
        ${!reducedMotion ? `
          .animate-spin-slow { transform-origin: center; animation: spin 120s linear infinite; }
          .animate-spin-reverse { transform-origin: center; animation: spin-rev 150s linear infinite; }
          .animate-pulse-slow { animation: pulse 8s ease-in-out infinite alternate; }
          
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes spin-rev { 100% { transform: rotate(-360deg); } }
          @keyframes pulse { 0% { opacity: 0.5; stroke-width: 1px; } 100% { opacity: 1; stroke-width: 2px; } }
        ` : ''}
      `}</style>

      {/* Main Signal Arc (Top Left) */}
      <g className={!reducedMotion ? "animate-spin-slow" : ""} transform="translate(150, 150)">
        {/* Arc line */}
        <circle cx="0" cy="0" r="400" className="bg-arc" strokeWidth="1" strokeDasharray="4 12" />
        <circle cx="0" cy="0" r="420" className="bg-arc animate-pulse-slow" strokeWidth="2" strokeDasharray="100 800" />
        
        {/* Orbital Text Path */}
        <path id="orbit1" d="M -440,0 A 440,440 0 1,1 440,0 A 440,440 0 1,1 -440,0" fill="none" />
        <text className="bg-arc-text">
          <textPath href="#orbit1" startOffset="10%">
            HH GOA // 2026 // SIGNAL FIELD // 247 SEATS
          </textPath>
        </text>
      </g>

      {/* Secondary Signal Arc (Bottom Right) */}
      <g className={!reducedMotion ? "animate-spin-reverse" : ""} transform="translate(85%, 85%)">
        <circle cx="0" cy="0" r="600" className="bg-arc" strokeWidth="1" strokeDasharray="2 20" />
        <circle cx="0" cy="0" r="580" className="bg-arc" strokeWidth="1" strokeDasharray="200 400" />
        
        <path id="orbit2" d="M -620,0 A 620,620 0 1,1 620,0 A 620,620 0 1,1 -620,0" fill="none" />
        <text className="bg-arc-text">
          <textPath href="#orbit2" startOffset="75%">
            BUILD SHIP LAUNCH // #FrameInGoa // GOA, INDIA
          </textPath>
        </text>
      </g>
    </svg>
  );
}
