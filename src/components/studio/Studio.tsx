"use client";

import React, { useState, useEffect } from "react";
import { Uploader } from "./Uploader";
import { Editor } from "../editor/Editor";
import { BuilderData } from "../frame/FrameCanvas";
import { generateBuilderClass } from "@/lib/builder-class/generator";
import { Sparkles, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

type Format = "pfp" | "id" | "team";
type Theme = "goa" | "night" | "sand";
type Treatment = "natural" | "cel" | "riso";

export function Studio() {
  const [activeFormat, setActiveFormat] = useState<Format>("id");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<Theme>("goa");
  const [treatment, setTreatment] = useState<Treatment>("natural");

  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [builderClass, setBuilderClass] = useState("");
  const [isClassEdited, setIsClassEdited] = useState(false);

  useEffect(() => {
    if (!isClassEdited && stack) {
      const generated = generateBuilderClass(stack);
      if (generated) setBuilderClass(generated);
    }
  }, [stack, isClassEdited]);

  const builderData: BuilderData = {
    name: name.toUpperCase(),
    stack: stack.toUpperCase(),
    builderClass: builderClass.toUpperCase(),
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `HHGOA-Builder-${name || "ID"}.png`;
    a.click();
  };

  const handleShare = async () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const caption = `Built my HH Goa 2026 Builder ID.\n\n${builderClass} · ${stack}\n\n#FrameInGoa`;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Canvas to Blob failed");
        const file = new File([blob], `HHGOA-Builder-${name || "ID"}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "HH GOA 2026 Builder ID",
            text: caption,
            files: [file],
          });
        } else {
          await navigator.clipboard.write([
            new ClipboardItem({ [file.type]: blob })
          ]);
          alert("Image copied to clipboard! Paste it into X (Twitter).");
          handleDownload();
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`, "_blank");
        }
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong trying to share. We'll download the image instead.");
      handleDownload();
    }
  };

  const formats: { id: Format; label: string }[] = [
    { id: "pfp", label: "PFP Frame" },
    { id: "id", label: "Builder ID" },
    { id: "team", label: "Team Frame" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 relative z-20">
      
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-4 mb-16 text-center md:text-left"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-hh-pink)] font-bold">The Studio</p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Take the frame.
        </h2>
        <p className="max-w-xl font-sans text-sm md:text-base leading-relaxed text-white/60 mx-auto md:mx-0 font-light">
          JPG, PNG, WebP and HEIC at any shape. Everything is drawn instantly on your device via HTML Canvas. Nothing is uploaded.
        </p>
      </motion.header>

      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        
        {/* LEFT: Live Preview (Sticky) */}
        <section className="order-1 lg:order-1 lg:sticky lg:top-12 w-full lg:w-[45%] flex flex-col">
          <div className="relative group">
            {/* Ambient Glow behind canvas */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-hh-yellow)] to-[var(--color-hh-pink)] opacity-20 blur-2xl rounded-[3rem] transition-opacity group-hover:opacity-30" />
            
            <div className="relative glass-panel p-4 md:p-6 rounded-[2.5rem] overflow-hidden">
               <Editor 
                  imageUrl={imageUrl}
                  format={activeFormat}
                  theme={theme}
                  treatment={treatment}
                  builderData={builderData}
                />
            </div>
          </div>
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
             Drag to pan · Scroll to zoom
          </p>
        </section>

        {/* RIGHT: Controls */}
        <aside className="order-2 lg:order-2 w-full lg:w-[55%] flex flex-col gap-12 pb-24">
          
          {/* Format Section (Segmented Control) */}
          <section>
            <div className="mb-6 flex items-baseline justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif text-2xl text-white">Format</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-hh-yellow)]">01</span>
            </div>
            
            <div className="glass-panel p-1.5 rounded-full flex relative overflow-hidden">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFormat(f.id)}
                  className={`relative flex-1 py-3 text-center transition-colors z-10 ${
                    activeFormat === f.id ? "text-[#022b13]" : "text-white/60 hover:text-white"
                  }`}
                >
                  {activeFormat === f.id && (
                    <motion.div
                      layoutId="activeFormat"
                      className="absolute inset-0 bg-[var(--color-hh-yellow)] rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20 font-mono text-[10px] font-bold uppercase tracking-[0.1em]">{f.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Photo Section */}
          <section>
            <div className="mb-6 flex items-baseline justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif text-2xl text-white">Photo</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-hh-yellow)]">02</span>
            </div>
            
            {!imageUrl ? (
              <div className="w-full">
                <Uploader onImageSelected={setImageUrl} />
              </div>
            ) : (
              <div className="glass-panel p-4 rounded-2xl flex items-center justify-between group transition-all hover:bg-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-hh-yellow)]/20 flex items-center justify-center">
                    <Sparkles size={16} className="text-[var(--color-hh-yellow)]" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-white">Photo Loaded</div>
                    <div className="font-sans text-[10px] text-white/40">Ready for processing</div>
                  </div>
                </div>
                <button 
                  onClick={() => setImageUrl(null)} 
                  className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-hh-pink)] hover:text-white transition-colors px-4 py-2 border border-[var(--color-hh-pink)]/30 rounded-full hover:bg-[var(--color-hh-pink)]"
                >
                  Change
                </button>
              </div>
            )}
          </section>

          {/* Details Section */}
          {activeFormat !== "pfp" && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div className="mb-6 flex items-baseline justify-between border-b border-white/10 pb-3">
                <h2 className="font-serif text-2xl text-white">Identity</h2>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-hh-yellow)]">03</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-2">Name</label>
                  <input 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full glass-input rounded-xl h-14 px-5 text-sm font-sans"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-2">Stack / Role</label>
                  <input 
                    placeholder="e.g. Full Stack / AI" 
                    value={stack} 
                    onChange={(e) => setStack(e.target.value)} 
                    className="w-full glass-input rounded-xl h-14 px-5 text-sm font-sans"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50">Builder Title</label>
                    <button 
                      className="inline-flex items-center gap-1.5 text-[10px] text-[var(--color-hh-yellow)] hover:text-white transition-colors font-mono uppercase tracking-wider group"
                      onClick={() => {
                        setIsClassEdited(false);
                        setBuilderClass(generateBuilderClass(stack));
                      }}
                    >
                      <Sparkles size={12} className="group-hover:rotate-12 transition-transform" /> Auto-generate
                    </button>
                  </div>
                  <input 
                    placeholder="Systems Alchemist" 
                    value={builderClass} 
                    onChange={(e) => {
                      setBuilderClass(e.target.value);
                      setIsClassEdited(true);
                    }} 
                    className="w-full glass-input rounded-xl h-14 px-5 text-sm font-sans font-bold text-[var(--color-hh-pink)]"
                    spellCheck={false}
                  />
                </div>
              </div>
            </motion.section>
          )}

          {/* Styling Section */}
          <section>
            <div className="mb-6 flex items-baseline justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif text-2xl text-white">Finish</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-hh-yellow)]">04</span>
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-3">Photo Treatment</span>
                <div className="glass-panel p-1.5 rounded-full flex relative overflow-hidden">
                  {(["natural", "cel", "riso"] as Treatment[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTreatment(t)}
                      className={`relative flex-1 py-2.5 text-center transition-colors z-10 ${
                        treatment === t ? "text-[#022b13]" : "text-white/60 hover:text-white"
                      }`}
                    >
                      {treatment === t && (
                        <motion.div
                          layoutId="activeTreatment"
                          className="absolute inset-0 bg-white rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-20 font-mono text-[10px] font-bold uppercase tracking-[0.1em]">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-3">Color Theme</span>
                <div className="flex gap-4">
                  {(["goa", "night", "sand"] as Theme[]).map((thm) => (
                    <button
                      key={thm}
                      onClick={() => setTheme(thm)}
                      className={`flex-1 rounded-2xl p-2 transition-all duration-300 ${
                        theme === thm ? "glass-panel ring-2 ring-[var(--color-hh-yellow)]" : "bg-white/5 border border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span 
                        className="block h-12 w-full rounded-xl shadow-inner mb-3" 
                        style={{
                          background: thm === "goa" ? "linear-gradient(135deg, var(--color-hh-yellow), #FF0080)" 
                                    : thm === "night" ? "linear-gradient(135deg, #1f5c38, #0B6839)" 
                                    : "linear-gradient(135deg, #ece5d3, #d4c8b3)"
                        }}
                      />
                      <span className={`block font-mono text-[10px] uppercase tracking-[0.1em] ${theme === thm ? "text-[var(--color-hh-yellow)] font-bold" : "text-white/50"}`}>{thm}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Action Bar (Sticky on Mobile, Static on Desktop) */}
          <div className="fixed inset-x-4 bottom-4 z-50 flex gap-3 lg:static lg:inset-auto lg:p-0">
            <button 
              className="flex-1 h-14 bg-[var(--color-hh-yellow)] text-[#022b13] rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-xl hover:shadow-[0_0_30px_rgba(245,200,66,0.6)] disabled:opacity-50 disabled:pointer-events-none" 
              onClick={handleDownload}
              disabled={!imageUrl}
            >
              <Download size={16} /> Download
            </button>
            <button 
              className="flex-1 h-14 glass-panel rounded-full font-bold uppercase tracking-widest text-[10px] text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-colors shadow-xl disabled:opacity-50 disabled:pointer-events-none" 
              onClick={handleShare}
              disabled={!imageUrl}
            >
              <Share2 size={16} /> Share
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}
