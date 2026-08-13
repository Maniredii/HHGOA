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
  width?: number; 
  height?: number;
}

// ═══════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════

const THEMES = {
  goa: {
    bg: "#022b13",
    bgSecondary: "#011c0c",
    text: "#f4f0e6",
    accent1: "#fde047",
    accent2: "#ec4899",
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

    // Background
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, w, h);

    // Texture
    if (theme === "sand") {
      drawNoise(ctx, w, h, 0.03);
    } else {
      // Subtle screen print texture for goa/night
      drawNoise(ctx, w, h, 0.015);
    }

    // Editorial Grid
    drawEditorialGrid(ctx, w, h, t.grid);

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
  // TEXT WRAPPING UTILITY
  // ═══════════════════════════════════════════
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    ctx.textBaseline = "top";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    ctx.textBaseline = "alphabetic"; // Reset
    return currentY + lineHeight; // Return Y coordinate for next element
  };

  // ═══════════════════════════════════════════
  // STICKERS / SEALS
  // ═══════════════════════════════════════════
  const drawGoaSeal = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, t: any) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 12);
    
    // Outer dashed ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = t.accent1;
    ctx.lineWidth = radius * 0.02;
    ctx.setLineDash([radius * 0.08, radius * 0.08]);
    ctx.stroke();
    
    // Inner solid ring
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
    ctx.setLineDash([]);
    ctx.lineWidth = radius * 0.01;
    ctx.stroke();

    // Text
    ctx.fillStyle = t.accent1;
    ctx.font = `bold ${radius * 0.4}px Playfair Display, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GOA", 0, -radius * 0.15);
    
    ctx.font = `bold ${radius * 0.15}px Space Mono, monospace`;
    ctx.fillText("INDIA 2026", 0, radius * 0.25);
    
    // Tiny center registration dot
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.02, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    let currX = x;
    const numBars = 40;
    
    const pseudoRandom = (seed: number) => {
      const val = Math.sin(seed++) * 10000;
      return val - Math.floor(val);
    };

    for (let i = 0; i < numBars; i++) {
      const barWidth = width * (0.005 + pseudoRandom(i) * 0.02);
      const spacing = width * (0.01 + pseudoRandom(i + 100) * 0.02);
      if (currX + barWidth > x + width) break;
      ctx.fillRect(currX, y, barWidth, height);
      currX += barWidth + spacing;
    }
  };

  const drawDoubleLineFrame = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: any) => {
    // Outer Line
    ctx.strokeStyle = t.accent1;
    ctx.lineWidth = 4;
    ctx.strokeRect(x - 20, y - 20, w + 40, h + 40);

    // Inner Line (tight to image)
    ctx.strokeStyle = t.text;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Corner Registration Marks on Outer Line
    const cornerSize = 40;
    ctx.strokeStyle = t.accent2;
    ctx.lineWidth = 4;

    // Top Left
    ctx.beginPath(); ctx.moveTo(x - 20, y - 20 + cornerSize); ctx.lineTo(x - 20, y - 20); ctx.lineTo(x - 20 + cornerSize, y - 20); ctx.stroke();
    // Top Right
    ctx.beginPath(); ctx.moveTo(x + w + 20 - cornerSize, y - 20); ctx.lineTo(x + w + 20, y - 20); ctx.lineTo(x + w + 20, y - 20 + cornerSize); ctx.stroke();
    // Bottom Right
    ctx.beginPath(); ctx.moveTo(x + w + 20, y + h + 20 - cornerSize); ctx.lineTo(x + w + 20, y + h + 20); ctx.lineTo(x + w + 20 - cornerSize, y + h + 20); ctx.stroke();
    // Bottom Left
    ctx.beginPath(); ctx.moveTo(x - 20 + cornerSize, y + h + 20); ctx.lineTo(x - 20, y + h + 20); ctx.lineTo(x - 20, y + h + 20 - cornerSize); ctx.stroke();
  };

  const drawSignalArc = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, t: any) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 1.9);
    ctx.strokeStyle = t.accent2;
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 18]);
    ctx.stroke();
    
    // End node
    const endX = cx + Math.cos(Math.PI * 1.9) * radius;
    const endY = cy + Math.sin(Math.PI * 1.9) * radius;
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, Math.PI*2);
    ctx.fillStyle = t.accent2;
    ctx.fill();
    ctx.restore();
  };


  // ═══════════════════════════════════════════
  // PORTRAIT LAYOUT
  // ═══════════════════════════════════════════
  const drawBuilderIDPortrait = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, w: number, h: number, t: any) => {
    const margin = 100;
    
    // --- 1. HEADER ---
    ctx.fillStyle = t.text;
    ctx.font = `bold 42px Playfair Display, serif`;
    ctx.textAlign = "left";
    ctx.fillText("HH GOA 2026", margin, margin + 42);
    
    ctx.fillStyle = t.accent2;
    ctx.font = `bold 20px Space Mono, monospace`;
    ctx.fillText("BUILDER PASSPORT //", margin, margin + 80);

    ctx.fillStyle = t.text;
    ctx.textAlign = "right";
    ctx.font = `bold 26px Space Mono, monospace`;
    ctx.fillText("GOA, INDIA", w - margin, margin + 30);
    ctx.globalAlpha = 0.6;
    ctx.fillText("28—31 OCT 2026", w - margin, margin + 70);
    ctx.globalAlpha = 1.0;
    ctx.textAlign = "left";

    // --- 2. SIGNAL ARC ---
    drawSignalArc(ctx, w * 0.7, h * 0.45, w * 0.5, t);

    // --- 3. PHOTO AREA ---
    const photoW = w - (margin * 2) - 100;
    const photoH = 850;
    const photoX = margin + 50; 
    const photoY = 220;

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

    drawDoubleLineFrame(ctx, photoX, photoY, photoW, photoH, t);

    // Goa Seal (Overlapping bottom right of photo)
    drawGoaSeal(ctx, photoX + photoW, photoY + photoH, 110, t);

    // --- 4. TYPOGRAPHY (NAME) ---
    const textStartY = photoY + photoH + 80;
    ctx.fillStyle = t.text;
    ctx.font = `900 130px Playfair Display, serif`;
    const name = builderData.name || "YOUR NAME";
    
    // Use the wrapText utility
    const nextY = wrapText(ctx, name.toUpperCase(), margin, textStartY, w - margin*2, 140);

    // --- 5. BUILDER CLASS STAMP ---
    const classY = nextY + 40;
    ctx.fillStyle = t.accent1;
    const classText = `BUILDER CLASS // ${builderData.builderClass || "GENESIS BUILDER"}`;
    ctx.font = `bold 24px Space Mono, monospace`;
    const classWidth = ctx.measureText(classText).width + 60;
    ctx.fillRect(margin, classY, classWidth, 50);
    
    ctx.fillStyle = theme === "goa" ? "#022b13" : "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(classText.toUpperCase(), margin + classWidth/2, classY + 25);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // --- 6. STACK ---
    const stackY = classY + 90;
    ctx.fillStyle = t.text;
    ctx.font = `bold 32px Space Mono, monospace`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(builderData.stack || "ROLE / STACK / DOMAIN", margin, stackY, w - margin*2);
    ctx.globalAlpha = 1.0;

    // --- 7. TECHNICAL METADATA ---
    const metadataY = stackY + 80;
    ctx.fillStyle = t.accent2;
    ctx.font = `bold 16px Space Mono, monospace`;
    ctx.fillText("BUILDER SIGNAL", margin, metadataY);
    ctx.fillStyle = t.text;
    ctx.font = `bold 36px Space Mono, monospace`;
    ctx.fillText("HHG / 026 / A7F", margin, metadataY + 40);
    
    drawBarcode(ctx, margin + 400, metadataY, 300, 50, t.text);

    // --- 8. FOOTER ---
    const footerY = h - 60;
    // Divider
    ctx.strokeStyle = t.text;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(margin, footerY - 40);
    ctx.lineTo(w - margin, footerY - 40);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = t.accent1;
    ctx.font = `bold 22px Space Mono, monospace`;
    ctx.fillText("#FrameInGoa", margin, footerY);
    
    ctx.fillStyle = t.text;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.5;
    ctx.fillText("BUILD · SHIP · LAUNCH", w / 2, footerY);
    ctx.globalAlpha = 1.0;

    ctx.textAlign = "right";
    ctx.fillText("HHGOA.COM", w - margin, footerY);
    ctx.textAlign = "left";
  };

  // ═══════════════════════════════════════════
  // LANDSCAPE LAYOUT
  // ═══════════════════════════════════════════
  const drawBuilderIDLandscape = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, w: number, h: number, t: any) => {
    // 2000 x 1600
    const margin = 100;

    // --- 1. HEADER ---
    ctx.fillStyle = t.text;
    ctx.font = `bold 42px Playfair Display, serif`;
    ctx.textAlign = "left";
    ctx.fillText("HH GOA 2026", margin, margin + 42);
    
    ctx.fillStyle = t.text;
    ctx.textAlign = "right";
    ctx.font = `bold 26px Space Mono, monospace`;
    ctx.fillText("GOA, INDIA", w - margin, margin + 30);
    ctx.globalAlpha = 0.6;
    ctx.fillText("28—31 OCT 2026", w - margin, margin + 70);
    ctx.globalAlpha = 1.0;
    ctx.textAlign = "left";

    // --- 2. SIGNAL ARC ---
    drawSignalArc(ctx, w * 0.4, h * 0.6, w * 0.4, t);

    // --- 3. PHOTO AREA (LEFT SIDE) ---
    const photoW = 750;
    const photoH = 1100;
    const photoX = margin;
    const photoY = 220;

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

    drawDoubleLineFrame(ctx, photoX, photoY, photoW, photoH, t);
    drawGoaSeal(ctx, photoX + photoW, photoY, 120, t);

    // --- 4. RIGHT SIDE TYPOGRAPHY ---
    const textX = photoX + photoW + 120;
    const maxTextW = w - textX - margin;

    ctx.fillStyle = t.accent2;
    ctx.font = `bold 22px Space Mono, monospace`;
    ctx.fillText("BUILDER PASSPORT //", textX, photoY + 20);

    // Name
    const textStartY = photoY + 90;
    ctx.fillStyle = t.text;
    ctx.font = `900 130px Playfair Display, serif`;
    const name = builderData.name || "YOUR NAME";
    const nextY = wrapText(ctx, name.toUpperCase(), textX, textStartY, maxTextW, 140);

    // Class Stamp
    const classY = nextY + 60;
    ctx.fillStyle = t.accent1;
    const classText = `BUILDER CLASS // ${builderData.builderClass || "GENESIS BUILDER"}`;
    ctx.font = `bold 24px Space Mono, monospace`;
    const classWidth = ctx.measureText(classText).width + 60;
    ctx.fillRect(textX, classY, classWidth, 50);
    
    ctx.fillStyle = theme === "goa" ? "#022b13" : "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(classText.toUpperCase(), textX + classWidth/2, classY + 25);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Stack
    const stackY = classY + 90;
    ctx.fillStyle = t.text;
    ctx.font = `bold 32px Space Mono, monospace`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(builderData.stack || "ROLE / STACK / DOMAIN", textX, stackY, maxTextW);
    ctx.globalAlpha = 1.0;

    // Technical Metadata
    const metadataY = photoY + photoH - 60;
    ctx.fillStyle = t.accent2;
    ctx.font = `bold 16px Space Mono, monospace`;
    ctx.fillText("BUILDER SIGNAL", textX, metadataY - 40);
    ctx.fillStyle = t.text;
    ctx.font = `bold 36px Space Mono, monospace`;
    ctx.fillText("HHG / 026 / A7F", textX, metadataY);
    
    drawBarcode(ctx, textX + 350, metadataY - 40, 300, 50, t.text);

    // --- 5. FOOTER ---
    const footerY = h - 60;
    ctx.strokeStyle = t.text;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(margin, footerY - 40);
    ctx.lineTo(w - margin, footerY - 40);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = t.accent1;
    ctx.font = `bold 22px Space Mono, monospace`;
    ctx.fillText("#FrameInGoa", margin, footerY);
    
    ctx.fillStyle = t.text;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.5;
    ctx.fillText("BUILD · SHIP · LAUNCH", w / 2, footerY);
    ctx.globalAlpha = 1.0;

    ctx.textAlign = "right";
    ctx.fillText("HHGOA.COM", w - margin, footerY);
    ctx.textAlign = "left";
  };


  // ═══════════════════════════════════════════
  // OTHER FORMATS
  // ═══════════════════════════════════════════
  const drawPFP = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, w: number, h: number, t: any) => {
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
    
    drawGoaSeal(ctx, photoX, photoY, h * 0.12, t);

    const textX = photoX + photoW + w * 0.05;
    const maxTextW = w - textX - marginX;
    
    ctx.fillStyle = t.accent1;
    ctx.font = `bold ${w * 0.02}px Space Mono, monospace`;
    ctx.fillText("ONE CREW // ONE SIGNAL", textX, photoY + h * 0.1, maxTextW);

    ctx.fillStyle = t.text;
    ctx.font = `900 ${w * 0.06}px Playfair Display, serif`;
    const name = builderData.name || "TEAM NAME";
    ctx.textBaseline = "top";
    wrapText(ctx, name.toUpperCase(), textX, photoY + h * 0.18, maxTextW, w * 0.07);
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = t.accent2;
    ctx.font = `bold ${w * 0.025}px Space Mono, monospace`;
    ctx.fillText(builderData.stack || "DOMAINS / HACKS", textX, photoY + h * 0.45, maxTextW);

    ctx.strokeStyle = t.text;
    ctx.strokeRect(textX, photoY + h * 0.6, w * 0.1, h * 0.15);
    ctx.fillStyle = t.text;
    ctx.font = `bold ${w * 0.015}px Space Mono, monospace`;
    ctx.fillText("HHG 26", textX + w * 0.02, photoY + h * 0.67);
    ctx.fillText("GOA", textX + w * 0.02, photoY + h * 0.72);

    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.5;
    ctx.font = `bold ${w * 0.02}px Space Mono, monospace`;
    ctx.fillText("#FrameInGoa", textX, photoY + photoH);
    ctx.globalAlpha = 1.0;
  };

  // ═══════════════════════════════════════════
  // PROCEDURAL TEXTURES & GRIDS
  // ═══════════════════════════════════════════
  const drawNoise = (ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) => {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = (Math.random() - 0.5) * (intensity * 255);
      data[i] += val;
      data[i + 1] += val;
      data[i + 2] += val;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const drawEditorialGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const step = 200;
    
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
    ctx.lineWidth = 1;
    for (let x = step; x < w; x += step) {
      for (let y = step; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(x - 10, y);
        ctx.lineTo(x + 10, y);
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y + 10);
        ctx.stroke();
      }
    }
  };

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
