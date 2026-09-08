import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Clock,
  CloudRain,
  Database,
  FileWarning,
  Info,
  Loader2,
  LocateFixed,
  MapPin,
  Milestone,
  Mountain,
  Route as RouteIcon,
  Search,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Waypoints,
  X,
  Zap,
} from "lucide-react";
import {
  CITIES,
  CITY_MAP,
  City,
  EDGES,
  computeStats,
  findNearestCity,
  formatHours,
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
  const [gpsState, setGpsState] = useState<GpsState | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

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

  const comparison = useMemo(() => {
    if (origin === destination) return null;
    const fastestPath = solvePath(
      origin,
      destination,
      (e) => e.dist / speed(e.risk)
    );
    const safePath = solvePath(
      origin,
      destination,
      (e) => e.dist / speed(e.risk) + e.risk * e.dist * 0.05
    );
    if (!fastestPath || !safePath) return null;
    return {
      fastest: computeStats(fastestPath),
      safe: computeStats(safePath),
    };
  }, [origin, destination]);

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

  return (
    <section id="planner" className="relative border-t border-border/70 py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines opacity-[0.18]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Try it — route planner
          </span>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Enter an origin and destination
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Pick two cities across the eight Northeast states. RaahSetu solves
            both the fastest and the risk-aware path over the road graph and shows
            you exactly what the safer option trades and avoids.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="grid gap-4">
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
            </div>

            {comparison && (
              <>
                <div className="rounded-2xl border border-signal/40 bg-signal/[0.06] p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-display font-semibold text-foreground">
                      <ShieldCheck className="size-4 text-signal" />
                      Risk-aware route
                    </span>
                    <span className="rounded-full border border-signal/40 px-2 py-0.5 font-mono text-[11px] text-signal">
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

                <div className="rounded-2xl border border-border bg-card p-5">
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
                        <span className="text-foreground">
                          {formatHours(
                            Math.max(
                              0,
                              comparison.safe.hours - comparison.fastest.hours
                            )
                          )}
                        </span>{" "}
                        extra travel time to cut the risk index from{" "}
                        <span className="text-hazard">
                          {comparison.fastest.riskIndex}
                        </span>{" "}
                        to{" "}
                        <span className="text-signal">
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
                                <span className="text-foreground">
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
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/70 p-3 shadow-2xl shadow-black/40">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url(/topographic-terrain.png)" }}
            />
            <div className="relative flex items-center justify-between px-2 pb-2 pt-1">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                northeast_india.map
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-signal">
                <span className="size-1.5 rounded-full bg-signal" /> solved
              </span>
            </div>

            <svg
              viewBox="0 0 1000 560"
              className="relative w-full"
              role="img"
              aria-label={
                comparison
                  ? `Map of Northeast India showing the risk-aware and fastest routes from ${CITY_MAP[origin].name} to ${CITY_MAP[destination].name}`
                  : "Map of Northeast India"
              }
            >
              {EDGES.map((edge) => {
                const u = CITY_MAP[edge.a];
                const v = CITY_MAP[edge.b];
                const key = [edge.a, edge.b].sort().join("-");
                const isActive = activeEdges.has(key);
                return (
                  <line
                    key={key}
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="currentColor"
                    strokeWidth={1}
                    className={isActive ? "text-border" : "text-border/50"}
                  />
                );
              })}

              {comparison && !isIdentical && (
                <polyline
                  points={toPolylinePoints(comparison.fastest.path)}
                  fill="none"
                  stroke="var(--hazard)"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 9"
                  opacity={0.9}
                />
              )}

              {comparison && (
                <polyline
                  points={toPolylinePoints(comparison.safe.path)}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="route-flow"
                />
              )}

              {gpsState && (() => {
                const gpsSvg = projectGeoToSvg(gpsState.lat, gpsState.lon);
                const snapped = CITY_MAP[origin];
                return (
                  <g className="gps-live-beacon">
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

              {CITIES.map((city) => {
                const isOrigin = city.id === origin;
                const isDest = city.id === destination;
                const isEndpoint = isOrigin || isDest;
                const isInRoute = activeNodes.has(city.id);
                const showLabel = isEndpoint || isInRoute;

                return (
                  <g key={city.id}>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isEndpoint ? 7 : isInRoute ? 4.5 : city.tier === "major" ? 3 : 2}
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
                      opacity={showLabel ? 1 : city.tier === "major" ? 0.65 : 0.4}
                    />
                    {showLabel && (
                      <text
                        x={city.x}
                        y={city.y - 12}
                        textAnchor="middle"
                        className={
                          isEndpoint
                            ? "fill-foreground font-mono text-[13px] font-medium"
                            : "fill-muted-foreground font-mono text-[11px]"
                        }
                      >
                        {city.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="relative flex flex-wrap gap-x-5 gap-y-2 px-2 pb-1 pt-2 font-mono text-xs">
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
          <Milestone className="size-3.5" />
          Demo graph with representative road-risk weights. The production engine
          runs the same A* search over full OpenStreetMap networks and live hazard
          reports.
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
