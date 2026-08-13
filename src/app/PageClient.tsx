"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Studio } from "@/components/studio/Studio";
import { PalmDecoration } from "@/components/ui/PalmDecoration";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";

/* ═══════════════════════════════════════════
   FLOATING SPARKLE ELEMENT
   ═══════════════════════════════════════════ */
function FloatingSparkle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute text-[var(--color-hh-yellow)] pointer-events-none z-0"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -10, 5, -5, 0],
        opacity: [0.2, 0.8, 0.3, 0.9, 0.2],
        scale: [0.8, 1.2, 0.9, 1.1, 0.8],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Sparkles size={size} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE CLIENT COMPONENT
   ═══════════════════════════════════════════ */
export default function PageClient() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center overflow-x-hidden bg-[var(--color-hh-dark-green)] relative selection:bg-[var(--color-hh-pink)] selection:text-white">

      {/* ═══════════════════════════════════════════
          STICKY NAVBAR
          ═══════════════════════════════════════════ */}
      <nav
        className={`w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#022b13]/90 backdrop-blur-xl border-b border-[var(--color-hh-yellow)]/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-[var(--color-hh-yellow)] border-b-4 border-black"
        }`}
      >
        <div className="flex items-center h-12 lg:h-14 px-4 lg:px-8 relative">
          {/* Left: Brand */}
          <a
            href="#"
            className={`font-serif font-bold text-lg lg:text-xl tracking-tight transition-colors duration-500 shrink-0 ${
              scrolled ? "text-[var(--color-hh-yellow)] glow-text" : "text-[#022b13]"
            }`}
          >
            GOA.ID
          </a>

          {/* Center: Ticker */}
          <div className="flex-1 mx-4 lg:mx-8 overflow-hidden">
            <div className={`animate-ticker inline-flex items-center whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.15em] ${
              scrolled ? "text-[var(--color-hh-cream)]/60" : "text-[#022b13]/80"
            }`}>
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className="mx-6">GOA, INDIA</span>
                  <span className={scrolled ? "text-[var(--color-hh-pink)]" : "text-[var(--color-hh-pink)]"}>✦</span>
                  <span className="mx-6">28–31 OCT 2026</span>
                  <span className="text-[var(--color-hh-pink)]">✦</span>
                  <span className="mx-6">247 SEATS</span>
                  <span className="text-[var(--color-hh-pink)]">✦</span>
                  <span className="mx-6">#FrameInGoa</span>
                  <span className="text-[var(--color-hh-pink)]">✦</span>
                  <span className="mx-6">LESS NOISE. MORE SIGNAL.</span>
                  <span className="text-[var(--color-hh-pink)]">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: External Links */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href="https://hhgoa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-1.5 rounded-full font-mono text-[9px] font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                scrolled
                  ? "text-[var(--color-hh-cream)] border border-[var(--color-hh-cream)]/30 hover:bg-[var(--color-hh-cream)]/10"
                  : "text-[#022b13] border border-[#022b13]/30 hover:bg-[#022b13]/10"
              }`}
            >
              HHGOA.COM
            </a>
            <a
              href="https://hacker-house-goa-2026.devfolio.co/overview"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-1.5 rounded-full font-mono text-[9px] font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                scrolled
                  ? "bg-[var(--color-hh-yellow)] text-[#022b13] shadow-[0_0_15px_rgba(245,200,66,0.3)] hover:shadow-[0_0_25px_rgba(245,200,66,0.5)]"
                  : "bg-[#022b13] text-[var(--color-hh-yellow)] hover:bg-[#022b13]/90"
              }`}
            >
              APPLY
            </a>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-12 lg:h-14 w-full" />

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="w-full relative px-4 min-h-[92vh] flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Sunset radial glow */}
          <div
            className="absolute top-[20%] right-[10%] w-[600px] h-[600px] rounded-full animate-pulse-glow"
            style={{ background: "radial-gradient(circle, rgba(245,200,66,0.15) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{
              background: "radial-gradient(circle, rgba(255,0,128,0.08) 0%, transparent 70%)",
              animationDelay: "1.5s",
            }}
          />
          {/* Subtle wave pattern at bottom */}
          <svg className="absolute bottom-0 left-0 w-full h-40 opacity-10" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,40 1440,60 L1440,120 L0,120 Z" fill="#1f5c38" />
            <path d="M0,80 C240,40 480,100 720,60 C960,20 1200,90 1440,50 L1440,120 L0,120 Z" fill="#026836" opacity="0.5" />
          </svg>
        </div>

        {/* Floating sparkles */}
        <FloatingSparkle delay={0} x="15%" y="20%" size={12} />
        <FloatingSparkle delay={1.2} x="80%" y="30%" size={10} />
        <FloatingSparkle delay={0.6} x="70%" y="70%" size={14} />
        <FloatingSparkle delay={2} x="25%" y="75%" size={8} />
        <FloatingSparkle delay={0.8} x="90%" y="55%" size={11} />

        {/* Palm trees */}
        <PalmDecoration side="left" className="bottom-0 opacity-20 hidden lg:block" />
        <PalmDecoration side="right" className="bottom-0 opacity-15 hidden lg:block" />
        <PalmDecoration side="left" variant="leaf" className="top-20 opacity-15 hidden lg:block" />
        <PalmDecoration side="right" variant="leaf" className="top-32 opacity-10 hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 text-left">

          <div className="flex-1 relative z-30">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-hh-cream)] border-2 border-black shadow-[4px_4px_0px_0px_#f5c842] mb-8"
            >
              <Sparkles size={14} className="text-[#022b13]" />
              <span className="font-mono text-[10px] tracking-[0.1em] text-[#022b13] uppercase font-bold">
                Goa, India · 28–31 Oct 2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-serif text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] font-bold leading-[0.9] text-[var(--color-hh-yellow)] mb-8 tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="block text-[var(--color-hh-cream)]">one photo.</span>
              <span className="block glow-text">one pass.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="font-sans text-base md:text-lg text-[var(--color-hh-cream-dim)] max-w-md leading-relaxed mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Drop in a picture and take out an HH Goa 2026 profile frame, a builder ID, or a team badge. Rendered instantly on your device.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a
                href="#studio"
                className="neo-button px-8 py-4 flex items-center gap-3 bg-[var(--color-hh-pink)] text-sm group"
              >
                Create One
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <span className="font-mono text-[10px] text-[var(--color-hh-yellow)] uppercase tracking-widest font-bold">
                no account required
              </span>
            </motion.div>

            {/* Team Name */}
            <motion.div
              className="mt-12 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <span className="font-mono text-[10px] text-[var(--color-hh-cream)]/40 uppercase tracking-widest">built by</span>
              <span className="animated-underline font-serif text-lg font-bold text-[var(--color-hh-yellow)] tracking-wide">
                Exceed
              </span>
            </motion.div>
          </div>

          {/* Right: Graphic Stack */}
          <motion.div
            className="hidden lg:flex w-[460px] h-[460px] relative items-center justify-center z-10"
            initial={{ opacity: 0, x: 60, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {/* ID Card mockup */}
            <motion.div
              className="absolute top-8 right-8 w-[280px] h-[380px] bg-[var(--color-hh-yellow)] border-4 border-black shadow-[12px_12px_0px_0px_#022b13] flex flex-col justify-between p-4 z-10"
              animate={{ rotate: [5, 7, 5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-full h-2/3 bg-[#022b13] border-2 border-black rounded-sm overflow-hidden relative">
                {/* Simulated tropical photo */}
                <div className="absolute inset-0 sunset-gradient opacity-60" />
                <div className="absolute bottom-3 left-3 font-mono text-[8px] text-[var(--color-hh-yellow)] uppercase tracking-widest font-bold">
                  BUILDER ID
                </div>
              </div>
              <div>
                <div className="w-2/3 h-4 bg-black mb-2" />
                <div className="w-1/2 h-4 bg-[var(--color-hh-pink)]" />
              </div>
            </motion.div>

            {/* PFP Circle */}
            <motion.div
              className="absolute top-16 left-8 w-[220px] h-[220px] bg-[var(--color-hh-cream)] border-4 border-black shadow-[12px_12px_0px_0px_#FF0080] rounded-full flex flex-col items-center justify-center p-4 z-20"
              animate={{ rotate: [-5, -7, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="w-[170px] h-[170px] bg-[#022b13] border-2 border-black rounded-full relative overflow-hidden">
                <div className="absolute inset-0 tropical-gradient opacity-40" />
              </div>
              <div className="absolute bottom-3 right-3 bg-[var(--color-hh-yellow)] border-2 border-black px-2 py-1 font-mono text-[9px] font-bold text-black rotate-12 shadow-[2px_2px_0px_0px_#FF0080]">
                PFP FRAME
              </div>
            </motion.div>

            {/* Small floating badge */}
            <motion.div
              className="absolute bottom-8 right-4 bg-black text-[var(--color-hh-yellow)] border-2 border-[var(--color-hh-yellow)] px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-widest z-30"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              7 FORMATS
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile external links */}
        <motion.div
          className="sm:hidden flex gap-3 mt-8 relative z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="https://hhgoa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full font-mono text-[9px] font-bold tracking-widest uppercase text-[var(--color-hh-cream)] border border-[var(--color-hh-cream)]/30 flex items-center gap-2"
          >
            HHGOA.COM <ExternalLink size={10} />
          </a>
          <a
            href="https://hacker-house-goa-2026.devfolio.co/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full font-mono text-[9px] font-bold tracking-widest uppercase bg-[var(--color-hh-yellow)] text-[#022b13]"
          >
            APPLY →
          </a>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          TROPICAL DIVIDER
          ═══════════════════════════════════════════ */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-hh-yellow)]/30 to-transparent" />

      {/* ═══════════════════════════════════════════
          STUDIO SECTION
          ═══════════════════════════════════════════ */}
      <section id="studio" className="w-full relative z-20 py-20 lg:py-28 overflow-hidden">
        {/* Ambient glow behind studio */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(31,92,56,0.4) 0%, transparent 70%)" }}
          />
        </div>

        {/* Palm decorations */}
        <PalmDecoration side="right" variant="minimal" className="top-20 hidden xl:block" />
        <PalmDecoration side="left" variant="minimal" className="top-40 hidden xl:block" />

        <Studio />
      </section>

      {/* ═══════════════════════════════════════════
          EDITORIAL — FOUR DAYS
          ═══════════════════════════════════════════ */}
      <section className="w-full bg-[var(--color-hh-cream)] text-black py-24 lg:py-32 relative z-20 overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
          <ScrollReveal>
            <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end border-b-4 border-black pb-8">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Four days.<br/>One room.
              </h2>
              <p className="font-mono text-xs uppercase tracking-widest mt-6 lg:mt-0 font-bold bg-black text-[var(--color-hh-yellow)] px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_#FF0080]">
                28–31 October 2026
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              { day: "01", title: "Genesis Day", desc: "Everyone lands. The room meets itself.", sub: "where it all begins" },
              { day: "02", title: "Day of Triangle", desc: "The three that have to line up.", sub: "problem. solution. market." },
              { day: "03", title: "Build Day", desc: "One day, and the work is all of it.", sub: "heads down. ship or ship." },
              { day: "04", title: "Launch Day", desc: "What you built, in front of the room.", sub: "the world watches." }
            ].map((item, i) => (
              <ScrollReveal key={item.day} delay={i * 0.1}>
                <article className="neo-card flex flex-col p-6 bg-white h-full">
                  <div className="font-mono text-xl text-black font-bold border-b-2 border-black pb-4 mb-4 uppercase tracking-widest flex justify-between items-center">
                    Day {item.day}
                    <div className="w-4 h-4 bg-[var(--color-hh-pink)] rounded-full border-2 border-black" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold mb-2 text-[#022b13]">{item.title}</h3>
                  <p className="font-mono text-[10px] text-black/60 mb-6 uppercase tracking-wider font-bold">{item.sub}</p>
                  <p className="font-sans text-sm text-[#022b13] mt-auto font-bold">{item.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          METRICS SECTION
          ═══════════════════════════════════════════ */}
      <section className="w-full bg-[var(--color-hh-yellow)] text-black py-24 relative z-20 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none tropical-gradient" />

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative">
          {[
            { num: "4", label: "days", sub: "28–31 October" },
            { num: "247", label: "seats", sub: "one room" },
            { num: "1", label: "photo", sub: "seven formats" },
            { num: "0", label: "accounts", sub: "nothing uploaded" }
          ].map((metric, i) => (
            <ScrollReveal key={i} delay={i * 0.12} direction="up">
              <div>
                <div className="font-serif text-5xl md:text-7xl font-bold">{metric.num}</div>
                <div className="font-mono text-xs bg-black text-white px-2 py-1 inline-block uppercase tracking-widest mt-4 mb-2 font-bold shadow-[4px_4px_0px_0px_#FF0080] border-2 border-black">
                  {metric.label}
                </div>
                <div className="font-mono text-[10px] text-black/70 font-bold block mt-2">{metric.sub}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="w-full bg-[#011a0b] text-white py-16 relative z-20 overflow-hidden">
        {/* Palm decoration */}
        <PalmDecoration side="right" variant="minimal" className="bottom-0 opacity-5" />

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left */}
            <div className="text-center md:text-left">
              <div className="font-serif text-2xl font-bold text-[var(--color-hh-yellow)] mb-2 glow-text">GOA.ID</div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                GOA, INDIA · 28–31 OCT 2026
              </p>
              <p className="font-mono text-[10px] text-white/30 mt-1">less noise. more signal.</p>
            </div>

            {/* Center: Team */}
            <div className="text-center">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-1">a project by</p>
              <p className="font-serif text-lg font-bold text-[var(--color-hh-yellow)] animated-underline">Exceed</p>
            </div>

            {/* Right: Links */}
            <div className="flex flex-col sm:flex-row gap-4 items-center text-center">
              <a href="#studio" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-[var(--color-hh-pink)] transition-colors font-bold">
                Create a frame
              </a>
              <a
                href="https://hacker-house-goa-2026.devfolio.co/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-[var(--color-hh-yellow)] transition-colors font-bold"
              >
                Apply
              </a>
              <a
                href="https://hhgoa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-[var(--color-hh-yellow)] transition-colors font-bold"
              >
                HHGOA.COM
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
              © 2026 Exceed · HH Goa
            </p>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
              #FrameInGoa
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
