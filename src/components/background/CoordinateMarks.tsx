"use client";

import React from "react";

export function CoordinateMarks({ theme }: { theme: any }) {
  // Static edge-aligned technical text markers
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden transition-colors duration-1000"
      style={{ color: theme.textColor, opacity: theme.textOpacity }}
    >
      <div className="absolute top-8 left-8 flex flex-col gap-1 font-mono text-[9px] uppercase tracking-widest font-bold">
        <span>15°29′N / 73°49′E</span>
        <span>GOA / INDIA</span>
      </div>

      <div className="absolute bottom-8 left-8 flex flex-col gap-1 font-mono text-[9px] uppercase tracking-widest font-bold">
        <span>SIGNAL 247</span>
        <span>SYS.ONLINE</span>
      </div>

      <div className="absolute top-1/3 right-8 flex flex-col gap-1 font-mono text-[9px] uppercase tracking-widest font-bold text-right" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
        <span>#FrameInGoa</span>
        <span>28—31 OCT 2026</span>
      </div>
      
      {/* Decorative Crop Marks */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-current opacity-50" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-current opacity-50" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-current opacity-50" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-current opacity-50" />
    </div>
  );
}
