"use client";

import React, { useEffect, useRef, useState } from "react";

export interface BuilderData {
  name: string;
  stack: string;
  builderClass: string;
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
}

export type FrameFormat = "pfp" | "id" | "team";

interface FrameCanvasProps {
  imageUrl: string | null;
  format: FrameFormat;
  theme: "goa" | "night" | "sand";
  treatment: "natural" | "cel" | "riso";
  builderData: BuilderData;
  transform: TransformState;
  orientation?: "portrait" | "landscape";
  width?: number; // Used for UI scaling, actual rendering is scaled up
  height?: number;
}

// ═══════════════════════════════════════════
// DESIGN TOKENS & UTILS
// ═══════════════════════════════════════════

const THEMES = {
  goa: {
    bg: "#022b13",
    bgSecondary: "#011c0c",
    text: "#f4f0e6", // Cream
    accent1: "#fde047", // Yellow
    accent2: "#ec4899", // Pink
    grid: "rgba(244, 240, 230, 0.05)",
  },
  night: {
    bg: "#09090b",
    bgSecondary: "#000000",
    text: "#f4f0e6",
    accent1: "#eab308",
    accent2: "#db2777",
    grid: "rgba(255, 255, 255, 0.03)",
  },
  sand: {
    bg: "#f4f0e6",
    bgSecondary: "#e8e2d2",
    text: "#022b13",
    accent1: "#ca8a04",
    accent2: "#be185d",
    grid: "rgba(2, 43, 19, 0.05)",
  },
};

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function FrameCanvas({
  imageUrl,
  format,
  theme,
  treatment,
  builderData,
  transform,
  orientation = "portrait",
  width = 600,
  height = 800,
}: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Ensure fonts are loaded before drawing
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const loadImages = async () => {
      let mainImg: HTMLImageElement | null = null;
      if (imageUrl) {
        mainImg = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image`));
          img.src = imageUrl;
        });
      }
      draw(ctx, mainImg, canvas.width, canvas.height);
    };

    loadImages();
  }, [imageUrl, format, theme, treatment, builderData, transform, orientation, fontsLoaded, width, height]);

  // ═══════════════════════════════════════════
  // DRAWING LOGIC
  // ═══════════════════════════════════════════
  const draw = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    w: number,
    h: number
  ) => {
    const t = THEMES[theme];

    // 1. BASE BACKGROUND
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, w, h);

    // 2. SAND NOISE (Procedural paper texture)
    if (theme === "sand") {
      drawNoise(ctx, w, h, 0.03);
    }

    // 3. GRID SYSTEM
    drawGrid(ctx, w, h, t.grid);

    // 4. FORMAT SPECIFIC RENDERING
    if (format === "id") {
      if (orientation === "landscape") {
        drawBuilderIDLandscape(ctx, img, w, h, t);
      } else {
        drawBuilderIDPortrait(ctx, img, w, h, t);
      }
    } else if (format === "pfp") {
      drawPFP(ctx, img, w, h, t);
    } else if (format === "team") {
      drawTeam(ctx, img, w, h, t);
    }
  };

  // ═══════════════════════════════════════════
  // STICKERS / DECORATIONS
  // ═══════════════════════════════════════════

  const drawStamp = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, text: string, color: string, rotation: number = -Math.PI / 8) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.05;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.85, 0, Math.PI * 2);
    ctx.lineWidth = size * 0.03;
    ctx.setLineDash([size * 0.1, size * 0.1]);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.font = `bold ${size * 0.3}px Space Mono, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    
    ctx.restore();
  };

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    let currX = x;
    const numBars = 30;
    
    // Seeded random for consistency
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < numBars; i++) {
      const barWidth = width * (0.01 + pseudoRandom(i) * 0.04);
      const spacing = width * (0.01 + pseudoRandom(i + 100) * 0.04);
      if (currX + barWidth > x + width) break;
      ctx.fillRect(currX, y, barWidth, height);
      currX += barWidth + spacing;
    }
  };

  const drawSecurityTape = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, text: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    
    ctx.fillStyle = "#000000"; // Always black text for contrast against tape
    ctx.font = `bold ${h * 0.6}px Space Mono, monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    
    for (let i = 0; i < 5; i++) {
      ctx.fillText(text, (w * 0.25) * i, h / 2);
    }
    
    ctx.restore();
  };


  // ═══════════════════════════════════════════
  // SUB-ROUTINES
  // ═══════════════════════════════════════════

  const drawBuilderIDPortrait = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, w: number, h: number, t: any) => {
    const marginX = w * 0.08;
    const marginY = h * 0.06;

    // --- PHOTO AREA ---
    const photoW = w * 0.84;
    const photoH = h * 0.55;
    const photoX = marginX;
    const photoY = marginY + h * 0.08;

    ctx.fillStyle = t.bgSecondary;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      
      const cx = photoX + photoW / 2 + transform.x;
      const cy = photoY + photoH / 2 + transform.y;
      const scaleCover = Math.max(photoW / img.width, photoH / img.height);
      const finalScale = scaleCover * transform.scale;
      
      ctx.translate(cx, cy);
      ctx.scale(finalScale, finalScale);
      
      if (treatment === "cel") ctx.filter = "contrast(1.4) saturate(1.2) brightness(0.9)";
      if (treatment === "riso") ctx.filter = "contrast(1.5) sepia(0.3) grayscale(0.2)";
      
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    }

    ctx.strokeStyle = t.accent1;
    ctx.lineWidth = w * 0.005;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Signature Signal Arc
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoW, photoY + photoH * 0.7, photoW * 0.4, Math.PI * 0.7, Math.PI * 1.6);
    ctx.strokeStyle = t.accent2;
    ctx.lineWidth = w * 0.003;
    ctx.setLineDash([w * 0.01, w * 0.015]);
    ctx.stroke();
    ctx.restore();

    // Stickers over photo
    drawStamp(ctx, photoX + photoW - w * 0.05, photoY + w * 0.05, w * 0.08, "GOA", t.accent1, Math.PI/12);
    
    // Top Metadata
    ctx.fillStyle = t.text;
    ctx.font = `bold ${w * 0.045}px Playfair Display, serif`;
    ctx.fillText("HH GOA 2026", marginX, marginY + h * 0.03);

    ctx.font = `bold ${w * 0.018}px Space Mono, monospace`;
    ctx.fillStyle = t.accent2;
    ctx.fillText("BUILDER PASSPORT //", marginX + w * 0.4, marginY + h * 0.025);

    // Bottom Identity Area
    const textStartY = photoY + photoH + h * 0.05;
    const maxTextW = w - (marginX * 2);

    ctx.fillStyle = t.text;
    ctx.font = `900 ${w * 0.09}px Playfair Display, serif`;
    const name = builderData.name || "YOUR NAME";
    ctx.fillText(name.toUpperCase(), marginX, textStartY, maxTextW);

    const classY = textStartY + h * 0.04;
    ctx.fillStyle = t.accent1;
    ctx.fillRect(marginX, classY, w * 0.45, h * 0.04);
    
    ctx.fillStyle = theme === "goa" ? "#022b13" : "#000000";
    ctx.font = `bold ${w * 0.02}px Space Mono, monospace`;
    ctx.fillText(`CLASS : ${builderData.builderClass || "GENESIS BUILDER"}`, marginX + w * 0.02, classY + h * 0.028);

    const stackY = classY + h * 0.07;
    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.8;
    ctx.font = `bold ${w * 0.022}px Space Mono, monospace`;
    ctx.fillText(builderData.stack || "ROLE / STACK / DOMAIN", marginX, stackY, maxTextW);
    ctx.globalAlpha = 1.0;

    // Bottom Technical
    const bottomY = h - marginY;
    
    drawBarcode(ctx, marginX, bottomY - h * 0.04, w * 0.2, h * 0.04, t.text);

    ctx.strokeStyle = t.text;
    ctx.lineWidth = w * 0.002;
    ctx.strokeRect(w - marginX - w * 0.15, bottomY - h * 0.05, w * 0.15, h * 0.05);
    ctx.font = `bold ${w * 0.015}px Space Mono, monospace`;
    ctx.textAlign = "center";
    ctx.fillText("HHG 2026", w - marginX - w * 0.075, bottomY - h * 0.032);
    ctx.fillStyle = t.accent2;
    ctx.fillText("247 SEATS", w - marginX - w * 0.075, bottomY - h * 0.012);
    ctx.textAlign = "left";

    ctx.fillStyle = t.accent1;
    ctx.font = `bold ${w * 0.025}px Space Mono, monospace`;
    ctx.fillText("#FrameInGoa", w - marginX - w * 0.28, photoY - h * 0.02);
  };

  const drawBuilderIDLandscape = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, w: number, h: number, t: any) => {
    const marginY = h * 0.08;
    const marginX = w * 0.06;

    // --- LEFT PHOTO AREA ---
    const photoW = w * 0.42;
    const photoH = h - (marginY * 2);
    const photoX = marginX;
    const photoY = marginY;

    ctx.fillStyle = t.bgSecondary;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      
      const cx = photoX + photoW / 2 + transform.x;
      const cy = photoY + photoH / 2 + transform.y;
      const scaleCover = Math.max(photoW / img.width, photoH / img.height);
      const finalScale = scaleCover * transform.scale;
      
      ctx.translate(cx, cy);
      ctx.scale(finalScale, finalScale);
      
      if (treatment === "cel") ctx.filter = "contrast(1.4) saturate(1.2) brightness(0.9)";
      if (treatment === "riso") ctx.filter = "contrast(1.5) sepia(0.3) grayscale(0.2)";
      
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    }

    ctx.strokeStyle = t.accent1;
    ctx.lineWidth = w * 0.005;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
    
    // Stickers on Photo
    drawStamp(ctx, photoX + photoW, photoY + photoH * 0.15, h * 0.1, "APPROVED", t.accent1, Math.PI / 16);
    drawSecurityTape(ctx, photoX - w * 0.02, photoY + photoH * 0.85, photoW + w * 0.04, h * 0.04, t.accent2, "// AUTH //");

    // --- RIGHT SIDE TYPOGRAPHY ---
    const textX = photoX + photoW + w * 0.05;
    const maxTextW = w - textX - marginX;

    // Title
    ctx.fillStyle = t.text;
    ctx.font = `bold ${h * 0.05}px Playfair Display, serif`;
    ctx.fillText("HH GOA 2026", textX, photoY + h * 0.05);
    
    ctx.fillStyle = t.accent2;
    ctx.font = `bold ${h * 0.022}px Space Mono, monospace`;
    ctx.fillText("BUILDER PASSPORT //", textX, photoY + h * 0.1);

    // Name
    ctx.fillStyle = t.text;
    ctx.font = `900 ${h * 0.15}px Playfair Display, serif`;
    const name = builderData.name || "YOUR NAME";
    ctx.fillText(name.toUpperCase(), textX, photoY + h * 0.35, maxTextW);

    // Class Stamp
    const classY = photoY + h * 0.45;
    ctx.fillStyle = t.accent1;
    ctx.fillRect(textX, classY, w * 0.28, h * 0.05);
    
    ctx.fillStyle = theme === "goa" ? "#022b13" : "#000000";
    ctx.font = `bold ${h * 0.025}px Space Mono, monospace`;
    ctx.fillText(`CLASS : ${builderData.builderClass || "GENESIS BUILDER"}`, textX + w * 0.015, classY + h * 0.035);

    // Stack
    const stackY = classY + h * 0.12;
    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.8;
    ctx.font = `bold ${h * 0.035}px Space Mono, monospace`;
    ctx.fillText(builderData.stack || "ROLE / STACK / DOMAIN", textX, stackY, maxTextW);
    ctx.globalAlpha = 1.0;
    
    // Bottom Right Metadata / Stickers
    const bottomY = photoY + photoH;
    
    drawBarcode(ctx, textX, bottomY - h * 0.06, w * 0.15, h * 0.06, t.text);
    
    ctx.fillStyle = t.accent1;
    ctx.font = `bold ${h * 0.035}px Space Mono, monospace`;
    ctx.textAlign = "right";
    ctx.fillText("#FrameInGoa", w - marginX, bottomY);
    ctx.textAlign = "left";
  };

  const drawPFP = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, w: number, h: number, t: any) => {
    // 1:1 Aspect Ratio logic
    const cx = w / 2;
    const cy = h / 2;
    const radius = w * 0.38;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = t.bgSecondary;
    ctx.fill();

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      
      const imgCx = cx + transform.x;
      const imgCy = cy + transform.y;
      const scaleCover = Math.max((radius*2) / img.width, (radius*2) / img.height);
      const finalScale = scaleCover * transform.scale;
      
      ctx.translate(imgCx, imgCy);
      ctx.scale(finalScale, finalScale);
      
      if (treatment === "cel") ctx.filter = "contrast(1.4) saturate(1.2) brightness(0.9)";
      if (treatment === "riso") ctx.filter = "contrast(1.5) sepia(0.3) grayscale(0.2)";
      
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius + w * 0.03, Math.PI * 0.8, Math.PI * 2.2);
    ctx.strokeStyle = t.accent1;
    ctx.lineWidth = w * 0.015;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + w * 0.06, Math.PI * 0.2, Math.PI * 1.5);
    ctx.strokeStyle = t.accent2;
    ctx.lineWidth = w * 0.005;
    ctx.setLineDash([w * 0.02, w * 0.02]);
    ctx.stroke();
    ctx.setLineDash([]);

    const margin = w * 0.06;
    ctx.fillStyle = t.text;
    ctx.font = `900 ${w * 0.06}px Playfair Display, serif`;
    
    ctx.fillText("HH GOA", margin, margin + w * 0.05);
    
    ctx.font = `bold ${w * 0.025}px Space Mono, monospace`;
    ctx.fillText("2026", margin, h - margin);

    ctx.fillStyle = t.accent1;
    ctx.textAlign = "right";
    ctx.fillText("#FrameInGoa", w - margin, h - margin);
    
    ctx.strokeStyle = t.text;
    ctx.lineWidth = w * 0.004;
    ctx.beginPath();
    ctx.moveTo(w - margin - w * 0.04, margin);
    ctx.lineTo(w - margin, margin);
    ctx.lineTo(w - margin, margin + w * 0.04);
    ctx.stroke();
    ctx.textAlign = "left";
  };

  const drawTeam = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, w: number, h: number, t: any) => {
    const marginX = w * 0.06;
    const marginY = h * 0.1;
    
    const photoW = w * 0.55;
    const photoH = h * 0.8;
    const photoX = marginX;
    const photoY = marginY;

    ctx.fillStyle = t.bgSecondary;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      
      const cx = photoX + photoW / 2 + transform.x;
      const cy = photoY + photoH / 2 + transform.y;
      const scaleCover = Math.max(photoW / img.width, photoH / img.height);
      const finalScale = scaleCover * transform.scale;
      
      ctx.translate(cx, cy);
      ctx.scale(finalScale, finalScale);
      
      if (treatment === "cel") ctx.filter = "contrast(1.4) saturate(1.2) brightness(0.9)";
      if (treatment === "riso") ctx.filter = "contrast(1.5) sepia(0.3) grayscale(0.2)";
      
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    }

    ctx.strokeStyle = t.text;
    ctx.lineWidth = w * 0.003;
    ctx.strokeRect(photoX, photoY, photoW, photoH);
    
    // Stickers for Team
    drawStamp(ctx, photoX, photoY, h * 0.12, "CREW", t.accent1, -Math.PI / 6);
    drawSecurityTape(ctx, photoX + photoW * 0.6, photoY - h * 0.02, photoW * 0.4, h * 0.04, t.accent2, "TEAM");

    const textX = photoX + photoW + w * 0.05;
    const maxTextW = w - textX - marginX;
    
    ctx.fillStyle = t.accent1;
    ctx.font = `bold ${w * 0.02}px Space Mono, monospace`;
    ctx.fillText("ONE CREW // ONE SIGNAL", textX, photoY + h * 0.1, maxTextW);

    ctx.fillStyle = t.text;
    ctx.font = `900 ${w * 0.06}px Playfair Display, serif`;
    const name = builderData.name || "TEAM NAME";
    ctx.fillText(name.toUpperCase(), textX, photoY + h * 0.25, maxTextW);

    ctx.fillStyle = t.accent2;
    ctx.font = `bold ${w * 0.025}px Space Mono, monospace`;
    ctx.fillText(builderData.stack || "DOMAINS / HACKS", textX, photoY + h * 0.35, maxTextW);

    ctx.strokeStyle = t.text;
    ctx.strokeRect(textX, photoY + h * 0.5, w * 0.1, h * 0.15);
    ctx.fillStyle = t.text;
    ctx.font = `bold ${w * 0.015}px Space Mono, monospace`;
    ctx.fillText("HHG 26", textX + w * 0.02, photoY + h * 0.57);
    ctx.fillText("GOA", textX + w * 0.02, photoY + h * 0.62);

    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.5;
    ctx.font = `bold ${w * 0.02}px Space Mono, monospace`;
    ctx.fillText("#FrameInGoa", textX, photoY + photoH);
    ctx.globalAlpha = 1.0;
  };

  // ═══════════════════════════════════════════
  // PROCEDURAL TEXTURES & GRIDS
  // ═══════════════════════════════════════════
  const drawNoise = (ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number) => {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = (Math.random() - 0.5) * 50;
      data[i] += val;
      data[i + 1] += val;
      data[i + 2] += val;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const step = Math.min(w, h) * 0.05;
    
    ctx.beginPath();
    for (let x = 0; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let x = step * 2; x < w - step; x += step * 4) {
      for (let y = step * 2; y < h - step; y += step * 4) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
        ctx.stroke();
      }
    }
  };

  // Dimension scaling logic based on format + orientation
  let renderWidth = width;
  let renderHeight = height;
  
  if (format === "id") {
    if (orientation === "landscape") {
      renderWidth = 2000;
      renderHeight = 1600;
    } else {
      renderWidth = 1600;
      renderHeight = 2000;
    }
  } else if (format === "pfp") {
    renderWidth = 1080;
    renderHeight = 1080;
  } else if (format === "team") {
    renderWidth = 1600;
    renderHeight = 900;
  }

  return (
    <canvas
      ref={canvasRef}
      width={renderWidth}
      height={renderHeight}
      className="max-w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black"
      style={{
        aspectRatio: `${renderWidth}/${renderHeight}`,
        width: "100%",
      }}
    />
  );
}
