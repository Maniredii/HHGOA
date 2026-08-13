"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Uploader } from "./Uploader";
import { Editor } from "../editor/Editor";
import { BuilderData } from "../frame/FrameCanvas";
import { generateBuilderClass } from "@/lib/builder-class/generator";
import { Sparkles, Download, Share2, Monitor, Smartphone } from "lucide-react";

type Format = "pfp" | "id" | "team" | "vibes" | "sunset" | "postcard" | "adventure";
type Theme = "goa" | "night" | "sand";
type Treatment = "natural" | "cel" | "riso";
type Orientation = "portrait" | "landscape";

export function Studio() {
  const [activeFormat, setActiveFormat] = useState<Format>("id");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("portrait");

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

  const formats: { id: Format; label: string; emoji: string }[] = [
    { id: "pfp", label: "PFP Frame", emoji: "◯" },
    { id: "id", label: "Builder ID", emoji: "▧" },
    { id: "team", label: "Team Frame", emoji: "◫" },
    { id: "vibes", label: "Goa Vibes", emoji: "☀" },
    { id: "sunset", label: "Sunset", emoji: "🌅" },
    { id: "postcard", label: "Postcard", emoji: "✉" },
    { id: "adventure", label: "Adventure", emoji: "🗺" }
  ];

  // Only show identity section for formats that need it
  const showIdentity = ["id", "team", "vibes", "sunset", "postcard", "adventure"].includes(activeFormat);

  // Section animation config
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 relative z-20">

      <motion.header
        className="flex flex-col gap-4 mb-16 text-center md:text-left"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-[10px] bg-[var(--color-hh-pink)] text-white px-2 py-1 inline-block border-2 border-black uppercase tracking-[0.2em] font-bold self-center md:self-start shadow-[2px_2px_0px_0px_#f5c842]">The Studio</p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Take the frame.
        </h2>
        <p className="max-w-xl font-sans text-sm md:text-base leading-relaxed text-white/70 mx-auto md:mx-0">
          JPG, PNG, WebP and HEIC at any shape. Everything is drawn instantly on your device via HTML Canvas. Nothing is uploaded.
        </p>
      </motion.header>

      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

        {/* LEFT: Live Preview (Sticky) */}
        <section className="order-1 lg:order-1 lg:sticky lg:top-20 w-full lg:w-[45%] flex flex-col">
          <motion.div
            className="glass-card p-4 md:p-6 rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
            layout
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Editor
              imageUrl={imageUrl}
              format={activeFormat}
              theme={theme}
              treatment={treatment}
              builderData={builderData}
              orientation={orientation}
            />
          </motion.div>
          <div className="mt-6 font-mono text-[9px] text-white/30 px-4 py-2 uppercase tracking-widest text-center font-bold">
            Drag to pan · Scroll to zoom
          </div>
        </section>

        {/* RIGHT: Controls */}
        <aside className="order-2 lg:order-2 w-full lg:w-[55%] flex flex-col gap-10 pb-24">

          {/* Orientation Selector */}
          <motion.section
            className="bg-[#022b13] p-6 border-2 border-[var(--color-hh-yellow)]/20 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-mono text-xs text-[var(--color-hh-yellow)] font-bold uppercase tracking-widest">Orientation</h2>
              <span className="font-mono text-xs uppercase tracking-widest text-white/20 font-bold">00</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: "portrait" as Orientation, label: "Portrait", icon: <Smartphone size={18} /> },
                { id: "landscape" as Orientation, label: "Landscape", icon: <Monitor size={18} /> },
              ]).map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOrientation(o.id)}
                  className={`flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
                    orientation === o.id
                      ? "bg-[var(--color-hh-yellow)] text-[#022b13] border-[var(--color-hh-yellow)] shadow-[0_0_20px_rgba(245,200,66,0.3)]"
                      : "bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white/80"
                  }`}
                >
                  {o.icon}
                  {o.label}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Format Section */}
          <motion.section
            className="bg-[var(--color-hh-yellow)] p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_black] rounded-2xl"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="mb-5 flex items-baseline justify-between border-b-4 border-black pb-3">
              <h2 className="font-serif text-2xl lg:text-3xl text-black font-bold">Format</h2>
              <span className="font-mono text-lg uppercase tracking-widest text-black font-bold">01</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {formats.map((f, i) => (
                <motion.button
                  key={f.id}
                  onClick={() => setActiveFormat(f.id)}
                  className={`py-3 px-2 text-center border-2 border-black font-mono text-[9px] font-bold uppercase tracking-[0.08em] transition-all rounded-lg ${
                    activeFormat === f.id
                      ? "bg-black text-[var(--color-hh-yellow)] shadow-none translate-y-0.5"
                      : "bg-white text-black shadow-[3px_3px_0px_0px_black] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_black]"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="block text-base mb-1">{f.emoji}</span>
                  {f.label}
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Photo Section */}
          <motion.section
            className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_#FF0080] rounded-2xl"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="mb-5 flex items-baseline justify-between border-b-4 border-black pb-3">
              <h2 className="font-serif text-2xl lg:text-3xl text-black font-bold">Photo</h2>
              <span className="font-mono text-lg uppercase tracking-widest text-[#FF0080] font-bold">02</span>
            </div>

            <AnimatePresence mode="wait">
              {!imageUrl ? (
                <motion.div
                  key="uploader"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Uploader onImageSelected={setImageUrl} />
                </motion.div>
              ) : (
                <motion.div
                  key="loaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[var(--color-hh-cream)] p-5 border-2 border-black flex items-center justify-between shadow-[4px_4px_0px_0px_black] rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#022b13] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#f5c842] rounded-lg">
                      <Sparkles size={20} className="text-[var(--color-hh-yellow)]" />
                    </div>
                    <div>
                      <div className="font-mono text-sm text-black font-bold uppercase">Photo Loaded</div>
                      <div className="font-sans text-xs text-black/60">Ready for processing</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setImageUrl(null)}
                    className="font-mono text-xs uppercase tracking-widest text-white bg-black border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_#FF0080] hover:-translate-y-1 transition-transform active:translate-y-1 active:shadow-none font-bold rounded-lg"
                  >
                    Change
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Details Section */}
          <AnimatePresence>
            {showIdentity && (
              <motion.section
                className="bg-[var(--color-hh-cream)] p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_#022b13] rounded-2xl"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-5 flex items-baseline justify-between border-b-4 border-black pb-3">
                  <h2 className="font-serif text-2xl lg:text-3xl text-black font-bold">Identity</h2>
                  <span className="font-mono text-lg uppercase tracking-widest text-[#022b13] font-bold">03</span>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-2">Name</label>
                    <input
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full neo-input h-14 px-5 text-sm font-sans font-bold bg-white rounded-lg"
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-2">Stack / Role</label>
                    <input
                      placeholder="e.g. Full Stack / AI"
                      value={stack}
                      onChange={(e) => setStack(e.target.value)}
                      className="w-full neo-input h-14 px-5 text-sm font-sans font-bold bg-white rounded-lg"
                      spellCheck={false}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold">Builder Title</label>
                      <button
                        className="inline-flex items-center gap-1.5 text-[10px] text-white bg-[#022b13] px-3 py-1.5 border-2 border-black hover:-translate-y-0.5 transition-transform font-mono uppercase tracking-wider font-bold shadow-[2px_2px_0px_0px_#FF0080] rounded-lg"
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
                      className="w-full neo-input h-14 px-5 text-sm font-sans font-bold text-[var(--color-hh-pink)] bg-white rounded-lg"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Styling Section */}
          <motion.section
            className="bg-white p-6 lg:p-8 border-4 border-black shadow-[8px_8px_0px_0px_#022b13] rounded-2xl"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="mb-5 flex items-baseline justify-between border-b-4 border-black pb-3">
              <h2 className="font-serif text-2xl lg:text-3xl text-black font-bold">Finish</h2>
              <span className="font-mono text-lg uppercase tracking-widest text-[#022b13] font-bold">04</span>
            </div>

            <div className="space-y-8">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-3">Photo Treatment</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  {(["natural", "cel", "riso"] as Treatment[]).map((t) => (
                    <motion.button
                      key={t}
                      onClick={() => setTreatment(t)}
                      className={`flex-1 py-3 text-center border-2 border-black font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-all rounded-lg ${
                        treatment === t
                          ? "bg-[var(--color-hh-pink)] text-white shadow-none translate-y-0.5"
                          : "bg-[var(--color-hh-cream)] text-black shadow-[4px_4px_0px_0px_black] hover:-translate-y-1"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-black font-bold mb-3">Color Theme</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  {(["goa", "night", "sand"] as Theme[]).map((thm) => (
                    <motion.button
                      key={thm}
                      onClick={() => setTheme(thm)}
                      className={`flex-1 p-2.5 transition-all border-2 border-black rounded-lg ${
                        theme === thm ? "bg-[var(--color-hh-yellow)] shadow-none translate-y-0.5" : "bg-white shadow-[4px_4px_0px_0px_black] hover:-translate-y-1"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        className="block h-12 w-full border-2 border-black mb-2 rounded-md"
                        style={{
                          background: thm === "goa" ? "linear-gradient(135deg, var(--color-hh-yellow), #FF0080)"
                                    : thm === "night" ? "linear-gradient(135deg, #1f5c38, #0B6839)"
                                    : "linear-gradient(135deg, #ece5d3, #d4c8b3)"
                        }}
                      />
                      <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-black font-bold">{thm}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Action Bar */}
          <div className="fixed inset-x-4 bottom-4 z-50 flex gap-3 lg:static lg:inset-auto lg:p-0">
            <motion.button
              className="neo-button flex-1 h-14 bg-[var(--color-hh-yellow)] text-black text-xs sm:text-sm shadow-[4px_4px_0px_0px_#FF0080] hover:shadow-[2px_2px_0px_0px_#FF0080] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl"
              onClick={handleDownload}
              disabled={!imageUrl}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={18} /> Download
            </motion.button>
            <motion.button
              className="neo-button flex-1 h-14 bg-[#022b13] text-white text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl"
              onClick={handleShare}
              disabled={!imageUrl}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={18} /> Share
            </motion.button>
          </div>

        </aside>
      </div>
    </div>
  );
}
