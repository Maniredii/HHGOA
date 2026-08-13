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

interface FrameCanvasProps {
  imageUrl: string | null;
  format: "pfp" | "id" | "team";
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

    // Load image
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        draw(ctx, img, canvas.width, canvas.height);
      };
      img.src = imageUrl;
    } else {
      draw(ctx, null, canvas.width, canvas.height);
    }

  }, [imageUrl, format, theme, treatment, builderData, transform, width, height]);

  const draw = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    w: number,
    h: number
  ) => {
    // 1. Clear
    ctx.clearRect(0, 0, w, h);

    // 2. Background based on theme
    if (theme === "goa") {
      ctx.fillStyle = "#f4f0e6"; // cream
    } else if (theme === "night") {
      ctx.fillStyle = "#0b2d18"; // green
    } else {
      ctx.fillStyle = "#ece5d3"; // sand
    }
    ctx.fillRect(0, 0, w, h);

    // 3. Draw image if exists
    if (img) {
      ctx.save();
      // Define clip path based on format
      if (format === "pfp") {
        // Square in the middle
        const size = Math.min(w, h) * 0.8;
        const x = (w - size) / 2;
        const y = (h - size) / 2;
        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.clip();
        
        // Draw image with transform
        const cx = x + size/2 + transform.x;
        const cy = y + size/2 + transform.y;
        
        // Scale to fit cover by default
        const scaleCover = Math.max(size / img.width, size / img.height);
        const finalScale = scaleCover * transform.scale;
        
        ctx.translate(cx, cy);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } else {
        // Builder ID / Team standard frame
        const margin = 40;
        const imgHeight = h * 0.55;
        ctx.beginPath();
        ctx.rect(margin, margin, w - margin * 2, imgHeight);
        ctx.clip();

        const rectW = w - margin * 2;
        const rectH = imgHeight;
        
        const cx = margin + rectW/2 + transform.x;
        const cy = margin + rectH/2 + transform.y;
        
        const scaleCover = Math.max(rectW / img.width, rectH / img.height);
        const finalScale = scaleCover * transform.scale;
        
        ctx.translate(cx, cy);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      }
      ctx.restore();

      // Apply treatment (placeholder for actual canvas filter manipulation)
      if (treatment === "cel") {
        // pseudo-cel shading can be done with high contrast and posterization
        // Using globalCompositeOperation or filters
        ctx.filter = "contrast(1.5) saturate(1.2)";
        // ... (Would re-draw or apply ImageData manipulation)
        ctx.filter = "none";
      } else if (treatment === "riso") {
        // dual tone or halftone
      }
    } else {
      // Placeholder
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      if (format === "pfp") {
        const size = Math.min(w, h) * 0.8;
        ctx.fillRect((w - size) / 2, (h - size) / 2, size, size);
      } else {
        const margin = 40;
        ctx.fillRect(margin, margin, w - margin * 2, h * 0.55);
      }
    }

    // 4. Draw Typography / Frame UI
    const textColor = theme === "night" ? "#f4f0e6" : "#09090b";
    const accentColor = "#fde047"; // yellow
    
    ctx.fillStyle = textColor;
    
    if (format === "id") {
      const margin = 40;
      const textStartY = margin + h * 0.55 + 50;
      
      ctx.font = "bold 48px Inter, sans-serif";
      ctx.fillText(builderData.name || "YOUR NAME", margin, textStartY);
      
      ctx.font = "24px Space Mono, monospace";
      ctx.fillStyle = theme === "night" ? "#d946ef" : "#1a4f2e"; // pink or secondary green
      ctx.fillText(builderData.builderClass || "BUILDER CLASS", margin, textStartY + 40);
      
      ctx.fillStyle = textColor;
      ctx.font = "20px Space Mono, monospace";
      ctx.globalAlpha = 0.7;
      ctx.fillText(builderData.stack || "STACK", margin, textStartY + 75);
      
      // Metadata
      ctx.globalAlpha = 0.4;
      ctx.font = "14px Space Mono, monospace";
      ctx.fillText("HH GOA 2026", margin, h - margin - 20);
      ctx.fillText("#FrameInGoa", w - margin - 100, h - margin - 20);
      ctx.globalAlpha = 1.0;
    } else if (format === "pfp") {
      // PFP might just have a strong border or small metadata
      const margin = 20;
      ctx.strokeStyle = theme === "night" ? "#d946ef" : "#1a4f2e";
      ctx.lineWidth = 10;
      const size = Math.min(w, h) * 0.8;
      const x = (w - size) / 2;
      const y = (h - size) / 2;
      ctx.strokeRect(x, y, size, size);
      
      ctx.font = "bold 24px Space Mono, monospace";
      ctx.fillText("HH GOA", x, y - 20);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="max-w-full h-auto shadow-xl"
      style={{
        aspectRatio: `${width}/${height}`,
        width: "100%",
        backgroundColor: "transparent",
      }}
    />
  );
}
