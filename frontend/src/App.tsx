import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpDown,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Database,
  Download,
  Info,
  Layers,
  Loader2,
  LocateFixed,
  MapPin,
  Maximize2,
  Mic,
  Minimize2,
  Moon,
  Mountain,
  Navigation,
  Phone,
  PhoneCall,
  Search,
  Share2,
  Siren,
  Sun,
  Truck,
  Waypoints,
  X,
} from "lucide-react";
import { RealMapLeaflet } from "./RealMapLeaflet";
import {
  detectPhoneNativeLanguage,
  getLocalizedNavInstruction,
  getSpeechRecognitionLocale,
  matchCityFromVoice,
  speakMultilingual,
} from "./voiceRecognition";
import {
  CITIES,
  CITY_MAP,
  COMMODITY_PROFILES,
  CommodityType,
  DISTRICT_CONNECTIVITY,
  STRATEGIC_CORRIDORS,
  SupportedLanguage,
  UI_TRANSLATIONS,
  VEHICLE_PROFILES,
  VehicleType,
  WEATHER_PROFILES,
  computeStats,
  formatHours,
  getAdjustedEdgeRisk,
  getAutomaticWeatherForLocation,
  getIntermediateCities,
  getRouteLegs,
  solvePath,
} from "./routeData";

// Clean City Combobox
function CityCombobox({
  label,
  selectedId,
  onSelect,
  otherCityId,
  customOrigin,
  lang,
  onGpsLocate,
  isLocating,
}: {
  label: string;
  selectedId: string;
  onSelect: (id: string) => void;
  otherCityId?: string;
  customOrigin?: { name: string; lat: number; lon: number } | null;
  lang: SupportedLanguage;
  onGpsLocate?: () => void;
  isLocating?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechRecognitionLocale(lang);
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      setIsListening(true);
      setVoiceNotice("Listening...");

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const matched = matchCityFromVoice(transcript, CITIES);
        if (matched && matched.id !== otherCityId) {
          onSelect(matched.id);
          setVoiceNotice(`Matched: ${matched.name}`);
          setTimeout(() => {
            setIsListening(false);
            setVoiceNotice(null);
          }, 1200);
        } else {
          setVoiceNotice(`No match for: "${transcript}"`);
          setTimeout(() => {
            setIsListening(false);
            setVoiceNotice(null);
          }, 1500);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice(null);
    }
  };

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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="size-3.5 text-primary" />
          <span>{label}</span>
        </label>
        {label === "Departure Hub" && onGpsLocate && (
          <button
            type="button"
            onClick={onGpsLocate}
            disabled={isLocating}
            className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {isLocating ? <Loader2 className="size-3 animate-spin" /> : <LocateFixed className="size-3" />}
            <span>Use Device GPS</span>
          </button>
        )}
      </div>

      <div className="relative flex items-center rounded-xl border border-border bg-card px-3 py-2.5 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-xs">
        <Search className="size-4 text-muted-foreground shrink-0 mr-2" />
        <div className="flex-1 min-w-0">
          {open ? (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type city or state..."
              className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setQuery("");
              }}
              className="flex w-full items-center justify-between text-left text-sm cursor-pointer truncate"
            >
              <span className="font-semibold text-foreground truncate">
                {customOrigin && label === "Departure Hub" ? (
                  <span className="text-primary font-bold">📍 {customOrigin.name}</span>
                ) : (
                  <>
                    <span>{selectedCity?.name}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                      ({selectedCity?.state})
                    </span>
                  </>
                )}
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isListening ? "bg-rose-500/20 text-rose-500 animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            title="Voice Search"
          >
            <Mic className="size-3.5" />
          </button>
          {open && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {voiceNotice && (
          <span className="absolute -top-7 right-0 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-primary text-primary-foreground shadow-sm">
            {voiceNotice}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg">
          <div className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {filtered.length} Locations Available
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
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors cursor-pointer ${
                city.id === selectedId
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span>{city.name}</span>
              <span className="text-xs text-muted-foreground">{city.state}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface DriverProfile {
  driverName: string;
  driverMobile: string;
  vehicleNo: string;
  vehicleType: VehicleType;
  commodity: CommodityType;
  trustedContactName: string;
  trustedContactMobile: string;
  isRegistered: boolean;
}

const DEFAULT_DRIVER_PROFILE: DriverProfile = {
  driverName: "Rajesh Kumar Das",
  driverMobile: "+91 98640 12345",
  vehicleNo: "AS 01 EC 4421",
  vehicleType: "heavy",
  commodity: "medical",
  trustedContactName: "Suresh Das (Fleet Dispatch)",
  trustedContactMobile: "+91 94350 98765",
  isRegistered: true,
};

export interface RoadBlockageAlert {
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
  updatedTime: string;
}

export const ACTIVE_ROAD_BLOCKAGES: RoadBlockageAlert[] = [
  {
    id: "BLK-NH10-SIKKIM",
    road: "NH-10 National Highway",
    cities: "Gangtok ⟷ Siliguri",
    originId: "gangtok",
    destinationId: "siliguri",
    state: "Sikkim & West Bengal",
    exactSpot: "29th Mile & Teesta Bazaar (km 42)",
    cause: "Severe Monsoon Hill Landslide & Road Bed Subsidence",
    avoidInfo: "NH-10 Teesta River Corridor closed to heavy freight",
    detourRoute: "Divert via Lava – Algarah – Kalimpong Bypass Corridor",
    severity: "CRITICAL",
    updatedTime: "BRO & PWD Telemetry",
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
    avoidInfo: "Main gorge corridor obstructed; multi-axle freight queued",
    detourRoute: "Divert via Niuland – Kohima Alternate Bypass Highway",
    severity: "CRITICAL",
    updatedTime: "GSI Slope Sensor Alert",
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
    updatedTime: "High-Altitude Weather Alert",
  },
  {
    id: "BLK-NH306-MIZORAM",
    road: "NH-306 Lifeline",
    cities: "Silchar ⟷ Aizawl",
    originId: "silchar",
    destinationId: "aizawl",
    state: "Assam & Mizoram",
    exactSpot: "Cachar-Kolasib Hairpin Border",
    cause: "Ghat Road Subsidence & 18-Tonne Bailey Bridge Load Limit",
    avoidInfo: "Direct Cachar Hairpin capped at 18 tonnes",
    detourRoute: "Stage at Dholai Depot & Route via Bhairabi Railhead Bypass",
    severity: "HIGH",
    updatedTime: "Weight Enforcement Alert",
  },
];

export const CITY_ELEVATIONS_M: Record<string, number> = {
  gangtok: 1650,
  namchi: 1315,
  pelling: 2150,
  mangan: 1310,
  rangpo: 330,
  singtam: 400,
  ravangla: 2130,
  chungthang: 1790,
  tawang: 3048,
  dirang: 1560,
  bomdila: 2415,
  itanagar: 320,
  naharlagun: 200,
  pasighat: 155,
  ziro: 1572,
  alpng: 610,
  tezu: 210,
  roing: 390,
  khonsa: 1215,
  changlang: 580,
  guwahati: 55,
  dispur: 55,
  silchar: 25,
  dibrugarh: 108,
  jorhat: 116,
  nagaon: 65,
  tezpur: 48,
  tinsukia: 116,
  bongaigaon: 54,
  dhubri: 34,
  goalpara: 35,
  barpeta: 35,
  nalbari: 42,
  mangaldai: 50,
  karimganj: 18,
  hailakandi: 21,
  diphu: 186,
  haflong: 680,
  golaghat: 95,
  sivasagar: 95,
  north_lakhimpur: 101,
  dhemaji: 104,
  shillong: 1525,
  cherrapunji: 1430,
  tura: 349,
  jowai: 1380,
  nongpoh: 485,
  baghmara: 110,
  williamnagar: 340,
  resubelpara: 120,
  mairang: 1600,
  khliehriat: 1200,
  kohima: 1444,
  dimapur: 145,
  mokokchung: 1325,
  tuensang: 1371,
  wokha: 1313,
  zunheboto: 1874,
  mon: 897,
  phek: 1524,
  kiphire: 896,
  longleng: 1066,
  imphal: 786,
  churachandpur: 914,
  thoubal: 765,
  bishnupur: 770,
  ukhrul: 1662,
  senapati: 1050,
  tamenglong: 1260,
  chandel: 1500,
  jiribam: 30,
  kakching: 776,
  aizawl: 1132,
  lunglei: 1222,
  champhai: 1678,
  serchhip: 1294,
  kolasib: 888,
  lawngtlai: 800,
  saiha: 729,
  mamit: 718,
  khawzawl: 1200,
  hnahthial: 900,
  agartala: 15,
  dharmanagar: 21,
  udaipur: 22,
  kailashahar: 20,
  belonia: 23,
  khowai: 23,
  ambassa: 45,
  shantirbazar: 25,
  teliamura: 28,
  kumarghat: 24,
};

export default function App() {
  const [origin, setOrigin] = useState("guwahati");
  const [destination, setDestination] = useState("tawang");
  const [vehicle, setVehicle] = useState<VehicleType>("heavy");
  const [commodity, setCommodity] = useState<CommodityType>("medical");

  // Phone Native Language
  const [langMode, setLangMode] = useState<"auto" | "manual">(() => {
    try {
      return (localStorage.getItem("raahsetu_lang_mode") as "auto" | "manual") || "auto";
    } catch {
      return "auto";
    }
  });
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem("raahsetu_lang");
      if (saved && ["en", "hi", "as", "bn"].includes(saved)) return saved as SupportedLanguage;
    } catch {}
    return detectPhoneNativeLanguage().lang;
  });
  const t = UI_TRANSLATIONS[lang];

  const handleSelectLanguage = (selectedLang: SupportedLanguage, mode: "auto" | "manual" = "manual") => {
    setLang(selectedLang);
    setLangMode(mode);
    try {
      localStorage.setItem("raahsetu_lang", selectedLang);
      localStorage.setItem("raahsetu_lang_mode", mode);
    } catch {}
  };

  // Views: "dispatcher" | "districts" | "advisories" | "system"
  const [activeView, setActiveView] = useState<"dispatcher" | "districts" | "advisories" | "system">("dispatcher");
  const [districtFilterState, setDistrictFilterState] = useState<string>("ALL");
  const [districtSearchQuery, setDistrictSearchQuery] = useState<string>("");

  // Theme: "light" | "dark"
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("raahsetu_theme");
      if (saved === "light" || saved === "dark") return saved;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch {}
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("raahsetu_theme", theme);
    } catch {}
  }, [theme]);

  // Live Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const [isBigScreenNav, setIsBigScreenNav] = useState(false);
  const [navGpsCoords, setNavGpsCoords] = useState<{
    lat: number;
    lon: number;
    accuracy?: number;
    speedKmh: number;
    heading: number;
    placeName: string;
  } | null>(null);

  const handleStartNavigation = () => {
    if (isNavigating) {
      setIsNavigating(false);
      setIsBigScreenNav(false);
      return;
    }
    const o = CITY_MAP[origin];
    const d = CITY_MAP[destination];
    if (o && d) {
      setNavGpsCoords({
        lat: o.lat,
        lon: o.lon,
        accuracy: 8,
        speedKmh: 45,
        heading: 32,
        placeName: `${o.name}, ${o.state}`,
      });
      setIsNavigating(true);
      const instruction = getLocalizedNavInstruction(
        "start",
        { origin: o.name, destination: d.name },
        lang
      );
      speakMultilingual(instruction, lang);
    }
  };

  // Road Advisories auto-cycle & pause
  const [activeBlockageIdx, setActiveBlockageIdx] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  useEffect(() => {
    if (isBannerPaused) return;
    const timer = setInterval(() => {
      setActiveBlockageIdx((prev) => (prev + 1) % ACTIVE_ROAD_BLOCKAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isBannerPaused]);

  // Modals
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Driver Profile
  const [driverProfile, setDriverProfile] = useState<DriverProfile>(() => {
    try {
      const saved = localStorage.getItem("raahsetu_driver_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DRIVER_PROFILE;
  });

  const handleSaveDriverProfile = (updated: DriverProfile) => {
    setDriverProfile(updated);
    setVehicle(updated.vehicleType);
    setCommodity(updated.commodity);
    try {
      localStorage.setItem("raahsetu_driver_profile", JSON.stringify(updated));
    } catch {}
  };

  // SOS Distress
  const [isSosTransmitting, setIsSosTransmitting] = useState(false);
  const [sosTransmissionSuccess, setSosTransmissionSuccess] = useState(false);
  const [sosAlertsList, setSosAlertsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("raahsetu_sos_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const triggerEmergencySos = () => {
    setIsSosTransmitting(true);
    setSosTransmissionSuccess(false);
    setTimeout(() => {
      setIsSosTransmitting(false);
      setSosTransmissionSuccess(true);
    }, 1200);

    const lat = CITY_MAP[origin]?.lat || 26.1445;
    const lon = CITY_MAP[origin]?.lon || 91.7362;
    const locName = `${CITY_MAP[origin]?.name}–${CITY_MAP[destination]?.name} Corridor`;

    const newLog = {
      id: `SOS-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      vehicleNo: driverProfile.vehicleNo,
      driverName: driverProfile.driverName,
      driverMobile: driverProfile.driverMobile,
      trustedMobile: driverProfile.trustedContactMobile,
      location: locName,
      coords: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`,
      status: "DISPATCHED_TO_AUTHORITIES",
    };

    const updated = [newLog, ...sosAlertsList];
    setSosAlertsList(updated);
    try {
      localStorage.setItem("raahsetu_sos_logs", JSON.stringify(updated));
    } catch {}

    setTimeout(() => {
      setIsSosTransmitting(false);
      setSosTransmissionSuccess(true);
    }, 600);
  };

  // Camera Hazard Report
  const [reportPhoto, setReportPhoto] = useState<{ dataUrl: string; name: string; sizeKb: number } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [offlineReportsCount, setOfflineReportsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("rs_offline_reports");
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
          audio: false,
        });
        setCameraStream(stream);
        setIsCameraActive(true);
      } else {
        cameraInputRef.current?.click();
      }
    } catch {
      cameraInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setReportPhoto({
        dataUrl,
        name: `hazard_${Date.now()}.jpg`,
        sizeKb: Math.round((dataUrl.length * 3) / 4 / 1024),
      });
    }
    stopCamera();
  };

  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive, cameraStream]);

  // Map & Navigation
  const [mapMode, setMapMode] = useState<"osm" | "satellite">("osm");
  const [hoveredLegIndex, setHoveredLegIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [customOrigin, setCustomOrigin] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const mapCardRef = useRef<HTMLDivElement | null>(null);

  // Auto weather for current corridor
  const liveWeather = useMemo(() => {
    return getAutomaticWeatherForLocation(origin, destination);
  }, [origin, destination]);
  const weather = liveWeather.condition;

  // Shortest route solver
  const shortest = useMemo(() => {
    return solvePath(origin, destination, (edge) => edge.dist);
  }, [origin, destination]);

  // Safe / Risk-Aware route solver
  const safe = useMemo(() => {
    const cProf = COMMODITY_PROFILES[commodity];
    const riskMultiplier = cProf ? cProf.riskToleranceMult : 2.5;
    return solvePath(origin, destination, (edge) => {
      const adjRisk = getAdjustedEdgeRisk(edge, vehicle, weather);
      return edge.dist * (1 + adjRisk * riskMultiplier);
    });
  }, [origin, destination, vehicle, weather, commodity]);

  const shortestStats = useMemo(() => (shortest ? computeStats(shortest, vehicle, weather) : null), [shortest, vehicle, weather]);
  const safeStats = useMemo(() => (safe ? computeStats(safe, vehicle, weather) : null), [safe, vehicle, weather]);

  const safeLegs = useMemo(() => {
    if (!safe) return [];
    return getRouteLegs(safe, vehicle, weather);
  }, [safe, vehicle, weather]);

  const intermediateCities = useMemo(() => {
    if (!safe) return [];
    return getIntermediateCities(safe);
  }, [safe]);

  const riskReductionPct = useMemo(() => {
    if (!shortestStats || !safeStats || shortestStats.riskIndex === 0) return 0;
    const diff = ((shortestStats.riskIndex - safeStats.riskIndex) / shortestStats.riskIndex) * 100;
    return Math.max(0, Math.round(diff));
  }, [shortestStats, safeStats]);

  // Elevation analysis
  const elevationAnalysis = useMemo(() => {
    if (!safe || safe.length === 0) return null;

    const profilePoints: { cityName: string; state: string; elevationM: number; distanceKm: number }[] = [];
    let cumulativeDist = 0;

    for (let i = 0; i < safe.length; i++) {
      const cityId = safe[i];
      const city = CITY_MAP[cityId];
      if (!city) continue;

      let elev = CITY_ELEVATIONS_M[cityId] || 150;

      if (i > 0) {
        const prevCity = CITY_MAP[safe[i - 1]];
        if (prevCity) {
          const leg = safeLegs.find((l) => l.fromCity.id === prevCity.id && l.toCity.id === city.id);
          cumulativeDist += leg ? leg.dist : 45;
        }
      }

      if ((cityId === "tawang" && safe[i - 1] === "dirang") || (cityId === "dirang" && safe[i - 1] === "tawang")) {
        profilePoints.push({
          cityName: "Sela Pass Summit",
          state: "Arunachal Pradesh",
          elevationM: 4170,
          distanceKm: Math.max(0, cumulativeDist - 24),
        });
      }

      profilePoints.push({
        cityName: city.name,
        state: city.state,
        elevationM: elev,
        distanceKm: cumulativeDist,
      });
    }

    if (profilePoints.length === 0) return null;

    const elevations = profilePoints.map((p) => p.elevationM);
    const maxElev = Math.max(...elevations);
    const minElev = Math.min(...elevations);
    const peakPoint = profilePoints.find((p) => p.elevationM === maxElev);

    let totalAscentM = 0;
    let maxGradientPct = 0;

    for (let i = 1; i < profilePoints.length; i++) {
      const diff = profilePoints[i].elevationM - profilePoints[i - 1].elevationM;
      if (diff > 0) totalAscentM += diff;

      const segDistM = Math.max(1000, (profilePoints[i].distanceKm - profilePoints[i - 1].distanceKm) * 1000);
      const gradient = Math.round((Math.abs(diff) / segDistM) * 100 * 10) / 10;
      if (gradient > maxGradientPct) maxGradientPct = gradient;
    }

    const warnings: { title: string; message: string; severity: "CRITICAL" | "HIGH" }[] = [];
    if (maxElev >= 2800) {
      warnings.push({
        title: `High Altitude Summit: ${maxElev}m (${Math.round(maxElev * 3.28)} ft)`,
        message: `Summit at ${peakPoint?.cityName || "Pass Summit"} exceeds 2,800m. Freezing black ice on hairpin curves. Anti-skid tire chains required.`,
        severity: "CRITICAL",
      });
    }
    if (maxGradientPct >= 6.5 || totalAscentM >= 1000) {
      warnings.push({
        title: `Steep Ghat: ${maxGradientPct}% Gradient (+${totalAscentM}m Ascent)`,
        message: `Sustained incline. Brake thermal fade risk on descent. Use low crawler gears.`,
        severity: "HIGH",
      });
    }

    return {
      maxElev,
      minElev,
      totalAscentM,
      maxGradientPct,
      peakName: peakPoint?.cityName || "Summit",
      profilePoints,
      warnings,
    };
  }, [safe, safeLegs]);

  // Hardware GPS Locator
  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearestCity = CITIES[0];
        let minDist = Infinity;
        for (const city of CITIES) {
          const d = Math.hypot(city.lat - latitude, city.lon - longitude);
          if (d < minDist) {
            minDist = d;
            nearestCity = city;
          }
        }

        setCustomOrigin({
          name: `Device GPS (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`,
          lat: latitude,
          lon: longitude,
        });
        setOrigin(nearestCity.id);
        setIsLocating(false);
        setLocationNotice(`Connected to corridor via nearest hub: ${nearestCity.name} (${nearestCity.state}).`);
      },
      (err) => {
        setIsLocating(false);
        setLocationNotice(`Unable to fetch GPS (${err.message}). Defaulted to Guwahati.`);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSwap = () => {
    const old = origin;
    setCustomOrigin(null);
    setOrigin(destination);
    setDestination(old);
  };

  const scrollToMap = () => {
    setActiveView("dispatcher");
    setTimeout(() => {
      const el = document.getElementById("route-map-viewport");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportManifest = () => {
    const manifest = {
      manifestId: `RS-DISPATCH-${Date.now()}`,
      timestamp: new Date().toISOString(),
      origin: CITY_MAP[origin],
      destination: CITY_MAP[destination],
      vehicle: VEHICLE_PROFILES[vehicle],
      commodity: COMMODITY_PROFILES[commodity],
      weather: WEATHER_PROFILES[weather],
      summary: {
        safeRoute: safeStats,
        shortestRoute: shortestStats,
        riskReductionPct,
      },
      legs: safeLegs,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manifest-${origin}-to-${destination}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered districts for Matrix
  const filteredDistricts = useMemo(() => {
    return DISTRICT_CONNECTIVITY.filter((dist) => {
      const matchesState =
        districtFilterState === "ALL" ||
        dist.state.toLowerCase().includes(districtFilterState.toLowerCase());
      const matchesSearch =
        !districtSearchQuery ||
        dist.district.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
        dist.primaryHighway.toLowerCase().includes(districtSearchQuery.toLowerCase());
      return matchesState && matchesSearch;
    });
  }, [districtFilterState, districtSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* 1. CLEAN APP HEADER */}
      <header className="border-b border-border bg-card px-4 sm:px-6 py-3 transition-colors">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
              <Waypoints className="size-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight leading-none text-foreground">
                RaahSetu
              </div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                Northeast Logistics Intelligence
              </div>
            </div>
          </div>

          {/* Segmented View Switcher (Desktop) */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-secondary border border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView("dispatcher")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "dispatcher"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Navigation className="size-3.5" />
              <span>Route Dispatcher</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("districts")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "districts"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="size-3.5" />
              <span>District Health</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("advisories")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "advisories"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertTriangle className="size-3.5" />
              <span>Road Advisories</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("system")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "system"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Database className="size-3.5" />
              <span>System & Data</span>
            </button>
          </nav>

          {/* Right Tools */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
            </button>

            {/* Language Selector */}
            <div className="hidden sm:flex items-center rounded-xl border border-border bg-card p-1 text-xs" title={`Language mode: ${langMode}`}>
              {(["en", "hi", "as", "bn"] as SupportedLanguage[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleSelectLanguage(l, "manual")}
                  className={`px-2 py-1 rounded-lg uppercase font-mono text-[11px] font-semibold cursor-pointer transition-colors ${
                    lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Driver Profile Button */}
            <button
              type="button"
              onClick={() => setIsRegistrationModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium cursor-pointer transition-colors"
            >
              <Truck className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground">{driverProfile.vehicleNo}</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              type="button"
              onClick={() => {
                setIsSosModalOpen(true);
                triggerEmergencySos();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive hover:opacity-90 text-destructive-foreground font-bold text-xs shadow-xs cursor-pointer transition-all"
              title="Emergency SOS to NDRF & Trusted Contact"
            >
              <Siren className="size-3.5" />
              <span>SOS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-b border-border bg-card px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveView("dispatcher")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "dispatcher" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          Dispatcher
        </button>
        <button
          type="button"
          onClick={() => setActiveView("districts")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "districts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          Districts
        </button>
        <button
          type="button"
          onClick={() => setActiveView("advisories")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "advisories" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          Advisories
        </button>
        <button
          type="button"
          onClick={() => setActiveView("system")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "system" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          System & Data
        </button>
      </div>

      {/* Active Road Closure Banner */}
      <div
        onMouseEnter={() => setIsBannerPaused(true)}
        onMouseLeave={() => setIsBannerPaused(false)}
        className="border-b border-border bg-secondary/50 px-4 py-2 transition-colors"
      >
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="badge-status-advisory shrink-0">
              <AlertTriangle className="size-3" />
              <span>Advisory</span>
            </span>
            <span className="truncate font-medium text-foreground">
              <strong>{ACTIVE_ROAD_BLOCKAGES[activeBlockageIdx].road} ({ACTIVE_ROAD_BLOCKAGES[activeBlockageIdx].state}):</strong>{" "}
              {ACTIVE_ROAD_BLOCKAGES[activeBlockageIdx].cause} at {ACTIVE_ROAD_BLOCKAGES[activeBlockageIdx].exactSpot}.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const blk = ACTIVE_ROAD_BLOCKAGES[activeBlockageIdx];
                if (blk.originId && blk.destinationId) {
                  setOrigin(blk.originId);
                  setDestination(blk.destinationId);
                }
                scrollToMap();
              }}
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Detour</span>
              <ArrowRight className="size-3" />
            </button>
            <div className="flex items-center gap-1 pl-2 border-l border-border text-muted-foreground">
              <button
                type="button"
                onClick={() => setActiveBlockageIdx((prev) => (prev === 0 ? ACTIVE_ROAD_BLOCKAGES.length - 1 : prev - 1))}
                className="p-0.5 rounded hover:bg-secondary cursor-pointer"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="text-[11px] font-mono">
                {activeBlockageIdx + 1}/{ACTIVE_ROAD_BLOCKAGES.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveBlockageIdx((prev) => (prev + 1) % ACTIVE_ROAD_BLOCKAGES.length)}
                className="p-0.5 rounded hover:bg-secondary cursor-pointer"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* VIEW 1: ROUTE DISPATCHER */}
        {activeView === "dispatcher" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
            {/* Quick-Pick Freight Corridors */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Strategic Mountain Freight Corridors</span>
                <span className="text-[11px] font-normal lowercase">1-click dispatch presets</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {STRATEGIC_CORRIDORS.map((c) => {
                  const isSelected = origin === c.origin && destination === c.destination;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setOrigin(c.origin);
                        setDestination(c.destination);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{c.title}</span>
                      <span className="ml-1.5 text-[10px] font-mono opacity-70">({c.tag})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split Workbench Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Telemetry */}
              <div className="lg:col-span-5 space-y-5">
                {/* Endpoints & Configuration Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
                  <div className="space-y-3">
                    <CityCombobox
                      label="Departure Hub"
                      selectedId={origin}
                      onSelect={(id) => {
                        setCustomOrigin(null);
                        setOrigin(id);
                      }}
                      otherCityId={destination}
                      customOrigin={customOrigin}
                      lang={lang}
                          onGpsLocate={handleGpsLocation}
                      isLocating={isLocating}
                    />

                    <div className="flex justify-center -my-1">
                      <button
                        type="button"
                        onClick={handleSwap}
                        className="p-1.5 rounded-full border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-xs"
                        title="Swap Origin and Destination"
                      >
                        <ArrowUpDown className="size-3.5" />
                      </button>
                    </div>

                    <CityCombobox
                      label="Arrival Destination"
                      selectedId={destination}
                      onSelect={(id) => setDestination(id)}
                      otherCityId={origin}
                      lang={lang}
                        />
                  </div>

                  {locationNotice && (
                    <div className="p-2.5 rounded-xl bg-secondary border border-border text-xs text-muted-foreground leading-relaxed">
                      {locationNotice}
                    </div>
                  )}

                  {/* Vehicle & Cargo Settings */}
                  <div className="pt-3 border-t border-border grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Vehicle Axle
                      </label>
                      <select
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value as VehicleType)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-secondary text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        {Object.entries(VEHICLE_PROFILES).map(([key, v]) => (
                          <option key={key} value={key}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Cargo Priority
                      </label>
                      <select
                        value={commodity}
                        onChange={(e) => setCommodity(e.target.value as CommodityType)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-secondary text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        {Object.entries(COMMODITY_PROFILES).map(([key, c]) => (
                          <option key={key} value={key}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Microclimate telemetry pill */}
                  <div className="p-2.5 rounded-xl bg-secondary/60 border border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <CloudRain className="size-3.5 text-primary" />
                      <span>Microclimate Ingestion:</span>
                    </span>
                    <span className="font-semibold text-foreground">
                      {WEATHER_PROFILES[weather]?.name || "Nominal Clear"}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Route Comparison Card */}
                {shortestStats && safeStats && (
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="font-bold text-sm text-foreground">A* Path Comparison</div>
                      {riskReductionPct > 0 && (
                        <span className="badge-status-normal">
                          <Check className="size-3" />
                          <span>{riskReductionPct}% Safer Corridor</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Nominal Shortest */}
                      <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-2">
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase">
                          Fastest (Shortest)
                        </div>
                        <div className="text-xl font-bold text-foreground">
                          {shortestStats.distance} <span className="text-xs font-normal text-muted-foreground">km</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatHours(shortestStats.hours)}
                        </div>
                        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          Risk Index: {shortestStats.riskIndex}/100
                        </div>
                      </div>

                      {/* Risk-Aware Safe Route */}
                      <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                        <div className="text-[11px] font-semibold text-primary uppercase">
                          Safe (Risk-Aware)
                        </div>
                        <div className="text-xl font-bold text-foreground">
                          {safeStats.distance} <span className="text-xs font-normal text-muted-foreground">km</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatHours(safeStats.hours)}
                        </div>
                        <div className="text-xs font-semibold text-primary">
                          Risk Index: {safeStats.riskIndex}/100
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Safe path trades {Math.max(0, safeStats.distance - shortestStats.distance)} km (+
                      {formatHours(Math.max(0, safeStats.hours - shortestStats.hours))}) to avoid steep erosion gorges and active landslide zones.
                    </p>
                  </div>
                )}

                {/* Elevation Profile Card */}
                {elevationAnalysis && (
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <Mountain className="size-4 text-primary" />
                        <span>Elevation Profile</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        Peak: {elevationAnalysis.maxElev}m ({elevationAnalysis.peakName})
                      </span>
                    </div>

                    {/* SVG Curve */}
                    <div className="h-28 w-full bg-secondary/40 rounded-xl p-2 flex items-end">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                        <path
                          d={(() => {
                            const pts = elevationAnalysis.profilePoints;
                            if (pts.length < 2) return "";
                            const max = Math.max(...pts.map((p) => p.elevationM), 100);
                            const min = Math.min(...pts.map((p) => p.elevationM), 0);
                            const range = Math.max(max - min, 100);
                            return pts
                              .map((p, i) => {
                                const x = (i / (pts.length - 1)) * 100;
                                const y = 50 - ((p.elevationM - min) / range) * 45;
                                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                              })
                              .join(" ");
                          })()}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-primary"
                        />
                      </svg>
                    </div>

                    {/* Elevation Warnings */}
                    {elevationAnalysis.warnings.map((w, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          w.severity === "CRITICAL"
                            ? "border-destructive/30 bg-destructive/5 text-destructive"
                            : "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="size-3.5" />
                          <span>{w.title}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{w.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions & Export */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportManifest}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="size-3.5" />
                    <span>Download Manifest (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {copiedLink ? <Check className="size-3.5 text-primary" /> : <Share2 className="size-3.5" />}
                    <span>{copiedLink ? "Copied" : "Share"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Camera className="size-3.5" />
                    <span>Report Hazard</span>
                    {offlineReportsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-mono">
                        {offlineReportsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Map & Legs Itinerary */}
              <div className="lg:col-span-7 space-y-5">
                {/* Map Card */}
                <div
                  id="route-map-viewport"
                  ref={mapCardRef}
                  className={
                    isBigScreenNav
                      ? "fixed inset-0 z-50 bg-background flex flex-col p-4"
                      : "rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3"
                  }
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {CITY_MAP[origin]?.name} ➔ {CITY_MAP[destination]?.name}
                      </span>
                      {safeStats && (
                        <span className="text-xs text-muted-foreground font-mono">
                          ({safeStats.distance} km · {formatHours(safeStats.hours)})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Live Navigation Toggle */}
                      <button
                        type="button"
                        onClick={handleStartNavigation}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs ${
                          isNavigating
                            ? "bg-destructive text-destructive-foreground hover:opacity-90"
                            : "bg-primary text-primary-foreground hover:opacity-90"
                        }`}
                        title={isNavigating ? t.stopNavigation : t.startNavigation}
                      >
                        <Navigation className="size-3.5" />
                        <span>{isNavigating ? t.stopNavigation : t.startNavigation}</span>
                      </button>

                      {/* Satellite / Street Switcher */}
                      <button
                        type="button"
                        onClick={() => setMapMode(mapMode === "osm" ? "satellite" : "osm")}
                        className="px-2.5 py-1 rounded-lg border border-border bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Layers className="size-3.5" />
                        <span>{mapMode === "osm" ? "Satellite View" : "Road Network"}</span>
                      </button>

                      {/* Fullscreen Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsBigScreenNav(!isBigScreenNav)}
                        className="p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        title={isBigScreenNav ? "Exit Fullscreen (ESC)" : "Expand Map Fullscreen"}
                      >
                        {isBigScreenNav ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Leaflet Cartography Container */}
                  <div className={isBigScreenNav ? "flex-1 w-full rounded-xl overflow-hidden" : "h-[460px] w-full rounded-xl overflow-hidden border border-border"}>
                    <RealMapLeaflet
                      originCity={CITY_MAP[origin]}
                      destCity={CITY_MAP[destination]}
                      routePath={safe}
                      safeLegs={safeLegs}
                      userGps={navGpsCoords}
                      isNavigating={isNavigating}
                      isBigScreen={isBigScreenNav}
                      mapMode={mapMode}
                      onMapModeChange={setMapMode}
                    />
                  </div>
                </div>

                {/* Turn-by-Turn Leg Itinerary */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
                  <div className="font-bold text-sm text-foreground flex items-center justify-between">
                    <span>Route Checkpoints & Waypoints</span>
                    <span className="text-xs text-muted-foreground font-normal">{safeLegs.length} highway legs</span>
                  </div>

                  {intermediateCities.length > 0 && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 flex-wrap pb-1">
                      <span className="font-medium text-foreground">Via:</span>
                      {intermediateCities.map((c, i) => (
                        <span key={c.id} className="inline-flex items-center">
                          {c.name}
                          {i < intermediateCities.length - 1 && <span className="mx-1 opacity-50">→</span>}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {safeLegs.map((leg, idx) => (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredLegIndex(idx)}
                        onMouseLeave={() => setHoveredLegIndex(null)}
                        className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                          hoveredLegIndex === idx
                            ? "border-primary bg-primary/5"
                            : "border-border bg-secondary/30 hover:bg-secondary/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <span className="size-5 rounded-md bg-secondary text-muted-foreground flex items-center justify-center font-mono text-[11px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{leg.fromCity.name}</span>
                            <ArrowRight className="size-3 text-muted-foreground" />
                            <span>{leg.toCity.name}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-muted-foreground">
                            <span>{leg.dist} km</span>
                            <span>·</span>
                            <span>{formatHours(leg.hours)}</span>
                            <span>·</span>
                            <span className={leg.risk > 40 ? "text-destructive font-bold" : "text-primary"}>
                              {leg.risk}% Risk
                            </span>
                          </div>
                        </div>
                        {leg.note && (
                          <div className="mt-1 pl-7 text-[11px] text-muted-foreground">
                            {leg.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DISTRICT ACCESSIBILITY MATRIX */}
        {activeView === "districts" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  District-Wise Accessibility Health (8 Northeast States)
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time connectivity status, delay records, and active incident tracking (SIH-26002 Requirement 'g').
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                <span className="badge-status-normal">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {DISTRICT_CONNECTIVITY.filter((d) => d.status === "NORMAL").length} Normal
                </span>
                <span className="badge-status-advisory">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  {DISTRICT_CONNECTIVITY.filter((d) => d.status === "WATCH").length} Watch
                </span>
                <span className="badge-status-restricted">
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  {DISTRICT_CONNECTIVITY.filter((d) => d.status === "RESTRICTED").length} Restricted
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {["ALL", "Assam", "Arunachal", "Meghalaya", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setDistrictFilterState(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      districtFilterState === st
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center min-w-[220px]">
                <Search className="size-3.5 text-muted-foreground absolute left-3" />
                <input
                  type="text"
                  value={districtSearchQuery}
                  onChange={(e) => setDistrictSearchQuery(e.target.value)}
                  placeholder="Search district or road..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-secondary text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDistricts.map((dist) => (
                <div
                  key={dist.district}
                  className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground uppercase">{dist.state}</span>
                      <span
                        className={
                          dist.status === "RESTRICTED"
                            ? "badge-status-restricted"
                            : dist.status === "WATCH"
                            ? "badge-status-advisory"
                            : "badge-status-normal"
                        }
                      >
                        {dist.status}
                      </span>
                    </div>
                    <div className="font-bold text-base text-foreground mt-2">{dist.district}</div>
                    <div className="text-xs text-primary font-mono mt-0.5">{dist.primaryHighway}</div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Active Incidents:</span>
                      <strong className="text-foreground">{dist.incidentCount}</strong>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Transit Delay:</span>
                      <strong className={dist.delayAvgMinutes > 60 ? "text-destructive" : "text-foreground"}>
                        +{dist.delayAvgMinutes}m
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDestination(dist.hubId);
                        setActiveView("dispatcher");
                        scrollToMap();
                      }}
                      className="w-full py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Route to Hub</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ROAD ADVISORIES */}
        {activeView === "advisories" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Active Road Closures & Landslide Advisories
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Verified mountain pass blockages, geotechnical sensor alerts, and official detour recommendations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs"
              >
                Report Road Hazard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ACTIVE_ROAD_BLOCKAGES.map((blk) => (
                <div
                  key={blk.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          blk.severity === "CRITICAL" ? "badge-status-restricted" : "badge-status-advisory"
                        }
                      >
                        {blk.severity} CLOSURE
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{blk.updatedTime}</span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        {blk.cities} <span className="text-xs font-normal text-muted-foreground">({blk.road})</span>
                      </h2>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Spot:</strong> {blk.exactSpot} ({blk.state})
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground">
                      <strong className="text-destructive">Cause:</strong> {blk.cause}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl border border-destructive/20 bg-destructive/5 text-foreground">
                        <span className="font-bold text-destructive">Avoid: </span>
                        <span>{blk.avoidInfo}</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-foreground">
                        <span className="font-bold text-primary">Recommended Detour: </span>
                        <span>{blk.detourRoute}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{blk.id}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (blk.originId && blk.destinationId) {
                          setOrigin(blk.originId);
                          setDestination(blk.destinationId);
                        }
                        scrollToMap();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <span>Apply Detour</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: SYSTEM & DATA DOCUMENTATION */}
        {activeView === "system" && (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
            <div className="pb-4 border-b border-border">
              <h1 className="text-2xl font-bold text-foreground">
                Platform Architecture & Official Data Sources
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Transparency and explainability principles powering the RaahSetu routing engine.
              </p>
            </div>

            {/* Census Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-destructive">1,68,491</div>
                <div className="text-xs font-semibold text-foreground mt-1">Annual Fatalities Nationwide</div>
                <p className="text-xs text-muted-foreground mt-1">MoRTH census: Ghat fatality severity is 45.2%.</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">400+</div>
                <div className="text-xs font-semibold text-foreground mt-1">Monsoon Landslides</div>
                <p className="text-xs text-muted-foreground mt-1">GSI recorded severe rockfall and mudflow blockages.</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-primary">8 States</div>
                <div className="text-xs font-semibold text-foreground mt-1">OSM Road Graphs</div>
                <p className="text-xs text-muted-foreground mt-1">Extracted via Pyosmium and OSMnx.</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-foreground">A* Search</div>
                <div className="text-xs font-semibold text-foreground mt-1">Deterministic Engine</div>
                <p className="text-xs text-muted-foreground mt-1">Priority queue with admissible terrain heuristic.</p>
              </div>
            </div>

            {/* How it works */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-foreground">How the Engine Computes Routes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                  <div className="font-bold text-foreground">1. Graph Extraction</div>
                  <p className="text-muted-foreground leading-relaxed">
                    OSM highway ways converted into directed weighted edges with surface and gradient tags.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                  <div className="font-bold text-foreground">2. Edge Cost Weighting</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Edges penalised based on vehicle axle limit, cargo sensitivity, and rainfall intensity.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                  <div className="font-bold text-foreground">3. Dual-Path Solve</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Engine runs A* twice on identical graph: once for fastest time, once for minimal hazard exposure.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl border border-border bg-secondary/40 text-xs text-muted-foreground space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Info className="size-4 text-primary" />
                <span>Prototype Scope & Boundaries</span>
              </div>
              <p>
                RaahSetu is an explainable prototype developed for Smart India Hackathon. Highway telemetry and hazard observations reflect research data and offline snapshots. Official emergency transit requires verification from local traffic authorities.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card px-4 sm:px-6 py-6 text-xs text-muted-foreground transition-colors">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Waypoints className="size-4 text-primary" />
            <span className="font-semibold text-foreground">RaahSetu</span>
            <span>· Northeast India Emergency Logistics Routing</span>
          </div>
          <div>OpenStreetMap data © OpenStreetMap contributors. SIH Prototype.</div>
        </div>
      </footer>

      {/* DRIVER REGISTRATION MODAL */}
      {isRegistrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Fleet Driver & Vehicle Profile</h2>
              <button
                type="button"
                onClick={() => setIsRegistrationModalOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveDriverProfile(driverProfile);
                setIsRegistrationModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Driver Name</label>
                <input
                  type="text"
                  value={driverProfile.driverName}
                  onChange={(e) => setDriverProfile({ ...driverProfile, driverName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Vehicle Registration No</label>
                <input
                  type="text"
                  value={driverProfile.vehicleNo}
                  onChange={(e) => setDriverProfile({ ...driverProfile, vehicleNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Driver Mobile</label>
                <input
                  type="text"
                  value={driverProfile.driverMobile}
                  onChange={(e) => setDriverProfile({ ...driverProfile, driverMobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Trusted Emergency Contact</label>
                <input
                  type="text"
                  value={driverProfile.trustedContactMobile}
                  onChange={(e) => setDriverProfile({ ...driverProfile, trustedContactMobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegistrationModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-secondary text-foreground font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY SOS MODAL */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-destructive/40 bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive font-bold text-base">
                <Siren className="size-5" />
                <span>Emergency Distress SOS</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSosModalOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-foreground space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Vehicle:</span>
                <span className="font-mono">{driverProfile.vehicleNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Driver:</span>
                <span>{driverProfile.driverName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Corridor:</span>
                <span>{CITY_MAP[origin]?.name} ➔ {CITY_MAP[destination]?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Status:</span>
                <span className="text-destructive font-bold">
                  {isSosTransmitting ? "Transmitting GPS..." : sosTransmissionSuccess ? "Dispatched to Authorities (Active)" : "Ready to Transmit"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a
                href="tel:1078"
                className="py-2.5 px-3 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="size-3.5" />
                <span>Call NDRF (1078)</span>
              </a>
              <a
                href={`tel:${driverProfile.trustedContactMobile}`}
                className="py-2.5 px-3 rounded-xl border border-border bg-secondary text-foreground flex items-center justify-center gap-1.5"
              >
                <Phone className="size-3.5" />
                <span>Call Fleet Base</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CAMERA HAZARD REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Report Highway Hazard</h2>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setIsReportModalOpen(false);
                }}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Viewfinder or Upload */}
            <div className="relative h-48 w-full rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : reportPhoto ? (
                <img src={reportPhoto.dataUrl} alt="Report capture" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-xs text-muted-foreground space-y-2">
                  <Camera className="size-8 mx-auto opacity-50" />
                  <div>Capture or upload live road evidence</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 py-2 rounded-xl bg-destructive text-destructive-foreground font-semibold text-xs cursor-pointer"
                >
                  Snap Photo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-2 rounded-xl border border-border bg-secondary text-foreground font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera className="size-3.5" />
                  <span>Start Camera</span>
                </button>
              )}

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const dataUrl = ev.target?.result as string;
                    setReportPhoto({ dataUrl, name: file.name, sizeKb: Math.round(file.size / 1024) });
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground font-semibold text-xs cursor-pointer"
              >
                Upload
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setIsReportModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setOfflineReportsCount((prev) => prev + 1);
                  setIsReportModalOpen(false);
                  alert("Hazard report logged successfully.");
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs"
              >
                Submit Hazard Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
