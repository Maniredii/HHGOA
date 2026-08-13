"use client";

import { Studio } from "@/components/studio/Studio";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="flex-1 flex flex-col items-center overflow-x-hidden bg-[var(--color-hh-dark-green)] relative">
      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--color-hh-yellow)]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--color-hh-pink)]/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* HERO SECTION */}
      <section className="w-full relative px-4 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-visible z-10">
        
        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 text-left"
        >
          
          <motion.div 
            className="flex-1 relative z-30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel mb-8 border-[var(--color-hh-yellow)]/30"
            >
              <Sparkles size={14} className="text-[var(--color-hh-yellow)]" />
              <span className="font-mono text-[10px] tracking-widest text-[var(--color-hh-cream)] uppercase font-bold">
                Goa, India · 28-31 Oct 2026
              </span>
            </motion.div>

            <h1 className="font-serif text-[4rem] md:text-[5.5rem] lg:text-[7rem] font-bold leading-[0.9] text-[var(--color-hh-yellow)] mb-8 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-hh-cream)] to-[var(--color-hh-cream-dim)]">one photo.</span>
              <span className="block">one pass.</span>
            </h1>
            
            <p className="font-sans text-base md:text-lg text-[var(--color-hh-cream-dim)] max-w-md leading-relaxed mb-10 font-light">
              Drop in a picture and take out an HH Goa 2026 profile frame, a builder ID, or a team badge. Rendered instantly on your device.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <a 
                href="#studio"
                className="group relative inline-flex items-center justify-center bg-[var(--color-hh-pink)] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(255,0,128,0.3)] hover:shadow-[0_0_60px_rgba(255,0,128,0.5)] hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Enter Studio <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </a>
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                no account required
              </span>
            </div>
          </motion.div>

          {/* Premium Floating Card Stack */}
          <motion.div 
            className="hidden lg:flex w-[500px] h-[600px] relative items-center justify-center z-10 perspective-1000"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Background Blur Core */}
            <div className="absolute inset-0 bg-[var(--color-hh-yellow)]/5 rounded-full blur-3xl" />
            
            <motion.div 
              animate={{ y: [-10, 10, -10], rotateZ: [-6, -4, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-10 w-[280px] h-[380px] glass-panel rounded-3xl border-white/20 p-4 shadow-2xl flex flex-col justify-between"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(0) rotateY(-10deg)" }}
            >
              <div className="w-full h-full bg-gradient-to-br from-black/40 to-black/80 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col p-4">
                <div className="w-full h-1/2 bg-[var(--color-hh-green-sec)] rounded-xl mb-4" />
                <div className="w-1/2 h-4 bg-white/20 rounded mb-2" />
                <div className="w-3/4 h-3 bg-[var(--color-hh-yellow)]/50 rounded mb-auto" />
                <div className="mt-4 font-serif text-2xl text-[var(--color-hh-cream)]">BUILDER ID</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10], rotateZ: [4, 6, 4] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-20 w-[300px] h-[300px] bg-[var(--color-hh-pink)]/20 backdrop-blur-2xl rounded-full border border-white/20 p-2 shadow-[0_0_50px_rgba(255,0,128,0.2)] right-0 bottom-10"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(50px) rotateY(10deg)" }}
            >
              <div className="w-full h-full rounded-full border-2 border-dashed border-[var(--color-hh-yellow)]/40 flex items-center justify-center">
                 <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-hh-yellow)] rotate-[-15deg]">
                    PFP Frame
                 </div>
              </div>
            </motion.div>

          </motion.div>

        </motion.div>
      </section>

      {/* TICKER */}
      <div className="w-full bg-[var(--color-hh-yellow)] text-[var(--color-hh-dark-green)] py-3 border-y border-[var(--color-hh-dark-green)] overflow-hidden flex whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.2em] relative z-20">
        <div className="animate-ticker inline-flex items-center">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8">GOA, INDIA</span>
              <span className="text-[var(--color-hh-pink)]">✦</span>
              <span className="mx-8">28–31 OCT 2026</span>
              <span className="text-[var(--color-hh-pink)]">✦</span>
              <span className="mx-8">247 SEATS</span>
              <span className="text-[var(--color-hh-pink)]">✦</span>
              <span className="mx-8">#FrameInGoa</span>
              <span className="text-[var(--color-hh-pink)]">✦</span>
              <span className="mx-8">LESS NOISE. MORE SIGNAL.</span>
              <span className="text-[var(--color-hh-pink)]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* STUDIO SECTION */}
      <section id="studio" className="w-full relative z-20 py-24 bg-gradient-to-b from-[var(--color-hh-dark-green)] to-[#011409]">
        <Studio />
      </section>

      {/* EDITORIAL / DETAILS SECTION */}
      <section className="w-full bg-white text-[var(--color-hh-dark-green)] py-32 relative z-20 rounded-t-[3rem] -mt-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end border-b border-black/10 pb-8"
          >
             <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Four days.<br/>One room.
             </h2>
             <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-hh-pink)] mt-6 lg:mt-0 font-bold">
               28–31 October 2026
             </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { day: "01", title: "Genesis Day", desc: "Everyone lands. The room meets itself.", sub: "where it all begins" },
              { day: "02", title: "Day of Triangle", desc: "The three that have to line up.", sub: "problem. solution. market." },
              { day: "03", title: "Build Day", desc: "One day, and the work is all of it.", sub: "heads down. ship or ship." },
              { day: "04", title: "Launch Day", desc: "What you built, in front of the room.", sub: "the world watches." }
            ].map((item, i) => (
              <motion.article 
                key={item.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative p-8 rounded-3xl bg-[var(--color-hh-cream)] hover:bg-[var(--color-hh-yellow)] transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110" />
                <span className="font-mono text-[10px] text-[var(--color-hh-pink)] font-bold uppercase tracking-widest block mb-4">Day {item.day}</span>
                <h3 className="font-serif text-3xl font-bold mb-4 text-[#022b13] relative z-10">{item.title}</h3>
                <p className="font-mono text-[10px] text-black/40 mb-6 uppercase tracking-wider">{item.sub}</p>
                <div className="h-px bg-black/10 w-full mb-6" />
                <p className="font-sans text-sm text-[#022b13]/70 relative z-10">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="w-full bg-[#022b13] text-white py-24 relative z-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { num: "4", label: "days", sub: "28–31 October" },
            { num: "247", label: "seats", sub: "one room" },
            { num: "1", label: "photo", sub: "three formats" },
            { num: "0", label: "accounts", sub: "nothing uploaded" }
          ].map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-serif text-5xl md:text-7xl font-bold text-[var(--color-hh-cream)]">{metric.num}</div>
              <div className="font-mono text-xs text-[var(--color-hh-yellow)] uppercase tracking-widest mt-4 mb-2 font-bold">{metric.label}</div>
              <div className="font-mono text-[10px] text-white/40">{metric.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="w-full bg-[#011409] text-white py-12 relative z-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-white/50 text-center md:text-left gap-6">
          <div>
            <p className="text-[var(--color-hh-yellow)] uppercase tracking-[0.2em] mb-2 font-bold text-xs">GOA, INDIA · 28–31 OCT 2026</p>
            <p>less noise. more signal.</p>
          </div>
          <div className="flex gap-8 uppercase tracking-[0.2em]">
             <a href="#studio" className="hover:text-[var(--color-hh-pink)] transition-colors">Make a frame</a>
             <a href="#" className="hover:text-[var(--color-hh-pink)] transition-colors">Apply</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
