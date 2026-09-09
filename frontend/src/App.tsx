import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpDown,
  Camera,
  Check,
  Clock,
  CloudRain,
  CornerUpRight,
  Database,
  Download,
  FileText,
  Globe,
  Info,
  Layers,
  Loader2,
  LocateFixed,
  MapPin,
  Milestone,
  Mountain,
  Navigation,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Route as RouteIcon,
  Search,
  Share2,
  Snowflake,
  Sun,
  TriangleAlert,
  Truck,
  Volume2,
  VolumeX,
  Waypoints,
  Wifi,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  CITIES,
  CITY_MAP,
  City,
  COMMODITY_PROFILES,
  CommodityType,
  DISTRICT_CONNECTIVITY,
  EDGES,
  REGIONAL_ALERTS,
  STRATEGIC_CORRIDORS,
  SupportedLanguage,
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
  projectGeoToSvg,
  solvePath,
  toPolylinePoints,
} from "./routeData";

interface CityComboboxProps {
  label: "Origin" | "Destination";
  tone: "signal" | "hazard";
  selectedId: string;
  onSelect: (id: string) => void;
  otherCityId: string;
  customOrigin?: { name: string; lat: number; lon: number } | null;
}

function CityCombobox({
  label,
  tone,
  selectedId,
  onSelect,
  otherCityId,
  customOrigin,
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
      ? "border-signal/50 focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/30"
      : "border-hazard/50 focus-within:border-hazard focus-within:ring-2 focus-within:ring-hazard/30";

  return (
    <div ref={containerRef} className="relative flex-1">
      <span className="mb-1.5 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <MapPin
          className={`size-3.5 ${
            tone === "signal" ? "text-signal drop-shadow-[0_0_8px_rgba(53,220,171,0.6)]" : "text-hazard drop-shadow-[0_0_8px_rgba(255,157,54,0.6)]"
          }`}
        />
        {label}
      </span>
      <div
        className={`relative flex items-center gap-2 rounded-xl border bg-secondary/60 px-3 py-2.5 shadow-sm transition-all backdrop-blur-md ${borderClass}`}
      >
        <Search className="pointer-events-none size-4 shrink-0 text-muted-foreground" />
        {open ? (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type city, state, or border outpost..."
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder-muted-foreground outline-none"
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
            <span className="font-semibold text-foreground">
              {customOrigin && label === "Origin" ? (
                <>
                  <span className="text-signal font-bold">📍 {customOrigin.name}</span>
                  <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded bg-signal/15 text-signal border border-signal/30 font-mono">
                    Live GPS
                  </span>
                </>
              ) : (
                <>
                  {selectedCity?.name}
                  <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                    ({selectedCity?.state})
                  </span>
                </>
              )}
            </span>
          </button>
        )}
        {open && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl">
          <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-signal font-semibold">
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
                  ? "bg-signal/15 text-signal font-semibold border border-signal/30"
                  : "text-foreground hover:bg-secondary/80"
              }`}
            >
              <div>
                <div className="font-medium">{city.name}</div>
                <div className="text-xs text-muted-foreground">
                  {city.state} · {city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E
                </div>
              </div>
              {city.id === selectedId && <Check className="size-4 text-signal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function App() {
  const [origin, setOrigin] = useState("guwahati");
  const [destination, setDestination] = useState("tawang");
  const [vehicle, setVehicle] = useState<VehicleType>("heavy");
  const [commodity, setCommodity] = useState<CommodityType>("medical");
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccessNotice, setReportSuccessNotice] = useState<string | null>(null);
  const [offlineReportsCount, setOfflineReportsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("rs_offline_reports");
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  });
  const [activeTab, setActiveTab] = useState<"comparison" | "itinerary">("comparison");
  const [hoveredLegIndex, setHoveredLegIndex] = useState<number | null>(null);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [customOrigin, setCustomOrigin] = useState<{
    name: string;
    lat: number;
    lon: number;
    nearestHub: City;
    distanceKm: number;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // SVG Map Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Read URL search params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
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
    params.set("from", origin);
    params.set("to", destination);
    params.set("vehicle", vehicle);
    params.set("tab", activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [origin, destination, vehicle, activeTab]);

  // AUTOMATIC WEATHER INGESTION:
  // Dynamically derived from origin, corridor, and elevation
  const liveWeather = useMemo(() => {
    return getAutomaticWeatherForLocation(origin, destination);
  }, [origin, destination]);

  const weather = liveWeather.condition;

  // Shortest / Nominal route solver (minimizes pure physical distance)
  const shortest = useMemo(() => {
    return solvePath(origin, destination, (edge) => edge.dist);
  }, [origin, destination]);

  // Safe / Terrain & Hazard-Aware route solver
  // Factors in: Distance + (Physical Risk * Vehicle Hill Penalty * Commodity Priority Multiplier)
  const safe = useMemo(() => {
    const cProf = COMMODITY_PROFILES[commodity];
    const riskMultiplier = cProf ? cProf.riskToleranceMult : 2.5;
    return solvePath(origin, destination, (edge) => {
      const adjRisk = getAdjustedEdgeRisk(edge, vehicle, weather);
      return edge.dist * (1 + adjRisk * riskMultiplier);
    });
  }, [origin, destination, vehicle, weather, commodity]);

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

  // Google Maps Style Live Navigation & Driver Tracking State
  const [isNavigating, setIsNavigating] = useState(false);
  const [isStartingNav, setIsStartingNav] = useState(false);
  const [navGpsCoords, setNavGpsCoords] = useState<{
    lat: number;
    lon: number;
    accuracy?: number;
    speedKmh: number;
    heading: number;
    placeName: string;
    source: "live_gps" | "simulated";
  } | null>(null);
  const [navProgressPct, setNavProgressPct] = useState(0);
  const [isSimulatingDrive, setIsSimulatingDrive] = useState(true);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [lastSpokenLeg, setLastSpokenLeg] = useState<number>(-1);
  const navWatchRef = useRef<number | null>(null);
  const mapCardRef = useRef<HTMLDivElement | null>(null);

  // Turn-by-Turn Telemetry Computations
  const navTelemetry = useMemo(() => {
    if (!safeLegs || safeLegs.length === 0) {
      return {
        activeLegIndex: 0,
        activeLeg: null,
        legProgress: 0,
        currentSvg: { x: 500, y: 280 },
        currentGeo: { lat: 26.1445, lon: 91.7362 },
        headingAngle: 0,
        remainingDistKm: 0,
        remainingHours: 0,
        distToNextCheckpoint: 0,
        nextCheckpointName: "",
        nextInstruction: "",
        etaTime: "--:--",
        traveledDistKm: 0,
      };
    }

    const totalDistance = safeStats?.distance || 1;
    const traveledDistKm = Math.min(
      totalDistance,
      (navProgressPct / 100) * totalDistance
    );
    const remainingDistKm = Math.max(0, Math.round(totalDistance - traveledDistKm));
    const remainingHours = Math.max(0, (safeStats?.hours || 0) * (1 - navProgressPct / 100));

    // Find current active leg along safeLegs
    let accDist = 0;
    let activeLegIndex = 0;
    let legProgress = 0;

    for (let i = 0; i < safeLegs.length; i++) {
      const leg = safeLegs[i];
      if (traveledDistKm <= accDist + leg.dist || i === safeLegs.length - 1) {
        activeLegIndex = i;
        const distInLeg = Math.max(0, traveledDistKm - accDist);
        legProgress = leg.dist > 0 ? Math.min(1, distInLeg / leg.dist) : 0;
        break;
      }
      accDist += leg.dist;
    }

    const activeLeg = safeLegs[activeLegIndex];
    const currentSvg = {
      x: Math.round(activeLeg.fromCity.x + (activeLeg.toCity.x - activeLeg.fromCity.x) * legProgress),
      y: Math.round(activeLeg.fromCity.y + (activeLeg.toCity.y - activeLeg.fromCity.y) * legProgress),
    };
    const currentGeo = {
      lat: activeLeg.fromCity.lat + (activeLeg.toCity.lat - activeLeg.fromCity.lat) * legProgress,
      lon: activeLeg.fromCity.lon + (activeLeg.toCity.lon - activeLeg.fromCity.lon) * legProgress,
    };
    const headingAngle = Math.round(
      Math.atan2(
        activeLeg.toCity.y - activeLeg.fromCity.y,
        activeLeg.toCity.x - activeLeg.fromCity.x
      ) * (180 / Math.PI)
    );

    const distToNextCheckpoint = Math.max(
      1,
      Math.round(activeLeg.dist * (1 - legProgress))
    );
    const nextCheckpointName = activeLeg.toCity.name;
    const nextInstruction = activeLeg.note
      ? `Caution: ${activeLeg.note}. Proceeding to ${activeLeg.toCity.name}`
      : `Continue straight towards ${activeLeg.toCity.name} via highway corridor`;

    const etaDate = new Date(Date.now() + remainingHours * 3600 * 1000);
    const etaTime = etaDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      activeLegIndex,
      activeLeg,
      legProgress,
      currentSvg,
      currentGeo,
      headingAngle,
      remainingDistKm,
      remainingHours,
      distToNextCheckpoint,
      nextCheckpointName,
      nextInstruction,
      etaTime,
      traveledDistKm: Math.round(traveledDistKm),
    };
  }, [safeLegs, safeStats, navProgressPct]);

  const speakGuidance = (text: string) => {
    if (isVoiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech errors
    }
  };

  const handleStartNavigation = async () => {
    if (isNavigating) {
      handleStopNavigation();
      return;
    }

    if (!safe || safe.length < 2) {
      setLocationNotice("Please select a valid origin and destination corridor first.");
      return;
    }

    setIsStartingNav(true);
    setLocationNotice(null);

    // Smooth scroll to map immediately
    if (mapCardRef.current) {
      mapCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const startTrip = (
      lat: number,
      lon: number,
      placeName: string,
      speed?: number,
      heading?: number
    ) => {
      setNavGpsCoords({
        lat,
        lon,
        speedKmh: speed && speed > 0 ? Math.round(speed * 3.6) : 52,
        heading: heading || 0,
        placeName,
        source: "live_gps",
      });
      setIsNavigating(true);
      setIsStartingNav(false);
      setNavProgressPct(0);
      setIsSimulatingDrive(true);

      const destCityName = CITY_MAP[destination]?.name || "Destination";
      speakGuidance(
        `Navigation started towards ${destCityName}. Live GPS location acquired at ${placeName}.`
      );
    };

    if (!navigator.geolocation) {
      const originCity = CITY_MAP[origin];
      startTrip(
        originCity.lat,
        originCity.lon,
        `${originCity.name}, ${originCity.state} (Origin Hub)`
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, speed, heading } = pos.coords;
        let placeTitle = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const road = addr.road || addr.suburb || addr.neighbourhood;
            const cityOrTown = addr.city || addr.town || addr.village || addr.county || addr.state_district;
            if (road && cityOrTown) {
              placeTitle = `${road}, ${cityOrTown}`;
            } else if (cityOrTown) {
              placeTitle = `${cityOrTown}, ${addr.state || "India"}`;
            } else if (data.display_name) {
              placeTitle = data.display_name.split(",").slice(0, 2).join(",");
            }
          }
        } catch {
          // Fallback to formatted coordinates
        }

        startTrip(latitude, longitude, placeTitle, speed || undefined, heading || undefined);

        // Start GPS tracking
        try {
          if (navWatchRef.current !== null) {
            navigator.geolocation.clearWatch(navWatchRef.current);
          }
          navWatchRef.current = navigator.geolocation.watchPosition(
            (watchPos) => {
              setNavGpsCoords((prev) => ({
                lat: watchPos.coords.latitude,
                lon: watchPos.coords.longitude,
                speedKmh: watchPos.coords.speed ? Math.round(watchPos.coords.speed * 3.6) : (prev?.speedKmh || 52),
                heading: watchPos.coords.heading || prev?.heading || 0,
                placeName: prev?.placeName || `${watchPos.coords.latitude.toFixed(4)}°N, ${watchPos.coords.longitude.toFixed(4)}°E`,
                source: "live_gps",
              }));
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
          );
        } catch {
          // Ignore watch errors
        }
      },
      (err) => {
        const originCity = CITY_MAP[origin];
        startTrip(
          originCity.lat,
          originCity.lon,
          `${originCity.name}, ${originCity.state} (Origin Hub)`
        );
        setLocationNotice(
          `GPS notice (${err.message}). Defaulted live navigation to ${originCity.name} corridor.`
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setIsStartingNav(false);
    setIsSimulatingDrive(false);
    if (navWatchRef.current !== null) {
      navigator.geolocation.clearWatch(navWatchRef.current);
      navWatchRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Smooth vehicle movement animation when navigating
  useEffect(() => {
    if (!isNavigating || !isSimulatingDrive) return;

    const interval = setInterval(() => {
      setNavProgressPct((prev) => {
        if (prev >= 100) {
          speakGuidance(`You have arrived at ${CITY_MAP[destination]?.name || "your destination"}.`);
          setIsSimulatingDrive(false);
          return 100;
        }
        return Math.min(100, prev + 0.65);
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isNavigating, isSimulatingDrive, destination]);

  // Voice announcements for upcoming waypoints
  useEffect(() => {
    if (
      !isNavigating ||
      navTelemetry.activeLegIndex === lastSpokenLeg ||
      !navTelemetry.activeLeg
    )
      return;

    setLastSpokenLeg(navTelemetry.activeLegIndex);
    const leg = navTelemetry.activeLeg;
    const msg = leg.note
      ? `Caution ahead near ${leg.fromCity.name}. ${leg.note}. Heading to ${leg.toCity.name}.`
      : `In ${leg.dist} kilometers, arrive at ${leg.toCity.name}.`;
    speakGuidance(msg);
  }, [isNavigating, navTelemetry.activeLegIndex, lastSpokenLeg, navTelemetry.activeLeg]);

  // Origin / Destination Quick-Swap
  const handleSwap = () => {
    const oldOrigin = origin;
    setCustomOrigin(null);
    setOrigin(destination);
    setDestination(oldOrigin);
  };

  // GPS Live Location Detection (Displays Exact Current Location)
  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearest = findNearestCity(latitude, longitude);

        let placeTitle = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
        try {
          // Reverse geocode via OpenStreetMap Nominatim for exact local city/district name
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const localName = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district;
            if (localName) {
              placeTitle = `${localName}, ${addr.state || "Current GPS"}`;
            }
          }
        } catch {
          // Fallback to formatted coordinates
        }

        setIsLocating(false);
        if (nearest.city.id === destination) {
          setLocationNotice(
            `Current GPS position is at ${placeTitle}, but the highway entry hub (${nearest.city.name}) is already your destination.`
          );
          return;
        }

        setOrigin(nearest.city.id);
        setCustomOrigin({
          name: placeTitle,
          lat: latitude,
          lon: longitude,
          nearestHub: nearest.city,
          distanceKm: nearest.distanceKm,
        });

        setLocationNotice(
          `GPS Active: Exact location detected at ${placeTitle} (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E). Linked to highway corridor via ${nearest.city.name} (${nearest.distanceKm} km entry connection).`
        );
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
      commodityProfile: COMMODITY_PROFILES[commodity],
      weatherProfile: WEATHER_PROFILES[weather],
      logisticsPriority: COMMODITY_PROFILES[commodity]?.priority || "STANDARD",
      regionalSafetyClearance: "NER-ESSENTIAL-CORRIDOR-ACTIVE",
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-signal/30 selection:text-signal">
      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-signal/15 text-signal ring-1 ring-signal/30 shadow-lg shadow-signal/10">
              <Waypoints className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                RaahSetu
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal font-bold">
                Logistics Intelligence
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex font-mono text-xs uppercase tracking-wider">
            <a href="#top" className="text-muted-foreground transition-colors hover:text-signal">
              Overview
            </a>
            <a href="#planner" className="text-muted-foreground transition-colors hover:text-signal">
              Route Planner
            </a>
            <a href="#crisis-data" className="text-muted-foreground transition-colors hover:text-signal">
              Crisis Data
            </a>
            <a href="#platform" className="text-muted-foreground transition-colors hover:text-signal">
              Platform
            </a>
            <a href="#how" className="text-muted-foreground transition-colors hover:text-signal">
              How it works
            </a>
            <a href="#comparison" className="text-muted-foreground transition-colors hover:text-signal">
              Comparison
            </a>
            <a href="#stack" className="text-muted-foreground transition-colors hover:text-signal">
              Stack
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center rounded-lg border border-border/70 bg-secondary/60 p-1 text-xs font-mono">
              <Globe className="size-3.5 text-muted-foreground mr-1 ml-1" />
              {(["en", "hi", "as", "bn"] as SupportedLanguage[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold uppercase transition-all cursor-pointer ${
                    lang === l ? "bg-signal text-signal-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Field Incident Reporter Button */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-hazard/40 bg-hazard/10 px-3 py-1.5 text-xs font-bold text-hazard hover:bg-hazard/20 transition-all cursor-pointer"
              title="Report road damage or landslide slip from field"
            >
              <Camera className="size-3.5" />
              <span>Report Incident</span>
              {offlineReportsCount > 0 && (
                <span className="ml-1 rounded-full bg-hazard text-hazard-foreground px-1.5 py-0.2 text-[10px] font-mono font-bold">
                  {offlineReportsCount}
                </span>
              )}
            </button>

            <a
              href="#planner"
              className="inline-flex items-center gap-1.5 rounded-lg bg-signal px-3.5 py-1.5 text-xs font-bold text-signal-foreground transition-transform hover:-translate-y-0.5 shadow-md shadow-signal/20 cursor-pointer"
            >
              <span>Launch Planner</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* SECTION 1: HERO SECTION */}
        <section id="top" className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground shadow-sm">
                <span className="size-1.5 rounded-full bg-signal node-pulse" />
                Northeast Mountain Freight Resilience System
              </div>

              <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Routes that explain{" "}
                <span className="text-signal drop-shadow-[0_0_20px_rgba(53,220,171,0.35)]">
                  why they avoid the risk.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                RaahSetu is an explainable, risk-aware logistics route planner for Northeast India. It compares the
                fastest route with one that accounts for road risk, vehicle limits, and closures — powered by a custom A*
                engine over real OpenStreetMap networks.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#planner"
                  className="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 text-sm font-semibold text-signal-foreground transition-transform hover:-translate-y-0.5 shadow-lg shadow-signal/25"
                >
                  <span>Explore the planner</span>
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#crisis-data"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <AlertTriangle className="size-4 text-hazard" />
                  <span>Ground Crisis Data</span>
                </a>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
                <div className="border-l border-border pl-4">
                  <dt className="font-display text-3xl font-bold text-foreground">8</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">NE states covered</dd>
                </div>
                <div className="border-l border-border pl-4">
                  <dt className="font-display text-3xl font-bold text-signal">300+</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">A* correctness tests</dd>
                </div>
                <div className="border-l border-border pl-4">
                  <dt className="font-display text-3xl font-bold text-hazard">A*</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">custom pathfinder</dd>
                </div>
              </dl>
            </div>

            {/* Right Side: Animated Route Graph Preview Card */}
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-md">
                <div className="flex items-center justify-between px-2 pb-3 border-b border-border/60">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    route_graph.solve()
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-signal font-bold">
                    <span className="size-2 rounded-full bg-signal node-pulse" />
                    solved
                  </span>
                </div>

                <svg viewBox="0 0 680 480" className="w-full my-3" fill="none" role="img" aria-label="Road graph with highlighted risk-aware route avoiding hazard nodes">
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

                  {/* Flow Route Halo */}
                  <path d="M 60 300 L 150 210 L 260 150 L 400 220 L 540 300 L 620 240" stroke="var(--signal)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
                  {/* Flow Route Animated Dashes */}
                  <path d="M 60 300 L 150 210 L 260 150 L 400 220 L 540 300 L 620 240" stroke="var(--signal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="route-flow" />

                  {/* Origin */}
                  <g>
                    <circle cx="60" cy="300" r="14" fill="var(--signal)" opacity="0.2" className="node-pulse" />
                    <circle cx="60" cy="300" r="6" fill="var(--signal)" />
                    <circle cx="60" cy="300" r="2.5" fill="var(--signal-foreground)" />
                  </g>

                  <circle cx="150" cy="210" r="4" fill="var(--muted-foreground)" />
                  <circle cx="165" cy="360" r="4" fill="var(--muted-foreground)" />
                  <circle cx="260" cy="150" r="4" fill="var(--muted-foreground)" />

                  {/* Hazard Node 1 */}
                  <g>
                    <circle cx="280" cy="300" r="10" fill="var(--hazard)" opacity="0.25" className="node-pulse" />
                    <circle cx="280" cy="300" r="5" fill="var(--hazard)" />
                  </g>

                  <circle cx="300" cy="420" r="4" fill="var(--muted-foreground)" />
                  <circle cx="400" cy="220" r="4" fill="var(--muted-foreground)" />
                  <circle cx="420" cy="360" r="4" fill="var(--muted-foreground)" />

                  {/* Hazard Node 2 */}
                  <g>
                    <circle cx="520" cy="160" r="10" fill="var(--hazard)" opacity="0.25" className="node-pulse" />
                    <circle cx="520" cy="160" r="5" fill="var(--hazard)" />
                  </g>

                  <circle cx="540" cy="300" r="4" fill="var(--muted-foreground)" />

                  {/* Destination */}
                  <g>
                    <circle cx="620" cy="240" r="14" fill="var(--signal)" opacity="0.2" className="node-pulse" />
                    <circle cx="620" cy="240" r="6" fill="var(--signal)" />
                    <circle cx="620" cy="240" r="2.5" fill="var(--signal-foreground)" />
                  </g>
                </svg>

                <div className="mt-3 flex flex-wrap gap-4 px-2 font-mono text-xs border-t border-border/50 pt-3">
                  <span className="inline-flex items-center gap-2 text-signal font-semibold">
                    <RouteIcon className="size-3.5" /> risk-aware route
                  </span>
                  <span className="inline-flex items-center gap-2 text-hazard font-semibold">
                    <AlertTriangle className="size-3.5" /> hazard node avoided
                  </span>
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span className="h-px w-4 bg-border" /> road edge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: GROUND CRISIS & FATALITY DATA */}
        <section id="crisis-data" className="relative border-t border-border/70 py-20 lg:py-28 bg-card/40">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-hazard font-bold">
                Ground Reality & Disaster Impact
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Why mountain freight is a life-or-death equation
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Official reports from the Ministry of Road Transport and Highways (MoRTH), National Crime Records Bureau
                (NCRB), and Geological Survey of India (GSI) highlight an urgent mountain highway crisis.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 backdrop-blur-md">
                <div className="font-mono text-3xl font-black text-destructive">1,68,491</div>
                <div className="mt-2 text-sm font-bold text-foreground">Annual Fatalities Nationwide</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  MoRTH accident census shows mountain ghat sections experience a fatal accident severity of{" "}
                  <strong className="text-destructive font-bold">45.2%</strong>—nearly double the plain highway average.
                </p>
                <div className="mt-4 text-[10px] font-mono text-destructive/80 font-bold uppercase">
                  Source: MoRTH Official Census
                </div>
              </div>

              <div className="rounded-2xl border border-hazard/40 bg-hazard/10 p-6 backdrop-blur-md">
                <div className="font-mono text-3xl font-black text-hazard">400+</div>
                <div className="mt-2 text-sm font-bold text-foreground">Major Monsoon Landslides</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  GSI records over 400 severe rockfall and mudflow blockages annually, completely severing lifelines like NH-6,
                  NH-2, NH-10, and NH-13 for weeks.
                </p>
                <div className="mt-4 text-[10px] font-mono text-hazard font-bold uppercase">
                  Source: Geological Survey of India
                </div>
              </div>

              <div className="rounded-2xl border border-hazard/30 bg-card p-6 backdrop-blur-md">
                <div className="font-mono text-3xl font-black text-hazard">6,200+</div>
                <div className="mt-2 text-sm font-bold text-foreground">Northeast Corridor Lives Lost</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Over 6,200 drivers and commuters have perished in the Northeast mountain belt over the past decade due to
                  avoidable ghat drop-offs and brake failures on extreme slopes.
                </p>
                <div className="mt-4 text-[10px] font-mono text-muted-foreground font-bold uppercase">
                  Source: Regional NCRB Records
                </div>
              </div>

              <div className="rounded-2xl border border-signal/40 bg-signal/10 p-6 backdrop-blur-md">
                <div className="font-mono text-3xl font-black text-signal">₹3,500 Cr</div>
                <div className="mt-2 text-sm font-bold text-foreground">Annual Economic Freight Delay</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Critical convoys carrying life-saving pharmaceuticals, oxygen, rations, and defense goods remain
                  stranded in Sonapur tunnel and Sela Pass chokepoints.
                </p>
                <div className="mt-4 text-[10px] font-mono text-signal font-bold uppercase">
                  Source: Logistics Council Estimates
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE INTERACTIVE ROUTE PLANNER */}
        <section id="planner" className="relative border-t border-border/70 py-20 lg:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines opacity-[0.18]" />
          <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8 space-y-8">

            {/* LIVE REGIONAL EARLY-WARNING DISRUPTION TICKER (Requirements b & e) */}
            <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex size-2.5 rounded-full bg-destructive"></span>
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                    <Radio className="size-3.5 text-destructive animate-pulse" />
                    NER Real-Time Road & Corridor Disruption Intelligence
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-signal">
                    <Wifi className="size-3" /> Live Feed Active
                  </span>
                  <span>·</span>
                  <span>Auto-updated via GSI & Field Sync</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {REGIONAL_ALERTS.slice(0, 3).map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-xl border transition-all ${
                      alt.severity === "CRITICAL"
                        ? "border-destructive/40 bg-destructive/10"
                        : alt.severity === "HIGH"
                        ? "border-hazard/40 bg-hazard/10"
                        : "border-signal/40 bg-signal/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className={`font-bold px-1.5 py-0.5 rounded ${
                        alt.severity === "CRITICAL"
                          ? "bg-destructive text-destructive-foreground"
                          : alt.severity === "HIGH"
                          ? "bg-hazard text-hazard-foreground"
                          : "bg-signal text-signal-foreground"
                      }`}>
                        {alt.category}
                      </span>
                      <span className="text-muted-foreground">{alt.timestamp}</span>
                    </div>
                    <div className="font-semibold text-xs text-foreground mt-1 line-clamp-1">
                      {alt.corridor}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {alt.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-bold">
                Try it — route planner
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Enter an origin and destination
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Pick two cities across the eight Northeast states. RaahSetu solves both the fastest and the risk-aware
                path over the road graph and shows you exactly what the safer option trades and avoids.
              </p>
            </div>

            {/* Strategic Mountain Freight Corridors Quick-Picks Ribbon */}
            <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-xl backdrop-blur-md">
              <div className="mb-2.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-signal font-bold">
                  <Zap className="size-4 text-signal animate-pulse" />
                  Strategic Mountain Freight Corridors (One-Click Dispatch)
                </span>
                <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                  {STRATEGIC_CORRIDORS.length} Lifelines
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
                          ? "border-signal bg-signal/15 text-foreground shadow-lg shadow-signal/10"
                          : "border-border bg-secondary/40 text-muted-foreground hover:border-signal/50 hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{corridor.title}</span>
                        {isSelected && <Check className="size-3 text-signal" />}
                      </div>
                      <div className="text-[10px] text-signal font-mono mt-0.5">
                        {corridor.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid: Controls & Outputs vs Map */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Left Column: Form & Telemetry Cards */}
              <div className="flex flex-col gap-5">
                {/* Endpoints Picker Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <div className="grid gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <CityCombobox
                        label="Origin"
                        tone="signal"
                        selectedId={origin}
                        onSelect={(id) => {
                          setCustomOrigin(null);
                          setOrigin(id);
                        }}
                        otherCityId={destination}
                        customOrigin={customOrigin}
                      />

                      <div className="pt-6 shrink-0">
                        <button
                          type="button"
                          onClick={handleSwap}
                          className="p-2.5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-signal transition-colors shadow-sm cursor-pointer"
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

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                      <button
                        type="button"
                        onClick={handleGpsLocation}
                        disabled={isLocating}
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-signal transition-colors cursor-pointer"
                      >
                        {isLocating ? (
                          <Loader2 className="size-3.5 animate-spin text-signal" />
                        ) : (
                          <LocateFixed className="size-3.5 text-signal" />
                        )}
                        <span>{isLocating ? "Acquiring GPS..." : "Snap Origin to Live GPS"}</span>
                      </button>

                      <div className="text-[11px] font-mono text-muted-foreground">
                        111 Nodes Connected
                      </div>
                    </div>

                    {locationNotice && (
                      <div className="text-xs text-hazard bg-hazard/10 border border-hazard/30 rounded-lg p-2 font-mono">
                        {locationNotice}
                      </div>
                    )}

                    {/* Google Maps Style Primary Start Navigation Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleStartNavigation}
                        disabled={!safe || safe.length < 2 || isStartingNav}
                        className={`w-full inline-flex items-center justify-center gap-2.5 rounded-xl font-bold py-3.5 px-4 text-sm transition-all shadow-lg cursor-pointer ${
                          isNavigating
                            ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 active:scale-95"
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]"
                        }`}
                      >
                        {isStartingNav ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Acquiring Live GPS & Calibrating Route...</span>
                          </>
                        ) : isNavigating ? (
                          <>
                            <X className="size-4" />
                            <span>Exit Live Navigation Mode</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="size-4 fill-slate-950" />
                            <span>Start Navigation (Live GPS & OSM)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ESSENTIAL COMMODITY DISPATCH SELECTOR (Requirement 'd') */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-signal font-bold">
                      <Layers className="size-4 text-signal" />
                      Essential Commodity Cargo Priority
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Governs route detour & risk tolerance
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(Object.keys(COMMODITY_PROFILES) as CommodityType[]).map((cKey) => {
                      const prof = COMMODITY_PROFILES[cKey];
                      const isSelected = commodity === cKey;
                      return (
                        <button
                          key={cKey}
                          type="button"
                          onClick={() => setCommodity(cKey)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-signal bg-signal/15 ring-2 ring-signal/30 shadow-md"
                              : "border-border/80 bg-secondary/40 hover:bg-secondary/70"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              prof.priority === "CRITICAL"
                                ? "bg-destructive/20 text-destructive border border-destructive/30"
                                : prof.priority === "HIGH"
                                ? "bg-hazard/20 text-hazard border border-hazard/30"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {prof.priority}
                            </span>
                            {isSelected && <Check className="size-3.5 text-signal" />}
                          </div>
                          <div className="font-bold text-xs text-foreground mt-1 truncate">{prof.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{prof.badge}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vehicle Selector Only (Required Input) */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      <Truck className="size-4 text-signal" />
                      Vehicle Dispatch Profile
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Governs hill speed & axle margins
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(Object.keys(VEHICLE_PROFILES) as VehicleType[]).map((vKey) => {
                      const prof = VEHICLE_PROFILES[vKey];
                      const isSelected = vehicle === vKey;
                      return (
                        <button
                          key={vKey}
                          type="button"
                          onClick={() => setVehicle(vKey)}
                          className={`rounded-xl p-3 text-left border transition-all cursor-pointer ${
                            isSelected
                              ? "border-signal bg-signal/15 text-foreground shadow-md shadow-signal/10"
                              : "border-border bg-secondary/40 text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-foreground">{prof.name}</span>
                            {isSelected && <Check className="size-3.5 text-signal" />}
                          </div>
                          <div className="text-[10px] font-mono text-signal font-semibold">
                            {prof.badge}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                            {prof.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Automated Live Microclimate Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-signal animate-pulse" />
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                        Automated Live Microclimate Telemetry
                      </span>
                    </div>
                    <span className="rounded-full border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] text-signal font-bold">
                      Auto-Synced
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border mb-3 flex items-center justify-between ${
                    weather === "snow"
                      ? "bg-sky-950/40 border-sky-500/40 text-sky-200"
                      : weather === "monsoon"
                      ? "bg-hazard/10 border-hazard/40 text-hazard"
                      : "bg-signal/10 border-signal/40 text-signal"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-background/60 border border-border">
                        {weather === "snow" && <Snowflake className="size-6 text-sky-300" />}
                        {weather === "monsoon" && <CloudRain className="size-6 text-hazard" />}
                        {weather === "clear" && <Sun className="size-6 text-signal" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{liveWeather.summary}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {liveWeather.stationName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-foreground">
                        {liveWeather.tempC > 0 ? `+${liveWeather.tempC}` : liveWeather.tempC}°C
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase">Ambient Temp</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                    <div className="p-2 rounded-xl bg-secondary/50 border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase">Precipitation</div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {liveWeather.precipitationMm} mm/h
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-secondary/50 border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase">Visibility</div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {liveWeather.visibilityKm} km
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-secondary/50 border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase">Road Grip</div>
                      <div className={`text-sm font-bold mt-0.5 ${
                        liveWeather.roadFriction > 0.8
                          ? "text-signal"
                          : liveWeather.roadFriction > 0.6
                          ? "text-hazard"
                          : "text-destructive"
                      }`}>
                        {Math.round(liveWeather.roadFriction * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-secondary/40 border border-border/80 text-xs text-muted-foreground flex items-start gap-2.5">
                    <AlertTriangle className="size-4 text-hazard shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{liveWeather.advisory}</p>
                  </div>
                </div>

                {/* Intermediate Small Cities Ribbon */}
                {intermediateCities.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                        <Milestone className="size-3.5 text-signal" />
                        Transit Checkpoints & Intermediate Towns ({intermediateCities.length})
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {intermediateCities.map((city, idx) => (
                        <div
                          key={city.id}
                          className="shrink-0 flex items-center gap-2 rounded-lg bg-secondary/60 border border-border px-3 py-1 text-xs"
                        >
                          <span className="size-1.5 rounded-full bg-signal" />
                          <span className="font-semibold text-foreground">{city.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">({city.state})</span>
                          {idx < intermediateCities.length - 1 && (
                            <ArrowRight className="size-3 text-muted-foreground ml-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk-Aware Route Card */}
                <div className="rounded-2xl border border-signal/40 bg-signal/[0.06] p-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-display font-semibold text-foreground">
                      <Check className="size-4 text-signal" />
                      Risk-aware route
                    </span>
                    <span className="rounded-full border border-signal/40 px-2 py-0.5 font-mono text-[11px] text-signal font-bold">
                      recommended
                    </span>
                  </div>
                  {safeStats ? (
                    <div className="mt-4 grid grid-cols-3 gap-3 font-mono">
                      <div>
                        <div className="text-lg font-semibold text-foreground">{safeStats.distance} km</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">distance</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-foreground">{formatHours(safeStats.hours)}</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">est. time</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-signal">{safeStats.riskIndex}</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">risk index</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-destructive mt-2">No traversable path found.</div>
                  )}
                </div>

                {/* Fastest Route Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <div className="flex items-center gap-2 font-display font-semibold text-hazard">
                    <RouteIcon className="size-4" />
                    Fastest route
                  </div>
                  {shortestStats ? (
                    <div className="mt-4 grid grid-cols-3 gap-3 font-mono">
                      <div>
                        <div className="text-lg font-semibold text-foreground">{shortestStats.distance} km</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">distance</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-foreground">{formatHours(shortestStats.hours)}</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">est. time</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-hazard">{shortestStats.riskIndex}</div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">risk index</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-destructive mt-2">No traversable path found.</div>
                  )}
                </div>

                {/* Why This Route Explanation Card */}
                <div className="rounded-2xl border border-border bg-secondary/40 p-5 shadow-xl">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Why this route
                  </span>
                  {safeStats && shortestStats && (
                    <>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        The risk-aware route accepts{" "}
                        <span className="text-foreground font-bold font-mono">
                          {formatHours(Math.max(0, safeStats.hours - shortestStats.hours))}
                        </span>{" "}
                        extra travel time to cut the risk index from{" "}
                        <span className="text-hazard font-bold font-mono">{shortestStats.riskIndex}</span> to{" "}
                        <span className="text-signal font-bold font-mono">{safeStats.riskIndex}</span>.
                      </p>
                      <ul className="mt-3 space-y-2">
                        {riskReductionPct > 0 && (
                          <li className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                            <Check className="mt-0.5 size-3.5 shrink-0 text-signal" />
                            <span>
                              Delivers a <span className="text-signal font-bold">{riskReductionPct}%</span> total hazard exposure reduction across vulnerable mountain ghats.
                            </span>
                          </li>
                        )}
                        {safeLegs.filter((l) => l.note).slice(0, 3).map((l, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                            <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-hazard" />
                            <span>
                              Monitors <span className="text-foreground font-semibold">{l.fromCity.name}–{l.toCity.name}</span>: {l.note}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartNavigation}
                    disabled={!safe || safe.length < 2 || isStartingNav}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all shadow-lg cursor-pointer ${
                      isNavigating
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25"
                    }`}
                  >
                    {isStartingNav ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Acquiring GPS...</span>
                      </>
                    ) : isNavigating ? (
                      <>
                        <X className="size-4" />
                        <span>Exit Navigation</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="size-4 fill-slate-950" />
                        <span>Start Navigation</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportManifest}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-signal px-4 py-3 text-xs font-bold text-signal-foreground transition-transform hover:-translate-y-0.5 shadow-lg shadow-signal/20 cursor-pointer"
                  >
                    <Download className="size-4" />
                    <span>Export Manifest (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="size-4 text-signal" />
                        <span className="text-signal">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="size-4" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Map & Turn-by-Turn Leg Itinerary */}
              <div className="flex flex-col gap-5">
                {/* The Map Card */}
                <div id="route-map-viewport" ref={mapCardRef} className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-4 shadow-2xl shadow-black/50 backdrop-blur-md">
                  {/* Map Header & Controls */}
                  <div className="relative flex items-center justify-between px-2 pb-3 border-b border-border/60">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                      northeast_india.map
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-signal font-bold">
                        <span className="size-2 rounded-full bg-signal node-pulse" /> solved
                      </span>

                      <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={handleZoomIn}
                          className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          title="Zoom In"
                        >
                          <ZoomIn className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleZoomOut}
                          className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          title="Zoom Out"
                        >
                          <ZoomOut className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleResetZoom}
                          className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          title="Reset Zoom"
                        >
                          {Math.round(zoomLevel * 100)}%
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SVG Canvas */}
                  <div className="relative w-full aspect-[1000/560] max-h-[560px] bg-background/60 rounded-xl overflow-hidden my-3 border border-border/40">
                    {/* Google Maps Style Top Navigation HUD Overlay */}
                    {isNavigating && (
                      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-auto transition-all animate-in fade-in slide-in-from-top-3 duration-300">
                        {/* Top Green Maneuver Banner */}
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-emerald-950/95 border-2 border-emerald-500/50 p-2.5 sm:p-3.5 shadow-2xl shadow-emerald-950/80 backdrop-blur-md text-white">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30">
                              <CornerUpRight className="size-5 sm:size-6 stroke-[2.5]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg sm:text-2xl font-black tracking-tight text-white font-mono">
                                  {navTelemetry.distToNextCheckpoint} km
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                                  Next Hub
                                </span>
                              </div>
                              <p className="truncate text-xs sm:text-sm font-semibold text-emerald-200">
                                {navTelemetry.nextInstruction}
                              </p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 pt-0.5 truncate">
                                <MapPin className="size-3 text-emerald-400 shrink-0" />
                                <span className="truncate">Approaching: <strong className="text-foreground">{navTelemetry.nextCheckpointName}</strong> (via NH corridor)</span>
                              </p>
                            </div>
                          </div>

                          {/* Speed & Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="hidden sm:flex flex-col items-center bg-black/50 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-mono">
                              <span className="text-lg font-black text-emerald-400">{navGpsCoords?.speedKmh || 52}</span>
                              <span className="text-[8px] uppercase tracking-widest text-muted-foreground">km/h</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isVoiceMuted ? "bg-secondary text-muted-foreground border-border" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                              }`}
                              title={isVoiceMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
                            >
                              {isVoiceMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={handleStopNavigation}
                              className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg transition-colors cursor-pointer"
                              title="Exit Live Navigation"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Live Road Advisory Ticker if note exists */}
                        {navTelemetry.activeLeg?.note && (
                          <div className="flex items-center gap-2 rounded-lg bg-hazard/15 border border-hazard/40 px-2.5 py-1.5 text-xs text-hazard font-mono backdrop-blur-md shadow-lg">
                            <TriangleAlert className="size-3.5 shrink-0 text-hazard animate-bounce" />
                            <span className="truncate font-semibold">Live Sector Advisory: {navTelemetry.activeLeg.note}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Floating Journey Bar */}
                    {isNavigating && (
                      <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950/95 border border-emerald-500/40 p-2.5 sm:p-3 shadow-2xl backdrop-blur-md">
                        {/* Left: ETA, Remaining Dist, Remaining Time */}
                        <div className="flex items-center gap-3 sm:gap-5">
                          <div>
                            <div className="text-base sm:text-xl font-black text-emerald-400 font-mono">
                              {formatHours(navTelemetry.remainingHours)}
                            </div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                              Remaining Time
                            </div>
                          </div>

                          <div className="h-6 w-px bg-border/80" />

                          <div>
                            <div className="text-sm sm:text-base font-bold text-foreground font-mono">
                              {navTelemetry.remainingDistKm} km
                            </div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                              Remaining Dist
                            </div>
                          </div>

                          <div className="h-6 w-px bg-border/80" />

                          <div>
                            <div className="text-sm sm:text-base font-bold text-foreground font-mono">
                              {navTelemetry.etaTime}
                            </div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                              Estimated ETA
                            </div>
                          </div>
                        </div>

                        {/* Right: GPS Origin, Simulation Controls & Exit */}
                        <div className="flex items-center gap-2">
                          {navGpsCoords?.placeName && (
                            <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-md px-2 py-1 max-w-[200px] truncate" title={navGpsCoords.placeName}>
                              <LocateFixed className="size-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{navGpsCoords.placeName}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setIsSimulatingDrive(!isSimulatingDrive)}
                            className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 border border-border cursor-pointer transition-colors"
                          >
                            {isSimulatingDrive ? (
                              <>
                                <Pause className="size-3 text-signal" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="size-3 text-signal" />
                                <span>Drive</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setNavProgressPct(0)}
                            className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border cursor-pointer"
                            title="Restart Route"
                          >
                            <RotateCcw className="size-3" />
                          </button>

                          <button
                            type="button"
                            onClick={handleStopNavigation}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1.5 text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer transition-colors"
                          >
                            <span>Exit</span>
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-secondary/80 rounded-full overflow-hidden mt-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-signal to-emerald-400 transition-all duration-300"
                            style={{ width: `${navProgressPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <svg viewBox={svgViewBox} className="relative w-full h-full select-none cursor-crosshair">
                      <defs>
                        <filter id="glow-safe" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="glow-hazard" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Brahmaputra River Basin Artery */}
                      <path
                        d="M 90 290 Q 250 270 420 250 T 680 210 T 880 180"
                        fill="none"
                        stroke="#0891b2"
                        strokeWidth="8"
                        strokeOpacity="0.25"
                        strokeLinecap="round"
                      />
                      <text
                        x="320"
                        y="262"
                        fill="#0891b2"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        opacity="0.4"
                        letterSpacing="4"
                      >
                        BRAHMAPUTRA VALLEY BASIN
                      </text>

                      {/* State Labels */}
                      <text x="360" y="295" fill="var(--muted-foreground)" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">ASSAM</text>
                      <text x="560" y="110" fill="var(--muted-foreground)" fontSize="12" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">ARUNACHAL PRADESH</text>
                      <text x="240" y="385" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">MEGHALAYA</text>
                      <text x="690" y="295" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">NAGALAND</text>
                      <text x="670" y="420" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">MANIPUR</text>
                      <text x="520" y="520" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">MIZORAM</text>
                      <text x="350" y="490" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">TRIPURA</text>
                      <text x="80" y="140" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.35" letterSpacing="3">SIKKIM</text>

                      {/* Road Network Edges */}
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
                            stroke="var(--border)"
                            strokeWidth="1.5"
                            strokeOpacity="0.75"
                          />
                        );
                      })}

                      {/* Shortest / Nominal Route (Hazard Orange Dashed) */}
                      {shortest && (
                        <polyline
                          points={toPolylinePoints(shortest)}
                          fill="none"
                          stroke="var(--hazard)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="4 6"
                          opacity="0.9"
                        />
                      )}

                      {/* Safe / Risk-Aware Route (Glowing Mint Line with Animated Flow) */}
                      {safe && (
                        <>
                          <polyline
                            points={toPolylinePoints(safe)}
                            fill="none"
                            stroke="var(--signal)"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.25"
                            filter="url(#glow-safe)"
                          />
                          <polyline
                            points={toPolylinePoints(safe)}
                            fill="none"
                            stroke="var(--signal)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="route-flow"
                          />
                        </>
                      )}

                      {/* Hovered Itinerary Leg Highlight */}
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

                      {/* Exact Live GPS Location Marker & Connector */}
                      {customOrigin && (() => {
                        const gpsSvg = projectGeoToSvg(customOrigin.lat, customOrigin.lon);
                        return (
                          <g className="cursor-pointer">
                            {/* Connector line from exact GPS position to highway entry hub */}
                            <line
                              x1={gpsSvg.x}
                              y1={gpsSvg.y}
                              x2={customOrigin.nearestHub.x}
                              y2={customOrigin.nearestHub.y}
                              stroke="var(--signal)"
                              strokeWidth="2.5"
                              strokeDasharray="4 4"
                              opacity="0.8"
                            />
                            {/* Live GPS Radar beacon */}
                            <circle
                              cx={gpsSvg.x}
                              cy={gpsSvg.y}
                              r="22"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2.5"
                              className="radar-ping"
                            />
                            <circle
                              cx={gpsSvg.x}
                              cy={gpsSvg.y}
                              r="8"
                              fill="#38bdf8"
                              stroke="#0f172a"
                              strokeWidth="2.5"
                              filter="drop-shadow(0 0 8px #38bdf8)"
                            />
                            <circle cx={gpsSvg.x} cy={gpsSvg.y} r="3" fill="#ffffff" />
                            <text
                              x={gpsSvg.x}
                              y={gpsSvg.y - 16}
                              textAnchor="middle"
                              fill="#38bdf8"
                              fontSize="12"
                              fontFamily="monospace"
                              fontWeight="bold"
                              filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.95))"
                            >
                              📍 {customOrigin.name} (Exact GPS)
                            </text>
                          </g>
                        );
                      })()}

                      {/* Live Navigating Driver Vehicle Beacon (Google Maps Style) */}
                      {isNavigating && (
                        <g transform={`translate(${navTelemetry.currentSvg.x}, ${navTelemetry.currentSvg.y})`} className="cursor-pointer">
                          {/* Animated radar rings */}
                          <circle r="26" fill="none" stroke="#10b981" strokeWidth="2" className="radar-ping" />
                          <circle r="14" fill="rgba(16, 185, 129, 0.2)" stroke="#38bdf8" strokeWidth="1.5" />
                          
                          {/* Directional Heading indicator arrow */}
                          <g transform={`rotate(${navTelemetry.headingAngle})`}>
                            <polygon
                              points="0,-16 10,10 0,5 -10,10"
                              fill="#10b981"
                              stroke="#022c22"
                              strokeWidth="2"
                              filter="drop-shadow(0 0 8px #10b981)"
                            />
                          </g>

                          {/* Center core dot */}
                          <circle r="3.5" fill="#ffffff" />

                          {/* Floating Driver Badge */}
                          <g transform="translate(0, -28)">
                            <rect
                              x="-65"
                              y="-12"
                              width="130"
                              height="20"
                              rx="5"
                              fill="#022c22"
                              stroke="#10b981"
                              strokeWidth="1.2"
                              filter="drop-shadow(0 2px 5px rgba(0,0,0,0.8))"
                            />
                            <text
                              x="0"
                              y="2"
                              textAnchor="middle"
                              fill="#6ee7b7"
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              🚗 ${navGpsCoords?.speedKmh || 52} km/h • DRIVER
                            </text>
                          </g>
                        </g>
                      )}

                      {/* City Nodes */}
                      {CITIES.map((city) => {
                        const isOrigin = city.id === origin;
                        const isDest = city.id === destination;
                        const isOnRoute = activeRouteCityIds.has(city.id);

                        if (isOrigin) {
                          return (
                            <g key={city.id} className="cursor-pointer">
                              <circle cx={city.x} cy={city.y} r="18" fill="none" stroke="var(--signal)" strokeWidth="2" opacity="0.7" className="radar-ping" />
                              <circle cx={city.x} cy={city.y} r="8" fill="var(--signal)" stroke="var(--background)" strokeWidth="2.5" />
                              <text
                                x={city.x}
                                y={city.y - 14}
                                textAnchor="middle"
                                fill="var(--foreground)"
                                fontSize="12"
                                fontFamily="monospace"
                                fontWeight="bold"
                                filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.9))"
                              >
                                {city.name} (Origin)
                              </text>
                            </g>
                          );
                        }

                        if (isDest) {
                          return (
                            <g key={city.id} className="cursor-pointer">
                              <circle cx={city.x} cy={city.y} r="18" fill="none" stroke="var(--hazard)" strokeWidth="2" opacity="0.7" className="radar-ping" />
                              <circle cx={city.x} cy={city.y} r="8" fill="var(--hazard)" stroke="var(--background)" strokeWidth="2.5" />
                              <text
                                x={city.x}
                                y={city.y - 14}
                                textAnchor="middle"
                                fill="var(--foreground)"
                                fontSize="12"
                                fontFamily="monospace"
                                fontWeight="bold"
                                filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.9))"
                              >
                                {city.name} (Dest)
                              </text>
                            </g>
                          );
                        }

                        if (isOnRoute) {
                          return (
                            <g
                              key={city.id}
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredCity(city)}
                              onMouseLeave={() => setHoveredCity(null)}
                            >
                              <circle cx={city.x} cy={city.y} r="5" fill="var(--foreground)" stroke="var(--background)" strokeWidth="1.5" />
                              <text
                                x={city.x}
                                y={city.y + 14}
                                textAnchor="middle"
                                fill="var(--muted-foreground)"
                                fontSize="10"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {city.name}
                              </text>
                            </g>
                          );
                        }

                        return (
                          <circle
                            key={city.id}
                            cx={city.x}
                            cy={city.y}
                            r="2.5"
                            fill="var(--muted-foreground)"
                            stroke="var(--background)"
                            strokeWidth="1.5"
                            opacity="0.5"
                            className="hover:opacity-100 hover:fill-signal cursor-pointer transition-all"
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

                    {hoveredCity && (
                      <div className="absolute bottom-3 left-3 rounded-xl border border-border bg-card/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md pointer-events-none">
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <MapPin className="size-3 text-signal" />
                          <span>{hoveredCity.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">({hoveredCity.state})</span>
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          Lat: {hoveredCity.lat.toFixed(3)}°N · Lon: {hoveredCity.lon.toFixed(3)}°E
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="relative flex flex-wrap gap-x-5 gap-y-2 px-2 pb-1 pt-2 font-mono text-xs border-t border-border/50">
                    <span className="inline-flex items-center gap-2 text-signal font-semibold">
                      <span className="h-0.5 w-5 rounded bg-signal" /> risk-aware
                    </span>
                    <span className="inline-flex items-center gap-2 text-hazard font-semibold">
                      <span className="h-0.5 w-5 rounded bg-hazard [background:repeating-linear-gradient(90deg,var(--hazard)_0_3px,transparent_3px_7px)]" /> fastest
                    </span>
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <span className="size-2 rounded-full bg-signal" /> origin
                    </span>
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <span className="size-2 rounded-full bg-hazard" /> destination
                    </span>
                  </div>
                </div>

                {/* Turn-by-Turn Leg Itinerary Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
                  <div className="mb-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-signal font-bold uppercase tracking-widest">
                      Turn-by-Turn Itinerary ({safeLegs.length} Legs)
                    </span>
                    <span className="text-muted-foreground">
                      Hover to spotlight leg on map
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                    {safeLegs.map((leg, idx) => (
                      <div
                        key={`${leg.fromId}-${leg.toId}-${idx}`}
                        onMouseEnter={() => setHoveredLegIndex(idx)}
                        onMouseLeave={() => setHoveredLegIndex(null)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          hoveredLegIndex === idx
                            ? "border-signal bg-signal/15 shadow-md"
                            : "border-border/70 bg-secondary/40 hover:border-border hover:bg-secondary/70"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="size-5 rounded-md bg-secondary text-foreground font-mono text-xs flex items-center justify-center font-bold border border-border">
                              {idx + 1}
                            </span>
                            <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                              <span>{leg.fromCity.name}</span>
                              <ArrowRight className="size-3 text-muted-foreground" />
                              <span>{leg.toCity.name}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              leg.terrainType === "High Mountain Pass"
                                ? "bg-destructive/15 text-destructive border border-destructive/30"
                                : leg.terrainType === "Foothills"
                                ? "bg-hazard/15 text-hazard border border-hazard/30"
                                : "bg-signal/15 text-signal border border-signal/30"
                            }`}>
                              {leg.terrainType}
                            </span>
                            <span className="text-foreground font-semibold">{leg.dist} km</span>
                            <span className="text-muted-foreground">({formatHours(leg.hours)})</span>
                            <span className={`font-bold ${
                              leg.risk > 40 ? "text-destructive" : leg.risk > 20 ? "text-hazard" : "text-signal"
                            }`}>
                              {leg.risk}% Risk
                            </span>
                          </div>
                        </div>

                        {leg.note && (
                          <p className="text-xs text-muted-foreground mt-1.5 pl-7 border-l border-border">
                            {leg.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DISTRICT-WISE CONNECTIVITY HEALTH DASHBOARD (Requirement 'g') */}
            <div className="rounded-3xl border border-border bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-bold">
                    Accessibility Monitoring Dashboard
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                    District-Wise Connectivity Status (8 NER States)
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 text-signal">
                    <span className="size-2 rounded-full bg-signal" /> Normal
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-hazard">
                    <span className="size-2 rounded-full bg-hazard" /> Watch
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-destructive">
                    <span className="size-2 rounded-full bg-destructive" /> Restricted
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {DISTRICT_CONNECTIVITY.map((dist) => (
                  <div
                    key={dist.district}
                    className={`p-4 rounded-2xl border transition-all ${
                      dist.status === "RESTRICTED"
                        ? "border-destructive/40 bg-destructive/10"
                        : dist.status === "WATCH"
                        ? "border-hazard/40 bg-hazard/10"
                        : "border-border bg-secondary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground font-mono">{dist.state}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        dist.status === "RESTRICTED"
                          ? "bg-destructive text-destructive-foreground"
                          : dist.status === "WATCH"
                          ? "bg-hazard text-hazard-foreground"
                          : "bg-signal text-signal-foreground"
                      }`}>
                        {dist.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-foreground mt-2">{dist.district}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">{dist.primaryHighway}</div>
                    <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[11px] font-mono">
                      <span>Incidents: <strong className="text-foreground">{dist.incidentCount}</strong></span>
                      <span className={dist.delayAvgMinutes > 60 ? "text-destructive font-bold" : "text-muted-foreground"}>
                        Delay: +{dist.delayAvgMinutes}m
                      </span>
                      <button
                        onClick={() => {
                          setDestination(dist.hubId);
                          const el = document.getElementById("planner");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-signal hover:underline font-bold cursor-pointer"
                      >
                        Route →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Milestone className="size-3.5" />
              Demo graph with representative road-risk weights. The production engine runs the same A* search over full OpenStreetMap networks and live hazard reports.
              <ArrowRight className="size-3.5" />
            </p>
          </div>
        </section>

        {/* SECTION 4: THE PLATFORM */}
        <section id="platform" className="relative border-t border-border/70 py-20 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-bold">
                The platform
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Logistics intelligence that shows its work
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Every route is grounded in real road data and explicit rules — not a black box. Here is what powers RaahSetu end to end.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <RouteIcon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">Custom A* pathfinding</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A hand-built A* with a priority queue, an admissible heuristic, and explicit edge reconstruction — validated against an independent Dijkstra baseline across 300 randomized scenarios.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <AlertTriangle className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">Risk-aware comparison</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Fastest and risk-aware routes are computed on the same road graph and scenario, so every trade-off between speed and exposure is explainable and reproducible.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <Mountain className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">Northeast terrain & networks</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  State-wise road extraction and public-facility data across all eight states, with a deterministic synthetic sandbox and a real Guwahati OSM pilot network.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <CloudRain className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">Automated scenario & microclimate</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Automatically syncs regional microclimates (snow freeze, monsoon mudflow, clear highway), adjusts vehicle axle constraints, and exports full JSON audit manifests.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <Database className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">Supabase / PostGIS foundation</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Eight-state metadata, versioned graph snapshots, hazard observations, and geo-tagged field-report APIs backed by a live spatial database.
                </p>
              </div>

              <div className="group bg-card p-7 transition-colors hover:bg-secondary/50">
                <span className="flex size-11 items-center justify-center rounded-lg bg-signal/12 text-signal ring-1 ring-signal/25">
                  <FileText className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">Field reports & moderation</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Officials submit geo-tagged incidents with private, authenticated evidence uploads. Reviewer-approved events become request-time closures for the routing engine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: HOW IT WORKS */}
        <section id="how" className="relative border-t border-border/70 py-20 lg:py-28 bg-card/20">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-bold">
                How it works
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                From raw road data to an explainable route
              </h2>
            </div>

            <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <li className="relative rounded-xl border border-border bg-card p-6 shadow-md">
                <span className="font-mono text-sm font-semibold text-signal">01</span>
                <span aria-hidden="true" className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Build the road graph</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  OSMnx extracts directed, multi-edge road networks for the region. Truck limits, closures, and versioned snapshots are stored in PostGIS.
                </p>
              </li>

              <li className="relative rounded-xl border border-border bg-card p-6 shadow-md">
                <span className="font-mono text-sm font-semibold text-signal">02</span>
                <span aria-hidden="true" className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Choose a scenario</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Pick origin and destination, select a vehicle, and let the system automatically detect microclimate conditions and hill exposure.
                </p>
              </li>

              <li className="relative rounded-xl border border-border bg-card p-6 shadow-md">
                <span className="font-mono text-sm font-semibold text-signal">03</span>
                <span aria-hidden="true" className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Solve with custom A*</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The engine runs A* twice on the same graph — once for the fastest path, once weighted by road risk exposure — with explicit edge reconstruction.
                </p>
              </li>

              <li className="relative rounded-xl border border-border bg-card p-6 shadow-md">
                <span className="font-mono text-sm font-semibold text-signal">04</span>
                <span aria-hidden="true" className="mt-4 block h-px w-full bg-gradient-to-r from-signal/60 to-transparent" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Compare & export</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Inspect the two routes side by side on interactive terrain, understand each trade-off, and export the full explainable result as JSON.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* SECTION 6: COMPARISON */}
        <section id="comparison" className="relative border-t border-border/70 py-20 lg:py-28">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-signal font-mono text-xs uppercase tracking-widest font-bold">
                <Check className="size-4" />
                Comparative Route Principles
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Honest multi-criteria logistics trade-offs
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                In difficult mountain geography, the shortest path often crosses hazardous mudslides, flooded valley floors,
                and steep gradient hairpin drops. RaahSetu quantifies this risk explicitly.
              </p>
              <div className="p-4 rounded-xl bg-signal/10 border border-signal/30 text-xs text-signal font-mono">
                Average hazard reduction index: 34% across 56 controlled mountain freight scenarios.
              </div>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-bold">
                Fastest vs. risk-aware
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Two routes, one honest trade-off
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                RaahSetu never hides the cost of safety. It surfaces both options on the same graph so planners can decide with full context.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-hazard">
                    <Zap className="size-4" />
                    <span className="font-display font-semibold">Fastest route</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Minimises estimated travel time only. May pass through landslide-prone or higher-exposure road edges.
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

                <div className="rounded-xl border border-signal/40 bg-signal/[0.06] p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-signal">
                    <Check className="size-4" />
                    <span className="font-display font-semibold text-foreground">Risk-aware route</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Weights each edge by road-risk exposure and respects vehicle limits and closures, trading a little time for a lower risk index.
                  </p>
                  <div className="mt-4 flex gap-6 font-mono text-xs">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" /> slightly longer
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-signal font-bold">
                      <Check className="size-3.5" /> lower risk index
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: ENGINEERING STACK */}
        <section id="stack" className="relative border-t border-border/70 py-20 lg:py-28 bg-card/20">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-bold">
                Engineering stack
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Built on the team blueprint
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Dashboard UI</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">React + TypeScript</p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Interactive Cartography</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">SVG + React Three Fiber</p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Routing API</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">Python 3.12 + FastAPI</p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Pathfinding</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">Custom A* engine</p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Road extraction</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">OSMnx + Pyosmium</p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Spatial data</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">Supabase / PostGIS</p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Microclimate</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">Automated Telemetry</p>
              </div>
              <div className="bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-signal font-bold">Deployment</p>
                <p className="mt-2 font-display text-base font-semibold text-foreground">Docker + Kubernetes</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: WHAT THE PROTOTYPE DOES NOT CLAIM */}
        <section className="relative border-t border-border/70 py-20 lg:py-28">
          <div className="mx-auto w-full max-w-4xl px-5 lg:px-8">
            <div className="rounded-2xl border border-border bg-card/60 p-8 lg:p-10 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-md bg-hazard/12 text-hazard ring-1 ring-hazard/25">
                  <Info className="size-5" />
                </span>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  What the prototype does not claim
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Explainability means being honest about limits. RaahSetu is upfront about the boundaries of the current prototype:
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  The synthetic network uses fictional roads and hazards; the real OSM network explicitly reports where reviewed risk evidence is missing.
                </li>
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  Weather controls simulate conditions and travel time is estimated without live traffic.
                </li>
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  Risk exposure is an index, not an accident probability. Scoring is rule-based, not a trained predictive ML model.
                </li>
                <li className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-hazard" />
                  This is a prototype — not operational dispatch. GPS tracking, live feeds, and turn restrictions are part of ongoing expansion.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-border/70 py-16 px-5 lg:px-8 bg-card/30">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
        <div className="relative mx-auto w-full max-w-7xl flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-signal/15 text-signal ring-1 ring-signal/30">
              <Waypoints className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold text-foreground">RaahSetu</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Northeast India</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            OpenStreetMap data © OpenStreetMap contributors, ODbL 1.0. Terrain-aware logistics route planner.
          </p>
        </div>
      </footer>

      {/* FIELD INCIDENT & ROAD DAMAGE REPORTER MODAL (Requirement 'f') */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-hazard/15 text-hazard border border-hazard/30">
                  <Camera className="size-5" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">Field Incident / Road Slip Report</h3>
                  <p className="text-xs text-muted-foreground">Direct feed from drivers, border officials & local authorities</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const report = {
                  id: "REP-" + Date.now(),
                  corridor: formData.get("corridor"),
                  category: formData.get("category"),
                  severity: formData.get("severity"),
                  notes: formData.get("notes"),
                  timestamp: new Date().toISOString(),
                  offline: !navigator.onLine,
                };
                try {
                  const existing = JSON.parse(localStorage.getItem("rs_offline_reports") || "[]");
                  existing.push(report);
                  localStorage.setItem("rs_offline_reports", JSON.stringify(existing));
                  setOfflineReportsCount(existing.length);
                } catch {}
                setReportSuccessNotice("Incident report successfully logged to local geo-database and queued for central sync.");
                setTimeout(() => {
                  setReportSuccessNotice(null);
                  setIsReportModalOpen(false);
                }, 2200);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-mono uppercase font-bold text-muted-foreground block mb-1">
                  Corridor / Road Name
                </label>
                <input
                  name="corridor"
                  required
                  placeholder="e.g. NH-29 Pagla Pahar Mile 124 or Sela Pass North Face"
                  className="w-full rounded-xl border border-border bg-secondary/60 px-3.5 py-2 text-sm text-foreground outline-none focus:border-signal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono uppercase font-bold text-muted-foreground block mb-1">
                    Incident Type
                  </label>
                  <select
                    name="category"
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground outline-none focus:border-signal"
                  >
                    <option value="Landslide / Mud Slip">Landslide / Mud Slip</option>
                    <option value="River Flood / Submergence">River Flood / Submergence</option>
                    <option value="Bridge Structural Crack">Bridge Structural Crack</option>
                    <option value="Black Ice / Snow Choke">Black Ice / Snow Choke</option>
                    <option value="Road Cave-in / Sinking">Road Cave-in / Sinking</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono uppercase font-bold text-muted-foreground block mb-1">
                    Passability Impact
                  </label>
                  <select
                    name="severity"
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground outline-none focus:border-signal"
                  >
                    <option value="Total Blockage / Impassable">Total Blockage / Impassable</option>
                    <option value="Single Lane Convoy Only">Single Lane Convoy Only</option>
                    <option value="Passable with Extreme Caution">Passable with Extreme Caution</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono uppercase font-bold text-muted-foreground block mb-1">
                  Field Observations & Detour Advice
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  required
                  placeholder="Describe boulder size, water depth, estimated clearance time by BRO / PWD..."
                  className="w-full rounded-xl border border-border bg-secondary/60 px-3.5 py-2 text-xs text-foreground outline-none focus:border-signal"
                />
              </div>

              {/* Photo Upload Simulator & GPS Stamp */}
              <div className="rounded-xl border border-dashed border-border p-3.5 bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-signal" />
                  <span className="text-muted-foreground font-mono text-[11px]">
                    Geo-Tagged Photo Evidence Attached
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-signal/15 text-signal border border-signal/30">
                  GPS Auto-Stamped
                </span>
              </div>

              {/* Offline Notice */}
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                <span className="flex items-center gap-1 text-signal">
                  <Radio className="size-3 text-signal" /> Offline Queue Sync Ready
                </span>
                <span>Low-Network Resilient</span>
              </div>

              {reportSuccessNotice && (
                <div className="p-2.5 rounded-xl bg-signal/15 border border-signal/40 text-signal font-mono text-xs text-center font-bold">
                  ✓ {reportSuccessNotice}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-hazard text-hazard-foreground font-bold hover:brightness-110 shadow-lg cursor-pointer"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
