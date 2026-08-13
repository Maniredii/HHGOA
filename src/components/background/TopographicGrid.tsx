"use client";

import React from "react";

export function TopographicGrid({ theme, reducedMotion }: { theme: any; reducedMotion: boolean }) {
  // SVG grid and contour lines representing a topographic mapping of Goa
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Dynamic styles for transitions */}
      <style>{`
        .bg-grid { stroke: ${theme.gridColor}; stroke-width: 1px; opacity: ${theme.gridOpacity}; transition: all 1s ease; }
        .bg-contour { fill: none; stroke: ${theme.contourColor}; stroke-width: 1.5px; opacity: ${theme.contourOpacity}; transition: all 1s ease; }
        ${!reducedMotion ? `
          .animate-drift { animation: drift 40s linear infinite alternate; }
          @keyframes drift { 0% { transform: translateY(0); } 100% { transform: translateY(-30px); } }
        ` : ''}
      `}</style>

      {/* Grid Pattern */}
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" className="bg-grid" />
          {/* Subtle intersection crosses */}
          <path d="M -4 0 L 4 0 M 0 -4 L 0 4" transform="translate(80, 80)" className="bg-grid" strokeWidth="2" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Topographic Contours (Abstract Goa Coastline) */}
      <g className={!reducedMotion ? "animate-drift" : ""}>
        <path 
          className="bg-contour"
          d="M -100 200 C 300 150, 400 400, 800 350 S 1200 600, 1600 500" 
        />
        <path 
          className="bg-contour"
          d="M -100 250 C 320 200, 380 450, 820 400 S 1180 650, 1600 550" 
        />
        <path 
          className="bg-contour"
          d="M -100 300 C 340 250, 360 500, 840 450 S 1160 700, 1600 600" 
        />
        {/* Secondary wave grouping */}
        <path 
          className="bg-contour"
          d="M 400 900 C 700 800, 800 1100, 1200 950 S 1500 1200, 1800 1100" 
        />
        <path 
          className="bg-contour"
          d="M 420 950 C 680 850, 820 1150, 1220 1000 S 1480 1250, 1800 1150" 
        />
      </g>
    </svg>
  );
}
