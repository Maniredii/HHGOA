"use client";

import React from "react";

export function AmbientNodes({ theme, reducedMotion }: { theme: any; reducedMotion: boolean }) {
  // SVG nodes representing a sparse builder network
  // Using static placement with slow CSS animation instead of JS calculation
  
  const nodes = [
    { x: "10%", y: "25%", delay: "0s" },
    { x: "20%", y: "15%", delay: "2s" },
    { x: "85%", y: "20%", delay: "1s" },
    { x: "90%", y: "45%", delay: "3s" },
    { x: "15%", y: "80%", delay: "1.5s" },
    { x: "30%", y: "90%", delay: "4s" },
    { x: "75%", y: "85%", delay: "0.5s" },
  ];

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .bg-node { fill: ${theme.nodeColor}; opacity: ${theme.nodeOpacity}; transition: all 1s ease; }
        .bg-link { stroke: ${theme.nodeColor}; stroke-width: 1px; opacity: ${theme.nodeOpacity * 0.3}; transition: all 1s ease; }
        
        ${!reducedMotion ? `
          .animate-node-pulse { animation: nodePulse 6s ease-in-out infinite alternate; }
          .animate-float { animation: float 20s ease-in-out infinite alternate; }
          
          @keyframes nodePulse {
            0% { opacity: 0.1; r: 1.5; }
            50% { opacity: ${theme.nodeOpacity}; r: 3; }
            100% { opacity: 0.1; r: 1.5; }
          }
          @keyframes float {
            0% { transform: translate(0, 0); }
            100% { transform: translate(15px, -15px); }
          }
        ` : ''}
      `}</style>

      {/* Network Connections */}
      <g className={!reducedMotion ? "animate-float" : ""} style={{ animationDelay: "0s" }}>
        <line x1="10%" y1="25%" x2="20%" y2="15%" className="bg-link" />
        <circle cx="10%" cy="25%" r="2" className="bg-node animate-node-pulse" style={{ animationDelay: "0s" }} />
        <circle cx="20%" cy="15%" r="2" className="bg-node animate-node-pulse" style={{ animationDelay: "2s" }} />
      </g>

      <g className={!reducedMotion ? "animate-float" : ""} style={{ animationDelay: "2s" }}>
        <line x1="85%" y1="20%" x2="90%" y2="45%" className="bg-link" />
        <circle cx="85%" cy="20%" r="2" className="bg-node animate-node-pulse" style={{ animationDelay: "1s" }} />
        <circle cx="90%" cy="45%" r="2" className="bg-node animate-node-pulse" style={{ animationDelay: "3s" }} />
      </g>

      <g className={!reducedMotion ? "animate-float" : ""} style={{ animationDelay: "1s" }}>
        <line x1="15%" y1="80%" x2="30%" y2="90%" className="bg-link" />
        <circle cx="15%" cy="80%" r="2" className="bg-node animate-node-pulse" style={{ animationDelay: "1.5s" }} />
        <circle cx="30%" cy="90%" r="2" className="bg-node animate-node-pulse" style={{ animationDelay: "4s" }} />
      </g>
      
      {/* Isolated node */}
      <circle cx="75%" cy="85%" r="2" className="bg-node animate-node-pulse" style={{ animationDelay: "0.5s" }} />
    </svg>
  );
}
