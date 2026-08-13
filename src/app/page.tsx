import { Studio } from "@/components/studio/Studio";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center overflow-x-hidden bg-[var(--color-hh-dark-green)] relative selection:bg-[var(--color-hh-pink)] selection:text-white">
      
      {/* HERO SECTION */}
      <section className="w-full relative px-4 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-visible z-10 bg-[#022b13]">
        
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 text-left">
          
          <div className="flex-1 relative z-30">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-hh-cream)] border-2 border-black shadow-[4px_4px_0px_0px_#f5c842] mb-8">
              <Sparkles size={14} className="text-[#022b13]" />
              <span className="font-mono text-[10px] tracking-[0.1em] text-[#022b13] uppercase font-bold">
                Goa, India · 28-31 Oct 2026
              </span>
            </div>

            <h1 className="font-serif text-[4rem] md:text-[5.5rem] lg:text-[7rem] font-bold leading-[0.9] text-[var(--color-hh-yellow)] mb-8 tracking-tight">
              <span className="block text-[var(--color-hh-cream)]">one photo.</span>
              <span className="block">one pass.</span>
            </h1>
            
            <p className="font-sans text-base md:text-lg text-[var(--color-hh-cream-dim)] max-w-md leading-relaxed mb-10 font-bold">
              Drop in a picture and take out an HH Goa 2026 profile frame, a builder ID, or a team badge. Rendered instantly on your device.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <a 
                href="#studio"
                className="neo-button px-8 py-4 flex items-center gap-2 bg-[var(--color-hh-pink)]"
              >
                Enter Studio <ArrowRight size={14} />
              </a>
              <span className="font-mono text-[10px] text-[var(--color-hh-yellow)] uppercase tracking-widest font-bold">
                no account required
              </span>
            </div>
          </div>

          {/* Clean, Flat Graphic Stack */}
          <div className="hidden lg:flex w-[500px] h-[500px] relative items-center justify-center z-10">
            <div className="absolute top-10 right-10 w-[300px] h-[400px] bg-[var(--color-hh-yellow)] border-4 border-black shadow-[12px_12px_0px_0px_#022b13] rotate-6 flex flex-col justify-between p-4 z-10">
              <div className="w-full h-2/3 bg-[#022b13] border-2 border-black rounded-sm" />
              <div>
                <div className="w-2/3 h-4 bg-black mb-2" />
                <div className="w-1/2 h-4 bg-[var(--color-hh-pink)]" />
              </div>
            </div>
            
            <div className="absolute top-20 left-10 w-[250px] h-[250px] bg-[var(--color-hh-cream)] border-4 border-black shadow-[12px_12px_0px_0px_#FF0080] -rotate-6 rounded-full flex flex-col items-center justify-center p-4 z-20">
              <div className="w-[200px] h-[200px] bg-[#022b13] border-2 border-black rounded-full" />
              <div className="absolute bottom-4 right-4 bg-[var(--color-hh-yellow)] border-2 border-black px-2 py-1 font-mono text-[10px] font-bold text-black rotate-12">
                PFP FRAME
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TICKER */}
      <div className="w-full bg-[var(--color-hh-yellow)] text-black py-3 border-y-4 border-black overflow-hidden flex whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.2em] relative z-20">
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
      <section id="studio" className="w-full relative z-20 py-24 bg-[#022b13] border-b-4 border-black">
        <Studio />
      </section>

      {/* EDITORIAL / DETAILS SECTION */}
      <section className="w-full bg-[var(--color-hh-cream)] text-black py-24 relative z-20 border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end border-b-4 border-black pb-8">
             <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Four days.<br/>One room.
             </h2>
             <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-hh-pink)] mt-6 lg:mt-0 font-bold bg-black text-[var(--color-hh-yellow)] px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_#FF0080]">
               28–31 October 2026
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              { day: "01", title: "Genesis Day", desc: "Everyone lands. The room meets itself.", sub: "where it all begins" },
              { day: "02", title: "Day of Triangle", desc: "The three that have to line up.", sub: "problem. solution. market." },
              { day: "03", title: "Build Day", desc: "One day, and the work is all of it.", sub: "heads down. ship or ship." },
              { day: "04", title: "Launch Day", desc: "What you built, in front of the room.", sub: "the world watches." }
            ].map((item, i) => (
              <article 
                key={item.day}
                className="neo-card flex flex-col p-6 bg-white transition-transform hover:-translate-y-2"
              >
                <div className="font-mono text-xl text-black font-bold border-b-2 border-black pb-4 mb-4 uppercase tracking-widest flex justify-between items-center">
                   Day {item.day}
                   <div className="w-4 h-4 bg-[var(--color-hh-pink)] rounded-full border-2 border-black" />
                </div>
                <h3 className="font-serif text-3xl font-bold mb-2 text-[#022b13]">{item.title}</h3>
                <p className="font-mono text-[10px] text-black/60 mb-6 uppercase tracking-wider font-bold">{item.sub}</p>
                <p className="font-sans text-sm text-[#022b13] mt-auto font-bold">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="w-full bg-[var(--color-hh-yellow)] text-black py-24 relative z-20 border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { num: "4", label: "days", sub: "28–31 October" },
            { num: "247", label: "seats", sub: "one room" },
            { num: "1", label: "photo", sub: "three formats" },
            { num: "0", label: "accounts", sub: "nothing uploaded" }
          ].map((metric, i) => (
            <div key={i}>
              <div className="font-serif text-5xl md:text-7xl font-bold">{metric.num}</div>
              <div className="font-mono text-xs bg-black text-white px-2 py-1 inline-block uppercase tracking-widest mt-4 mb-2 font-bold shadow-[4px_4px_0px_0px_#FF0080] border-2 border-black">{metric.label}</div>
              <div className="font-mono text-[10px] text-black/70 font-bold block mt-2">{metric.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full bg-[#022b13] text-white py-12 relative z-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono font-bold text-white/50 text-center md:text-left gap-6">
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
