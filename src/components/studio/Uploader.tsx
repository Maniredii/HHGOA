"use client";

import React, { useRef, useState } from "react";
import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UploaderProps {
  onImageSelected: (imageUrl: string) => void;
}

export function Uploader({ onImageSelected }: UploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    onImageSelected(url);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed p-8 transition-colors ${
        isDragging
          ? "border-[var(--color-hh-pink)] bg-[var(--color-hh-pink)]/10"
          : "border-black/20 hover:border-black/40 bg-white/50"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp, image/heic"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="mb-4 text-black/50">
        <Upload size={32} />
      </div>
      <p className="text-center font-bold uppercase tracking-widest text-sm mb-2">
        Upload Photo
      </p>
      <p className="text-center text-xs font-mono text-black/60 mb-6">
        Drag & drop or click to browse
      </p>
      <div className="flex gap-4">
        <Button onClick={() => fileInputRef.current?.click()} variant="primary">
          Select File
        </Button>
        {/* On mobile devices, camera capture is useful */}
        <Button
          variant="outline"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.setAttribute("capture", "user");
              fileInputRef.current.click();
              fileInputRef.current.removeAttribute("capture");
            }
          }}
          className="md:hidden"
        >
          <Camera size={18} className="mr-2" /> Selfie
        </Button>
      </div>
    </div>
  );
}
