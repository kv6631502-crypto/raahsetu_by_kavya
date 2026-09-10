import React from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  LogIn,
  Mountain,
  Route,
  Sparkles,
  XCircle,
} from "lucide-react";
import { STRATEGIC_CORRIDORS } from "./routeData";
import ConstellationGrid from "@/components/ui/constellation-grid";

interface IntroPageProps {
  onLaunchConsole: (origin?: string, destination?: string) => void;
  onNavigateToAuth: () => void;
  onNavigateToDistricts: () => void;
  onNavigateToAdvisories: () => void;
  onNavigateToSystem: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({
  onLaunchConsole,
  onNavigateToAuth,
  onNavigateToDistricts,
  onNavigateToAdvisories,
  onNavigateToSystem,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. WELCOME TO RAAHSETU — INTERACTIVE KINETIC CONSTELLATION HERO */}
      <section className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
        <ConstellationGrid
          fullHeight={false}
          className="min-h-[620px] sm:min-h-[680px]"
        >
          <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 text-center flex flex-col items-center">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold backdrop-blur-md">
              <Mountain className="size-3.5 text-primary" />
              <span>Smart India Hackathon · SIH26002 Prototype</span>
              <Sparkles className="size-3 text-primary animate-pulse" />
            </div>

            {/* Main Welcome Heading */}
            <div className="space-y-3">
              <div className="text-xs sm:text-sm font-mono tracking-widest text-muted-foreground uppercase">
                Welcome to
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08]">
                RaahSetu{" "}
                <span className="text-primary font-serif font-normal text-3xl sm:text-5xl md:text-6xl block sm:inline">
                  (राहसेतु)
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Autonomous, terrain-aware freight routing intelligence for the high-risk mountain corridors of the Northeast. Navigating where ordinary GPS costs human lives.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onLaunchConsole()}
                className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Launch Route Dispatcher</span>
                <ArrowRight className="size-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToAuth}
                className="px-5 py-3.5 rounded-xl border border-border bg-secondary/80 backdrop-blur-md text-foreground font-semibold text-sm hover:bg-secondary transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn className="size-4 text-primary" />
                <span>Driver & Fleet Sign In</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToDistricts}
                className="px-5 py-3.5 rounded-xl border border-border bg-card/80 backdrop-blur-md text-muted-foreground hover:text-foreground font-medium text-sm hover:bg-secondary transition-all cursor-pointer flex items-center gap-2"
              >
                <Compass className="size-4 text-primary" />
                <span>District Health Matrix</span>
              </button>
            </div>

            {/* Telemetry Bar (3D Glassmorphic Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-4">
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">111</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Strategic Hubs & Towns</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">34%</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Avg Risk Reduction</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">400+</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Monsoon Landslides GSI</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">8 States</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Full Northeast Grid</div>
              </div>
            </div>

            {/* Interactive Kinetic Mesh Tip & Slide Down Prompt */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <div className="text-[11px] font-mono text-muted-foreground/80 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-cyan-500 animate-ping" />
                <span>Sweep cursor on canvas to unleash kinetic shockwaves</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("ground-reality-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline cursor-pointer pt-1 transition-transform hover:translate-y-0.5"
              >
                <span>Slide down to explore ground data & crisis evidence</span>
                <ArrowDown className="size-3.5 animate-bounce" />
              </button>
            </div>
          </div>
        </ConstellationGrid>
      </section>

      {/* 2. THE CRISIS: WHY THIS PROBLEM IS VERY BIG (GROUND DATA) */}
      <section id="ground-reality-section" className="space-y-6 scroll-mt-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20">
            <AlertTriangle className="size-3" />
            <span>Ground Reality & MoRTH Accident Census</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            The Life-or-Death Reality of Mountain Highway Logistics
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Official government data from the Ministry of Road Transport and Highways (MoRTH), National Crime Records Bureau (NCRB), and Geological Survey of India (GSI) document a severe regional logistics crisis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="p-5 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 transform-gpu group cursor-default">
            <div className="text-3xl font-black text-destructive group-hover:scale-105 transition-transform origin-left">1,68,491</div>
            <div className="text-xs font-bold text-foreground">Annual Fatalities Nationwide</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Per MoRTH official census, mountain ghat sections have an accident fatality rate of <strong className="text-destructive">45.2%</strong>—nearly double plain highway crashes.
            </p>
            <div className="pt-2 border-t border-destructive/20 text-[10px] text-destructive font-semibold">
              Source: MoRTH Road Accidents Report
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 transform-gpu group cursor-default">
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform origin-left">400+</div>
            <div className="text-xs font-bold text-foreground">Major Landslides Annually</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              GSI landslide databases record over 400 severe rockfall and debris slips each monsoon, completely severing lifelines like NH-6, NH-2, and NH-13 for weeks.
            </p>
            <div className="pt-2 border-t border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
              Source: Geological Survey of India (GSI)
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 transform-gpu group cursor-default">
            <div className="text-3xl font-black text-foreground group-hover:scale-105 transition-transform origin-left">6,200+</div>
            <div className="text-xs font-bold text-foreground">Northeast Corridor Lives Lost</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Truck drivers, co-drivers, and passengers have lost their lives across the Northeast mountain belt over the past decade due to brake fade, extreme slopes, and edge drop-offs.
            </p>
            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground font-semibold">
              Source: Regional NCRB Police Records
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-3 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 transform-gpu group cursor-default">
            <div className="text-3xl font-black text-primary group-hover:scale-105 transition-transform origin-left">₹3,500 Cr</div>
            <div className="text-xs font-bold text-foreground">Annual Economic Freight Delay</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Convoys carrying life-saving pharmaceuticals, oxygen cylinders, food rations, and farm produce remain stranded at Sela Pass and Sonapur tunnel chokepoints.
            </p>
            <div className="pt-2 border-t border-primary/20 text-[10px] text-primary font-semibold">
              Source: Logistics Council Estimates
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE BLIND SPOT: CONVENTIONAL NAVIGATION VS RAAHSETU */}
      <section className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Route className="size-3" />
            <span>Algorithmic Failure vs Terrain Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Why Standard Commercial GPS Fails in the Mountains
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Consumer mapping applications are optimized for light passenger cars on urban highways. When applied to commercial transport in Himalayan terrain, their naive assumptions break down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Conventional GPS */}
          <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <XCircle className="size-4" />
                <span>Conventional GPS (Google Maps / Apple Maps)</span>
              </div>
              <span className="text-[10px] font-mono text-destructive uppercase px-2 py-0.5 rounded bg-destructive/10">Naive Distance</span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold shrink-0">✕</span>
                <span>Minimizes pure linear distance (km), frequently choosing dangerous unpaved shortcut tracks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold shrink-0">✕</span>
                <span>Ignores hill slope gradients, causing fatal brake overheating and vehicle roll-aways on 14%+ inclines.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold shrink-0">✕</span>
                <span>Unaware of multi-axle bridge weight restrictions, leading to freight strandings at narrow Bailey crossings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold shrink-0">✕</span>
                <span>No commodity prioritization: treats volatile petroleum tankers the same as light passenger cars.</span>
              </li>
            </ul>
          </div>

          {/* Card: RaahSetu Engine */}
          <div className="p-6 rounded-2xl border border-primary/40 bg-primary/5 space-y-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <CheckCircle2 className="size-4" />
                <span>RaahSetu Explainable Engine</span>
              </div>
              <span className="text-[10px] font-mono text-primary uppercase px-2 py-0.5 rounded bg-primary/10">Terrain Dual-Solve</span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span>Runs dual A* pathfinding: outputs both Nominal Shortest and Risk-Aware Safe corridor side-by-side.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span>Penalizes steep mountain passes (SRTM-30M elevation model) and active monsoonal precipitation zones.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span>Enforces strict axle-load constraints: 28T multi-axle freight vs 16T cargo vs 4x4 utility dispatch.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span>Specialized cargo tolerances: zero-choke paths for cold-chain medicines and flammable petroleum.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC PRESETS & QUICK LAUNCH */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Featured Strategic Mountain Corridors</h3>
            <p className="text-xs text-muted-foreground">Click any corridor to open the Route Dispatcher with pre-configured endpoints.</p>
          </div>
          <button
            type="button"
            onClick={() => onLaunchConsole()}
            className="text-primary font-semibold text-xs hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Custom Route Dispatcher</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STRATEGIC_CORRIDORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onLaunchConsole(c.origin, c.destination)}
              className="p-4 rounded-2xl border border-border bg-card hover:bg-secondary/60 hover:border-primary/40 text-left transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {c.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                  {c.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{c.description}</p>
              <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] text-primary font-medium">
                <span>Configure & Dispatch Route</span>
                <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. REDIRECT DIRECTORY LINKS */}
      <section className="p-6 rounded-2xl border border-border bg-secondary/40 space-y-4">
        <h3 className="text-sm font-bold text-foreground">Explore Platform Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            type="button"
            onClick={() => onLaunchConsole()}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">1. Route Dispatcher</div>
            <div className="text-muted-foreground font-normal mt-0.5">Origin to destination A* solver</div>
          </button>
          <button
            type="button"
            onClick={onNavigateToDistricts}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">2. District Matrix</div>
            <div className="text-muted-foreground font-normal mt-0.5">8 Northeast states connectivity</div>
          </button>
          <button
            type="button"
            onClick={onNavigateToAdvisories}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">3. Road Advisories</div>
            <div className="text-muted-foreground font-normal mt-0.5">Verified blockages & detours</div>
          </button>
          <button
            type="button"
            onClick={onNavigateToSystem}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">4. System & Data</div>
            <div className="text-muted-foreground font-normal mt-0.5">Census & OSM graph architecture</div>
          </button>
        </div>
      </section>
    </div>
  );
};
