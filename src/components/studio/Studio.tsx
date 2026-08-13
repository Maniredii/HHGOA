"use client";

import React, { useState, useEffect } from "react";
import { Uploader } from "./Uploader";
import { Editor } from "../editor/Editor";
import { BuilderData } from "../frame/FrameCanvas";
import { generateBuilderClass } from "@/lib/builder-class/generator";
import { Sparkles, Download, Share2 } from "lucide-react";

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
      
      <header className="flex flex-col gap-4 mb-16 text-center md:text-left">
        <p className="font-mono text-[10px] bg-[var(--color-hh-pink)] text-white px-2 py-1 inline-block border-2 border-black uppercase tracking-[0.2em] font-bold self-center md:self-start shadow-[2px_2px_0px_0px_#f5c842]">The Studio</p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Take the frame.
        </h2>
        <p className="max-w-xl font-sans text-sm md:text-base leading-relaxed text-white/80 mx-auto md:mx-0 font-bold">
          JPG, PNG, WebP and HEIC at any shape. Everything is drawn instantly on your device via HTML Canvas. Nothing is uploaded.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        
        {/* LEFT: Live Preview (Sticky) */}
        <section className="order-1 lg:order-1 lg:sticky lg:top-12 w-full lg:w-[45%] flex flex-col">
          <div className="bg-[var(--color-hh-cream)] p-4 md:p-6 rounded-none border-4 border-black shadow-[16px_16px_0px_0px_#f5c842]">
             <Editor 
                imageUrl={imageUrl}
                format={activeFormat}
                theme={theme}
                treatment={treatment}
                builderData={builderData}
              />
          </div>
          <div className="mt-8 font-mono text-[10px] bg-white text-black border-2 border-black px-4 py-2 uppercase tracking-widest text-center shadow-[4px_4px_0px_0px_#FF0080] font-bold">
             Drag to pan · Scroll to zoom
          </div>
        </section>

        {/* RIGHT: Controls */}
        <aside className="order-2 lg:order-2 w-full lg:w-[55%] flex flex-col gap-12 pb-24">
          
          {/* Format Section */}
          <section className="bg-[var(--color-hh-yellow)] p-8 border-4 border-black shadow-[8px_8px_0px_0px_black]">
            <div className="mb-6 flex items-baseline justify-between border-b-4 border-black pb-3">
              <h2 className="font-serif text-3xl text-black font-bold">Format</h2>
              <span className="font-mono text-xl uppercase tracking-widest text-black font-bold">01</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFormat(f.id)}
                  className={`flex-1 py-4 text-center border-2 border-black font-mono text-xs font-bold uppercase tracking-[0.1em] transition-transform active:translate-y-1 ${
                    activeFormat === f.id 
                      ? "bg-black text-[var(--color-hh-yellow)] shadow-none translate-y-1" 
                      : "bg-white text-black shadow-[4px_4px_0px_0px_black] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_black]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {/* Photo Section */}
          <section className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#FF0080]">
            <div className="mb-6 flex items-baseline justify-between border-b-4 border-black pb-3">
              <h2 className="font-serif text-3xl text-black font-bold">Photo</h2>
              <span className="font-mono text-xl uppercase tracking-widest text-[#FF0080] font-bold">02</span>
            </div>
            
            {!imageUrl ? (
              <div className="w-full">
                <Uploader onImageSelected={setImageUrl} />
              </div>
            ) : (
              <div className="bg-[var(--color-hh-cream)] p-6 border-2 border-black flex items-center justify-between shadow-[4px_4px_0px_0px_black]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#022b13] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#f5c842]">
                    <Sparkles size={20} className="text-[var(--color-hh-yellow)]" />
                  </div>
                  <div>
                    <div className="font-mono text-sm text-black font-bold uppercase">Photo Loaded</div>
                    <div className="font-sans text-xs text-black/60 font-bold">Ready for processing</div>
                  </div>
                </div>
                <button 
                  onClick={() => setImageUrl(null)} 
                  className="font-mono text-xs uppercase tracking-widest text-white bg-black border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_#FF0080] hover:-translate-y-1 transition-transform active:translate-y-1 active:shadow-none font-bold"
                >
                  Change
                </button>
              </div>
            )}
          </section>

          {/* Details Section */}
          {activeFormat !== "pfp" && (
            <section className="bg-[var(--color-hh-cream)] p-8 border-4 border-black shadow-[8px_8px_0px_0px_#022b13]">
              <div className="mb-6 flex items-baseline justify-between border-b-4 border-black pb-3">
                <h2 className="font-serif text-3xl text-black font-bold">Identity</h2>
                <span className="font-mono text-xl uppercase tracking-widest text-[#022b13] font-bold">03</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-2">Name</label>
                  <input 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full neo-input h-14 px-5 text-sm font-sans font-bold bg-white"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-2">Stack / Role</label>
                  <input 
                    placeholder="e.g. Full Stack / AI" 
                    value={stack} 
                    onChange={(e) => setStack(e.target.value)} 
                    className="w-full neo-input h-14 px-5 text-sm font-sans font-bold bg-white"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold">Builder Title</label>
                    <button 
                      className="inline-flex items-center gap-1.5 text-[10px] text-white bg-[#022b13] px-2 py-1 border-2 border-black hover:-translate-y-0.5 transition-transform font-mono uppercase tracking-wider font-bold shadow-[2px_2px_0px_0px_#FF0080]"
                      onClick={() => {
                        setIsClassEdited(false);
                        setBuilderClass(generateBuilderClass(stack));
                      }}
                    >
                      <Sparkles size={12} /> Auto-generate
                    </button>
                  </div>
                  <input 
                    placeholder="Systems Alchemist" 
                    value={builderClass} 
                    onChange={(e) => {
                      setBuilderClass(e.target.value);
                      setIsClassEdited(true);
                    }} 
                    className="w-full neo-input h-14 px-5 text-sm font-sans font-bold text-[var(--color-hh-pink)] bg-white"
                    spellCheck={false}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Styling Section */}
          <section className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_#022b13]">
            <div className="mb-6 flex items-baseline justify-between border-b-4 border-black pb-3">
              <h2 className="font-serif text-3xl text-black font-bold">Finish</h2>
              <span className="font-mono text-xl uppercase tracking-widest text-[#022b13] font-bold">04</span>
            </div>
            
            <div className="space-y-8">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-3">Photo Treatment</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  {(["natural", "cel", "riso"] as Treatment[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTreatment(t)}
                      className={`flex-1 py-3 text-center border-2 border-black font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-transform active:translate-y-1 ${
                        treatment === t
                          ? "bg-[var(--color-hh-pink)] text-white shadow-none translate-y-1" 
                          : "bg-[var(--color-hh-cream)] text-black shadow-[4px_4px_0px_0px_black] hover:-translate-y-1"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-3">Color Theme</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  {(["goa", "night", "sand"] as Theme[]).map((thm) => (
                    <button
                      key={thm}
                      onClick={() => setTheme(thm)}
                      className={`flex-1 p-2 transition-transform border-2 border-black active:translate-y-1 ${
                        theme === thm ? "bg-[var(--color-hh-yellow)] shadow-none translate-y-1" : "bg-white shadow-[4px_4px_0px_0px_black] hover:-translate-y-1"
                      }`}
                    >
                      <span 
                        className="block h-12 w-full border-2 border-black mb-3" 
                        style={{
                          background: thm === "goa" ? "linear-gradient(135deg, var(--color-hh-yellow), #FF0080)" 
                                    : thm === "night" ? "linear-gradient(135deg, #1f5c38, #0B6839)" 
                                    : "linear-gradient(135deg, #ece5d3, #d4c8b3)"
                        }}
                      />
                      <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-black font-bold">{thm}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Action Bar */}
          <div className="fixed inset-x-4 bottom-4 z-50 flex gap-4 lg:static lg:inset-auto lg:p-0">
            <button 
              className="neo-button flex-1 h-16 bg-[var(--color-hh-yellow)] text-black text-xs sm:text-sm shadow-[4px_4px_0px_0px_#FF0080] hover:shadow-[2px_2px_0px_0px_#FF0080] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none" 
              onClick={handleDownload}
              disabled={!imageUrl}
            >
              <Download size={18} /> Download
            </button>
            <button 
              className="neo-button flex-1 h-16 bg-[#022b13] text-white text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none" 
              onClick={handleShare}
              disabled={!imageUrl}
            >
              <Share2 size={18} /> Share
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}
