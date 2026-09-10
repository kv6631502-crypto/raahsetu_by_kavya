import React from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  LogIn,
  Mountain,
  Navigation,
  Route,
  Shield,
  Sparkles,
  XCircle,
} from "lucide-react";
import { STRATEGIC_CORRIDORS } from "./routeData";
import ConstellationGrid from "@/components/ui/constellation-grid";
import {
  SupportedLanguage,
  TRANSLATIONS,
  getCityName,
  getStateName,
  getBlockageDetails,
  getCorridorDetails,
} from "./translations";

interface RoadBlockage {
  id: string;
  road: string;
  cities: string;
  originId: string;
  destinationId: string;
  state: string;
  exactSpot: string;
  cause: string;
  avoidInfo: string;
  detourRoute: string;
  severity: "CRITICAL" | "HIGH";
}

const INTRO_ROAD_BLOCKAGES: RoadBlockage[] = [
  {
    id: "BLK-NH10-SIKKIM",
    road: "NH-10 National Highway",
    cities: "Gangtok ⟷ Siliguri",
    originId: "gangtok",
    destinationId: "siliguri",
    state: "Sikkim",
    exactSpot: "29th Mile & Teesta Bazaar (km 42)",
    cause: "Severe Monsoon Hill Landslide & Road Bed Subsidence",
    avoidInfo: "NH-10 Teesta River Corridor closed to heavy multi-axle freight",
    detourRoute: "Divert via Lava – Algarah – Kalimpong Bypass Corridor",
    severity: "CRITICAL",
  },
  {
    id: "BLK-NH29-NAGALAND",
    road: "NH-29 Lifeline Corridor",
    cities: "Dimapur ⟷ Kohima",
    originId: "dimapur",
    destinationId: "kohima",
    state: "Nagaland",
    exactSpot: "Pagla Pahar Gorge (km 124)",
    cause: "Active Mudslide, Heavy Hill Seepage & Boulder Collapse",
    avoidInfo: "Main gorge corridor obstructed; heavy freight backlog",
    detourRoute: "Divert via Niuland – Kohima Alternate Bypass Highway",
    severity: "CRITICAL",
  },
  {
    id: "BLK-NH13-ARUNACHAL",
    road: "NH-13 Trans-Arunachal Highway",
    cities: "Bomdila ⟷ Tawang",
    originId: "bomdila",
    destinationId: "tawang",
    state: "Arunachal Pradesh",
    exactSpot: "Sela Pass Summit (13,700 ft)",
    cause: "Rockfall, Snow Avalanche & Freezing Black Ice",
    avoidInfo: "High Sela Ridge Top hazardous without anti-skid tire chains",
    detourRoute: "Use Sela Tunnel Lower Bypass with BRO Convoy escort",
    severity: "HIGH",
  },
  {
    id: "BLK-NH306-MIZORAM",
    road: "NH-306 Essential Lifeline",
    cities: "Silchar ⟷ Aizawl",
    originId: "silchar",
    destinationId: "aizawl",
    state: "Mizoram",
    exactSpot: "Vairengte Hill Slopes (km 18)",
    cause: "Road Fracture & River Erosion from Torrential Rains",
    avoidInfo: "Single lane alternating transit for 16T+ freight",
    detourRoute: "Use Bairabi – Sairang Freight Link Corridor",
    severity: "HIGH",
  },
];

interface IntroPageProps {
  onLaunchConsole: (origin?: string, destination?: string) => void;
  onNavigateToAuth: () => void;
  onNavigateToDistricts: () => void;
  onNavigateToAdvisories: () => void;
  onNavigateToSystem: () => void;
  lang?: SupportedLanguage;
}

