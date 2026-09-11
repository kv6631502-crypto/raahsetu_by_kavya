import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpDown,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  CloudRain,
  Database,
  Droplets,
  Eye,
  Snowflake,
  FileText,
  Download,
  Info,
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
  Radio,
  Send,
  MessageSquare,
  Sun,
  Truck,
  Waypoints,
  X,
} from "lucide-react";
import { RealMapLeaflet } from "./RealMapLeaflet";
import { IntroPage } from "./IntroPage";
import { AuthPage } from "./AuthPage";
import {
  compareRoutes,
  createFieldReport,
  getLiveWeather,
  LiveWeatherStation,
  sendFleetPosition,
  uploadFieldReportAttachment,
} from "./api";
import { dataUrlToFile, queueReport, listQueuedReports, removeQueuedReport } from "./offlineQueue";
import type { AvailableRoute, Comparison, FieldReportInput, Network, RouteInput } from "./types";
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
  EDGES,
  COMMODITY_PROFILES,
  CommodityType,
  DISTRICT_CONNECTIVITY,
  STRATEGIC_CORRIDORS,
  VEHICLE_PROFILES,
  VehicleType,
  WEATHER_PROFILES,
  computeStats,
  formatHours,
  getAdjustedEdgeRisk,
  getAutomaticWeatherForLocation,
  getCityWeather,
  getIntermediateCities,
  getRouteLegs,
  REGIONAL_ALERTS,
  solvePath,
  WeatherCondition,
} from "./routeData";
import {
  SupportedLanguage,
  TRANSLATIONS,
  getCityName,
  getStateName,
  getBlockageDetails,
  getDistrictName,
  getLocalizedWeatherSummary,
  getCorridorDetails,
  getLocalizedNote,
  getLocalizedWeatherAdvisory,
} from "./translations";

