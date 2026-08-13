"use client";

import React, { useRef, useState, useEffect } from "react";
import { FrameCanvas, BuilderData, TransformState } from "../frame/FrameCanvas";
import { Maximize2, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";

interface EditorProps {
  imageUrl: string | null;
  format: "pfp" | "id" | "team";
  theme: "goa" | "night" | "sand";
  treatment: "natural" | "cel" | "riso";
  builderData: BuilderData;
}

export function Editor({
  imageUrl,
  format,
  theme,
  treatment,
  builderData,
}: EditorProps) {
  const [transform, setTransform] = useState<TransformState>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset transform when image or format changes
  useEffect(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, [imageUrl, format]);

  // Handle Drag/Pan
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!imageUrl) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    // @ts-ignore
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    // @ts-ignore
    e.target.releasePointerCapture(e.pointerId);
  };

  // Handle Wheel/Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!imageUrl) return;
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.1, Math.min(prev.scale + delta, 5)),
    }));
  };

  const resetTransform = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // Dimensions based on format
  const width = 600;
  const height = format === "pfp" ? 600 : 800;

  return (
    <div className="relative group w-full flex flex-col items-center">
      <div
        ref={containerRef}
        className={`relative w-full max-w-[450px] overflow-hidden ${imageUrl ? 'cursor-move' : ''} touch-none`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <FrameCanvas
          imageUrl={imageUrl}
          format={format}
          theme={theme}
          treatment={treatment}
          builderData={builderData}
          transform={transform}
          width={width}
          height={height}
        />

        {imageUrl && (
          <div className="absolute inset-0 pointer-events-none border border-black/10 group-hover:border-[var(--color-hh-pink)] transition-colors" />
        )}
      </div>

      {imageUrl && (
        <div className="mt-6 flex flex-col sm:flex-row w-full justify-between gap-4">
          <button 
            className="flex-1 neo-button bg-black text-white h-12 flex items-center justify-center text-[10px]"
            onClick={resetTransform}
          >
            <RotateCcw size={14} className="mr-2" /> Reset View
          </button>
          
          <div className="flex-1 bg-white border-2 border-black flex items-center px-4 shadow-[4px_4px_0px_0px_#f5c842] h-12">
            <span className="text-[10px] font-mono text-black font-bold uppercase tracking-widest mr-4">Zoom</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.05"
              value={transform.scale}
              onChange={(e) =>
                setTransform((prev) => ({
                  ...prev,
                  scale: parseFloat(e.target.value),
                }))
              }
              className="w-full accent-[var(--color-hh-pink)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