export const IntroPage: React.FC<IntroPageProps> = ({
  onLaunchConsole,
  onNavigateToAuth,
  onNavigateToDistricts,
  onNavigateToAdvisories,
  onNavigateToSystem,
  lang = "en",
}) => {
  const t = TRANSLATIONS[lang];
  const handleScrollToAdvisories = () => {
    document.getElementById("advisories-and-intro-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. FULL-SCREEN WELCOME SECTION WITH KINETIC CONSTELLATION MESH */}
      <section className="relative min-h-[calc(100vh-4.5rem)] w-full rounded-3xl border border-border bg-card overflow-hidden shadow-2xl flex flex-col justify-center">
        <ConstellationGrid
          fullHeight={true}
          className="min-h-[calc(100vh-4.5rem)]"
        >
          <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 text-center flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            {/* National Logistics Grid Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold backdrop-blur-md">
              <Mountain className="size-3.5 text-primary" />
              <span>{t.heroBadge}</span>
              <Sparkles className="size-3 text-primary animate-pulse" />
            </div>

            {/* Main Welcome Heading */}
            <div className="space-y-3">
              <div className="text-xs sm:text-sm font-mono tracking-widest text-muted-foreground uppercase">
                {t.welcomeTo}
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08]">
                {t.brandName}{" "}
                {lang !== "en" && (
                  <span className="text-primary font-serif font-normal text-3xl sm:text-5xl md:text-6xl block sm:inline">
                    (RaahSetu)
                  </span>
                )}
                {lang === "en" && (
                  <span className="text-primary font-serif font-normal text-3xl sm:text-5xl md:text-6xl block sm:inline">
                    (राहसेतु)
                  </span>
                )}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t.heroDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleScrollToAdvisories}
                className="px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.getStarted}</span>
                <ArrowDown className="size-4 animate-bounce" />
              </button>

              <button
                type="button"
                onClick={() => onLaunchConsole()}
                className="px-5 py-3.5 rounded-xl border border-border bg-secondary/80 backdrop-blur-md text-foreground font-semibold text-sm hover:bg-secondary transition-all cursor-pointer flex items-center gap-2"
              >
                <Navigation className="size-4 text-primary" />
                <span>{t.launchDispatcher}</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToAuth}
                className="px-5 py-3.5 rounded-xl border border-border bg-card/80 backdrop-blur-md text-muted-foreground hover:text-foreground font-medium text-sm hover:bg-secondary transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn className="size-4 text-primary" />
                <span>{t.driverLogin}</span>
              </button>
            </div>

            {/* Telemetry Bar (3D Glassmorphic Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-4">
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">111</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{t.statBeacons}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{t.statSolvers}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{t.statSolversSub}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">{t.statHazards}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{t.statHazardsSub}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border shadow-xs hover:-translate-y-0.5 transition-transform text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{t.statStates}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{t.statStatesSub}</div>
              </div>
            </div>

            {/* Interactive Kinetic Mesh Tip & Slide Down Prompt */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleScrollToAdvisories}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline cursor-pointer pt-1 transition-transform hover:translate-y-0.5"
              >
                <span>{t.getStarted} ↓</span>
              </button>
            </div>
          </div>
        </ConstellationGrid>
      </section>

      {/* 2. THE INTRO PAGE: FROM WHERE THE ADVISORY STARTS */}
      <section id="advisories-and-intro-section" className="space-y-8 scroll-mt-8">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Shield className="size-3" />
              <span>{t.liveHighwayAdvisory}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t.advisoriesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {t.advisoriesSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToAdvisories}
            className="px-4 py-2 rounded-xl border border-border bg-secondary hover:bg-muted text-foreground text-xs font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <span>{t.tabAdvisories}</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* Advisory Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTRO_ROAD_BLOCKAGES.map((blk) => {
            const b = getBlockageDetails(blk.id, lang, blk);
            return (
              <div
                key={blk.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  blk.severity === "CRITICAL"
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-amber-500/30 bg-amber-500/5"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        blk.severity === "CRITICAL"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {blk.severity === "CRITICAL" ? t.critical : t.high}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground truncate">{getStateName(blk.state, lang)}</span>
                  </div>

                  <div className="font-bold text-sm text-foreground">{b.road}</div>
                  <div className="text-xs text-primary font-medium">
                    {getCityName(blk.originId, lang)} ⟷ {getCityName(blk.destinationId, lang)}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{b.cause}</p>

                  <div className="p-2.5 rounded-xl bg-background/80 border border-border/80 text-[11px] space-y-1">
                    <div className="font-semibold text-foreground">{t.recommendedDetour}:</div>
                    <div className="text-muted-foreground">{b.detourRoute}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onLaunchConsole(blk.originId, blk.destinationId)}
                  className="w-full py-2 px-3 rounded-xl bg-card border border-border hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-2xs group"
                >
                  <span>{t.inspectInDispatcher}</span>
                  <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. GROUND REALITY & CRISIS EVIDENCE */}
      <section className="space-y-6">
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

      {/* 4. THE BLIND SPOT: CONVENTIONAL NAVIGATION VS RAAHSETU */}
      <section className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xs space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Route className="size-3" />
            <span>{t.whyRaahSetu}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t.problemTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t.problemDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Conventional GPS */}
          <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <XCircle className="size-4" />
                <span>Conventional Consumer Navigation</span>
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
                <span>{t.solutionTitle}</span>
              </div>
              <span className="text-[10px] font-mono text-primary uppercase px-2 py-0.5 rounded bg-primary/10">Terrain Dual-Solve</span>
            </div>

            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span><strong>{t.pillar1Title}:</strong> {t.pillar1Desc}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span><strong>{t.pillar2Title}:</strong> {t.pillar2Desc}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span><strong>{t.pillar3Title}:</strong> {t.pillar3Desc}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. STRATEGIC PRESETS & QUICK LAUNCH */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">{t.strategicCorridorsTitle}</h3>
            <p className="text-xs text-muted-foreground">{t.strategicCorridorsSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => onLaunchConsole()}
            className="text-primary font-semibold text-xs hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t.navDispatcher}</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STRATEGIC_CORRIDORS.map((c) => {
            const cor = getCorridorDetails(c, lang);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onLaunchConsole(c.origin, c.destination)}
                className="p-4 rounded-2xl border border-border bg-card hover:bg-secondary/60 hover:border-primary/40 text-left transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {getCityName(c.origin, lang)} ➔ {getCityName(c.destination, lang)}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {cor.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{cor.description}</p>
                <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] text-primary font-medium">
                  <span>{t.inspectInDispatcher}</span>
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. REDIRECT DIRECTORY LINKS */}
      <section className="p-6 rounded-2xl border border-border bg-secondary/40 space-y-4">
        <h3 className="text-sm font-bold text-foreground">Explore Platform Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            type="button"
            onClick={() => onLaunchConsole()}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">1. {t.navDispatcher}</div>
            <div className="text-muted-foreground font-normal mt-0.5">{t.compareRoutes}</div>
          </button>
          <button
            type="button"
            onClick={onNavigateToDistricts}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">2. {t.navDistricts}</div>
            <div className="text-muted-foreground font-normal mt-0.5">{t.districtHealthSubtitle}</div>
          </button>
          <button
            type="button"
            onClick={onNavigateToAdvisories}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">3. {t.tabAdvisories}</div>
            <div className="text-muted-foreground font-normal mt-0.5">{t.advisoriesSubtitle}</div>
          </button>
          <button
            type="button"
            onClick={onNavigateToSystem}
            className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-left font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
          >
            <div className="text-primary font-bold">4. {t.navArchitecture}</div>
            <div className="text-muted-foreground font-normal mt-0.5">{t.dataPageTitle}</div>
          </button>
        </div>
      </section>
    </div>
  );
};
