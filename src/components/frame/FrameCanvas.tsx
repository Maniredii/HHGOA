"use client";

import React, { useEffect, useRef } from "react";

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

export type FrameFormat = "pfp" | "id" | "team" | "vibes" | "sunset" | "postcard" | "adventure";

interface FrameCanvasProps {
  imageUrl: string | null;
  format: FrameFormat;
  theme: "goa" | "night" | "sand";
  treatment: "natural" | "cel" | "riso";
  builderData: BuilderData;
  transform: TransformState;
  width?: number;
  height?: number;
}

export function FrameCanvas({
  imageUrl,
  format,
  theme,
  treatment,
  builderData,
  transform,
  width = 600,
  height = 800,
}: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loadImages = async () => {
      let mainImg: HTMLImageElement | null = null;
      let bgImg: HTMLImageElement | null = null;

      const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });

      try {
        if (imageUrl) {
          mainImg = await loadImage(imageUrl);
        }
        if (format === "adventure") {
          bgImg = await loadImage("/adventure-bg.png");
        }
      } catch (err) {
        console.error(err);
      }

      draw(ctx, mainImg, bgImg, canvas.width, canvas.height);
    };

    loadImages();
  }, [imageUrl, format, theme, treatment, builderData, transform, width, height]);

  // --- Helper: draw a full-bleed image ---
  const drawFullBleed = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    const cx = w / 2 + transform.x;
    const cy = h / 2 + transform.y;
    const scaleCover = Math.max(w / img.width, h / img.height);
    const finalScale = scaleCover * transform.scale;
    ctx.translate(cx, cy);
    ctx.scale(finalScale, finalScale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  };

  // --- Helper: draw a rounded rect ---
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  };

  // --- Helper: draw a palm tree silhouette ---
  const drawPalm = (
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    height: number,
    color: string,
    lean: number // -1 left, 1 right
  ) => {
    ctx.fillStyle = color;
    // Trunk
    ctx.beginPath();
    ctx.moveTo(x - 8, baseY);
    ctx.quadraticCurveTo(x + lean * 30, baseY - height * 0.6, x + lean * 15, baseY - height);
    ctx.lineTo(x + lean * 15 + 6, baseY - height);
    ctx.quadraticCurveTo(x + lean * 30 + 6, baseY - height * 0.6, x + 8, baseY);
    ctx.closePath();
    ctx.fill();

    // Fronds
    const topX = x + lean * 15;
    const topY = baseY - height;
    for (let i = -3; i <= 3; i++) {
      const angle = (i * 25 * Math.PI) / 180 + (lean * 10 * Math.PI) / 180;
      const len = 60 + Math.abs(i) * 10;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      const endX = topX + Math.sin(angle) * len;
      const endY = topY - Math.cos(angle) * len * 0.4;
      const cpX = topX + Math.sin(angle) * len * 0.6;
      const cpY = topY - Math.cos(angle) * len * 0.6;
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.lineWidth = 5;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    bgImg: HTMLImageElement | null,
    w: number,
    h: number
  ) => {
    // 1. Clear
    ctx.clearRect(0, 0, w, h);

    // 2. Background based on theme
    if (theme === "goa") {
      ctx.fillStyle = "#f4f0e6";
    } else if (theme === "night") {
      ctx.fillStyle = "#0b2d18";
    } else {
      ctx.fillStyle = "#ece5d3";
    }
    ctx.fillRect(0, 0, w, h);

    // =====================================================
    // 3. Draw image + overlays based on format
    // =====================================================

    if (format === "pfp") {
      // ---------- PFP FRAME ----------
      if (img) {
        ctx.save();
        const size = Math.min(w, h) * 0.8;
        const x = (w - size) / 2;
        const y = (h - size) / 2;
        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.clip();
        const cx = x + size / 2 + transform.x;
        const cy = y + size / 2 + transform.y;
        const scaleCover = Math.max(size / img.width, size / img.height);
        const finalScale = scaleCover * transform.scale;
        ctx.translate(cx, cy);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        const size = Math.min(w, h) * 0.8;
        ctx.fillRect((w - size) / 2, (h - size) / 2, size, size);
      }

      // Overlays
      const textColor = theme === "night" ? "#f4f0e6" : "#09090b";
      const accentStroke = theme === "night" ? "#d946ef" : "#1a4f2e";
      const size = Math.min(w, h) * 0.8;
      const x = (w - size) / 2;
      const y = (h - size) / 2;
      ctx.strokeStyle = accentStroke;
      ctx.lineWidth = 10;
      ctx.strokeRect(x, y, size, size);
      ctx.fillStyle = textColor;
      ctx.font = "bold 24px Space Mono, monospace";
      ctx.fillText("HH GOA", x, y - 20);

    } else if (format === "id") {
      // ---------- BUILDER ID ----------
      if (img) {
        ctx.save();
        const margin = 40;
        const imgHeight = h * 0.55;
        ctx.beginPath();
        ctx.rect(margin, margin, w - margin * 2, imgHeight);
        ctx.clip();
        const rectW = w - margin * 2;
        const rectH = imgHeight;
        const cx = margin + rectW / 2 + transform.x;
        const cy = margin + rectH / 2 + transform.y;
        const scaleCover = Math.max(rectW / img.width, rectH / img.height);
        const finalScale = scaleCover * transform.scale;
        ctx.translate(cx, cy);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        const margin = 40;
        ctx.fillRect(margin, margin, w - margin * 2, h * 0.55);
      }

      // Overlays
      const textColor = theme === "night" ? "#f4f0e6" : "#09090b";
      const margin = 40;
      const textStartY = margin + h * 0.55 + 50;
      ctx.fillStyle = textColor;
      ctx.font = "bold 48px Inter, sans-serif";
      ctx.fillText(builderData.name || "YOUR NAME", margin, textStartY);
      ctx.font = "24px Space Mono, monospace";
      ctx.fillStyle = theme === "night" ? "#d946ef" : "#1a4f2e";
      ctx.fillText(builderData.builderClass || "BUILDER CLASS", margin, textStartY + 40);
      ctx.fillStyle = textColor;
      ctx.font = "20px Space Mono, monospace";
      ctx.globalAlpha = 0.7;
      ctx.fillText(builderData.stack || "STACK", margin, textStartY + 75);
      ctx.globalAlpha = 0.4;
      ctx.font = "14px Space Mono, monospace";
      ctx.fillText("HH GOA 2026", margin, h - margin - 20);
      ctx.fillText("#FrameInGoa", w - margin - 100, h - margin - 20);
      ctx.globalAlpha = 1.0;

    } else if (format === "team") {
      // ---------- TEAM FRAME ----------
      if (img) {
        ctx.save();
        const margin = 40;
        const imgHeight = h * 0.55;
        ctx.beginPath();
        ctx.rect(margin, margin, w - margin * 2, imgHeight);
        ctx.clip();
        const rectW = w - margin * 2;
        const rectH = imgHeight;
        const cx = margin + rectW / 2 + transform.x;
        const cy = margin + rectH / 2 + transform.y;
        const scaleCover = Math.max(rectW / img.width, rectH / img.height);
        const finalScale = scaleCover * transform.scale;
        ctx.translate(cx, cy);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        const margin = 40;
        ctx.fillRect(margin, margin, w - margin * 2, h * 0.55);
      }

      // Team overlays
      const textColor = theme === "night" ? "#f4f0e6" : "#09090b";
      const margin = 40;
      const textStartY = margin + h * 0.55 + 50;
      ctx.fillStyle = textColor;
      ctx.font = "bold 48px Inter, sans-serif";
      ctx.fillText(builderData.name || "TEAM NAME", margin, textStartY);
      ctx.font = "20px Space Mono, monospace";
      ctx.fillStyle = theme === "night" ? "#d946ef" : "#1a4f2e";
      ctx.fillText(builderData.stack || "STACK", margin, textStartY + 40);
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = textColor;
      ctx.font = "14px Space Mono, monospace";
      ctx.fillText("HH GOA 2026 · TEAM", margin, h - margin - 20);
      ctx.fillText("#FrameInGoa", w - margin - 100, h - margin - 20);
      ctx.globalAlpha = 1.0;

    } else if (format === "vibes") {
      // ---------- GOA VIBES ----------
      if (img) {
        drawFullBleed(ctx, img, w, h);
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fillRect(0, 0, w, h);
      }

      // Yellow sun top-right
      ctx.beginPath();
      ctx.arc(w, 0, Math.min(w, h) * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(253, 224, 71, 0.9)";
      ctx.fill();

      // Pink wave bottom
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h - 140);
      ctx.quadraticCurveTo(w / 4, h - 40, w / 2, h - 90);
      ctx.quadraticCurveTo(w * 0.75, h - 140, w, h - 70);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 0, 128, 0.9)";
      ctx.fill();

      // Thick border
      ctx.lineWidth = 16;
      ctx.strokeStyle = "#022b13";
      ctx.strokeRect(8, 8, w - 16, h - 16);

      // Text
      ctx.fillStyle = "#022b13";
      ctx.font = "bold 72px Playfair Display, serif";
      ctx.fillText("GOA VIBES", 30, h - 30);
      ctx.font = "bold 28px Space Mono, monospace";
      ctx.fillText(builderData.name || "YOUR NAME", 30, 55);
      ctx.font = "bold 18px Space Mono, monospace";
      ctx.fillText("#FrameInGoa", 30, h - 110);

    } else if (format === "sunset") {
      // ---------- SUNSET STRIP ----------
      if (img) {
        drawFullBleed(ctx, img, w, h);
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fillRect(0, 0, w, h);
      }

      // Warm sunset gradient overlay at bottom half
      const grad = ctx.createLinearGradient(0, h * 0.4, 0, h);
      grad.addColorStop(0, "rgba(255, 165, 0, 0)");
      grad.addColorStop(0.3, "rgba(255, 100, 50, 0.4)");
      grad.addColorStop(0.6, "rgba(200, 50, 80, 0.6)");
      grad.addColorStop(1, "rgba(60, 10, 40, 0.85)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Golden sun
      ctx.beginPath();
      ctx.arc(w - 100, 100, 80, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 200, 50, 0.9)";
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = "rgba(255, 200, 50, 0.3)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(w - 100 + Math.cos(angle) * 90, 100 + Math.sin(angle) * 90);
        ctx.lineTo(w - 100 + Math.cos(angle) * 140, 100 + Math.sin(angle) * 140);
        ctx.stroke();
      }

      // Palm silhouettes
      drawPalm(ctx, 60, h, h * 0.55, "rgba(10, 30, 20, 0.9)", -0.5);
      drawPalm(ctx, w - 80, h, h * 0.45, "rgba(10, 30, 20, 0.9)", 0.5);

      // Water reflection line
      ctx.strokeStyle = "rgba(255, 200, 100, 0.5)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const y = h * 0.78 + i * 12;
        ctx.beginPath();
        ctx.moveTo(w * 0.3 + Math.random() * 40, y);
        ctx.lineTo(w * 0.7 - Math.random() * 40, y);
        ctx.stroke();
      }

      // Bottom band
      ctx.fillStyle = "rgba(10, 30, 20, 0.95)";
      ctx.fillRect(0, h - 120, w, 120);

      // Text
      ctx.fillStyle = "#fde047";
      ctx.font = "bold 56px Playfair Display, serif";
      ctx.fillText("SUNSET · GOA", 30, h - 55);
      ctx.font = "bold 18px Space Mono, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(builderData.name || "YOUR NAME", 30, h - 20);
      ctx.textAlign = "right";
      ctx.fillText("#FrameInGoa", w - 30, h - 20);
      ctx.textAlign = "left";

      // Top label
      ctx.fillStyle = "#fde047";
      ctx.font = "bold 14px Space Mono, monospace";
      ctx.fillText("HH GOA 2026", 30, 40);

    } else if (format === "postcard") {
      // ---------- BEACH POSTCARD ----------
      ctx.fillStyle = "#f8f0dd";
      ctx.fillRect(0, 0, w, h);

      if (img) {
        ctx.save();
        const pad = 30;
        const imgH = h * 0.55;
        roundRect(ctx, pad, pad, w - pad * 2, imgH, 12);
        ctx.clip();
        const rectW = w - pad * 2;
        const rectH = imgH;
        const cx = pad + rectW / 2 + transform.x;
        const cy = pad + rectH / 2 + transform.y;
        const scaleCover = Math.max(rectW / img.width, rectH / img.height);
        const finalScale = scaleCover * transform.scale;
        ctx.translate(cx, cy);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        const pad = 30;
        roundRect(ctx, pad, pad, w - pad * 2, h * 0.55, 12);
        ctx.fill();
      }

      ctx.setLineDash([12, 6]);
      ctx.strokeStyle = "#c4a882";
      ctx.lineWidth = 4;
      ctx.strokeRect(15, 15, w - 30, h - 30);
      ctx.setLineDash([]);

      ctx.save();
      ctx.translate(w - 100, 60);
      ctx.rotate(0.15);
      ctx.strokeStyle = "#d94070";
      ctx.lineWidth = 3;
      ctx.strokeRect(-35, -25, 70, 50);
      ctx.fillStyle = "#d94070";
      ctx.font = "bold 12px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText("GOA", 0, -5);
      ctx.fillText("2026", 0, 12);
      ctx.textAlign = "left";
      ctx.restore();

      ctx.save();
      ctx.translate(w - 90, h * 0.55 - 20);
      ctx.rotate(-0.1);
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 64, 112, 0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(217, 64, 112, 0.5)";
      ctx.font = "bold 10px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText("ARRIVED", 0, -3);
      ctx.fillText("OCT 2026", 0, 10);
      ctx.textAlign = "left";
      ctx.restore();

      const textY = h * 0.55 + 70;
      ctx.fillStyle = "#3d2c1e";
      ctx.font = "italic 52px Playfair Display, serif";
      ctx.fillText("Greetings from", 35, textY);
      ctx.font = "bold 72px Playfair Display, serif";
      ctx.fillStyle = "#d94070";
      ctx.fillText("GOA!", 35, textY + 70);

      ctx.fillStyle = "#3d2c1e";
      ctx.font = "bold 22px Space Mono, monospace";
      ctx.fillText(builderData.name || "YOUR NAME", 35, h - 70);

      ctx.globalAlpha = 0.5;
      ctx.font = "14px Space Mono, monospace";
      ctx.fillText("#FrameInGoa · HH GOA 2026", 35, h - 40);
      ctx.globalAlpha = 1.0;

    } else if (format === "adventure") {
      // ---------- GOA ADVENTURE ----------
      // Draw background
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#e2d2b5"; // fallback parchment color
        ctx.fillRect(0, 0, w, h);
      }

      // Draw the user photo in an ornate circle in the middle
      if (img) {
        ctx.save();
        const centerX = w / 2;
        const centerY = h * 0.515; // Aligned with the background image
        const radius = w * 0.24;

        // Draw an ornate border behind the photo
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
        ctx.fillStyle = "#2d1b0a"; // dark brown border
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = "#c69b61"; // gold inner border
        ctx.lineWidth = 3;
        ctx.stroke();

        // Clip the photo
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();

        const cx = centerX + transform.x;
        const cy = centerY + transform.y;
        const scaleCover = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
        const finalScale = scaleCover * transform.scale;
        
        ctx.translate(cx, cy);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        ctx.restore();
      }

      // Add the vintage text at the bottom
      ctx.fillStyle = "#2d1b0a"; // dark brown
      ctx.textAlign = "center";
      
      // "NAME" label
      ctx.font = "bold 15px Playfair Display, serif";
      ctx.fillText("NAME:", w / 2, h * 0.77);
      // Name value
      ctx.font = "italic 26px Playfair Display, serif";
      ctx.fillText(builderData.name || "Your Name", w / 2, h * 0.77 + 26);
      
      // "SKILL" label
      ctx.font = "bold 15px Playfair Display, serif";
      ctx.fillText("SKILL:", w / 2, h * 0.84);
      // Skill value
      ctx.font = "italic 20px Playfair Display, serif";
      ctx.fillText(builderData.stack || "Full Stack", w / 2, h * 0.84 + 22);
      
      // "BUILDER TITLE" label
      ctx.font = "bold 15px Playfair Display, serif";
      ctx.fillText("BUILDER TITLE:", w / 2, h * 0.905);
      // Title value
      ctx.font = "italic 20px Playfair Display, serif";
      ctx.fillText(builderData.builderClass || "Genesis Builder", w / 2, h * 0.905 + 22);

      ctx.textAlign = "left"; // reset
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="max-w-full h-auto"
      style={{
        aspectRatio: `${width}/${height}`,
        width: "100%",
        backgroundColor: "transparent",
      }}
    />
  );
}
