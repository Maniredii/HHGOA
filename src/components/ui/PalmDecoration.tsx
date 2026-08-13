"use client";

import React from "react";

interface PalmDecorationProps {
  side: "left" | "right";
  className?: string;
  variant?: "full" | "leaf" | "minimal";
}

export function PalmDecoration({ side, className = "", variant = "full" }: PalmDecorationProps) {
  const isLeft = side === "left";

  if (variant === "leaf") {
    return (
      <div
        className={`absolute ${isLeft ? "left-0" : "right-0"} pointer-events-none z-0 ${className}`}
        style={{
          transform: isLeft ? "scaleX(1)" : "scaleX(-1)",
        }}
      >
        <svg
          width="120"
          height="300"
          viewBox="0 0 120 300"
          fill="none"
          className="animate-sway opacity-20"
          style={{ transformOrigin: "bottom center" }}
        >
          {/* Palm leaf frond */}
          <path
            d="M60 280 Q30 200 10 120 Q5 80 20 40 Q35 10 60 0 Q50 30 45 80 Q42 130 50 200 Z"
            fill="url(#leafGrad)"
          />
          <path
            d="M60 280 Q80 220 95 150 Q105 100 100 60 Q90 25 60 0 Q70 40 72 90 Q73 140 65 210 Z"
            fill="url(#leafGrad2)"
          />
          <defs>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f5c38" />
              <stop offset="100%" stopColor="#022b13" />
            </linearGradient>
            <linearGradient id="leafGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#26704a" />
              <stop offset="100%" stopColor="#022b13" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={`absolute ${isLeft ? "-left-4" : "-right-4"} pointer-events-none z-0 ${className}`}
        style={{
          transform: isLeft ? "scaleX(1)" : "scaleX(-1)",
        }}
      >
        <svg
          width="80"
          height="200"
          viewBox="0 0 80 200"
          fill="none"
          className="animate-sway-slow opacity-10"
          style={{ transformOrigin: "bottom center" }}
        >
          <path
            d="M40 190 Q20 140 10 80 Q8 50 18 25 Q28 5 40 0 Q35 20 33 60 Q32 100 37 150 Z"
            fill="#1f5c38"
          />
          <path
            d="M40 190 Q55 150 65 95 Q70 60 65 30 Q55 10 40 0 Q45 25 46 65 Q46 105 42 155 Z"
            fill="#26704a"
          />
        </svg>
      </div>
    );
  }

  // Full palm tree
  return (
    <div
      className={`absolute ${isLeft ? "-left-2 lg:left-0" : "-right-2 lg:right-0"} bottom-0 pointer-events-none z-0 ${className}`}
      style={{
        transform: isLeft ? "scaleX(1)" : "scaleX(-1)",
      }}
    >
      <svg
        width="200"
        height="500"
        viewBox="0 0 200 500"
        fill="none"
        className="animate-sway opacity-15 lg:opacity-20"
        style={{ transformOrigin: "bottom center" }}
      >
        {/* Trunk */}
        <path
          d="M95 500 Q90 400 85 320 Q82 260 88 200 Q92 160 100 130"
          stroke="#3d2c1e"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100 500 Q98 400 95 320 Q93 260 96 200 Q99 160 105 130"
          stroke="#5a4234"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Fronds */}
        <path d="M100 130 Q60 80 10 50 Q50 70 80 100 Q90 115 100 130" fill="#1a5c30" />
        <path d="M100 130 Q130 60 180 20 Q150 60 120 100 Q110 118 100 130" fill="#1f6b38" />
        <path d="M100 130 Q50 100 5 100 Q45 95 80 110 Q92 120 100 130" fill="#22703e" />
        <path d="M100 130 Q140 85 190 70 Q155 85 125 110 Q112 122 100 130" fill="#26804a" />
        <path d="M100 130 Q70 60 30 10 Q65 55 90 100 Q96 118 100 130" fill="#1a6030" />
        <path d="M100 130 Q120 50 160 5 Q135 50 110 100 Q104 120 100 130" fill="#1e6838" />
        {/* Coconuts */}
        <circle cx="92" cy="135" r="6" fill="#5a4234" />
        <circle cx="108" cy="138" r="5" fill="#4a3628" />
      </svg>
    </div>
  );
}
