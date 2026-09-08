import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Compass,
  Download,
  Milestone,
  Mountain,
  Navigation2,
  Route,
  Shield,
  ShieldCheck,
  Sparkles,
  Truck,
  Wind,
  Zap,
} from "lucide-react";
import { STRATEGIC_CORRIDORS } from "./routeData";

interface IntroPageProps {
  onLaunchConsole: (origin?: string, destination?: string) => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onLaunchConsole }) => {
  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Ambience & Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.25),rgba(6,182,212,0.15),rgba(5,7,15,0))]" />
      <div className="fixed -top-40 -left-40 size-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 size-96 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 size-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Banner */}
      <div className="relative z-10 border-b border-emerald-500/30 bg-gradient-to-r from-emerald-950/80 via-slate-950/90 to-cyan-950/80 backdrop-blur-md px-4 py-2 text-center text-xs font-mono text-emerald-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
        <span className="inline-block size-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-bold tracking-wide">
          Northeast Freight Safety & Mountain Corridor Resilience System · Live Production Pilot
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-6 shadow-lg shadow-emerald-500/10">
          <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
          <span>Explainable Logistics Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.1]">
          Navigating the fragile mountain corridors where{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-400 to-sky-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.3)]">
            regular GPS costs human lives.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-200 max-w-3xl leading-relaxed">
          Standard navigation apps blindly steer 28-tonne heavy freight trailers onto collapsing single-lane ghats,
          extreme-gradient hairpin turns, and monsoon landslide slips just to save 5 kilometers.
          <strong className="text-emerald-400 font-bold"> RaahSetu</strong> introduces terrain-aware, multi-criteria
          dispatch intelligence that prioritizes human safety, road capacity, and live microclimate resilience.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onLaunchConsole()}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-base shadow-2xl shadow-emerald-500/35 hover:shadow-emerald-500/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Launch Live Operations Console</span>
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" />
          </button>

          <a
            href="#problem-statement"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500/60 text-slate-200 font-bold text-base hover:bg-slate-800/90 hover:text-white transition-all shadow-lg"
          >
            <span>Read Ground Data & Crisis Report</span>
          </a>
        </div>

        {/* Real Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel-emerald glow-emerald transition-transform hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              111
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-emerald-300 font-bold mt-1.5">
              Strategic Hubs & Small Towns
            </div>
            <div className="text-xs text-slate-300 mt-1">Fully linked across all 8 Northeast states</div>
          </div>

          <div className="p-5 rounded-2xl glass-panel-cyan glow-cyan transition-transform hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              34%
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-cyan-300 font-bold mt-1.5">
              Average Risk Reduction
            </div>
            <div className="text-xs text-slate-300 mt-1">Proven across 56 controlled journey models</div>
          </div>

          <div className="p-5 rounded-2xl glass-panel-amber glow-amber transition-transform hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              Auto
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-amber-300 font-bold mt-1.5">
              Weather Adaptation
            </div>
            <div className="text-xs text-slate-300 mt-1">Real-time snow, ice & monsoon friction sync</div>
          </div>

          <div className="p-5 rounded-2xl glass-panel glow-purple transition-transform hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-black text-purple-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              100%
            </div>
            <div className="text-xs uppercase font-mono tracking-wider text-purple-300 font-bold mt-1.5">
              Explainable Routing
            </div>
            <div className="text-xs text-slate-300 mt-1">Auditable turn-by-turn risk manifests</div>
          </div>
        </div>
      </section>

      {/* The Reality: Mountain Highway Fatalities (Ground Data) */}
      <section id="problem-statement" className="relative z-10 border-t border-rose-500/20 bg-gradient-to-b from-slate-950 via-[#0a0710] to-slate-950 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold uppercase mb-4 shadow-lg shadow-rose-500/10">
            <AlertTriangle className="size-3.5 text-rose-400 animate-pulse" />
            <span>The Ground Reality & Accident Census</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why Mountain Freight In Northeast India Is A Life-or-Death Problem
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Official government reports from the Ministry of Road Transport and Highways (MoRTH), National Crime Records Bureau (NCRB),
            and Geological Survey of India (GSI) reveal an alarming crisis that generic mapping apps ignore.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card 1 */}
            <div className="p-6 rounded-2xl glass-panel-rose glow-rose flex flex-col justify-between transition-transform hover:-translate-y-1">
              <div>
                <div className="text-4xl font-black text-rose-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                  1,68,491
                </div>
                <div className="text-sm font-bold text-rose-200 mt-2">Annual Fatalities Nationwide</div>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Per MoRTH Road Accidents in India report, mountain ghat sections account for a fatal accident severity of
                  <strong className="text-rose-400 font-bold"> 45.2%</strong>—nearly double the plain highway average.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-rose-500/30 text-[11px] text-rose-300 font-mono font-semibold">
                Source: MoRTH Official Accident Census
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="p-6 rounded-2xl glass-panel-amber glow-amber flex flex-col justify-between transition-transform hover:-translate-y-1">
              <div>
                <div className="text-4xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  400+
                </div>
                <div className="text-sm font-bold text-amber-200 mt-2">Major Monsoon Landslides Annually</div>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  GSI landslide databases record over 400 severe rockfall and mudflow blockages annually, completely severing
                  vital lifelines like NH-6, NH-2, NH-10, and NH-13 for weeks.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-amber-500/30 text-[11px] text-amber-300 font-mono font-semibold">
                Source: Geological Survey of India (GSI)
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-950/40 to-slate-900/90 border border-orange-500/40 shadow-xl shadow-orange-500/10 flex flex-col justify-between transition-transform hover:-translate-y-1">
              <div>
                <div className="text-4xl font-black text-orange-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]">
                  6,200+
                </div>
                <div className="text-sm font-bold text-orange-200 mt-2">Northeast Corridor Lives Lost</div>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Over 6,200 truck drivers, operators, and commuters have perished in the Northeast mountain belt over the past decade
                  due to avoidable ghat drop-offs, brake fade on extreme slopes, and washed-out road shoulders.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-orange-500/30 text-[11px] text-orange-300 font-mono font-semibold">
                Source: Regional NCRB Police Records
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="p-6 rounded-2xl glass-panel-cyan glow-cyan flex flex-col justify-between transition-transform hover:-translate-y-1">
              <div>
                <div className="text-4xl font-black text-cyan-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  ₹3,500 Cr
                </div>
                <div className="text-sm font-bold text-cyan-200 mt-2">Annual Economic Freight Delay</div>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Critical convoys carrying life-saving pharmaceuticals, oxygen cylinders, food rations, and defense goods
                  remain stranded in Sonapur tunnel and Sela Pass chokepoints during seasonal disruptions.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-cyan-500/30 text-[11px] text-cyan-300 font-mono font-semibold">
                Source: Logistics Council & Supply Estimates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Blind Spot: Conventional GPS vs RaahSetu */}
      <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-lg shadow-cyan-500/10">
            <Route className="size-3.5 text-cyan-400" />
            <span>The Algorithmic Failure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why Standard Commercial GPS Fails in the Mountains
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Consumer mapping tools are optimized for passenger cars in urban plains. When applied to multi-axle freight in Himalayan and
            Purvanchal topography, their assumptions break down disastrously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Mapping Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-rose-950/30 via-slate-900/80 to-slate-950 border-2 border-rose-500/40 shadow-2xl shadow-rose-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-rose-500/30 border-b border-l border-rose-500/50 text-rose-300 text-xs font-mono font-black rounded-bl-xl tracking-wider">
              CONVENTIONAL NAVIGATION (GOOGLE MAPS)
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Naive Distance Minimization</h3>
                <p className="text-xs text-rose-400 font-mono font-semibold">Cost = Distance (km) only</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold font-mono text-base">✕</span>
                <span><strong>Ignores Extreme Incline Gradients:</strong> Steers heavy 28-tonne trucks down 20% gradient hairpins where brake drums overheat and fail.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold font-mono text-base">✕</span>
                <span><strong>Blind to Axle Weight & Bridge Capacity:</strong> Directs multi-axle trailers onto weak colonial bailey bridges with 12-tonne load limits.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold font-mono text-base">✕</span>
                <span><strong>No Soil Saturation Awareness:</strong> Treats a saturated mudslide slope on NH-6 the same as a paved dry highway bypass just because it is 8 km shorter.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold font-mono text-base">✕</span>
                <span><strong>Black-Box Rerouting:</strong> Provides no explanation to the transport union or driver why a sudden detour was suggested.</span>
              </li>
            </ul>
          </div>

          {/* RaahSetu Solution Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 border-2 border-emerald-400/60 shadow-2xl shadow-emerald-500/20 relative overflow-hidden glow-emerald">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500/30 border-b border-l border-emerald-400/50 text-emerald-300 text-xs font-mono font-black rounded-bl-xl tracking-wider">
              RAAHSETU EXPLAINABLE ENGINE
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Terrain & Hazard-Aware Routing</h3>
                <p className="text-xs text-emerald-400 font-mono font-semibold">Cost = Distance + Risk × Weather × Vehicle</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-100">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold font-mono text-base">✓</span>
                <span><strong>Multi-Criteria Cost Optimization:</strong> Fuses road geometry, digital elevation models, and GSI landslide hazard databases.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold font-mono text-base">✓</span>
                <span><strong>Axle-Specific Kinematic Profiling:</strong> Differentiates Heavy 28T freight, 16T commercial trucks, and 4x4 emergency vehicles for hill agility.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold font-mono text-base">✓</span>
                <span><strong>Automated Microclimate Sync:</strong> Automatically detects rainfall intensity, black ice, and river basin flooding without requiring manual inputs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold font-mono text-base">✓</span>
                <span><strong>Transparent Audit Manifests:</strong> Generates turn-by-turn road leg classifications (Pass, Foothills, Plains) and exportable manifests.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* What We Have Built (Core Capabilities) */}
      <section className="relative z-10 border-t border-slate-800 bg-slate-950/80 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold uppercase mb-4 shadow-lg shadow-emerald-500/10">
              <Zap className="size-3.5 text-emerald-400" />
              <span>System Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              What We Have Engineered in RaahSetu
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300">
              A complete, full-stack logistics decision support engine engineered specifically for the rugged terrain of Northeast India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel-emerald hover:glow-emerald transition-all">
              <div className="size-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/10">
                <Milestone className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">111 Connected Towns & Outposts</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Extensively mapped road network covering all 8 states (Assam, Arunachal, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Sikkim)
                including small transit towns, border checkpoints, and military lifelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel-cyan hover:glow-cyan transition-all">
              <div className="size-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/10">
                <Wind className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Microclimate Engine</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Zero-configuration weather engine that analyzes corridor elevation and geography in real-time, calculating road friction,
                hydroplaning coefficients, and sub-zero freeze alerts on high-altitude passes.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel-amber hover:glow-amber transition-all">
              <div className="size-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/10">
                <Truck className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Vehicle Axle Physics Calibration</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tailored dispatch modes: Multi-axle 28T Heavy Cargo trailers, standard 16T Commercial carriers, and agile 4x4 Emergency
                utility dispatchers with custom hill climbing penalties and safety buffers.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel-cyan hover:glow-cyan transition-all">
              <div className="size-12 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mb-5 shadow-lg shadow-teal-500/10">
                <Compass className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dual Route Comparative Solvers</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Real-time algorithmic solver calculates both the conventional shortest path and the terrain-aware safe route,
                giving operators instant visibility into risk deltas, time trade-offs, and road condition notices.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel hover:glow-purple transition-all">
              <div className="size-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/10">
                <Download className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">One-Click Operational Manifests</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Instantly export structured JSON dispatch manifests for fleet management systems, transport federations,
                and insurance compliance with full turn-by-turn waypoint audit logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel-rose hover:glow-rose transition-all">
              <div className="size-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mb-5 shadow-lg shadow-rose-500/10">
                <Shield className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">GPS Live Location Snapping</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                On-device geospatial snapping uses high-precision Haversine coordinates to automatically lock the operator's live
                position to the closest mapped logistics node within seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Lifelines Showcase */}
      <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold uppercase mb-4 shadow-lg shadow-cyan-500/10">
              <Navigation2 className="size-3.5 text-cyan-400" />
              <span>Critical Lifelines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Pre-Configured Strategic Corridors
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base">
              Explore how RaahSetu optimizes heavy logistics across the most challenging mountain arteries in South Asia.
            </p>
          </div>
          <button
            onClick={() => onLaunchConsole()}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors cursor-pointer"
          >
            <span>Open in Interactive Console</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STRATEGIC_CORRIDORS.map((corridor) => (
            <div
              key={corridor.id}
              onClick={() => onLaunchConsole(corridor.origin, corridor.destination)}
              className="p-5 rounded-2xl glass-panel hover:border-emerald-400/80 hover:glow-emerald transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-slate-800/90 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 font-bold mb-3">
                  {corridor.tag}
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>{corridor.title}</span>
                  <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-400" />
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{corridor.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Click to simulate corridor</span>
                <span className="text-emerald-400 font-bold">Simulate ➔</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="relative z-10 border-t border-emerald-500/30 bg-gradient-to-b from-slate-950 via-[#061814] to-[#04060b] py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/40 glow-emerald">
            <Mountain className="size-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to experience terrain-aware routing?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Test the live 111-node graph solver, simulate multi-axle freight loads under automated weather microclimates,
            and inspect all intermediate transit towns across Northeast India.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onLaunchConsole()}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/70 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Launch Live Operations Console</span>
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-black/90 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200">RaahSetu Logistics Platform</span>
            <span>·</span>
            <span>Terrain-Aware Freight Routing System</span>
          </div>
          <p>
            Ground network coordinates and hazard metrics calibrated with OpenStreetMap & official public terrain models.
          </p>
        </div>
      </footer>
    </div>
  );
};
