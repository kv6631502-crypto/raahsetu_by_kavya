import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpDown,
  Check,
  Clock,
  CloudRain,
  Database,
  Download,
  FileWarning,
  Info,
  Loader2,
  LocateFixed,
  MapPin,
  Milestone,
  Mountain,
  RotateCcw,
  Route as RouteIcon,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sun,
  TriangleAlert,
  Truck,
  Waypoints,
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
  WeatherCondition,
  computeStats,
  findNearestCity,
  formatHours,
  getAdjustedEdgeRisk,
  getRouteLegs,
  projectGeoToSvg,
  solvePath,
  speed,
  toPolylinePoints,
} from "./routeData";

interface CityComboboxProps {
  label: "Origin" | "Destination";
  tone: "signal" | "hazard";
  value: string;
  exclude: string;
  onChange: (id: string) => void;
  onGpsLocate?: () => void;
  isLocating?: boolean;
}

function CityCombobox({
  label,
  tone,
  value,
  exclude,
  onChange,
  onGpsLocate,
  isLocating,
}: CityComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCity = CITY_MAP[value] || CITIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CITIES.filter(
      (c) =>
        c.id !== exclude &&
        (!q ||
          c.name.toLowerCase().startsWith(q) ||
          c.name.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q))
    ).sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [query, exclude]);

  function handleSelect(id: string) {
    onChange(id);
    setQuery("");
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <MapPin
            className={`size-3.5 ${
              tone === "signal" ? "text-signal" : "text-hazard"
            }`}
          />{" "}
          {label}
        </span>
        {onGpsLocate && (
          <button
            type="button"
            onClick={onGpsLocate}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-signal transition-all hover:border-signal hover:bg-signal/20 disabled:cursor-not-allowed disabled:opacity-60"
            title="Detect live GPS coordinates and snap to closest city"
          >
            {isLocating ? (
              <>
                <Loader2 className="size-3 animate-spin text-signal" />
                <span>Locating…</span>
              </>
            ) : (
              <>
                <LocateFixed className="size-3 text-signal" />
                <span>Enable GPS</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${label}-listbox`}
          aria-label={`${label} city`}
          autoComplete="off"
          value={isOpen ? query : `${selectedCity.name} — ${selectedCity.state}`}
          placeholder="Type a city…"
          onFocus={() => {
            setIsOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
              setIsOpen(true);
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                Math.min(prev + 1, filtered.length - 1)
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (filtered[highlightedIndex]) {
                handleSelect(filtered[highlightedIndex].id);
              }
            } else if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
          className="w-full rounded-md border border-input bg-secondary/60 px-9 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/30"
        />
        {isOpen && query && (
          <button
            type="button"
            aria-label="Clear"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          id={`${label}-listbox`}
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-2xl shadow-black/50"
        >
          {onGpsLocate && (
            <li role="presentation" className="border-b border-border/50 pb-1 mb-1">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setIsOpen(false);
                  onGpsLocate();
                }}
                disabled={isLocating}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs font-mono text-signal transition-colors hover:bg-signal/15"
              >
                {isLocating ? (
                  <Loader2 className="size-3.5 animate-spin text-signal shrink-0" />
                ) : (
                  <LocateFixed className="size-3.5 text-signal shrink-0" />
                )}
                <span>
                  {isLocating ? "Detecting GPS coordinates…" : "Use current live GPS location"}
                </span>
              </button>
            </li>
          )}
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No cities match “{query}”.
            </li>
          )}
          {filtered.map((city, idx) => {
            const isHighlighted = idx === highlightedIndex;
            const isSelected = city.id === value;
            return (
              <li key={city.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(city.id)}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors ${
                    isHighlighted
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {city.name}
                    </span>
                    {city.tier === "small" && (
                      <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        town
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {city.state}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatDisplay({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "signal" | "hazard";
}) {
  return (
    <div>
      <div
        className={
          tone === "signal"
            ? "text-lg font-semibold text-signal"
            : tone === "hazard"
            ? "text-lg font-semibold text-hazard"
            : "text-lg font-semibold text-foreground"
        }
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}


interface GpsState {
  lat: number;
  lon: number;
  accuracy: number;
  snappedCity: City;
  distanceKm: number;
  timestamp: number;
}

function RoutePlannerSection() {
  const [origin, setOrigin] = useState("guwahati");
  const [destination, setDestination] = useState("imphal");
  const [vehicle, setVehicle] = useState<VehicleType>("heavy");
  const [weather, setWeather] = useState<WeatherCondition>("clear");
  const [gpsState, setGpsState] = useState<GpsState | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "itinerary">("summary");
  const [hoveredLeg, setHoveredLeg] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Sync with URL parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const o = params.get("origin");
      const d = params.get("dest");
      const v = params.get("vehicle") as VehicleType;
      const w = params.get("weather") as WeatherCondition;
      if (o && CITY_MAP[o]) setOrigin(o);
      if (d && CITY_MAP[d]) setDestination(d);
      if (v && VEHICLE_PROFILES[v]) setVehicle(v);
      if (w && WEATHER_PROFILES[w]) setWeather(w);
    } catch {
      // Ignore URL parse errors
    }
  }, []);

  function handleGpsLocate() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const { city, distanceKm } = findNearestCity(latitude, longitude);
        setGpsState({
          lat: latitude,
          lon: longitude,
          accuracy: Math.round(accuracy),
          snappedCity: city,
          distanceKm,
          timestamp: Date.now(),
        });
        setOrigin(city.id);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError(
            "Location permission was denied. Please allow location access in your browser to use GPS."
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError(
            "GPS position unavailable. Please check that location services are enabled on your device."
          );
        } else if (err.code === err.TIMEOUT) {
          setGpsError("GPS location request timed out. Please try again.");
        } else {
          setGpsError(`Could not detect location: ${err.message}`);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      }
    );
  }

  function handleSwap() {
    const prevOrigin = origin;
    setOrigin(destination);
    setDestination(prevOrigin);
    if (gpsState) setGpsState(null);
  }

  function handleExportManifest() {
    if (!comparison) return;
    const manifest = {
      generatedAt: new Date().toISOString(),
      system: "RaahSetu Logistics Intelligence Platform",
      region: "Northeast India (8 States)",
      origin: CITY_MAP[origin],
      destination: CITY_MAP[destination],
      vehicleProfile: VEHICLE_PROFILES[vehicle],
      weatherScenario: WEATHER_PROFILES[weather],
      recommendedRiskAwareRoute: {
        totalDistanceKm: comparison.safe.distance,
        estimatedHours: Math.round(comparison.safe.hours * 100) / 100,
        riskIndex: comparison.safe.riskIndex,
        stopCount: comparison.safe.path.length,
        path: comparison.safe.path.map((id) => ({
          id,
          name: CITY_MAP[id].name,
          state: CITY_MAP[id].state,
          lat: CITY_MAP[id].lat,
          lon: CITY_MAP[id].lon,
        })),
        legs: routeLegs.map((l) => ({
          from: l.fromCity.name,
          to: l.toCity.name,
          distanceKm: l.dist,
          estimatedHours: Math.round(l.hours * 100) / 100,
          riskScore: l.risk,
          terrain: l.terrainType,
          note: l.note || null,
        })),
      },
      fastestAlternative: {
        totalDistanceKm: comparison.fastest.distance,
        estimatedHours: Math.round(comparison.fastest.hours * 100) / 100,
        riskIndex: comparison.fastest.riskIndex,
        path: comparison.fastest.path.map((id) => CITY_MAP[id].name),
      },
      gpsFix: gpsState
        ? {
            latitude: gpsState.lat,
            longitude: gpsState.lon,
            accuracyMeters: gpsState.accuracy,
            snappedHub: gpsState.snappedCity.name,
            distanceToHubKm: gpsState.distanceKm,
          }
        : null,
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raahsetu-manifest-${origin}-to-${destination}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopyShareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("origin", origin);
    url.searchParams.set("dest", destination);
    url.searchParams.set("vehicle", vehicle);
    url.searchParams.set("weather", weather);
    navigator.clipboard.writeText(url.toString());
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2200);
  }

  function handleZoomIn() {
    setZoomLevel((z) => Math.min(2.2, Math.round((z + 0.3) * 10) / 10));
  }
  function handleZoomOut() {
    setZoomLevel((z) => Math.max(1.0, Math.round((z - 0.3) * 10) / 10));
  }
  function handleZoomReset() {
    setZoomLevel(1.0);
  }

  const comparison = useMemo(() => {
    if (origin === destination) return null;
    const fastestPath = solvePath(
      origin,
      destination,
      (e) => e.dist / speed(e.risk, vehicle, weather)
    );
    const safePath = solvePath(
      origin,
      destination,
      (e) => {
        const effRisk = getAdjustedEdgeRisk(e, vehicle, weather);
        const effSpeed = speed(e.risk, vehicle, weather);
        return e.dist / effSpeed + effRisk * e.dist * 0.055;
      }
    );
    if (!fastestPath || !safePath) return null;
    return {
      fastest: computeStats(fastestPath, vehicle, weather),
      safe: computeStats(safePath, vehicle, weather),
    };
  }, [origin, destination, vehicle, weather]);

  const routeLegs = useMemo(() => {
    if (!comparison) return [];
    return getRouteLegs(comparison.safe.path, vehicle, weather);
  }, [comparison, vehicle, weather]);

  const activeEdges = useMemo(() => {
    const set = new Set<string>();
    if (!comparison) return set;
    for (const r of [comparison.fastest, comparison.safe]) {
      for (let i = 0; i < r.path.length - 1; i++) {
        set.add([r.path[i], r.path[i + 1]].sort().join("-"));
      }
    }
    return set;
  }, [comparison]);

  const activeNodes = useMemo(() => {
    const set = new Set<string>();
    if (comparison) {
      for (const id of comparison.fastest.path) set.add(id);
      for (const id of comparison.safe.path) set.add(id);
    }
    return set;
  }, [comparison]);

  const avoidedHazards = useMemo(() => {
    if (!comparison) return [];
    const safeEdgeSet = new Set(
      comparison.safe.edges.map((e) => [e.a, e.b].sort().join("-"))
    );
    return comparison.fastest.edges.filter(
      (e) => e.note && !safeEdgeSet.has([e.a, e.b].sort().join("-"))
    );
  }, [comparison]);

  const isIdentical =
    comparison &&
    comparison.fastest.path.join(">") === comparison.safe.path.join(">");

  // SVG Dynamic Zoom ViewBox Calculation
  const baseW = 1000;
  const baseH = 560;
  const viewBoxW = baseW / zoomLevel;
  const viewBoxH = baseH / zoomLevel;
  const focusCity = CITY_MAP[origin] || { x: 530, y: 280 };
  const targetCenterX = zoomLevel > 1.0 ? focusCity.x : 500;
  const targetCenterY = zoomLevel > 1.0 ? focusCity.y : 280;
  const minX = Math.max(0, Math.min(baseW - viewBoxW, targetCenterX - viewBoxW / 2));
  const minY = Math.max(0, Math.min(baseH - viewBoxH, targetCenterY - viewBoxH / 2));
  const currentViewBox = `${minX} ${minY} ${viewBoxW} ${viewBoxH}`;

  return (
    <section id="planner" className="relative border-t border-border/70 py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-[0.18]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        
        {/* Operations Telemetry Ribbon */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/60 px-4 py-2.5 shadow-sm backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5 text-signal font-medium">
              <span className="size-2 rounded-full bg-signal node-pulse" />
              <span>111 Active Nodes</span>
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Waypoints className="size-3.5 text-muted-foreground" />
              <span>189 Highway Arcs</span>
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Mountain className="size-3.5 text-muted-foreground" />
              <span>8 Northeast States</span>
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1.5 text-signal">
              <Zap className="size-3.5 text-signal" />
              <span>A* Solver Latency: &lt;4ms</span>
            </span>
          </div>
          <div className="hidden font-mono text-[11px] text-muted-foreground md:block">
            <span>Projection: </span>
            <span className="text-foreground">22.0°N–28.5°N, 88.0°E–96.5°E</span>
          </div>
        </div>

        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Live Dispatch Operations
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Interactive Route Command Center
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Select origin and destination, toggle commercial payload profiles, and simulate
            weather impacts. RaahSetu computes both fastest and risk-aware trajectories
            across all 111 interconnected cities and border lifelines.
          </p>
        </div>

        {/* Strategic Corridors Quick-Picks */}
        <div className="mt-8">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Strategic Freight Corridors
            </span>
            <span className="font-mono text-[11px] text-signal">
              Instant Corridor Simulation
            </span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {STRATEGIC_CORRIDORS.map((corridor) => {
              const isActive = origin === corridor.origin && destination === corridor.destination;
              return (
                <button
                  key={corridor.id}
                  type="button"
                  onClick={() => {
                    setOrigin(corridor.origin);
                    setDestination(corridor.destination);
                    if (gpsState) setGpsState(null);
                  }}
                  className={`group shrink-0 rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-signal bg-signal/15 text-foreground shadow-sm shadow-signal/20 ring-1 ring-signal/30"
                      : "border-border/80 bg-card/80 text-muted-foreground hover:border-signal/50 hover:bg-secondary/70 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-display text-xs font-semibold ${isActive ? "text-signal" : "text-foreground"}`}>
                      {corridor.title}
                    </span>
                    <span className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                      {corridor.tag}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[220px] truncate text-[10px] text-muted-foreground">
                    {corridor.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col gap-5">
            {/* Origin & Destination Card with Quick Swap */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20">
              <div className="relative grid gap-3">
                <CityCombobox
                  label="Origin"
                  tone="signal"
                  value={origin}
                  exclude={destination}
                  onChange={(id) => {
                    setOrigin(id);
                    if (gpsState && id !== gpsState.snappedCity.id) {
                      setGpsState(null);
                    }
                  }}
                  onGpsLocate={handleGpsLocate}
                  isLocating={isLocating}
                />

                {/* Swap Origin / Destination Button */}
                <div className="relative my-1 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border/70" />
                  </div>
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="relative inline-flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-signal hover:bg-secondary hover:text-signal hover:scale-110 active:scale-95"
                    title="Swap Origin and Destination"
                    aria-label="Swap Origin and Destination"
                  >
                    <ArrowUpDown className="size-3.5" />
                  </button>
                </div>

                <CityCombobox
                  label="Destination"
                  tone="hazard"
                  value={destination}
                  exclude={origin}
                  onChange={setDestination}
                />
              </div>

              {gpsState && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-signal/30 bg-signal/[0.08] p-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-signal" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-signal">
                        <LocateFixed className="size-3.5" />
                        <span className="font-semibold">Live GPS Active:</span>
                        <span className="text-foreground">
                          {gpsState.lat.toFixed(4)}°N, {gpsState.lon.toFixed(4)}°E
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          (±{gpsState.accuracy}m)
                        </span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground">
                        Snapped to closest network hub:{" "}
                        <strong className="text-foreground">
                          {gpsState.snappedCity.name}
                        </strong>{" "}
                        ({gpsState.distanceKm} km away)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGpsState(null)}
                    className="ml-2 rounded px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
              )}

              {gpsError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-hazard/40 bg-hazard/10 p-3 text-xs text-hazard">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <div className="flex-1">
                    <span>{gpsError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGpsError(null)}
                    className="ml-1 font-mono text-[11px] text-hazard/70 hover:text-hazard"
                  >
                    ✕
                  </button>
                </div>
              )}

              {origin === destination && (
                <p className="mt-4 flex items-center gap-2 rounded-md border border-hazard/40 bg-hazard/10 px-3 py-2 text-xs text-hazard">
                  <TriangleAlert className="size-3.5" />
                  Choose two different cities to solve a route.
                </p>
              )}

              {/* Operational Dispatch Simulation Profiles */}
              <div className="mt-4 rounded-xl border border-border/70 bg-secondary/30 p-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <SlidersHorizontal className="size-3.5 text-signal" />
                    Operational Dispatch Parameters
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Reactive A* weights
                  </span>
                </div>

                {/* Vehicle Payload Class */}
                <div className="mb-3">
                  <span className="mb-1.5 block font-mono text-[10px] uppercase text-muted-foreground">
                    Vehicle Class
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(VEHICLE_PROFILES) as VehicleType[]).map((vKey) => {
                      const vp = VEHICLE_PROFILES[vKey];
                      const isSelected = vehicle === vKey;
                      return (
                        <button
                          key={vKey}
                          type="button"
                          onClick={() => setVehicle(vKey)}
                          className={`flex flex-col items-start rounded-lg border p-2 text-left transition-colors ${
                            isSelected
                              ? "border-signal bg-signal/15 text-foreground ring-1 ring-signal/30"
                              : "border-border/60 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-foreground">
                            <Truck className="size-3 text-signal" />
                            {vp.badge}
                          </span>
                          <span className="mt-0.5 w-full truncate font-mono text-[9px] text-muted-foreground">
                            {vp.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Weather Scenario Toggle */}
                <div>
                  <span className="mb-1.5 block font-mono text-[10px] uppercase text-muted-foreground">
                    Weather Condition
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(WEATHER_PROFILES) as WeatherCondition[]).map((wKey) => {
                      const wp = WEATHER_PROFILES[wKey];
                      const isSelected = weather === wKey;
                      return (
                        <button
                          key={wKey}
                          type="button"
                          onClick={() => setWeather(wKey)}
                          className={`flex flex-col items-start rounded-lg border p-2 text-left transition-colors ${
                            isSelected
                              ? wKey === "clear"
                                ? "border-signal bg-signal/15 text-foreground ring-1 ring-signal/30"
                                : "border-hazard bg-hazard/15 text-foreground ring-1 ring-hazard/30"
                              : "border-border/60 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-foreground">
                            {wKey === "clear" && <Sun className="size-3 text-amber-400" />}
                            {wKey === "monsoon" && <CloudRain className="size-3 text-sky-400" />}
                            {wKey === "snow" && <Snowflake className="size-3 text-cyan-300" />}
                            {wp.name}
                          </span>
                          <span className="mt-0.5 w-full truncate font-mono text-[9px] text-muted-foreground">
                            {wp.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Export Manifest & Share Route */}
              {comparison && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
                  <button
                    type="button"
                    onClick={handleExportManifest}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-signal hover:bg-secondary"
                  >
                    <Download className="size-3.5 text-signal" />
                    <span>Export Manifest (JSON)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-signal hover:bg-secondary"
                  >
                    {copiedShareLink ? (
                      <>
                        <Check className="size-3.5 text-signal" />
                        <span className="text-signal font-medium">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="size-3.5 text-muted-foreground" />
                        <span>Share Route Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Results Navigation Tabs (Comparison vs Turn-by-Turn Manifest) */}
            {comparison && (
              <div className="flex border-b border-border/80 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={`border-b-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === "summary"
                      ? "border-signal text-signal"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Route Comparison
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("itinerary")}
                  className={`border-b-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === "itinerary"
                      ? "border-signal text-signal"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Turn-by-Turn Itinerary ({routeLegs.length} legs)
                </button>
              </div>
            )}

            {comparison && activeTab === "summary" && (
              <>
                <div className="rounded-2xl border border-signal/40 bg-signal/[0.06] p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-display font-semibold text-foreground">
                      <ShieldCheck className="size-4 text-signal" />
                      Risk-aware route
                    </span>
                    <span className="rounded-full border border-signal/40 px-2.5 py-0.5 font-mono text-[11px] text-signal font-medium">
                      recommended
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 font-mono">
                    <StatDisplay
                      label="distance"
                      value={`${comparison.safe.distance} km`}
                    />
                    <StatDisplay
                      label="est. time"
                      value={formatHours(comparison.safe.hours)}
                    />
                    <StatDisplay
                      label="risk index"
                      value={`${comparison.safe.riskIndex}`}
                      tone="signal"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 font-display font-semibold text-hazard">
                    <RouteIcon className="size-4" />
                    Fastest route
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 font-mono">
                    <StatDisplay
                      label="distance"
                      value={`${comparison.fastest.distance} km`}
                    />
                    <StatDisplay
                      label="est. time"
                      value={formatHours(comparison.fastest.hours)}
                    />
                    <StatDisplay
                      label="risk index"
                      value={`${comparison.fastest.riskIndex}`}
                      tone="hazard"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/40 p-5">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Why this route
                  </span>
                  {isIdentical ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      On this pair the fastest path is already the lowest-risk
                      option, so RaahSetu recommends it directly — no trade-off
                      needed.
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        The risk-aware route accepts{" "}
                        <span className="text-foreground font-medium">
                          {formatHours(
                            Math.max(
                              0,
                              comparison.safe.hours - comparison.fastest.hours
                            )
                          )}
                        </span>{" "}
                        extra travel time to cut the risk index from{" "}
                        <span className="text-hazard font-semibold">
                          {comparison.fastest.riskIndex}
                        </span>{" "}
                        to{" "}
                        <span className="text-signal font-semibold">
                          {comparison.safe.riskIndex}
                        </span>
                        .
                      </p>
                      {avoidedHazards.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {avoidedHazards.map((edge) => (
                            <li
                              key={`${edge.a}-${edge.b}`}
                              className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                            >
                              <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-hazard" />
                              <span>
                                Avoids{" "}
                                <span className="text-foreground font-medium">
                                  {CITY_MAP[edge.a].name}–{CITY_MAP[edge.b].name}
                                </span>
                                : {edge.note}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            {comparison && activeTab === "itinerary" && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Turn-by-Turn Leg Manifest
                  </span>
                  <span className="font-mono text-[11px] text-signal">
                    Hover leg to highlight on map
                  </span>
                </div>
                <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                  {routeLegs.map((leg, idx) => {
                    const key = [leg.fromId, leg.toId].sort().join("-");
                    const isHovered = hoveredLeg === key;
                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setHoveredLeg(key)}
                        onMouseLeave={() => setHoveredLeg(null)}
                        className={`rounded-xl border p-3 text-xs transition-all ${
                          isHovered
                            ? "border-signal bg-signal/10 ring-1 ring-signal/40"
                            : "border-border/70 bg-secondary/30 hover:bg-secondary/60"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <div className="flex items-center gap-2">
                            <span className="flex size-5 items-center justify-center rounded-full bg-signal/20 font-mono text-[10px] font-bold text-signal">
                              {idx + 1}
                            </span>
                            <span className="font-medium text-foreground">
                              {leg.fromCity.name} ➔ {leg.toCity.name}
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            {leg.dist} km • {formatHours(leg.hours)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px]">
                          <span className={`rounded px-1.5 py-0.5 font-medium ${
                            leg.risk > 50
                              ? "bg-hazard/20 text-hazard"
                              : "bg-signal/20 text-signal"
                          }`}>
                            Exposure: {leg.risk}/100
                          </span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                            {leg.terrainType}
                          </span>
                          {leg.note && (
                            <span className="flex items-center gap-1 text-hazard truncate max-w-[260px]">
                              <TriangleAlert className="size-3" />
                              {leg.note}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Map */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/70 p-3 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url(/topographic-terrain.png)" }}
            />
            
            {/* Map Header with Zoom Controls */}
            <div className="relative flex items-center justify-between px-2 pb-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  northeast_india.map
                </span>
                <span className="rounded bg-muted/80 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
                  Zoom {Math.round(zoomLevel * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-border bg-secondary/80 p-0.5">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2.2}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Zoom In"
                  >
                    <ZoomIn className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1.0}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Zoom Out"
                  >
                    <ZoomOut className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                    title="Reset View"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-signal">
                  <span className="size-1.5 rounded-full bg-signal" /> solved
                </span>
              </div>
            </div>

            <svg
              viewBox={currentViewBox}
              className="relative w-full transition-all duration-300"
              role="img"
              aria-label={
                comparison
                  ? `Map of Northeast India showing the risk-aware and fastest routes from ${CITY_MAP[origin].name} to ${CITY_MAP[destination].name}`
                  : "Map of Northeast India"
              }
            >
              {/* Background Cartography: Brahmaputra River Corridor */}
              <path
                d="M 940 115 Q 860 145 780 185 T 620 220 T 500 248 T 400 255 T 320 280"
                fill="none"
                stroke="#0284c7"
                strokeWidth={3}
                strokeOpacity={0.25}
                strokeLinecap="round"
                className="pointer-events-none"
              />
              <text
                x="680"
                y="196"
                className="fill-sky-400/20 font-mono text-[9px] uppercase tracking-widest pointer-events-none select-none"
              >
                Brahmaputra Valley
              </text>

              {/* State Labels in Background */}
              <g className="pointer-events-none select-none font-mono text-[10px] font-bold uppercase tracking-[0.2em] fill-muted-foreground/15">
                <text x="135" y="90">Sikkim</text>
                <text x="680" y="100">Arunachal Pradesh</text>
                <text x="620" y="240">Assam</text>
                <text x="460" y="325">Meghalaya</text>
                <text x="830" y="235">Nagaland</text>
                <text x="800" y="420">Manipur</text>
                <text x="655" y="480">Mizoram</text>
                <text x="465" y="490">Tripura</text>
              </g>

              {/* Road Network Edges */}
              {EDGES.map((edge) => {
                const u = CITY_MAP[edge.a];
                const v = CITY_MAP[edge.b];
                const key = [edge.a, edge.b].sort().join("-");
                const isActive = activeEdges.has(key);
                const isHovered = hoveredLeg === key;
                return (
                  <line
                    key={key}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={isHovered ? "var(--signal)" : "currentColor"}
                    strokeWidth={isHovered ? 4.5 : isActive ? 1.5 : 1}
                    className={
                      isHovered
                        ? "text-signal filter drop-shadow-[0_0_6px_var(--signal)]"
                        : isActive
                        ? "text-border"
                        : "text-border/40"
                    }
                  />
                );
              })}

              {/* Fastest Route Polyline */}
              {comparison && !isIdentical && (
                <polyline
                  points={toPolylinePoints(comparison.fastest.path)}
                  fill="none"
                  stroke="var(--hazard)"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 9"
                  opacity={0.88}
                />
              )}

              {/* Safe Route Polyline */}
              {comparison && (
                <polyline
                  points={toPolylinePoints(comparison.safe.path)}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth={4.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="route-flow"
                />
              )}

              {/* Live GPS Beacon Marker */}
              {gpsState && (() => {
                const gpsSvg = projectGeoToSvg(gpsState.lat, gpsState.lon);
                const snapped = CITY_MAP[origin];
                return (
                  <g className="gps-live-beacon pointer-events-none">
                    {snapped && (
                      <line
                        x1={gpsSvg.x}
                        y1={gpsSvg.y}
                        x2={snapped.x}
                        y2={snapped.y}
                        stroke="#38bdf8"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        opacity={0.85}
                      />
                    )}
                    <circle
                      cx={gpsSvg.x}
                      cy={gpsSvg.y}
                      r={18}
                      fill="#38bdf8"
                      opacity={0.2}
                      className="animate-ping"
                    />
                    <circle
                      cx={gpsSvg.x}
                      cy={gpsSvg.y}
                      r={8}
                      fill="#38bdf8"
                      opacity={0.35}
                    />
                    <circle
                      cx={gpsSvg.x}
                      cy={gpsSvg.y}
                      r={4.5}
                      fill="#38bdf8"
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                    <text
                      x={gpsSvg.x}
                      y={gpsSvg.y - 12}
                      textAnchor="middle"
                      className="fill-cyan-400 font-mono text-[11px] font-semibold"
                    >
                      YOU (GPS) • {gpsState.distanceKm} km
                    </text>
                  </g>
                );
              })()}

              {/* City and Town Nodes */}
              {CITIES.map((city) => {
                const isOrigin = city.id === origin;
                const isDest = city.id === destination;
                const isEndpoint = isOrigin || isDest;
                const isInRoute = activeNodes.has(city.id);
                const showLabel = isEndpoint || isInRoute;

                return (
                  <g
                    key={city.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => {
                      if (city.id !== origin) {
                        setDestination(city.id);
                      } else {
                        setOrigin(city.id);
                      }
                    }}
                  >
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isEndpoint ? 7.5 : isInRoute ? 4.5 : city.tier === "major" ? 3.2 : 2.2}
                      fill={
                        isOrigin
                          ? "var(--signal)"
                          : isDest
                          ? "var(--hazard)"
                          : isInRoute
                          ? "var(--foreground)"
                          : "var(--muted-foreground)"
                      }
                      stroke="var(--background)"
                      strokeWidth={isEndpoint ? 2.5 : 1.5}
                      opacity={showLabel ? 1 : city.tier === "major" ? 0.7 : 0.4}
                    />
                    {showLabel && (
                      <text
                        x={city.x}
                        y={city.y - 12}
                        textAnchor="middle"
                        className={
                          isEndpoint
                            ? "fill-foreground font-mono text-[13px] font-bold filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                            : "fill-muted-foreground font-mono text-[11px] font-medium"
                        }
                      >
                        {city.name}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Floating City Hover HUD Tooltip */}
              {hoveredCity && (
                <g className="pointer-events-none transition-opacity">
                  <rect
                    x={hoveredCity.x - 70}
                    y={hoveredCity.y - 48}
                    width={140}
                    height={34}
                    rx={6}
                    fill="#0b0f17"
                    stroke="var(--signal)"
                    strokeWidth={1}
                    opacity={0.95}
                  />
                  <text
                    x={hoveredCity.x}
                    y={hoveredCity.y - 32}
                    textAnchor="middle"
                    className="fill-foreground font-mono text-[11px] font-semibold"
                  >
                    {hoveredCity.name}
                  </text>
                  <text
                    x={hoveredCity.x}
                    y={hoveredCity.y - 20}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[9px]"
                  >
                    {hoveredCity.state} • {hoveredCity.tier || "town"}
                  </text>
                </g>
              )}
            </svg>

            {/* Map Legend */}
            <div className="relative flex flex-wrap gap-x-5 gap-y-2 px-2 pb-1 pt-2 font-mono text-xs border-t border-border/50">
              <span className="inline-flex items-center gap-2 text-signal">
                <span className="h-0.5 w-5 rounded bg-signal" /> risk-aware
              </span>
              <span className="inline-flex items-center gap-2 text-hazard">
                <span className="h-0.5 w-5 rounded bg-hazard [background:repeating-linear-gradient(90deg,var(--hazard)_0_3px,transparent_3px_7px)]" />{" "}
                fastest
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <span className="size-2 rounded-full bg-signal" /> origin
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <span className="size-2 rounded-full bg-hazard" /> destination
              </span>
              {gpsState && (
                <span className="inline-flex items-center gap-2 text-cyan-400">
                  <span className="size-2 rounded-full bg-cyan-400 animate-pulse" /> live GPS fix
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Milestone className="size-3.5 text-signal" />
          Production A* engine evaluates real multi-edge OpenStreetMap topology, elevation gradients, and
          monitored road vulnerability factors.
          <ArrowRight className="size-3.5" />
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-signal/15 text-signal ring-1 ring-signal/30">
              <Waypoints className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                RaahSetu
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Northeast India
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#platform"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Platform
            </a>
            <a
              href="#how"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#comparison"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Comparison
            </a>
            <a
              href="#stack"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Stack
            </a>
          </nav>
          <a
            href="#planner"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <RouteIcon className="size-4" />
            <span className="hidden sm:inline">Try Planner</span>
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="top" className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url(/topographic-terrain.png)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid-lines opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background"
          />

          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-signal node-pulse" />
                Logistics Intelligence Platform
              </div>
              <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Routes that explain
                <span className="text-signal"> why they avoid the risk.</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                RaahSetu is an explainable, risk-aware logistics route planner for
                Northeast India. It compares the fastest route with one that
                accounts for road risk, vehicle limits, and closures — powered by
                a custom A* engine over real OpenStreetMap networks.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#platform"
                  className="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-semibold text-signal-foreground transition-transform hover:-translate-y-0.5"
                >
                  Explore the platform
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#planner"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Launch planner
                  <ArrowRight className="size-4" />
                </a>
              </div>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
                <div>
                  <dt className="font-display text-3xl font-semibold text-foreground">
                    8
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    NE states covered
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-3xl font-semibold text-foreground">
                    300+
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    A* correctness tests
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-3xl font-semibold text-foreground">
                    A*
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    custom pathfinder
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border bg-card/70 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between px-2 pb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    route_graph.solve()
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-signal">
                    <span className="size-1.5 rounded-full bg-signal" />
                    solved
                  </span>
                </div>
                <svg
                  viewBox="0 0 680 480"
                  className="w-full"
                  fill="none"
                  role="img"
                  aria-label="Illustration of a road graph with a highlighted risk-aware route avoiding hazard nodes"
                >
                  <line x1="60" y1="300" x2="150" y2="210" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="60" y1="300" x2="165" y2="360" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="150" y1="210" x2="260" y2="150" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="150" y1="210" x2="280" y2="300" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="165" y1="360" x2="280" y2="300" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="165" y1="360" x2="300" y2="420" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="260" y1="150" x2="400" y2="220" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="280" y1="300" x2="400" y2="220" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="280" y1="300" x2="420" y2="360" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="300" y1="420" x2="420" y2="360" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="400" y1="220" x2="520" y2="160" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="400" y1="220" x2="540" y2="300" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="420" y1="360" x2="540" y2="300" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="520" y1="160" x2="620" y2="240" stroke="var(--border)" strokeWidth="1.5" />
                  <line x1="540" y1="300" x2="620" y2="240" stroke="var(--border)" strokeWidth="1.5" />

                  <path
                    d="M 60 300 L 150 210 L 260 150 L 400 220 L 540 300 L 620 240"
                    stroke="var(--signal)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.18"
                  />
                  <path
                    d="M 60 300 L 150 210 L 260 150 L 400 220 L 540 300 L 620 240"
                    stroke="var(--signal)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="route-flow"
                  />

                  {/* Origin */}
                  <g>
                    <circle cx="60" cy="300" r="12" fill="var(--signal)" opacity="0.16" />
                    <circle cx="60" cy="300" r="5.5" fill="var(--signal)" />
                    <circle cx="60" cy="300" r="2" fill="var(--signal-foreground)" />
                  </g>

                  {/* Nodes */}
                  <circle cx="150" cy="210" r="3.5" fill="var(--muted-foreground)" />
                  <circle cx="165" cy="360" r="3.5" fill="var(--muted-foreground)" />
                  <circle cx="260" cy="150" r="3.5" fill="var(--muted-foreground)" />

                  {/* Hazard Node d */}
                  <g>
                    <circle cx="280" cy="300" r="9" fill="var(--hazard)" opacity="0.18" className="node-pulse" />
                    <circle cx="280" cy="300" r="4" fill="var(--hazard)" />
                  </g>

                  <circle cx="300" cy="420" r="3.5" fill="var(--muted-foreground)" />
                  <circle cx="400" cy="220" r="3.5" fill="var(--muted-foreground)" />
                  <circle cx="420" cy="360" r="3.5" fill="var(--muted-foreground)" />

                  {/* Hazard Node h */}
                  <g>
                    <circle cx="520" cy="160" r="9" fill="var(--hazard)" opacity="0.18" className="node-pulse" />
                    <circle cx="520" cy="160" r="4" fill="var(--hazard)" />
                  </g>

                  <circle cx="540" cy="300" r="3.5" fill="var(--muted-foreground)" />

                  {/* Destination */}
                  <g>
                    <circle cx="620" cy="240" r="12" fill="var(--signal)" opacity="0.16" />
                    <circle cx="620" cy="240" r="5.5" fill="var(--signal)" />
                    <circle cx="620" cy="240" r="2" fill="var(--signal-foreground)" />
                  </g>
                </svg>

                <div className="mt-3 flex flex-wrap gap-4 px-2 font-mono text-xs">
                  <span className="inline-flex items-center gap-2 text-signal">
                    <RouteIcon className="size-3.5" /> risk-aware route
                  </span>
                  <span className="inline-flex items-center gap-2 text-hazard">
                    <ShieldAlert className="size-3.5" /> hazard node avoided
                  </span>
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span className="h-px w-4 bg-border" /> road edge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Route Planner Section */}
        <RoutePlannerSection />

        {/* Platform Features Section */}
        <section id="platform" className="relative border-t border-border/70 py-20 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
                The platform
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Logistics intelligence that shows its work
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Every route is grounded in real road data and explicit rules — not a
                black box. Here is what powers RaahSetu end to end.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <RouteIcon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Custom A* pathfinding
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A hand-built A* with a priority queue, an admissible heuristic,
                  and explicit edge reconstruction — validated against an
                  independent Dijkstra baseline across 300 randomized scenarios.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <ShieldAlert className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Risk-aware comparison
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Fastest and risk-aware routes are computed on the same road graph
                  and scenario, so every trade-off between speed and exposure is
                  explainable and reproducible.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <Mountain className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Northeast terrain &amp; networks
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  State-wise road extraction and public-facility data across all
                  eight states, with a deterministic synthetic sandbox and a real
                  Guwahati OSM pilot network.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <CloudRain className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Scenario &amp; weather controls
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Switch vehicles, tune risk preference, apply closures, and
                  simulate weather conditions — then export the full result set as
                  JSON for review.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <Database className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Supabase / PostGIS foundation
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Eight-state metadata, versioned graph snapshots, hazard
                  observations, and geo-tagged field-report APIs backed by a live
                  spatial database.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <FileWarning className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  Field reports &amp; moderation
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Officials submit geo-tagged incidents with private,
                  authenticated evidence uploads. Reviewer-approved events become
                  request-time closures for the routing engine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="how" className="relative border-t border-border/70 py-20 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
                How it works
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                From raw road data to an explainable route
              </h2>
            </div>
            <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <li className="relative rounded-xl border border-border bg-card p-6">
                <span className="font-mono text-sm font-semibold text-signal">
                  01
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent"
                />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Build the road graph
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  OSMnx extracts directed, multi-edge road networks for the region.
                  Truck limits, closures, and versioned snapshots are stored in
                  PostGIS.
                </p>
              </li>
              <li className="relative rounded-xl border border-border bg-card p-6">
                <span className="font-mono text-sm font-semibold text-signal">
                  02
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent"
                />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Choose a scenario
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Pick origin and destination, select a vehicle, set your risk
                  preference, and apply any active closures or simulated weather
                  conditions.
                </p>
              </li>
              <li className="relative rounded-xl border border-border bg-card p-6">
                <span className="font-mono text-sm font-semibold text-signal">
                  03
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent"
                />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Solve with custom A*
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The engine runs A* twice on the same graph — once for the
                  fastest path, once weighted by road-risk exposure — with
                  explicit edge reconstruction.
                </p>
              </li>
              <li className="relative rounded-xl border border-border bg-card p-6">
                <span className="font-mono text-sm font-semibold text-signal">
                  04
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent"
                />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  Compare &amp; export
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Inspect the two routes side by side on interactive terrain,
                  understand each trade-off, and export the full explainable
                  result as JSON.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* Comparison Section */}
        <section
          id="comparison"
          className="relative border-t border-border/70 py-20 lg:py-28"
        >
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
            <div className="relative order-2 overflow-hidden rounded-2xl border border-border lg:order-1">
              <img
                src="/route-map-dark.png"
                alt="Dark cartographic map showing a teal fastest route and an amber risk-aware alternate route across mountainous terrain"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
                Fastest vs. risk-aware
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Two routes, one honest trade-off
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                RaahSetu never hides the cost of safety. It surfaces both options
                on the same graph so planners can decide with full context.
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 text-hazard">
                    <Zap className="size-4" />
                    <span className="font-display font-semibold">
                      Fastest route
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Minimises estimated travel time only. May pass through
                    landslide-prone or higher-exposure road edges.
                  </p>
                  <div className="mt-4 flex gap-6 font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" /> lowest time
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-hazard">
                      <TriangleAlert className="size-3.5" /> higher risk index
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-signal/40 bg-signal/[0.06] p-5">
                  <div className="flex items-center gap-2 text-signal">
                    <ShieldCheck className="size-4" />
                    <span className="font-display font-semibold text-foreground">
                      Risk-aware route
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Weights each edge by road-risk exposure and respects vehicle
                    limits and closures, trading a little time for a lower risk
                    index.
                  </p>
                  <div className="mt-4 flex gap-6 font-mono text-xs">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" /> slightly longer
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-signal">
                      <ShieldCheck className="size-3.5" /> lower risk index
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stack Section */}
        <section id="stack" className="relative border-t border-border/70 py-20 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
                Engineering stack
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Built on the team blueprint
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  Dashboard UI
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  React + TypeScript
                </p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  Interactive terrain
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  React Three Fiber
                </p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  Routing API
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  Python 3.12 + FastAPI
                </p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  Pathfinding
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  Custom A* engine
                </p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  Road extraction
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  OSMnx
                </p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  Spatial data
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  Supabase / PostGIS
                </p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  Containers
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  Docker
                </p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal">
                  VM deployment
                </p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">
                  Kubernetes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Limits Section */}
        <section className="relative border-t border-border/70 py-20 lg:py-28">
          <div className="mx-auto w-full max-w-4xl px-5 lg:px-8">
            <div className="rounded-2xl border border-border bg-card/60 p-8 lg:p-10">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-md bg-hazard/12 text-hazard ring-1 ring-hazard/25">
                  <Info className="size-5" />
                </span>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  What the prototype does not claim
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Explainability means being honest about limits. RaahSetu is
                upfront about the boundaries of the current prototype:
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  The synthetic network uses fictional roads and hazards; the real
                  OSM network explicitly reports where reviewed risk evidence is
                  missing.
                </li>
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  Weather controls simulate conditions and travel time is estimated
                  without live traffic.
                </li>
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  Risk exposure is an index, not an accident probability. Scoring
                  is rule-based, not a trained predictive ML model.
                </li>
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  This is a hackathon prototype — not operational dispatch or
                  navigation. GPS tracking, live feeds, and turn restrictions
                  remain backlog work.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-border/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-lines opacity-30"
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start gap-8 rounded-2xl border border-border bg-card/70 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-xl">
              <h2 className="text-balance font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Explainable Logistics Routing
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                The full stack — routing engine, spatial schema, datasets, and
                deployment definitions — built for Northeast India.
              </p>
            </div>
            <a
              href="#planner"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-signal px-6 py-3 text-sm font-semibold text-signal-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore Route Planner
              <ArrowRight className="size-4" />
            </a>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-signal/15 text-signal ring-1 ring-signal/30">
                <Waypoints className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-sm font-semibold text-foreground">
                  RaahSetu
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Logistics Intelligence · Northeast India
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              OpenStreetMap data © OpenStreetMap contributors, ODbL 1.0. Working
              name for the prototype.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