const TerrainMap = lazy(() => import("./TerrainMap"));

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
  isOrigin,
}: {
  label: string;
  selectedId: string;
  onSelect: (id: string) => void;
  otherCityId?: string;
  customOrigin?: { name: string; lat: number; lon: number } | null;
  lang: SupportedLanguage;
  onGpsLocate?: () => void;
  isLocating?: boolean;
  isOrigin?: boolean;
}) {
  const t = TRANSLATIONS[lang];
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
      const localizedCity = getCityName(c.id, lang, c.name).toLowerCase();
      const localizedState = getStateName(c.state, lang).toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        localizedCity.includes(q) ||
        c.state.toLowerCase().includes(q) ||
        localizedState.includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [query, otherCityId, lang]);

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
        {isOrigin && onGpsLocate && (
          <button
            type="button"
            onClick={onGpsLocate}
            disabled={isLocating}
            className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {isLocating ? <Loader2 className="size-3 animate-spin" /> : <LocateFixed className="size-3" />}
            <span>{t.snapOriginLiveGps}</span>
          </button>
        )}
      </div>

      <div className={`relative flex items-center rounded-xl border px-3 py-2.5 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-xs ${
        !selectedId
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/25"
          : "border-border bg-card"
      }`}>
        <Search className="size-4 text-muted-foreground shrink-0 mr-2" />
        <div className="flex-1 min-w-0">
          {open ? (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchCity}
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
                {customOrigin && isOrigin ? (
                  <span className="text-primary font-bold">📍 {customOrigin.name}</span>
                ) : selectedCity ? (
                  <>
                    <span>{getCityName(selectedCity.id, lang, selectedCity.name)}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                      ({getStateName(selectedCity.state, lang)})
                    </span>
                  </>
                ) : (
                  <span className="text-primary font-semibold flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    <span>{isOrigin ? t.selectOriginPlaceholder : t.selectDestPlaceholder}...</span>
                  </span>
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
            title={t.voiceInput}
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
            {filtered.length} {t.locationsAvailable}
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
              <span>{getCityName(city.id, lang, city.name)}</span>
              <span className="text-xs text-muted-foreground">{getStateName(city.state, lang)}</span>
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
  grossWeightTonnes?: number;
  axleCount?: number;
  heightMetres?: number;
  widthMetres?: number;
  fleetDepot?: string;
  brakeCheckPassed?: boolean;
  chainsEquipped?: boolean;
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
    cause: "Simulated monsoon landslide and road-bed subsidence",
    avoidInfo: "Planning assumption: NH-10 is unavailable to heavy freight",
    detourRoute: "Candidate route via Lava – Algarah – Kalimpong",
    severity: "CRITICAL",
    updatedTime: "Controlled planning scenario",
  },
  {
    id: "BLK-NH29-NAGALAND",
    road: "NH-29 Lifeline Corridor",
    cities: "Dimapur ⟷ Kohima",
    originId: "dimapur",
    destinationId: "kohima",
    state: "Nagaland",
    exactSpot: "Pagla Pahar Gorge (km 124)",
    cause: "Simulated mudslide, hill seepage and boulder collapse",
    avoidInfo: "Planning assumption: the main gorge corridor is obstructed",
    detourRoute: "Candidate alternate corridor via Niuland",
    severity: "CRITICAL",
    updatedTime: "Controlled planning scenario",
  },
  {
    id: "BLK-NH13-ARUNACHAL",
    road: "NH-13 Trans-Arunachal Highway",
    cities: "Bomdila ⟷ Tawang",
    originId: "bomdila",
    destinationId: "tawang",
    state: "Arunachal Pradesh",
    exactSpot: "Sela Pass Summit (13,700 ft)",
    cause: "Simulated rockfall, snowfall and freezing road surface",
    avoidInfo: "Planning assumption: the high Sela ridge has elevated exposure",
    detourRoute: "Candidate lower-altitude Sela corridor",
    severity: "HIGH",
    updatedTime: "Controlled planning scenario",
  },
  {
    id: "BLK-NH306-MIZORAM",
    road: "NH-306 Lifeline",
    cities: "Silchar ⟷ Aizawl",
    originId: "silchar",
    destinationId: "aizawl",
    state: "Assam & Mizoram",
    exactSpot: "Cachar-Kolasib Hairpin Border",
    cause: "Simulated road subsidence and configured bridge restriction",
    avoidInfo: "Planning assumption: the direct corridor exceeds its configured limit",
    detourRoute: "Candidate alternative corridor subject to authority verification",
    severity: "HIGH",
    updatedTime: "Controlled planning scenario",
  },
];

export interface SihScenario {
  id: string;
  badge: string;
  title: string;
  origin: string;
  destination: string;
  vehicle: VehicleType;
  commodity: CommodityType;
  weather: WeatherCondition;
  hazardDescription: string;
  explanation: string;
}

export const SIH_DEMO_SCENARIOS: SihScenario[] = [
  {
    id: "sih-guwahati-tawang",
    badge: "Scenario 1 · Arunachal Pass",
    title: "Guwahati ➔ Tawang (Sela Freeze & Landslide)",
    origin: "guwahati",
    destination: "tawang",
    vehicle: "heavy",
    commodity: "medical",
    weather: "snow",
    hazardDescription: "Scenario inputs mark the high Sela corridor as exposed to freezing conditions and rockfall, with a configured vehicle restriction.",
    explanation: "Controlled evaluation: the Risk-Aware route compares the configured Sela corridor constraints and reports the resulting time-versus-exposure trade-off.",
  },
  {
    id: "sih-dimapur-imphal",
    badge: "Scenario 2 · Nagaland-Manipur",
    title: "Dimapur ➔ Imphal (28T Heavy Bridge Limit & Sinking Zone)",
    origin: "dimapur",
    destination: "imphal",
    vehicle: "heavy",
    commodity: "pds",
    weather: "monsoon",
    hazardDescription: "Scenario inputs assign a 16T edge limit and elevated ground-instability risk; a 28T vehicle must use a feasible alternative.",
    explanation: "Controlled evaluation: a 28T vehicle cannot use an edge configured with a 16T limit, so the search selects another feasible corridor when one exists.",
  },
  {
    id: "sih-silchar-aizawl",
    badge: "Scenario 3 · Barak Valley",
    title: "Silchar ➔ Aizawl (Flood Scenario & Reviewed Detour)",
    origin: "silchar",
    destination: "aizawl",
    vehicle: "standard",
    commodity: "fuel",
    weather: "monsoon",
    hazardDescription: "Scenario inputs model flood exposure and a landslide report promoted through the reviewer workflow.",
    explanation: "Controlled evaluation: a pending field report does not close a road; an accepted reviewer decision can promote it to an accessibility event used by subsequent route requests.",
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
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [vehicle, setVehicle] = useState<VehicleType>("heavy");
  const [commodity, setCommodity] = useState<CommodityType>("medical");

  // Language dropdown toggle state
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const t = TRANSLATIONS[lang];

  const handleSelectLanguage = (selectedLang: SupportedLanguage, mode: "auto" | "manual" = "manual") => {
    setLang(selectedLang);
    setLangMode(mode);
    try {
      localStorage.setItem("raahsetu_lang", selectedLang);
      localStorage.setItem("raahsetu_lang_mode", mode);
    } catch {}
  };

  // Views: "intro" | "dispatcher" | "auth" | "districts" | "advisories" | "system"
  const [activeView, setActiveView] = useState<"intro" | "dispatcher" | "auth" | "districts" | "advisories" | "system">("intro");
  const [districtFilterState, setDistrictFilterState] = useState<string>("ALL");
  const [districtSearchQuery, setDistrictSearchQuery] = useState<string>("");

  // Theme: "light" | "dark" - First preference is strictly light theme
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("raahsetu_theme");
      if (saved === "light" || saved === "dark") return saved;
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

  const [isRealGpsActive, setIsRealGpsActive] = useState(false);
  const toggleRealDeviceGps = () => {
    if (!navigator.geolocation) {
      alert("HTML5 Geolocation is not supported by this browser.");
      return;
    }
    if (isRealGpsActive) {
      setIsRealGpsActive(false);
      return;
    }
    setIsRealGpsActive(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNavGpsCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 8),
          speedKmh: Math.round((pos.coords.speed || 0) * 3.6),
          heading: Math.round(pos.coords.heading || 0),
          placeName: `Real Device GPS (${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E)`,
        });
        const token = sessionStorage.getItem("raahsetu_token");
        if (token) {
          sendFleetPosition(token, {
            vehicle_id: driverProfile.vehicleNo || "AS-01-GB-4821",
            recorded_at: new Date().toISOString(),
            lon: pos.coords.longitude,
            lat: pos.coords.latitude,
            speed_kph: Math.round((pos.coords.speed || 0) * 3.6),
            heading: Math.round(pos.coords.heading || 0),
            accuracy_m: Math.round(pos.coords.accuracy || 8),
            status: "en_route",
          }).catch(() => {});
        }
      },
      (err) => {
        alert(`Device GPS error: ${err.message}. Operating in corridor simulation mode.`);
        setIsRealGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
  const [isAlertCenterModalOpen, setIsAlertCenterModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedSihScenario, setSelectedSihScenario] = useState<string | null>(null);
  const [simObstacleNotice, setSimObstacleNotice] = useState<string | null>(null);
  const [simStepCount, setSimStepCount] = useState(0);
  const [simTotalSteps, setSimTotalSteps] = useState(0);
  const [broadcastChannel, setBroadcastChannel] = useState<"sms" | "whatsapp">("sms");
  const [broadcastTarget, setBroadcastTarget] = useState<string>("all");
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    "[RAAHSETU LOGISTICS DISPATCH] Urgent: Landslide and heavy river swell verified on active corridor. Automatic Risk-A* detour recalculation pushed to vehicle console. Proceed via verified bypass."
  );
  const [isBroadcastTransmitting, setIsBroadcastTransmitting] = useState(false);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState<string | null>(null);

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
  const [mapDisplayMode, setMapDisplayMode] = useState<"osm" | "satellite" | "3d">("osm");
  const [hoveredLegIndex, setHoveredLegIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [customOrigin, setCustomOrigin] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const mapCardRef = useRef<HTMLDivElement | null>(null);

  // Backend Risk-A* Integration State
  const [backendComparison, setBackendComparison] = useState<Comparison | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [routeSource, setRouteSource] = useState<"backend" | "local">("backend");
  const [reportKind, setReportKind] = useState<"road_blocked" | "landslide" | "flood" | "bridge_damage" | "road_damage">("landslide");
  const [reportStatus, setReportStatus] = useState<"blocked" | "restricted" | "open">("blocked");
  const [reportDescription, setReportDescription] = useState<string>("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Auto weather for current corridor
  const liveWeather = useMemo(() => {
    return getAutomaticWeatherForLocation(origin || "guwahati", destination || "tawang");
  }, [origin, destination]);
  const weather = liveWeather.condition;

  const destWeather = useMemo(() => {
    if (!destination) return null;
    return getCityWeather(destination);
  }, [destination]);

  // Live Weather Telemetry from FastAPI / Open-Meteo Station
  const [backendLiveWeather, setBackendLiveWeather] = useState<LiveWeatherStation | null>(null);

  useEffect(() => {
    let active = true;
    const fetchWeather = async () => {
      try {
        const stateName = CITY_MAP[origin || "guwahati"]?.state || "Assam";
        const regionCode = stateName.toLowerCase().replace(/\s+/g, "-");
        const res = await getLiveWeather(regionCode);
        if (active && res && typeof res.temperature_c === "number") {
          setBackendLiveWeather(res);
        }
      } catch {
        if (active) setBackendLiveWeather(null);
      }
    };
    fetchWeather();
    return () => {
      active = false;
    };
  }, [origin]);

  // Offline Sync Effect
  useEffect(() => {
    const syncQueue = async () => {
      try {
        const queued = await listQueuedReports();
        setOfflineReportsCount(queued.length);
        if (queued.length === 0 || !navigator.onLine) return;
        const token = sessionStorage.getItem("raahsetu_token");
        if (!token) return;
        for (const item of queued) {
          try {
            const report = await createFieldReport(item.payload, token);
            if (item.evidence) {
              await uploadFieldReportAttachment(
                token,
                report.id,
                dataUrlToFile(item.evidence.dataUrl, item.evidence.name, item.evidence.type),
              );
            }
            await removeQueuedReport(item.id);
          } catch {
            // Keep in queue if server error
          }
        }
        const remaining = await listQueuedReports();
        setOfflineReportsCount(remaining.length);
      } catch (err) {
        console.warn("Offline report queue sync notice:", err);
      }
    };

    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener("online", handleOnline);
    syncQueue();

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Live GPS Route Progression Animation Engine & Telemetry Streaming
  useEffect(() => {
    if (!isNavigating || isRealGpsActive) return;

    const r1 = backendComparison?.routes?.[1] as any;
    const r0 = backendComparison?.routes?.[0] as any;
    const coords: [number, number][] =
      r1?.geometry?.coordinates && r1.geometry.coordinates.length > 1
        ? r1.geometry.coordinates
        : r0?.geometry?.coordinates && r0.geometry.coordinates.length > 1
        ? r0.geometry.coordinates
        : (origin && destination && CITY_MAP[origin] && CITY_MAP[destination]
            ? [[CITY_MAP[origin].lon, CITY_MAP[origin].lat], [CITY_MAP[destination].lon, CITY_MAP[destination].lat]]
            : []);

    if (coords.length < 2) return;
    setSimTotalSteps(coords.length);

    let step = 0;
    const animInterval = setInterval(() => {
      step++;
      setSimStepCount(step);

      if (step >= coords.length) {
        const dest = CITY_MAP[destination];
        speakMultilingual(
          `Arrived at destination. Delivery completed successfully at ${dest?.name || "terminal"}.`,
          lang
        );
        setIsNavigating(false);
        return;
      }

      const curr = coords[step];
      const prev = coords[step - 1];
      const dLon = curr[0] - prev[0];
      const dLat = curr[1] - prev[1];
      const headingDeg = (Math.atan2(dLon, dLat) * (180 / Math.PI) + 360) % 360;
      const speed = Math.round(48 + Math.sin(step * 0.4) * 12);

      setNavGpsCoords({
        lon: curr[0],
        lat: curr[1],
        accuracy: 8,
        speedKmh: speed,
        heading: Math.round(headingDeg),
        placeName: `Corridor Waypoint ${step + 1}/${coords.length} · Transit`,
      });

      const token = sessionStorage.getItem("raahsetu_token");
      if (token) {
        sendFleetPosition(token, {
          vehicle_id: "AS-01-GB-4821",
          recorded_at: new Date().toISOString(),
          lon: curr[0],
          lat: curr[1],
          speed_kph: speed,
          heading: Math.round(headingDeg),
          accuracy_m: 8,
          status: "en_route",
        }).catch(() => {});
      }
    }, 1200);

    return () => clearInterval(animInterval);
  }, [isNavigating, backendComparison, origin, destination, lang]);

  const handleSimulateObstacleAhead = () => {
    const obstacleNotice = "Critical Hazard Ahead: Active Landslide & River Inundation Reported by SDRF Telemetry";
    setSimObstacleNotice(obstacleNotice);
    speakMultilingual(
      "Warning: Critical hazard reported on active route ahead by state disaster authorities. Automatic Risk-A* recalculation engaged.",
      lang
    );

    const r = backendComparison?.routes?.[0] as any;
    const blockedEdge = (r && r.edge_ids && r.edge_ids.length > 2) ? r.edge_ids[Math.min(2, r.edge_ids.length - 1)] : "hazard-block";
    const input: RouteInput = {
      dataset_id: "osm-northeast",
      origin: { node_id: origin },
      destination: { node_id: destination },
      vehicle: vehicle === "light" ? "light" : "heavy",
      risk_aversion: 1.5,
      weather: "heavy_rain",
      closed_edge_ids: [blockedEdge],
      strict_vehicle: true,
    };
    compareRoutes(input, new AbortController().signal)
      .then((res) => {
        setBackendComparison(res);
      })
      .catch(() => {});
  };

  // Active FastAPI Risk-A* Route Solver
  useEffect(() => {
    if (!origin || !destination || origin === destination) {
      setBackendComparison(null);
      return;
    }

    const controller = new AbortController();
    setIsRoutingLoading(true);

    const cProf = COMMODITY_PROFILES[commodity];
    const riskTolerance = cProf ? cProf.riskToleranceMult : 1.5;

    const activeWeatherParam: "normal" | "heavy_rain" =
      (backendLiveWeather && backendLiveWeather.precipitation_mm_24h > 5.0) || weather === "monsoon"
        ? "heavy_rain"
        : "normal";

    const input: RouteInput = {
      dataset_id: "osm-northeast",
      origin: { node_id: origin },
      destination: { node_id: destination },
      vehicle: vehicle === "heavy" ? "heavy" : vehicle === "light" ? "light" : "heavy",
      risk_aversion: riskTolerance,
      weather: activeWeatherParam,
      closed_edge_ids: [],
      strict_vehicle: false,
    };

    compareRoutes(input, controller.signal)
      .then((comp) => {
        setBackendComparison(comp);
        setRouteSource("backend");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("FastAPI routing service notice, falling back to local topological solver:", err.message);
          setBackendComparison(null);
          setRouteSource("local");
        }
      })
      .finally(() => {
        setIsRoutingLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [origin, destination, vehicle, commodity, weather, backendLiveWeather]);

  // Fallback / Topological Shortest route solver
  const shortest = useMemo(() => {
    return solvePath(origin, destination, (edge) => edge.dist);
  }, [origin, destination]);

  // Fallback / Topological Safe / Risk-Aware route solver
  const safe = useMemo(() => {
    const cProf = COMMODITY_PROFILES[commodity];
    const riskMultiplier = cProf ? cProf.riskToleranceMult : 2.5;
    return solvePath(origin, destination, (edge) => {
      const adjRisk = getAdjustedEdgeRisk(edge, vehicle, weather);
      return edge.dist * (1 + adjRisk * riskMultiplier);
    });
  }, [origin, destination, vehicle, weather, commodity]);

  // Backend route extractions
  const backendRiskRoute = useMemo<AvailableRoute | null>(() => {
    return backendComparison?.routes.find((route): route is AvailableRoute => route.id === "risk_aware" && route.status === "available") ?? null;
  }, [backendComparison]);

  const backendFastestRoute = useMemo<AvailableRoute | null>(() => {
    return backendComparison?.routes.find((route): route is AvailableRoute => route.id === "fastest" && route.status === "available") ?? null;
  }, [backendComparison]);

  const backendRiskCoords = useMemo(() => {
    return (backendRiskRoute?.geometry.coordinates as [number, number][]) ?? undefined;
  }, [backendRiskRoute]);

  const backendFastestCoords = useMemo(() => {
    return (backendFastestRoute?.geometry.coordinates as [number, number][]) ?? undefined;
  }, [backendFastestRoute]);

  const shortestStats = useMemo(() => {
    if (backendFastestRoute) {
      return {
        path: backendFastestRoute.edge_ids,
        distance: Math.round(backendFastestRoute.distance_km),
        hours: Math.round((backendFastestRoute.duration_min / 60) * 10) / 10,
        riskIndex: Math.round(backendFastestRoute.mean_risk_score * 100),
        edges: [],
      };
    }
    return shortest ? computeStats(shortest, vehicle, weather) : null;
  }, [backendFastestRoute, shortest, vehicle, weather]);

  const safeStats = useMemo(() => {
    if (backendRiskRoute) {
      return {
        path: backendRiskRoute.edge_ids,
        distance: Math.round(backendRiskRoute.distance_km),
        hours: Math.round((backendRiskRoute.duration_min / 60) * 10) / 10,
        riskIndex: Math.round(backendRiskRoute.mean_risk_score * 100),
        edges: [],
      };
    }
    return safe ? computeStats(safe, vehicle, weather) : null;
  }, [backendRiskRoute, safe, vehicle, weather]);

  const safeLegs = useMemo(() => {
    if (!safe) return [];
    return getRouteLegs(safe, vehicle, weather);
  }, [safe, vehicle, weather]);

  const intermediateCities = useMemo(() => {
    if (!safe) return [];
    return getIntermediateCities(safe);
  }, [safe]);

  const riskReductionPct = useMemo(() => {
    if (backendComparison?.comparison?.exposure_reduction_pct != null) {
      return Math.max(0, Math.round(backendComparison.comparison.exposure_reduction_pct));
    }
    if (!shortestStats || !safeStats || shortestStats.riskIndex === 0) return 0;
    const diff = ((shortestStats.riskIndex - safeStats.riskIndex) / shortestStats.riskIndex) * 100;
    return Math.max(0, Math.round(diff));
  }, [backendComparison, shortestStats, safeStats]);

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

  // 3D Terrain Data
  const locationsList = useMemo(() => {
    return CITIES.map((c) => ({
      id: c.id,
      label: `${c.name} (${c.state})`,
      lon: c.lon,
      lat: c.lat,
      kind: "hub",
    }));
  }, []);

  const terrainNetwork = useMemo<Network>(() => {
    return {
      type: "FeatureCollection" as const,
      metadata: {
        dataset_id: "osm-northeast",
        focus_node: origin || "guwahati",
        focus: { lon: CITY_MAP[origin]?.lon || 91.73, lat: CITY_MAP[origin]?.lat || 26.14 },
        radius_km: 400,
        returned_features: Math.min(EDGES.length, 60),
        total_features: EDGES.length,
        truncated: EDGES.length > 60,
      },
      features: EDGES.slice(0, 60).map((e) => {
        const uNode = CITY_MAP[e.a];
        const vNode = CITY_MAP[e.b];
        return {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: [
              [uNode?.lon || 91.73, uNode?.lat || 26.14],
              [vNode?.lon || 92.77, vNode?.lat || 24.83],
            ] as [number, number][],
          },
          properties: {
            id: `${e.a}>${e.b}`,
            name: e.note || `${e.a} - ${e.b}`,
            u: e.a,
            v: e.b,
            risk: e.risk,
            closed: false,
            evidence: "Northeast arterial corridor",
          },
        };
      }),
    };
  }, [origin]);

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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors relative overflow-x-hidden">
      {/* 0. AMBIENT TOPOGRAPHIC CONTOUR & WATERMARK BACKGROUND */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] dark:opacity-[0.055] bg-repeat bg-center mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage: "url('/topographic-terrain.png')",
          backgroundSize: "680px auto",
        }}
        aria-hidden="true"
      />
      {/* Subtle Coordinate Datum Margin Watermarks */}
      <div
        className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden text-[9px] font-mono text-muted-foreground/15 dark:text-muted-foreground/10 leading-none"
        aria-hidden="true"
      >
        <div className="absolute top-2 left-6 tracking-widest uppercase">
          DATUM: WGS84 · SRTM-30M · NORTH-EASTERN REGIONAL CORRIDOR [21°57'N - 29°30'N, 89°46'E - 97°30'E]
        </div>
        <div className="absolute bottom-2 right-6 tracking-widest uppercase hidden md:block">
          SURVEY GRID REF: NH-13 / NH-27 / NH-29 / NH-102 · GROUND TELEMETRY V2.4
        </div>
      </div>
      {/* 1. CLEAN APP HEADER */}
      <header className="border-b border-border bg-card px-4 sm:px-6 py-3 transition-colors">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          {/* Brand */}
          <button
            type="button"
            onClick={() => setActiveView("intro")}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
              <Waypoints className="size-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight leading-none text-foreground">
                {t.brandName}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {t.brandSubtitle}
              </div>
            </div>
          </button>

          {/* Segmented View Switcher (Desktop) */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-secondary border border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView("intro")}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "intro"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="size-3.5" />
              <span>{t.navOverview}</span>
            </button>
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
              <span>{t.navDispatcher}</span>
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
              <span>{t.navDistricts}</span>
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
              <span>{t.tabAdvisories}</span>
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
              <span>{t.navArchitecture}</span>
            </button>
          </nav>

          {/* Right Tools */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer"
              title={`Switch to ${theme === "light" ? t.darkMode : t.lightMode}`}
            >
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
            </button>

            {/* Language Selector Dropdown */}
            <div ref={langDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title={`Current language: ${lang.toUpperCase()} (${langMode === "auto" ? "Auto-detected" : "Manual"})`}
              >
                <Globe className="size-3.5 text-primary" />
                <span>{lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : lang === "as" ? "অসমীয়া" : "বাংলা"}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-border bg-card p-1 shadow-xl z-50 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {langMode === "auto" ? t.autoDetected : t.selectLanguage}
                  </div>
                  {[
                    { id: "en", label: "English", native: "English" },
                    { id: "hi", label: "Hindi", native: "हिन्दी" },
                    { id: "as", label: "Assamese", native: "অসমীয়া" },
                    { id: "bn", label: "Bengali", native: "বাংলা" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleSelectLanguage(item.id as SupportedLanguage, "manual");
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between cursor-pointer transition-colors ${
                        lang === item.id
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{item.native}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Driver Profile Button */}
            <button
              type="button"
              onClick={() => setActiveView("auth")}
              className={`hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-xs font-medium cursor-pointer transition-colors ${
                activeView === "auth"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-card hover:bg-secondary text-foreground"
              }`}
            >
              <Truck className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground">{driverProfile.driverName ? driverProfile.vehicleNo : t.navSignIn}</span>
            </button>

            {/* Fleet Alerts & Broadcast Center */}
            <button
              type="button"
              onClick={() => setIsAlertCenterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs shadow-2xs cursor-pointer transition-all"
              title="Regional Alerts and Fleet Driver Dispatch Broadcast"
            >
              <Activity className="size-3.5" />
              <span className="hidden sm:inline">Fleet Alerts & Broadcast</span>
              <span className="sm:hidden">Alerts</span>
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
              <span>{t.emergencySos}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-b border-border bg-card px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveView("intro")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "intro" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          {t.tabProblem}
        </button>
        <button
          type="button"
          onClick={() => setActiveView("dispatcher")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "dispatcher" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          {t.tabDispatcher}
        </button>
        <button
          type="button"
          onClick={() => setActiveView("districts")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "districts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          {t.tabDistricts}
        </button>
        <button
          type="button"
          onClick={() => setActiveView("advisories")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "advisories" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          {t.tabAdvisories}
        </button>
        <button
          type="button"
          onClick={() => setActiveView("system")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            activeView === "system" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          {t.tabSystem}
        </button>
      </div>

      {/* Active Road Closure Banner (Visible on Dispatcher, Districts, Advisories, System; hidden on Welcome/Intro) */}
      {activeView !== "intro" && (
        <div
          onMouseEnter={() => setIsBannerPaused(true)}
          onMouseLeave={() => setIsBannerPaused(false)}
          className="border-b border-border bg-secondary/50 px-4 py-2 transition-colors"
        >
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="badge-status-advisory shrink-0">
                <AlertTriangle className="size-3" />
                <span>{t.tabAdvisories}</span>
              </span>
              <span className="truncate font-medium text-foreground">
                {(() => {
                  const blk = ACTIVE_ROAD_BLOCKAGES[activeBlockageIdx];
                  const b = getBlockageDetails(blk.id, lang, blk);
                  return (
                    <>
                      <strong>{b.road} ({getStateName(blk.state, lang)}):</strong>{" "}
                      [PLANNING SCENARIO] {b.cause} at {b.exactSpot}.
                    </>
                  );
                })()}
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
                <span>{t.inspect}</span>
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
      )}

      <main className="flex-1">
        {/* VIEW 0: INTRO / GROUND DATA & PROBLEM STATEMENT */}
        {activeView === "intro" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <IntroPage
              onLaunchConsole={(o, d) => {
                if (o && d) {
                  setOrigin(o);
                  setDestination(d);
                } else {
                  setOrigin("");
                  setDestination("");
                }
                setActiveView("dispatcher");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateToAuth={() => {
                setActiveView("auth");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateToDistricts={() => {
                setActiveView("districts");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateToAdvisories={() => {
                setActiveView("advisories");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateToSystem={() => {
                setActiveView("system");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}

        {/* VIEW 1: DEDICATED LOGIN / SIGN-UP PAGE (Modeled after Screenshot 1) */}
        {activeView === "auth" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <AuthPage
              lang={lang}
              onSuccess={(profile) => {
                handleSaveDriverProfile({
                  ...profile,
                  trustedContactName: "Fleet Dispatch Base",
                  isRegistered: true,
                });
                setActiveView("dispatcher");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onBackToHome={() => {
                setActiveView("intro");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}

        {/* VIEW 2: ROUTE DISPATCHER (ORIGIN TO DESTINATION PAGE) */}
        {activeView === "dispatcher" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
            {/* Highlighted Callout: Enter Origin & Destination */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !origin || !destination
                  ? "border-primary/80 bg-primary/10 ring-2 ring-primary/25"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-foreground">
                    {!origin && !destination
                      ? t.step12SelectTitle
                      : !destination
                      ? `${t.departureHubSelected}: ${getCityName(origin, lang, CITY_MAP[origin]?.name)}. ${t.nowChooseDestination}`
                      : !origin
                      ? `${t.destSelected}: ${getCityName(destination, lang, CITY_MAP[destination]?.name)}. ${t.nowChooseDeparture}`
                      : `${t.activeRoute}: ${getCityName(origin, lang, CITY_MAP[origin]?.name)} ➔ ${getCityName(destination, lang, CITY_MAP[destination]?.name)}`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {!origin || !destination
                      ? t.step12Prompt
                      : t.step12Active}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
                    !origin || !destination
                      ? "bg-primary text-primary-foreground font-bold animate-pulse shadow-xs"
                      : "border border-border bg-secondary text-foreground"
                  }`}
                >
                  {!origin || !destination ? t.enterEndpointsBelow : t.routeReady}
                </span>
              </div>
            </div>

            {/* SIH 2026 Jury Test Scenarios Launcher */}
            <div className="rounded-2xl border border-primary/50 bg-gradient-to-r from-primary/15 via-card to-primary/10 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <Waypoints className="size-3.5" />
                    <span>SIH 2026 Evaluation Scenarios</span>
                  </span>
                  <span className="text-xs font-semibold text-foreground hidden sm:inline">
                    Deterministic Test Corridors for Jury Evaluation
                  </span>
                </div>
                <span className="text-[11px] font-mono text-primary font-semibold">
                  1-Click Execution · Explainable Trade-offs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SIH_DEMO_SCENARIOS.map((sc) => {
                  const isCurrent = (origin === sc.origin && destination === sc.destination) || selectedSihScenario === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setOrigin(sc.origin);
                        setDestination(sc.destination);
                        setVehicle(sc.vehicle);
                        setCommodity(sc.commodity);
                        setSelectedSihScenario(sc.id);
                        scrollToMap();
                      }}
                      className={`text-left p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isCurrent
                          ? "border-primary bg-primary/20 ring-2 ring-primary/40 shadow-xs"
                          : "border-border/80 bg-card/90 hover:border-primary/50 hover:bg-secondary/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{sc.badge}</span>
                        {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-bold">ACTIVE</span>}
                      </div>
                      <div className="font-bold text-xs text-foreground mt-1 truncate">{sc.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{sc.hazardDescription}</div>
                      <div className="mt-2 text-[10px] text-primary font-semibold flex items-center gap-1">
                        <span>Load Scenario & Solve Route</span>
                        <ArrowRight className="size-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick-Pick Freight Corridors */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>{t.strategicCorridorsBar}</span>
                <span className="text-[11px] font-normal lowercase">{t.clickPresets}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {STRATEGIC_CORRIDORS.map((c) => {
                  const isSelected = origin === c.origin && destination === c.destination;
                  const cor = getCorridorDetails(c, lang);
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
                      <span>{cor.title}</span>
                      <span className="ml-1.5 text-[10px] font-mono opacity-70">({cor.tag})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Regional Logistics Overview Banner with Himalayan Highway Backdrop */}
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <div
                className="absolute inset-0 z-0 bg-cover bg-right sm:bg-center opacity-30 dark:opacity-20 transition-opacity"
                style={{
                  backgroundImage: "url('/hero-himalayan-highway.jpg')",
                }}
              />
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-card via-card/90 to-card/35 dark:from-card dark:via-card/92 dark:to-card/50" />

              <div className="relative z-10 p-5 sm:p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-semibold">
                    <Mountain className="size-3.5" />
                    <span>{t.himalayanGridTitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t.osmGraphActive}</span>
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{t.keyCorridorsCount}</span>
                  </div>
                </div>

                <div className="max-w-2xl">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {t.dispatcherBannerTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    {t.dispatcherBannerDesc}
                  </p>
                </div>

                {/* Corridor telemetry stat bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-2.5 rounded-xl border border-border/80 bg-card/85 backdrop-blur-xs">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase">{t.activeDeparture}</div>
                    <div className="text-xs font-bold text-foreground truncate mt-0.5">
                      {origin ? `${getCityName(origin, lang, CITY_MAP[origin]?.name)} (${getStateName(CITY_MAP[origin]?.state, lang)})` : t.awaitingInput}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-border/80 bg-card/85 backdrop-blur-xs">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase">{t.targetDestination}</div>
                    <div className="text-xs font-bold text-foreground truncate mt-0.5">
                      {destination ? `${getCityName(destination, lang, CITY_MAP[destination]?.name)} (${getStateName(CITY_MAP[destination]?.state, lang)})` : t.awaitingInput}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-border/80 bg-card/85 backdrop-blur-xs">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase">{t.corridorElevation}</div>
                    <div className="text-xs font-bold text-foreground truncate mt-0.5">
                      {origin && destination ? `${CITY_MAP[origin]?.y || 55}m ➔ ${CITY_MAP[destination]?.y || 3048}m` : t.awaitingRoute}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-border/80 bg-card/85 backdrop-blur-xs">
                    <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground uppercase">
                      <span>{t.weatherAdvisory}</span>
                      {backendLiveWeather && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold font-mono ${backendLiveWeather.fresh ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-700 dark:text-amber-400"}`}>
                          {backendLiveWeather.fresh ? "LIVE OPEN-METEO" : "WEATHER FALLBACK"}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-primary truncate mt-0.5">
                      {backendLiveWeather
                        ? `${backendLiveWeather.station}: ${backendLiveWeather.temperature_c}°C · ${backendLiveWeather.condition.toUpperCase()} · Rain: ${backendLiveWeather.precipitation_mm_24h}mm/24h`
                        : origin && destination
                        ? (getLocalizedWeatherSummary(liveWeather.summary, lang) || t.clearTransit)
                        : t.standardNominal}
                    </div>
                  </div>
                </div>
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
                      label={t.departureHub}
                      selectedId={origin}
                      isOrigin={true}
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
                        title={t.swap}
                      >
                        <ArrowUpDown className="size-3.5" />
                      </button>
                    </div>

                    <CityCombobox
                      label={t.arrivalDestination}
                      selectedId={destination}
                      onSelect={(id) => setDestination(id)}
                      otherCityId={origin}
                      lang={lang}
                    />
                  </div>

                  {/* Scenario weather profile; a timestamped provider is required for live conditions. */}
                  {destination && destWeather && (
                    <div className="p-3.5 rounded-2xl border border-border bg-secondary/40 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-xl bg-card border border-border flex items-center justify-center shadow-xs">
                            {destWeather.condition === "snow" ? (
                              <Snowflake className="size-4 text-sky-500 animate-pulse" />
                            ) : destWeather.condition === "monsoon" ? (
                              <CloudRain className="size-4 text-blue-500" />
                            ) : (
                              <Sun className="size-4 text-amber-500" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">
                              Weather scenario: {getCityName(destination, lang, CITY_MAP[destination]?.name)}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                              Planning profile · {destWeather.stationName}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-foreground">{destWeather.tempC}°C</div>
                          <div className="text-[10px] font-semibold text-primary">
                            {getLocalizedWeatherSummary(destWeather.summary, lang)}
                          </div>
                        </div>
                      </div>

                      {/* 3 Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60 text-[11px]">
                        <div className="p-1.5 rounded-xl bg-card/70 border border-border/50 text-center">
                          <div className="text-[9px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                            <Droplets className="size-2.5 text-blue-400" />
                            <span>{t.precipitation}</span>
                          </div>
                          <div className="font-bold text-foreground mt-0.5">{destWeather.precipitationMm} mm/h</div>
                        </div>

                        <div className="p-1.5 rounded-xl bg-card/70 border border-border/50 text-center">
                          <div className="text-[9px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                            <Eye className="size-2.5 text-emerald-400" />
                            <span>{t.visibility}</span>
                          </div>
                          <div className="font-bold text-foreground mt-0.5">{destWeather.visibilityKm} km</div>
                        </div>

                        <div className="p-1.5 rounded-xl bg-card/70 border border-border/50 text-center">
                          <div className="text-[9px] text-muted-foreground uppercase flex items-center justify-center gap-1">
                            <Activity className="size-2.5 text-amber-400" />
                            <span>{t.roadGrip}</span>
                          </div>
                          <div className="font-bold text-foreground mt-0.5">{Math.round(destWeather.roadFriction * 100)}%</div>
                        </div>
                      </div>

                      {/* Terminal Advisory Notice */}
                      <div className="p-2 rounded-xl bg-card/50 border border-border/40 text-[11px] text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">{t.terminalAdvisoryLabel}: </span>
                        {getLocalizedWeatherAdvisory(destWeather.advisory, lang)}
                      </div>
                    </div>
                  )}

                  {locationNotice && (
                    <div className="p-2.5 rounded-xl bg-secondary border border-border text-xs text-muted-foreground leading-relaxed">
                      {locationNotice}
                    </div>
                  )}

                  {/* Vehicle & Cargo Settings */}
                  <div className="pt-3 border-t border-border grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {t.vehicleAxle}
                      </label>
                      <select
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value as VehicleType)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-secondary text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        {Object.entries(VEHICLE_PROFILES).map(([key, v]) => (
                          <option key={key} value={key}>
                            {t.vehicles[key as VehicleType]?.name || v.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {t.cargoPriority}
                      </label>
                      <select
                        value={commodity}
                        onChange={(e) => setCommodity(e.target.value as CommodityType)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-secondary text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        {Object.entries(COMMODITY_PROFILES).map(([key, c]) => (
                          <option key={key} value={key}>
                            {t.commodities[key as CommodityType]?.name || c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Microclimate telemetry pill */}
                  <div className="p-3 rounded-xl bg-secondary/60 border border-border space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                        <CloudRain className="size-3.5 text-primary" />
                        <span>{t.microclimateIngestion}:</span>
                      </span>
                      {backendLiveWeather ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex items-center gap-1 ${backendLiveWeather.fresh ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-700 dark:text-amber-400"}`}>
                          <span className={`size-1.5 rounded-full ${backendLiveWeather.fresh ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                          {backendLiveWeather.fresh ? "Open-Meteo Live" : "Seasonal Fallback"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                          Scenario Fallback
                        </span>
                      )}
                    </div>
                    {backendLiveWeather ? (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">
                            {backendLiveWeather.station}: {backendLiveWeather.temperature_c}°C · {backendLiveWeather.condition.toUpperCase()}
                          </span>
                          <span className="font-mono text-muted-foreground text-[11px]">
                            Rain: {backendLiveWeather.precipitation_mm_24h}mm/24h · Wind: {backendLiveWeather.wind_kph}km/h
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between pt-1 border-t border-border/50">
                          <span>Source: {backendLiveWeather.source}</span>
                          <span>Updated: {new Date(backendLiveWeather.fetched_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          <span className={backendLiveWeather.fresh ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>Status: {backendLiveWeather.fresh ? "Fresh" : "Fallback"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-foreground">
                        {t.weather[weather]?.name || WEATHER_PROFILES[weather]?.name || t.standardNominal}
                      </div>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Route Comparison Card */}
                {shortestStats && safeStats && (
                  <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 overflow-hidden">
                    {/* Subtle Cartographic Compass Rose Watermark */}
                    <svg
                      className="pointer-events-none absolute -right-6 -bottom-6 size-40 text-muted-foreground/5 dark:text-primary/5 select-none"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.75" />
                      <polygon points="50,10 54,46 50,42 46,46" fill="currentColor" />
                      <polygon points="50,90 54,54 50,58 46,54" fill="currentColor" opacity="0.6" />
                      <polygon points="90,50 54,54 58,50 54,46" fill="currentColor" opacity="0.8" />
                      <polygon points="10,50 46,54 42,50 46,46" fill="currentColor" opacity="0.8" />
                      <circle cx="50" cy="50" r="3" fill="currentColor" />
                    </svg>
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-foreground flex items-center gap-2">
                          <span>{t.pathComparison}</span>
                          {routeSource === "backend" ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              FastAPI Risk-A* ({backendComparison?.dataset_version || "osm-northeast"})
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                              Topological Dijkstra
                            </span>
                          )}
                          {isRoutingLoading && (
                            <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                              <Loader2 className="size-3 animate-spin" /> Solving route…
                            </span>
                          )}
                        </div>
                        {backendRiskRoute && (
                          <div className="text-[10px] text-muted-foreground font-mono">
                            Solved in {backendRiskRoute.compute_ms}ms • {backendRiskRoute.expanded_nodes} nodes evaluated • Admissible heuristic
                          </div>
                        )}
                      </div>
                      {riskReductionPct > 0 && (
                        <span className="badge-status-normal">
                          <Check className="size-3" />
                          <span>{riskReductionPct}% {t.saferCorridor}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Nominal Shortest */}
                      <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-2">
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase">
                          {t.fastestShortest}
                        </div>
                        <div className="text-xl font-bold text-foreground">
                          {shortestStats.distance} <span className="text-xs font-normal text-muted-foreground">km</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatHours(shortestStats.hours)}
                        </div>
                        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {t.riskIndex}: {shortestStats.riskIndex}/100
                        </div>
                      </div>

                      {/* Risk-Aware Safe Route */}
                      <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                        <div className="text-[11px] font-semibold text-primary uppercase">
                          {t.safeRiskAware}
                        </div>
                        <div className="text-xl font-bold text-foreground">
                          {safeStats.distance} <span className="text-xs font-normal text-muted-foreground">km</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatHours(safeStats.hours)}
                        </div>
                        <div className="text-xs font-semibold text-primary">
                          {t.riskIndex}: {safeStats.riskIndex}/100
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Risk-aware delta: {safeStats.distance - shortestStats.distance >= 0 ? "+" : ""}
                      {safeStats.distance - shortestStats.distance} km · {safeStats.hours - shortestStats.hours >= 0 ? "+" : "−"}
                      {formatHours(Math.abs(safeStats.hours - shortestStats.hours))}. Exposure is calculated from the selected scenario and versioned graph.
                    </p>

                    {/* Explainable AI: Detour Explanations */}
                    {backendComparison?.explanations && backendComparison.explanations.length > 0 && (
                      <div className="pt-2 border-t border-border space-y-1.5">
                        <div className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="size-3.5 text-amber-500" />
                            <span>Explainable Detour Rationale:</span>
                          </div>
                          <span className="text-[10px] font-mono text-primary font-semibold">Prototype Risk-A* model</span>
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {backendComparison.explanations.map((exp, i) => (
                            <div key={i} className="text-[11px] p-2 rounded-xl bg-secondary/60 border border-border space-y-1 text-muted-foreground">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground truncate pr-2">{exp.road}</span>
                                <span className="font-mono text-amber-500 text-[10px] font-bold shrink-0">
                                  Risk {exp.score}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-muted-foreground truncate">Detour: {exp.reason}</span>
                                {exp.ml_disruption_probability !== undefined && (
                                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-semibold shrink-0">
                                    Model disruption score: {(exp.ml_disruption_probability * 100).toFixed(0)}% ({exp.ml_primary_factor || "Terrain"})
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Elevation Profile Card */}
                {elevationAnalysis && (
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <Mountain className="size-4 text-primary" />
                        <span>{t.elevationProfile}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {t.peak} {elevationAnalysis.maxElev}m ({elevationAnalysis.peakName})
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
                    <span>{t.downloadManifest}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {copiedLink ? <Check className="size-3.5 text-primary" /> : <Share2 className="size-3.5" />}
                    <span>{copiedLink ? t.copied : t.share}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Camera className="size-3.5" />
                    <span>{t.reportHazard}</span>
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
                        {origin ? getCityName(origin, lang, CITY_MAP[origin]?.name) : ""} ➔ {destination ? getCityName(destination, lang, CITY_MAP[destination]?.name) : ""}
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

                      {/* Dynamic Reroute Simulation Trigger */}
                      {isNavigating && (
                        <button
                          type="button"
                          onClick={handleSimulateObstacleAhead}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-2xs animate-pulse"
                          title="Simulate dynamic hazard report triggering Risk-A* recalculation"
                        >
                          <AlertTriangle className="size-3.5" />
                          <span>Simulate Hazard Ahead</span>
                        </button>
                      )}

                      {/* 2D Road / Satellite / 3D Terrain Switcher */}
                      <div className="flex items-center gap-1 bg-secondary/80 p-0.5 rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={() => setMapDisplayMode("osm")}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            mapDisplayMode === "osm" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t.roadNetwork || "Roads"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMapDisplayMode("satellite")}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            mapDisplayMode === "satellite" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t.satelliteView || "Satellite"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMapDisplayMode("3d")}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                            mapDisplayMode === "3d" ? "bg-primary text-primary-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Mountain className="size-3" />
                          <span>3D Terrain</span>
                        </button>
                      </div>

                      {/* Fullscreen Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsBigScreenNav(!isBigScreenNav)}
                        className="p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        title={isBigScreenNav ? t.exitFullscreen : t.expandFullscreen}
                      >
                        {isBigScreenNav ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Cartography View (2D Leaflet Road/Satellite or React Three Fiber 3D Terrain) */}
                  <div className={isBigScreenNav ? "flex-1 w-full rounded-xl overflow-hidden" : "h-[460px] w-full rounded-xl overflow-hidden border border-border"}>
                    {mapDisplayMode === "3d" ? (
                      <div className="w-full h-full bg-slate-950">
                        <Suspense
                          fallback={
                            <div className="h-full w-full grid place-items-center text-sm text-slate-300">
                              <Loader2 className="size-5 animate-spin mr-2" /> Loading 3D terrain…
                            </div>
                          }
                        >
                          <TerrainMap
                            network={terrainNetwork}
                            locations={locationsList}
                            result={backendComparison}
                            origin={origin}
                            destination={destination}
                            closedIds={[]}
                            mode="3d"
                            reset={0}
                            showRisk={true}
                            selected="risk_aware"
                            terrain={null}
                            events={[]}
                          />
                        </Suspense>
                      </div>
                    ) : (
                      <RealMapLeaflet
                        originCity={CITY_MAP[origin]}
                        destCity={CITY_MAP[destination]}
                        routePath={safe}
                        safeLegs={safeLegs}
                        backendRouteGeometry={backendRiskCoords}
                        fastestRouteGeometry={backendFastestCoords}
                        routeSource={routeSource}
                        userGps={navGpsCoords}
                        isNavigating={isNavigating}
                        isBigScreen={isBigScreenNav}
                        mapMode={mapDisplayMode === "satellite" ? "satellite" : "osm"}
                        onMapModeChange={(mode) => setMapDisplayMode(mode)}
                        lang={lang}
                      />
                    )}
                  </div>

                  {/* Live GPS Telemetry HUD */}
                  {(isNavigating || navGpsCoords) && (
                    <div className="p-3 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-primary/5 shadow-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <Truck className="size-3.5 text-primary" />
                            <span>{isRealGpsActive ? "Real Device GPS Stream" : "Fleet Telemetry Simulator"}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold">
                            AS-01-GB-4821
                          </span>
                          <button
                            type="button"
                            onClick={toggleRealDeviceGps}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                              isRealGpsActive
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-2xs"
                                : "bg-secondary hover:bg-secondary/80 text-muted-foreground border-border"
                            }`}
                            title="Switch between browser HTML5 device GPS and deterministic corridor transit simulation"
                          >
                            {isRealGpsActive ? "● Real Device GPS Active" : "Device GPS (Mobile)"}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-muted-foreground">
                            Speed: <strong className="text-foreground">{navGpsCoords?.speedKmh || 48} km/h</strong>
                          </span>
                          <span className="text-muted-foreground">
                            Heading: <strong className="text-foreground">{navGpsCoords?.heading || 34}°</strong>
                          </span>
                          <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <Check className="size-3" /> Geofence: Corridor Verified
                          </span>
                        </div>
                      </div>

                      {simTotalSteps > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>Corridor Waypoint Transit ({simStepCount}/{simTotalSteps})</span>
                            <span>{Math.round((simStepCount / simTotalSteps) * 100)}% Complete</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.round((simStepCount / simTotalSteps) * 100))}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {simObstacleNotice && (
                        <div className="p-2.5 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs font-medium flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 shrink-0 animate-bounce" />
                            <span>{simObstacleNotice}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-destructive text-destructive-foreground text-[10px] font-bold shrink-0 uppercase">
                            Risk-A* Detour Recalculated
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Turn-by-Turn Leg Itinerary */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
                  <div className="font-bold text-sm text-foreground flex items-center justify-between">
                    <span>{t.routeWaypoints}</span>
                    <span className="text-xs text-muted-foreground font-normal">{safeLegs.length} {t.highwayLegs}</span>
                  </div>

                  {intermediateCities.length > 0 && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 flex-wrap pb-1">
                      <span className="font-medium text-foreground">{t.via}:</span>
                      {intermediateCities.map((c, i) => (
                        <span key={c.id} className="inline-flex items-center">
                          {getCityName(c.id, lang, c.name)}
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
                            <span>{getCityName(leg.fromId, lang, leg.fromCity.name)}</span>
                            <ArrowRight className="size-3 text-muted-foreground" />
                            <span>{getCityName(leg.toId, lang, leg.toCity.name)}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-muted-foreground">
                            <span>{leg.dist} km</span>
                            <span>·</span>
                            <span>{formatHours(leg.hours)}</span>
                            <span>·</span>
                            <span className={leg.risk > 40 ? "text-destructive font-bold" : "text-primary"}>
                              {leg.risk}% {t.risk}
                            </span>
                          </div>
                        </div>
                        {leg.note && (
                          <div className="mt-1 pl-7 text-[11px] text-muted-foreground">
                            {getLocalizedNote(leg.note, lang)}
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
                  {t.districtHealthTitle}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.districtHealthSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                <span className="badge-status-normal">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {DISTRICT_CONNECTIVITY.filter((d) => d.status === "NORMAL").length} {t.statusNormal}
                </span>
                <span className="badge-status-advisory">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  {DISTRICT_CONNECTIVITY.filter((d) => d.status === "WATCH").length} {t.statusWatch}
                </span>
                <span className="badge-status-restricted">
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  {DISTRICT_CONNECTIVITY.filter((d) => d.status === "RESTRICTED").length} {t.statusRestricted}
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
                    {st === "ALL" ? t.all : getStateName(st === "Arunachal" ? "Arunachal Pradesh" : st, lang)}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center min-w-[220px]">
                <Search className="size-3.5 text-muted-foreground absolute left-3" />
                <input
                  type="text"
                  value={districtSearchQuery}
                  onChange={(e) => setDistrictSearchQuery(e.target.value)}
                  placeholder={t.searchDistrictRoad}
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
                      <span className="font-semibold text-muted-foreground uppercase">{getStateName(dist.state, lang)}</span>
                      <span
                        className={
                          dist.status === "RESTRICTED"
                            ? "badge-status-restricted"
                            : dist.status === "WATCH"
                            ? "badge-status-advisory"
                            : "badge-status-normal"
                        }
                      >
                        {dist.status === "RESTRICTED" ? t.statusRestricted : dist.status === "WATCH" ? t.statusWatch : t.statusNormal}
                      </span>
                    </div>
                    <div className="font-bold text-base text-foreground mt-2">{getDistrictName(dist.district, lang)}</div>
                    <div className="text-xs text-primary font-mono mt-0.5">{dist.primaryHighway}</div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t.activeIncidents}</span>
                      <strong className="text-foreground">{dist.incidentCount}</strong>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t.transitDelay}</span>
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
                      <span>{t.routeToHub}</span>
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
                  {t.activeClosuresTitle}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.activeClosuresSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs"
              >
                {t.reportRoadHazard}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ACTIVE_ROAD_BLOCKAGES.map((blk) => {
                const b = getBlockageDetails(blk.id, lang, blk);
                return (
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
                          {blk.severity === "CRITICAL" ? t.critical : t.high} {t.closureBadge}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{b.updatedTime}</span>
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          {getCityName(blk.originId || "", lang)} ⟷ {getCityName(blk.destinationId || "", lang)}{" "}
                          <span className="text-xs font-normal text-muted-foreground">({b.road})</span>
                        </h2>
                        <div className="text-xs text-muted-foreground mt-1">
                          <strong>{t.spot}:</strong> {b.exactSpot} ({getStateName(blk.state, lang)})
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground">
                        <strong className="text-destructive">{t.cause}:</strong> Simulation — {b.cause}
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl border border-destructive/20 bg-destructive/5 text-foreground">
                          <span className="font-bold text-destructive">{t.avoid}: </span>
                          <span>{b.avoidInfo}</span>
                        </div>
                        <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-foreground">
                          <span className="font-bold text-primary">{t.recommendedDetourLabel}: </span>
                          <span>{b.detourRoute}</span>
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
                        <span>{t.applyDetour}</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: SYSTEM & DATA DOCUMENTATION */}
        {activeView === "system" && (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
            <div className="pb-4 border-b border-border">
              <h1 className="text-2xl font-bold text-foreground">
                {t.platformArchitecture}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {t.platformArchitectureSub}
              </p>
            </div>

            {/* Network Topology Specimen Card */}
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xs p-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                    <Database className="size-3" />
                    <span>{t.osmTopology}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground">
                    {t.northeastMultiModal}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.northeastMultiModalDesc}
                  </p>
                </div>
                <div className="md:col-span-5 rounded-xl overflow-hidden border border-border h-40 relative shadow-2xs bg-slate-950">
                  <img
                    src="/route-map-dark.png"
                    alt="Northeast Road Topology Graph"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] text-white/90 font-mono">{t.graphEdgesCaption}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Census Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-destructive">01</div>
                <div className="text-xs font-semibold text-foreground mt-1">Road-safety source register</div>
                <p className="text-xs text-muted-foreground mt-1">Only traceable MoRTH/eDAR data should be used for operational scores.</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">02</div>
                <div className="text-xs font-semibold text-foreground mt-1">Hazard coordinate review</div>
                <p className="text-xs text-muted-foreground mt-1">A report changes a route only after road-edge review and acceptance.</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-primary">111</div>
                <div className="text-xs font-semibold text-foreground mt-1">Prototype corridor nodes</div>
                <p className="text-xs text-muted-foreground mt-1">A complete OSM road graph must be versioned outside the frontend bundle.</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div className="text-2xl font-bold text-foreground">Risk-A*</div>
                <div className="text-xs font-semibold text-foreground mt-1">Versioned route comparison</div>
                <p className="text-xs text-muted-foreground mt-1">Fastest and risk-aware routes are solved by FastAPI when the service is available.</p>
              </div>
            </div>

            {/* How it works */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-foreground">{t.howEngineComputes}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                  <div className="font-bold text-foreground">{t.graphExtractionTitle}</div>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.graphExtractionDesc}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                  <div className="font-bold text-foreground">{t.costWeightingTitle}</div>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.costWeightingDesc}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                  <div className="font-bold text-foreground">{t.dualPathSolveTitle}</div>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.dualPathSolveDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl border border-border bg-secondary/40 text-xs text-muted-foreground space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Info className="size-4 text-primary" />
                <span>{t.platformScopeTitle}</span>
              </div>
              <p>
                {t.platformScopeDesc}
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
            <span className="font-semibold text-foreground">{t.footerBrandText}</span>
            <span>· {t.footerSub}</span>
          </div>
          <div>{t.footerCopyrightText}</div>
        </div>
      </footer>

      {/* DRIVER REGISTRATION MODAL */}
      {isRegistrationModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">{t.driverProfileTitle}</h2>
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
                <label className="block font-semibold text-muted-foreground mb-1">{t.driverNameLabel}</label>
                <input
                  type="text"
                  value={driverProfile.driverName}
                  onChange={(e) => setDriverProfile({ ...driverProfile, driverName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">{t.vehicleRegLabel}</label>
                <input
                  type="text"
                  value={driverProfile.vehicleNo}
                  onChange={(e) => setDriverProfile({ ...driverProfile, vehicleNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">{t.driverMobileLabel}</label>
                <input
                  type="text"
                  value={driverProfile.driverMobile}
                  onChange={(e) => setDriverProfile({ ...driverProfile, driverMobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">{t.trustedEmergencyContactLabel}</label>
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
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer shadow-xs"
                >
                  {t.saveProfileBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY SOS MODAL */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-destructive/40 bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive font-bold text-base">
                <Siren className="size-5" />
                <span>{t.emergencyDistressSos}</span>
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
                <span className="font-semibold">{t.vehicleLabel}</span>
                <span className="font-mono">{driverProfile.vehicleNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t.driverLabel}</span>
                <span>{driverProfile.driverName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t.corridorLabel}</span>
                <span>{getCityName(origin, lang)} ➔ {getCityName(destination, lang)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t.statusLabel}</span>
                <span className="text-destructive font-bold">
                  {isSosTransmitting ? t.transmittingGps : sosTransmissionSuccess ? t.dispatchedToAuthorities : t.readyToTransmit}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a
                href="tel:1078"
                className="py-2.5 px-3 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="size-3.5" />
                <span>{t.callNdrf}</span>
              </a>
              <a
                href={`tel:${driverProfile.trustedContactMobile}`}
                className="py-2.5 px-3 rounded-xl border border-border bg-secondary text-foreground flex items-center justify-center gap-1.5"
              >
                <Phone className="size-3.5" />
                <span>{t.callFleetBase}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CAMERA HAZARD REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">{t.reportHighwayHazard}</h2>
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
                  <div>{t.captureOrUpload}</div>
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
                  {t.snapPhoto}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-2 rounded-xl border border-border bg-secondary text-foreground font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera className="size-3.5" />
                  <span>{t.startCamera}</span>
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
                {t.upload}
              </button>
            </div>

            {/* Incident Details Form */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                  Hazard Classification
                </label>
                <select
                  value={reportKind}
                  onChange={(e) => setReportKind(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-medium focus:outline-none"
                >
                  <option value="landslide">Landslide / Rockfall</option>
                  <option value="flood">Monsoon Flood / Waterlogging</option>
                  <option value="road_blocked">Road Blockage / Fallen Tree</option>
                  <option value="bridge_damage">Bridge Structural Distress</option>
                  <option value="road_damage">Severe Surface Subsidence</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                  Corridor Accessibility Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReportStatus("blocked")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                      reportStatus === "blocked"
                        ? "bg-destructive text-destructive-foreground border-destructive"
                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    Blocked
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportStatus("restricted")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                      reportStatus === "restricted"
                        ? "bg-amber-500 text-black border-amber-500 font-bold"
                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    Restricted
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportStatus("open")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                      reportStatus === "open"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    Open/Caution
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                  Field Observations / Landmark
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="e.g. Mudslide near km marker 42. Single axle vehicles passing with caution."
                  className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-secondary text-foreground text-xs placeholder:text-muted-foreground focus:outline-none resize-none h-16"
                />
              </div>
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
                {t.cancelBtn}
              </button>
              <button
                type="button"
                disabled={isSubmittingReport}
                onClick={async () => {
                  setIsSubmittingReport(true);
                  stopCamera();
                  const token = sessionStorage.getItem("raahsetu_token");
                  const city = CITY_MAP[origin] || CITY_MAP["guwahati"];
                  const clientReportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

                  const payload: FieldReportInput = {
                    client_report_id: clientReportId,
                    region_code: city.state ? city.state.toLowerCase().replace(/\s+/g, "-") : "assam",
                    district: city.name,
                    place_name: `${city.name} Highway Sector`,
                    kind: reportKind,
                    accessibility_status: reportStatus,
                    severity: reportStatus === "blocked" ? 0.95 : 0.6,
                    lon: navGpsCoords?.lon || city.lon,
                    lat: navGpsCoords?.lat || city.lat,
                    description: reportDescription.trim() || `Field observation: ${reportKind.replace("_", " ")} observed on arterial route.`,
                    observed_at: new Date().toISOString(),
                    details: {
                      photo_attached: Boolean(reportPhoto),
                      photo_name: reportPhoto?.name || null,
                    },
                  };

                  try {
                    if (navigator.onLine) {
                      if (!token) throw new Error("Authenticated session required to upload field reports");
                      const report = await createFieldReport(payload, token);
                      if (reportPhoto) {
                        await uploadFieldReportAttachment(
                          token,
                          report.id,
                          dataUrlToFile(reportPhoto.dataUrl, reportPhoto.name, "image/jpeg"),
                        );
                      }
                      alert(t.hazardReportSuccess || "Hazard report submitted successfully to central monitoring!");
                    } else {
                      throw new Error("Device offline");
                    }
                  } catch {
                      await queueReport({
                        id: clientReportId,
                        payload,
                        evidence: reportPhoto
                          ? { name: reportPhoto.name, type: "image/jpeg", dataUrl: reportPhoto.dataUrl }
                          : undefined,
                        queuedAt: new Date().toISOString(),
                    });
                    const queued = await listQueuedReports();
                    setOfflineReportsCount(queued.length);
                    alert("Report securely queued in client IndexedDB. Will auto-sync when connected with an authenticated official session.");
                  } finally {
                    setIsSubmittingReport(false);
                    setIsReportModalOpen(false);
                    setReportPhoto(null);
                    setReportDescription("");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmittingReport ? "Syncing..." : t.submitHazardReport}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGIONAL ALERT CENTER */}
      {isAlertCenterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Activity className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Northeast Regional Disruption Center
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Live 8-State Highway Network Feeds, MoRTH Blackspots & Civil Defense Advisories
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAlertCenterModalOpen(false)}
                className="size-8 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl border border-border bg-secondary/40">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Network Scope</div>
                <div className="font-bold text-foreground mt-0.5">8 Northeast States</div>
                <div className="text-[10px] text-emerald-500 font-medium">100% Interconnected</div>
              </div>
              <div className="p-2.5 rounded-xl border border-border bg-secondary/40">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Graph Snapshot</div>
                <div className="font-bold text-foreground mt-0.5">111 Nodes · 378 Edges</div>
                <div className="text-[10px] text-primary font-medium">Fastest & Risk-A*</div>
              </div>
              <div className="p-2.5 rounded-xl border border-border bg-secondary/40">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Bridge Capacities</div>
                <div className="font-bold text-foreground mt-0.5">16T / 18T / 35T Limits</div>
                <div className="text-[10px] text-amber-500 font-medium">PWD & BRO Verified</div>
              </div>
              <div className="p-2.5 rounded-xl border border-border bg-secondary/40">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Fleet Telemetry</div>
                <div className="font-bold text-foreground mt-0.5">42 Active Vehicles</div>
                <div className="text-[10px] text-emerald-500 font-medium">Live GPS Connected</div>
              </div>
            </div>

            {/* Alert List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-96">
              {REGIONAL_ALERTS.map((al) => (
                <div
                  key={al.id}
                  className="p-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        al.severity === "CRITICAL"
                          ? "bg-destructive/20 text-destructive border border-destructive/30"
                          : al.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : "bg-primary/20 text-primary border border-primary/30"
                      }`}>
                        {al.severity}
                      </span>
                      <span className="font-bold text-xs text-foreground">{al.corridor}</span>
                      <span className="text-[11px] text-muted-foreground">({al.state})</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{al.timestamp}</span>
                  </div>
                  <div className="text-xs font-semibold text-foreground">{al.headline}</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{al.detail}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                    <span className="font-medium text-foreground">Affected Nodes:</span>
                    {al.affectedNodes.map((node) => (
                      <span key={node} className="px-1.5 py-0.2 rounded bg-secondary border border-border capitalize">
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-muted-foreground">
                Target data integrations: MoRTH/eDAR · GSI · CWC · approved weather feeds
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAlertCenterModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAlertCenterModalOpen(false);
                    setIsBroadcastModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  <span>Dispatch Driver Broadcast</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DRIVER DISPATCH BROADCAST SIMULATOR */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Send className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Driver Dispatch Broadcast Simulator
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Provider-Ready Gateway Simulator for Omnichannel SMS (C-DAC) & WhatsApp Business
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBroadcastModalOpen(false);
                  setBroadcastSuccessNotice(null);
                }}
                className="size-8 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Target Fleet Selector & Channel */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                    Target Fleet Corridor
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-medium focus:outline-none"
                  >
                    <option value="all">All Northeast Drivers (42 Vehicles En-Route)</option>
                    <option value="nh29">NH-29 Dimapur–Kohima Corridor (14 Vehicles)</option>
                    <option value="nh10">NH-10 Siliguri–Gangtok Corridor (8 Vehicles)</option>
                    <option value="nh13">NH-13 Arunachal Highway Corridor (9 Vehicles)</option>
                    <option value="nh6">NH-6 Assam–Meghalaya Corridor (11 Vehicles)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                    Dispatch Channel
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBroadcastChannel("sms")}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                        broadcastChannel === "sms"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      <Radio className="size-3.5" />
                      <span>SMS Gateway</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastChannel("whatsapp")}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                        broadcastChannel === "whatsapp"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      <MessageSquare className="size-3.5" />
                      <span>WhatsApp Fleet</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Multilingual Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Multilingual Broadcast Message
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setBroadcastMessage(
                          "[RAAHSETU LOGISTICS DISPATCH] Urgent: Landslide and heavy river swell verified on active corridor. Automatic Risk-A* detour recalculation pushed to vehicle console. Proceed via verified bypass."
                        )
                      }
                      className="px-1.5 py-0.5 rounded text-[10px] bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBroadcastMessage(
                          "[राहसेतु रसद चेतावनी] आवश्यक: सक्रिय कॉरिडोर पर भूस्खलन व जलभराव की पुष्टि। स्वचालित रिस्क-ए* मार्ग संशोधन आपके वाहन कंसोल पर भेजा गया। प्रमाणित बाईपास का उपयोग करें।"
                        )
                      }
                      className="px-1.5 py-0.5 rounded text-[10px] bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                    >
                      हिन्दी
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBroadcastMessage(
                          "[ৰাহসেতু সতৰ্কবাৰ্তা] জৰুৰী: সক্ৰিয় কৰিডৰত ভূমিস্খলন নিশ্চিত কৰা হৈছে। স্বয়ংক্ৰিয় সুৰক্ষিত বিকল্প পথ বাহনৰ নেভিগেশ্যনত প্ৰেৰণ কৰা হৈছে।"
                        )
                      }
                      className="px-1.5 py-0.5 rounded text-[10px] bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                    >
                      অসমীয়া
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBroadcastMessage(
                          "[রাহসেতু সতর্কবার্তা] জরুরি: সক্রিয় করিডরে ভূমিধস নিশ্চিত। স্বয়ংক্রিয় ঝুঁকিমুক্ত বিকল্প রুট ভেহিকল কনসোলে পাঠানো হয়েছে।"
                        )
                      }
                      className="px-1.5 py-0.5 rounded text-[10px] bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                    >
                      বাংলা
                    </button>
                  </div>
                </div>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none resize-none h-24 font-mono leading-relaxed"
                />
              </div>

              {/* Success Notification */}
              {broadcastSuccessNotice && (
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="size-4 shrink-0" />
                  <span>{broadcastSuccessNotice}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono">
                Simulation · Payload formatted for C-DAC & WhatsApp Cloud API
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsBroadcastModalOpen(false);
                    setBroadcastSuccessNotice(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isBroadcastTransmitting}
                  onClick={() => {
                    setIsBroadcastTransmitting(true);
                    setTimeout(() => {
                      setIsBroadcastTransmitting(false);
                      setBroadcastSuccessNotice(
                        `[Simulated Dispatch] Formatted broadcast payload dispatched to ${
                          broadcastTarget === "all" ? "42" : "14"
                        } fleet terminals via ${
                          broadcastChannel === "sms" ? "Govt C-DAC SMS Gateway" : "WhatsApp Business API"
                        }. Ready for provider webhook binding.`
                      );
                      setTimeout(() => {
                        setBroadcastSuccessNotice(null);
                      }, 5000);
                    }, 650);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isBroadcastTransmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>Transmit Fleet Broadcast</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
