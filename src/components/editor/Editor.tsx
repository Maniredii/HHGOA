"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FrameCanvas, BuilderData, TransformState } from "../frame/FrameCanvas";
import { RotateCcw } from "lucide-react";

interface EditorProps {
  imageUrl: string | null;
  format: "pfp" | "id" | "team" | "vibes" | "sunset" | "postcard" | "adventure";
  theme: "goa" | "night" | "sand";
  treatment: "natural" | "cel" | "riso";
  builderData: BuilderData;
  orientation?: "portrait" | "landscape";
}

export function Editor({
  imageUrl,
  format,
  theme,
  treatment,
  builderData,
  orientation = "portrait",
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
  }, [imageUrl, format, orientation]);

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

  // Dimensions based on format + orientation
  let width = 600;
  let height = 800;

  if (format === "pfp") {
    width = 600;
    height = 600;
  } else if (orientation === "landscape") {
    width = 800;
    height = 600;
  }

  return (
    <div className="relative group w-full flex flex-col items-center">
      <motion.div
        ref={containerRef}
        className={`relative w-full max-w-[450px] overflow-hidden rounded-lg ${imageUrl ? 'cursor-move' : ''} touch-none`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
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
          <div className="absolute inset-0 pointer-events-none border border-white/5 group-hover:border-[var(--color-hh-pink)]/40 transition-colors rounded-lg" />
        )}
      </motion.div>

      {imageUrl && (
        <motion.div
          className="mt-5 flex flex-col sm:flex-row w-full justify-between gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button
            className="flex-1 bg-white/10 backdrop-blur-sm text-white/80 border border-white/10 h-11 flex items-center justify-center text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg hover:bg-white/20 transition-colors"
            onClick={resetTransform}
          >
            <RotateCcw size={13} className="mr-2" /> Reset View
          </button>

          <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 flex items-center px-4 h-11 rounded-lg">
            <span className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-widest mr-3">Zoom</span>
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
        </motion.div>
      )}
    </div>
  );
}
