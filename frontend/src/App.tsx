import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpDown,
  Check,
  CloudRain,
  Compass,
  Download,
  Info,
  Loader2,
  LocateFixed,
  MapPin,
  Milestone,
  Mountain,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Snowflake,
  Sun,
  Truck,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  CITIES,
  CITY_MAP,
  City,
  EDGES,
  STRATEGIC_CORRIDORS,
  VEHICLE_PROFILES,
  VehicleType,
  WEATHER_PROFILES,
  computeStats,
  findNearestCity,
  formatHours,
  getAdjustedEdgeRisk,
  getAutomaticWeatherForLocation,
  getIntermediateCities,
  getRouteLegs,
  solvePath,
  toPolylinePoints,
} from "./routeData";
import { IntroPage } from "./IntroPage";

interface CityComboboxProps {
  label: "Origin" | "Destination";
  tone: "signal" | "hazard";
  selectedId: string;
  onSelect: (id: string) => void;
  otherCityId: string;
}

function CityCombobox({
  label,
  tone,
  selectedId,
  onSelect,
  otherCityId,
}: CityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCity = CITY_MAP[selectedId];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CITIES.filter((c) => {
      if (c.id === otherCityId) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [query, otherCityId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const borderClass =
    tone === "signal"
      ? "border-emerald-500/60 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/30"
      : "border-rose-500/60 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-400/30";

  return (
    <div ref={containerRef} className="relative flex-1">
      <label className="mb-1 block text-xs font-mono uppercase tracking-wider font-bold text-slate-300">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-slate-900/95 px-3 py-2.5 shadow-md transition-all ${borderClass}`}
      >
        <MapPin
          className={`size-4 shrink-0 ${
            tone === "signal" ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
          }`}
        />
        {open ? (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type city, state, or border outpost..."
            className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setQuery("");
            }}
            className="flex w-full items-center justify-between text-left text-sm cursor-pointer"
          >
            <span className="font-bold text-white">
              {selectedCity?.name}
              <span className="ml-1.5 text-xs text-slate-400 font-normal">
                ({selectedCity?.state})
              </span>
            </span>
            <Search className="size-3.5 text-slate-400 hover:text-cyan-400 transition-colors" />
          </button>
        )}
        {open && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-cyan-500/40 bg-slate-950/98 p-1.5 shadow-2xl backdrop-blur-2xl">
          <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            {filtered.length} locations available
          </div>
          {filtered.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => {
                onSelect(city.id);
                setOpen(false);
                setQuery("");
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all cursor-pointer ${
                city.id === selectedId
                  ? "bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40"
                  : "text-slate-200 hover:bg-slate-800/90 hover:text-white"
              }`}
            >
              <div>
                <div className="font-bold">{city.name}</div>
                <div className="text-xs text-slate-400">
                  {city.state} · {city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E
                </div>
              </div>
              {city.id === selectedId && <Check className="size-4 text-emerald-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function App() {
  // Navigation View: 'intro' (landing/impact page) vs 'console' (routing engine)
  const [activeView, setActiveView] = useState<"intro" | "console">("console");

  const [origin, setOrigin] = useState("guwahati");
  const [destination, setDestination] = useState("tawang");
  const [vehicle, setVehicle] = useState<VehicleType>("heavy");
  const [activeTab, setActiveTab] = useState<"comparison" | "itinerary">("comparison");
  const [hoveredLegIndex, setHoveredLegIndex] = useState<number | null>(null);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // SVG Map Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Read URL search params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    if (viewParam === "intro") setActiveView("intro");
    const fromParam = params.get("from");
    const toParam = params.get("to");
    const vehParam = params.get("vehicle") as VehicleType;
    const tabParam = params.get("tab") as "comparison" | "itinerary";

    if (fromParam && CITY_MAP[fromParam]) setOrigin(fromParam);
    if (toParam && CITY_MAP[toParam] && toParam !== fromParam) setDestination(toParam);
    if (vehParam && VEHICLE_PROFILES[vehParam]) setVehicle(vehParam);
    if (tabParam) setActiveTab(tabParam);
  }, []);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeView === "intro") {
      params.set("view", "intro");
    } else {
      params.set("from", origin);
      params.set("to", destination);
      params.set("vehicle", vehicle);
      params.set("tab", activeTab);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [activeView, origin, destination, vehicle, activeTab]);

  // AUTOMATIC WEATHER INGESTION:
  // Derived automatically from current origin, corridor, and elevation
  const liveWeather = useMemo(() => {
    return getAutomaticWeatherForLocation(origin, destination);
  }, [origin, destination]);

  const weather = liveWeather.condition;

  // Shortest / Nominal route solver (minimizes pure physical distance)
  const shortest = useMemo(() => {
    return solvePath(origin, destination, (edge) => edge.dist);
  }, [origin, destination]);

  // Safe / Terrain & Hazard-Aware route solver (penalizes risk, grade, and weather)
  const safe = useMemo(() => {
    return solvePath(origin, destination, (edge) => {
      const adjRisk = getAdjustedEdgeRisk(edge, vehicle, weather);
      return edge.dist * (1 + adjRisk * 2.5);
    });
  }, [origin, destination, vehicle, weather]);

  const shortestStats = useMemo(
    () => (shortest ? computeStats(shortest, vehicle, weather) : null),
    [shortest, vehicle, weather]
  );
  const safeStats = useMemo(
    () => (safe ? computeStats(safe, vehicle, weather) : null),
    [safe, vehicle, weather]
  );

  // Turn-by-turn legs for the active safe route
  const safeLegs = useMemo(() => {
    if (!safe) return [];
    return getRouteLegs(safe, vehicle, weather);
  }, [safe, vehicle, weather]);

  // Intermediate small cities along the active route
  const intermediateCities = useMemo(() => {
    if (!safe) return [];
    return getIntermediateCities(safe);
  }, [safe]);

  // Risk reduction percentage
  const riskReductionPct = useMemo(() => {
    if (!shortestStats || !safeStats) return 0;
    if (shortestStats.riskIndex === 0) return 0;
    const diff = ((shortestStats.riskIndex - safeStats.riskIndex) / shortestStats.riskIndex) * 100;
    return Math.max(0, Math.round(diff));
  }, [shortestStats, safeStats]);

  // Set of all node IDs currently on the active safe route
  const activeRouteCityIds = useMemo(() => {
    return new Set(safe || []);
  }, [safe]);

  // Origin / Destination Quick-Swap
  const handleSwap = () => {
    const oldOrigin = origin;
    setOrigin(destination);
    setDestination(oldOrigin);
  };

  // GPS Live Location Snap
  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const nearest = findNearestCity(latitude, longitude);
        if (nearest.city.id === destination) {
          setLocationNotice(
            `Snapped to ${nearest.city.name} (${nearest.distanceKm} km away), but it is already your destination.`
          );
        } else {
          setOrigin(nearest.city.id);
          setLocationNotice(
            `GPS locked: nearest logistics node is ${nearest.city.name} (${nearest.distanceKm} km away).`
          );
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationNotice(`Unable to retrieve GPS coordinates (${err.message}).`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Share Route Link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Export Manifest JSON
  const handleExportManifest = () => {
    const manifest = {
      manifestId: `RS-DISPATCH-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      origin: CITY_MAP[origin],
      destination: CITY_MAP[destination],
      vehicleProfile: VEHICLE_PROFILES[vehicle],
      weatherProfile: WEATHER_PROFILES[weather],
      liveMicroclimateTelemetry: liveWeather,
      summary: {
        safeRoute: safeStats,
        nominalShortestRoute: shortestStats,
        riskReductionPercent: riskReductionPct,
      },
      intermediateTransitTowns: intermediateCities,
      turnByTurnLegs: safeLegs,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manifest-${origin}-to-${destination}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dynamic SVG viewBox calculation with zoom & pan
  const svgViewBox = useMemo(() => {
    const baseW = 1000;
    const baseH = 560;
    const w = baseW / zoomLevel;
    const h = baseH / zoomLevel;
    const x = (baseW - w) / 2 + panOffset.x;
    const y = (baseH - h) / 2 + panOffset.y;
    return `${x} ${y} ${w} ${h}`;
  }, [zoomLevel, panOffset]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, z - 0.3));
  const handleResetZoom = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  // If user is looking at the Intro / Mission Impact page
  if (activeView === "intro") {
    return (
      <div className="relative">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-emerald-500/30 bg-slate-950/95 backdrop-blur-2xl px-4 py-3 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/30 glow-emerald">
                <div className="size-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <Mountain className="size-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                  RaahSetu
                </span>
                <span className="ml-2.5 text-xs font-mono font-bold text-cyan-400 hidden sm:inline">
                  Terrain-Aware Logistics
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView("intro")}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-300 border border-emerald-400/60 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Mission & Crisis Data
              </button>
              <button
                onClick={() => setActiveView("console")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-cyan-500/50 border border-transparent transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Operations Console</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </header>

        <IntroPage
          onLaunchConsole={(from, to) => {
            if (from) setOrigin(from);
            if (to) setDestination(to);
            setActiveView("console");
          }}
        />
      </div>
    );
  }

  // Otherwise render the Live Operations Console
  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 size-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 right-10 size-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* Top Operations Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-500/30 bg-slate-950/95 backdrop-blur-2xl shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/30 glow-emerald">
              <div className="size-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Mountain className="size-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                  RaahSetu
                </span>
                <span className="rounded-md bg-emerald-500/20 border border-emerald-400/60 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-extrabold uppercase tracking-wider shadow-sm">
                  Ops Console
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                Autonomous Terrain & Microclimate Routing Engine
              </p>
            </div>
          </div>

          {/* Navigation View Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActiveView("intro")}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="size-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Mission & Impact Data</span>
            </button>
            <button
              onClick={() => setActiveView("console")}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-300 border border-emerald-400/60 flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Compass className="size-3.5 text-emerald-400" />
              <span>Operations Console</span>
            </button>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-cyan-400 hover:text-white transition-colors cursor-pointer"
              title="Share route link"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5 text-slate-400" />
                  <span className="hidden md:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportManifest}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all cursor-pointer"
              title="Export structured JSON dispatch manifest"
            >
              <Download className="size-3.5 text-slate-950" />
              <span>Export Manifest</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Operations Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-4 space-y-4">
        {/* Strategic Freight Corridors Quick-Picks Ribbon */}
        <section className="rounded-2xl glass-panel p-3.5 shadow-xl">
          <div className="mb-2.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-emerald-300 font-bold">
              <Zap className="size-4 text-emerald-400 animate-pulse" />
              Strategic Mountain Freight Corridors (One-Click Dispatch)
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              {STRATEGIC_CORRIDORS.length} Arteries
            </span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {STRATEGIC_CORRIDORS.map((corridor) => {
              const isSelected =
                origin === corridor.origin && destination === corridor.destination;
              return (
                <button
                  key={corridor.id}
                  onClick={() => {
                    setOrigin(corridor.origin);
                    setDestination(corridor.destination);
                  }}
                  className={`shrink-0 rounded-xl px-3.5 py-2 text-left transition-all border cursor-pointer ${
                    isSelected
                      ? "glass-panel-emerald glow-emerald border-emerald-400 text-white shadow-lg"
                      : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-900"
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{corridor.title}</span>
                    {isSelected && <Check className="size-3 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono font-semibold mt-0.5">
                    {corridor.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Dispatch Controls & Automated Weather Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Route Endpoints & Vehicle Input (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Origin & Destination Card */}
            <div className="rounded-2xl glass-panel p-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <CityCombobox
                  label="Origin"
                  tone="signal"
                  selectedId={origin}
                  onSelect={setOrigin}
                  otherCityId={destination}
                />

                {/* Quick-Swap Button */}
                <div className="pt-5 shrink-0">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-emerald-400 hover:border-emerald-400 transition-all shadow-md cursor-pointer"
                    title="Swap Origin and Destination"
                  >
                    <ArrowUpDown className="size-4" />
                  </button>
                </div>

                <CityCombobox
                  label="Destination"
                  tone="hazard"
                  selectedId={destination}
                  onSelect={setDestination}
                  otherCityId={origin}
                />
              </div>

              {/* GPS Live Locate Button */}
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={handleGpsLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/20 font-bold transition-all cursor-pointer"
                >
                  {isLocating ? (
                    <Loader2 className="size-3.5 animate-spin text-emerald-400" />
                  ) : (
                    <LocateFixed className="size-3.5 text-emerald-400" />
                  )}
                  <span>{isLocating ? "Acquiring GPS..." : "Snap Origin to My Live GPS"}</span>
                </button>

                <div className="text-[11px] text-cyan-400 font-mono font-semibold">
                  111 Connected Logistics Nodes
                </div>
              </div>

              {locationNotice && (
                <div className="mt-2 text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-lg p-2 font-mono">
                  {locationNotice}
                </div>
              )}
            </div>

            {/* Vehicle Profile Selector ONLY (User input requirement) */}
            <div className="rounded-2xl glass-panel p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  <Truck className="size-4 text-cyan-400" />
                  Select Vehicle Dispatch Profile
                </span>
                <span className="text-[11px] text-slate-400">
                  Governs Hill Speed & Axle Safety Margin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(Object.keys(VEHICLE_PROFILES) as VehicleType[]).map((vKey) => {
                  const prof = VEHICLE_PROFILES[vKey];
                  const isSelected = vehicle === vKey;

                  let cardStyle = "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900";
                  if (isSelected) {
                    if (vKey === "heavy") cardStyle = "glass-panel-amber glow-amber border-amber-400 text-white";
                    else if (vKey === "standard") cardStyle = "glass-panel-cyan glow-cyan border-cyan-400 text-white";
                    else cardStyle = "glass-panel-emerald glow-emerald border-emerald-400 text-white";
                  }

                  return (
                    <button
                      key={vKey}
                      type="button"
                      onClick={() => setVehicle(vKey)}
                      className={`rounded-xl p-3.5 text-left border transition-all cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{prof.name}</span>
                        {isSelected && <Check className="size-3.5 text-emerald-400" />}
                      </div>
                      <div className={`text-[10px] font-mono font-bold ${
                        vKey === "heavy" ? "text-amber-300" : vKey === "standard" ? "text-cyan-300" : "text-emerald-300"
                      }`}>
                        {prof.badge}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">
                        {prof.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AUTOMATIC LIVE WEATHER & MICROCLIMATE HUD (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 rounded-2xl glass-panel p-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                      Automated Live Microclimate Telemetry
                    </span>
                  </div>
                  <span className="neon-badge-cyan text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    Auto-Synced
                  </span>
                </div>

                {/* Weather Main Badge */}
                <div className={`p-4 rounded-xl border mb-3 flex items-center justify-between shadow-lg ${
                  weather === "snow"
                    ? "glass-panel glow-cyan border-sky-400/80 bg-gradient-to-r from-sky-950/70 to-slate-900"
                    : weather === "monsoon"
                    ? "glass-panel-amber glow-amber border-amber-400/80 bg-gradient-to-r from-amber-950/70 to-slate-900"
                    : "glass-panel-emerald glow-emerald border-emerald-400/80 bg-gradient-to-r from-emerald-950/70 to-slate-900"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 shadow-md">
                      {weather === "snow" && <Snowflake className="size-7 text-sky-300 animate-spin" style={{ animationDuration: "12s" }} />}
                      {weather === "monsoon" && <CloudRain className="size-7 text-amber-300" />}
                      {weather === "clear" && <Sun className="size-7 text-emerald-300 animate-pulse" />}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{liveWeather.summary}</div>
                      <div className="text-xs text-slate-300 font-mono font-semibold">
                        {liveWeather.stationName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-white">
                      {liveWeather.tempC > 0 ? `+${liveWeather.tempC}` : liveWeather.tempC}°C
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Ambient Temp</div>
                  </div>
                </div>

                {/* Weather Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Precipitation</div>
                    <div className="text-sm font-black text-cyan-300 mt-0.5">
                      {liveWeather.precipitationMm} mm/h
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Visibility</div>
                    <div className="text-sm font-black text-cyan-300 mt-0.5">
                      {liveWeather.visibilityKm} km
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Road Grip</div>
                    <div className={`text-sm font-black mt-0.5 ${
                      liveWeather.roadFriction > 0.8
                        ? "text-emerald-400"
                        : liveWeather.roadFriction > 0.6
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}>
                      {Math.round(liveWeather.roadFriction * 100)}%
                    </div>
                  </div>
                </div>

                {/* Advisory Notice */}
                <div className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-amber-500/30 text-xs text-slate-200 flex items-start gap-2.5 shadow-sm">
                  <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <p className="leading-relaxed">{liveWeather.advisory}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-800 flex items-center justify-between">
                <span>Microclimate algorithm active</span>
                <span className="text-emerald-400 font-bold">Zero-user input required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intermediate Small Cities Ribbon */}
        {intermediateCities.length > 0 && (
          <section className="rounded-2xl glass-panel p-3.5 shadow-xl">
            <div className="flex items-center justify-between mb-2.5">
              <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                <Milestone className="size-4 text-cyan-400" />
                Transit Checkpoints & Intermediate Towns ({intermediateCities.length})
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                All settlements along active safe corridor
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {intermediateCities.map((city, idx) => (
                <div
                  key={city.id}
                  className="shrink-0 flex items-center gap-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 text-xs shadow-sm hover:border-cyan-400 transition-colors"
                >
                  <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-white">{city.name}</span>
                  <span className="text-[10px] text-cyan-300 font-mono">({city.state})</span>
                  {idx < intermediateCities.length - 1 && (
                    <ArrowRight className="size-3 text-slate-500 ml-1" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive SVG Cartographic Map */}
        <section className="relative rounded-2xl glass-panel p-4 shadow-2xl overflow-hidden">
          {/* Map Controls & Status Header */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                <MapPin className="size-4 text-emerald-400" />
                Northeast India Operational Network (111 Nodes / 164 Corridors)
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700 shadow-md">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="size-4 text-cyan-400" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="size-4 text-cyan-400" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2.5 py-1 text-[11px] font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="size-3.5 text-emerald-400" />
                <span>{Math.round(zoomLevel * 100)}%</span>
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full aspect-[1000/560] max-h-[580px] bg-[#04060d] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <svg
              viewBox={svgViewBox}
              className="w-full h-full select-none cursor-crosshair"
            >
              <defs>
                <filter id="glow-safe" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-hazard" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-node" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="safe-corridor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Stylized Brahmaputra River Artery (Luminous Cyan) */}
              <path
                d="M 90 290 Q 250 270 420 250 T 680 210 T 880 180"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeOpacity="0.3"
                strokeLinecap="round"
              />
              <path
                d="M 90 290 Q 250 270 420 250 T 680 210 T 880 180"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeOpacity="0.75"
                strokeLinecap="round"
              />
              <text
                x="320"
                y="262"
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                opacity="0.55"
                letterSpacing="4"
              >
                BRAHMAPUTRA VALLEY BASIN
              </text>

              {/* State Labels in visible stylish slate typography */}
              <text x="360" y="295" fill="#64748b" fontSize="13" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">ASSAM</text>
              <text x="560" y="110" fill="#64748b" fontSize="13" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">ARUNACHAL PRADESH</text>
              <text x="240" y="385" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">MEGHALAYA</text>
              <text x="690" y="295" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">NAGALAND</text>
              <text x="670" y="420" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">MANIPUR</text>
              <text x="520" y="520" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">MIZORAM</text>
              <text x="350" y="490" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">TRIPURA</text>
              <text x="80" y="140" fill="#64748b" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.45" letterSpacing="3">SIKKIM</text>

              {/* All Network Edges */}
              {EDGES.map((edge) => {
                const a = CITY_MAP[edge.a];
                const b = CITY_MAP[edge.b];
                return (
                  <line
                    key={`${edge.a}-${edge.b}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                );
              })}

              {/* Shortest / Nominal Route (Bright Hazard Amber Dashed Laser) */}
              {shortest && (
                <polyline
                  points={toPolylinePoints(shortest)}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray="7 4"
                  strokeOpacity="0.85"
                />
              )}

              {/* Safe / Terrain-Aware Route (Glowing Neon Emerald Beam) */}
              {safe && (
                <>
                  <polyline
                    points={toPolylinePoints(safe)}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeOpacity="0.35"
                    filter="url(#glow-safe)"
                  />
                  <polyline
                    points={toPolylinePoints(safe)}
                    fill="none"
                    stroke="url(#safe-corridor-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Hovered Itinerary Leg Highlight (Pulsing Gold Laser) */}
              {hoveredLegIndex !== null && safeLegs[hoveredLegIndex] && (
                <line
                  x1={safeLegs[hoveredLegIndex].fromCity.x}
                  y1={safeLegs[hoveredLegIndex].fromCity.y}
                  x2={safeLegs[hoveredLegIndex].toCity.x}
                  y2={safeLegs[hoveredLegIndex].toCity.y}
                  stroke="#fde047"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glow-hazard)"
                />
              )}

              {/* Network City Nodes */}
              {CITIES.map((city) => {
                const isOrigin = city.id === origin;
                const isDest = city.id === destination;
                const isOnRoute = activeRouteCityIds.has(city.id);

                if (isOrigin) {
                  return (
                    <g key={city.id} className="cursor-pointer">
                      <circle cx={city.x} cy={city.y} r="20" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.7" className="radar-ping" />
                      <circle cx={city.x} cy={city.y} r="13" fill="#10b981" fillOpacity="0.4" />
                      <circle cx={city.x} cy={city.y} r="6.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                      <text
                        x={city.x}
                        y={city.y - 13}
                        textAnchor="middle"
                        fill="#34d399"
                        fontSize="12"
                        fontWeight="900"
                        filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.9))"
                      >
                        {city.name} (Origin)
                      </text>
                    </g>
                  );
                }

                if (isDest) {
                  return (
                    <g key={city.id} className="cursor-pointer">
                      <circle cx={city.x} cy={city.y} r="20" fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.7" className="radar-ping" />
                      <circle cx={city.x} cy={city.y} r="13" fill="#f43f5e" fillOpacity="0.4" />
                      <circle cx={city.x} cy={city.y} r="6.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
                      <text
                        x={city.x}
                        y={city.y - 13}
                        textAnchor="middle"
                        fill="#fb7185"
                        fontSize="12"
                        fontWeight="900"
                        filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.9))"
                      >
                        {city.name} (Dest)
                      </text>
                    </g>
                  );
                }

                if (isOnRoute) {
                  // Intermediate Small Towns along the Route
                  return (
                    <g
                      key={city.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredCity(city)}
                      onMouseLeave={() => setHoveredCity(null)}
                    >
                      <circle cx={city.x} cy={city.y} r="9" fill="#06b6d4" fillOpacity="0.4" />
                      <circle cx={city.x} cy={city.y} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        x={city.x}
                        y={city.y + 14}
                        textAnchor="middle"
                        fill="#7dd3fc"
                        fontSize="9.5"
                        fontWeight="bold"
                        filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.9))"
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                }

                // Inactive Nodes
                return (
                  <circle
                    key={city.id}
                    cx={city.x}
                    cy={city.y}
                    r="2.5"
                    fill="#64748b"
                    opacity="0.45"
                    className="hover:opacity-100 hover:fill-cyan-300 cursor-pointer transition-colors"
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => {
                      if (!origin) setOrigin(city.id);
                      else setDestination(city.id);
                    }}
                  />
                );
              })}
            </svg>

            {/* Hovered City HUD Tooltip */}
            {hoveredCity && (
              <div className="absolute bottom-3 left-3 glass-panel-cyan glow-cyan rounded-xl px-3.5 py-2.5 text-xs backdrop-blur-md shadow-2xl pointer-events-none">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-cyan-400" />
                  <span>{hoveredCity.name}</span>
                  <span className="text-[10px] font-mono text-cyan-300">({hoveredCity.state})</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300 mt-1">
                  Lat: {hoveredCity.lat.toFixed(3)}°N · Lon: {hoveredCity.lon.toFixed(3)}°E
                </div>
              </div>
            )}

            {/* Map Legend */}
            <div className="absolute top-3 right-3 glass-panel rounded-xl p-3 text-[11px] backdrop-blur-md font-mono space-y-1.5 pointer-events-none shadow-lg">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-emerald-400 glow-emerald" />
                <span className="text-emerald-300 font-bold">Terrain-Aware Safe Corridor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full border-2 border-amber-400 border-dashed" />
                <span className="text-amber-300 font-bold">Nominal Shortest (High Risk)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-cyan-400 glow-cyan" />
                <span className="text-cyan-300 font-bold">Transit Town Waypoint</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dual View: Route Comparison vs. Turn-by-Turn Leg Itinerary */}
        <section className="space-y-4">
          {/* Tab Controls */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("comparison")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "comparison"
                    ? "glass-panel-emerald glow-emerald text-emerald-300 border-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                Route Safety Comparison
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("itinerary")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "itinerary"
                    ? "glass-panel-cyan glow-cyan text-cyan-300 border-cyan-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <span>Turn-by-Turn Itinerary</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                  {safeLegs.length} Legs
                </span>
              </button>
            </div>

            {riskReductionPct > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/50 glow-emerald">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>{riskReductionPct}% Hazard Exposure Reduced</span>
              </div>
            )}
          </div>

          {/* TAB 1: Route Comparison Cards */}
          {activeTab === "comparison" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Safe Route Card */}
              <div className="rounded-2xl glass-panel-emerald glow-emerald p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3.5 py-1.5 bg-emerald-500/30 border-b border-l border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-black rounded-bl-xl uppercase tracking-wider">
                  Recommended Dispatch
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Terrain & Risk-Aware Route
                    </h3>
                    <p className="text-xs text-emerald-300 font-mono font-semibold">
                      Safe Mountain Logistics Corridor
                    </p>
                  </div>
                </div>

                {safeStats && safe ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Distance</div>
                        <div className="text-sm font-black text-white mt-0.5">
                          {safeStats.distance} km
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Est. Time</div>
                        <div className="text-sm font-black text-emerald-400 mt-0.5">
                          {formatHours(safeStats.hours)}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Exposure</div>
                        <div className="text-sm font-black text-emerald-400 mt-0.5">
                          {safeStats.riskIndex} pts
                        </div>
                      </div>
                    </div>

                    {/* Path Breadcrumbs */}
                    <div>
                      <div className="text-[11px] font-mono text-cyan-300 mb-1.5 uppercase tracking-wider font-bold">
                        Waypoint Sequence ({safe.length} Checkpoints)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {safe.map((cityId, idx) => (
                          <span
                            key={cityId}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 border border-cyan-500/30 px-2 py-1 text-xs text-slate-200 font-mono font-semibold"
                          >
                            <span>{CITY_MAP[cityId]?.name}</span>
                            {idx < safe.length - 1 && (
                              <ArrowRight className="size-3 text-cyan-400" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-rose-400">No traversable path found.</div>
                )}
              </div>

              {/* Shortest Route Card */}
              <div className="rounded-2xl glass-panel-amber glow-amber p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3.5 py-1.5 bg-amber-500/30 border-b border-l border-amber-400/50 text-amber-300 text-[10px] font-mono font-black rounded-bl-xl uppercase tracking-wider">
                  Nominal Distance Only
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Fastest Nominal Route
                    </h3>
                    <p className="text-xs text-amber-300 font-mono font-semibold">
                      Unconstrained Shortest Distance
                    </p>
                  </div>
                </div>

                {shortestStats && shortest ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Distance</div>
                        <div className="text-sm font-black text-white mt-0.5">
                          {shortestStats.distance} km
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Est. Time</div>
                        <div className="text-sm font-black text-amber-400 mt-0.5">
                          {formatHours(shortestStats.hours)}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Exposure</div>
                        <div className="text-sm font-black text-amber-400 mt-0.5">
                          {shortestStats.riskIndex} pts
                        </div>
                      </div>
                    </div>

                    {/* Path Breadcrumbs */}
                    <div>
                      <div className="text-[11px] font-mono text-amber-300 mb-1.5 uppercase tracking-wider font-bold">
                        Waypoint Sequence ({shortest.length} Checkpoints)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {shortest.map((cityId, idx) => (
                          <span
                            key={cityId}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-900/80 border border-amber-500/30 px-2 py-1 text-xs text-slate-300 font-mono"
                          >
                            <span>{CITY_MAP[cityId]?.name}</span>
                            {idx < shortest.length - 1 && (
                              <ArrowRight className="size-3 text-amber-400" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-rose-400">No traversable path found.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Turn-by-Turn Leg Itinerary */}
          {activeTab === "itinerary" && (
            <div className="rounded-2xl glass-panel p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="text-cyan-300 font-bold">Hover a leg to spotlight on map in gold</span>
                <span>Calculated under {VEHICLE_PROFILES[vehicle].name} & {liveWeather.summary}</span>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                {safeLegs.map((leg, idx) => (
                  <div
                    key={`${leg.fromId}-${leg.toId}-${idx}`}
                    onMouseEnter={() => setHoveredLegIndex(idx)}
                    onMouseLeave={() => setHoveredLegIndex(null)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      hoveredLegIndex === idx
                        ? "border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/10"
                        : "border-slate-800 bg-slate-900/80 hover:border-cyan-400 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="size-6 rounded-lg bg-slate-800 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold border border-slate-700">
                          {idx + 1}
                        </span>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{leg.fromCity.name}</span>
                          <ArrowRight className="size-3.5 text-cyan-400" />
                          <span>{leg.toCity.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          leg.terrainType === "High Mountain Pass"
                            ? "neon-badge-rose"
                            : leg.terrainType === "Foothills"
                            ? "neon-badge-amber"
                            : "neon-badge-emerald"
                        }`}>
                          {leg.terrainType}
                        </span>
                        <span className="text-white font-bold">{leg.dist} km</span>
                        <span className="text-slate-400">({formatHours(leg.hours)})</span>
                        <span className={`font-bold ${
                          leg.risk > 40 ? "text-rose-400" : leg.risk > 20 ? "text-amber-400" : "text-emerald-400"
                        }`}>
                          {leg.risk}% Risk
                        </span>
                      </div>
                    </div>

                    {leg.note && (
                      <p className="text-xs text-slate-300 mt-2 pl-8 border-l-2 border-slate-700">
                        {leg.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
