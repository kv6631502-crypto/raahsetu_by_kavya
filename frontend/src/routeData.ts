export interface City {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  tier?: "major" | "town" | "small";
}

export interface Edge {
  a: string;
  b: string;
  dist: number;
  risk: number;
  note?: string;
}

export interface RouteStats {
  path: string[];
  distance: number;
  hours: number;
  riskIndex: number;
  edges: Edge[];
}

export type VehicleType = "heavy" | "standard" | "light";

export interface VehicleProfile {
  id: VehicleType;
  name: string;
  badge: string;
  speedMult: number;
  riskPenalty: number;
  description: string;
}

export const VEHICLE_PROFILES: Record<VehicleType, VehicleProfile> = {
  heavy: {
    id: "heavy",
    name: "Heavy Freight (28T)",
    badge: "28T Multi-Axle",
    speedMult: 0.85,
    riskPenalty: 0.12,
    description: "Multi-axle heavy transport. High caution on hairpin bends, steep ghats, and bridges.",
  },
  standard: {
    id: "standard",
    name: "Commercial Truck (16T)",
    badge: "16T Cargo",
    speedMult: 1.0,
    riskPenalty: 0.0,
    description: "Standard logistics carrier. Balanced hill speed and highway cruising efficiency.",
  },
  light: {
    id: "light",
    name: "Light 4x4 / Emergency",
    badge: "4x4 Utility",
    speedMult: 1.15,
    riskPenalty: -0.08,
    description: "Light cargo or emergency dispatch vehicle. Highly agile on unpaved hill tracks.",
  },
};

export type WeatherCondition = "clear" | "monsoon" | "snow";

export interface WeatherProfile {
  id: WeatherCondition;
  name: string;
  badge: string;
  speedMult: number;
  riskMult: number;
  description: string;
}

export const WEATHER_PROFILES: Record<WeatherCondition, WeatherProfile> = {
  clear: {
    id: "clear",
    name: "Clear / Dry",
    badge: "Optimal",
    speedMult: 1.0,
    riskMult: 1.0,
    description: "Fair weather conditions with nominal transit speeds and baseline road safety.",
  },
  monsoon: {
    id: "monsoon",
    name: "Monsoon Downpour",
    badge: "High Hazard",
    speedMult: 0.8,
    riskMult: 1.35,
    description: "Active monsoon rainfall. Heightened landslide susceptibility and river overflow risk.",
  },
  snow: {
    id: "snow",
    name: "Winter Freeze",
    badge: "Ice Warning",
    speedMult: 0.65,
    riskMult: 1.6,
    description: "Sub-zero conditions on high-altitude passes with black ice and snowfall slowdowns.",
  },
};

export type CommodityType = "medical" | "agro" | "pds" | "fuel" | "construction";

export interface CommodityProfile {
  id: CommodityType;
  name: string;
  badge: string;
  icon: string;
  priority: "CRITICAL" | "HIGH" | "STANDARD";
  riskToleranceMult: number; // multiplier for routing penalty
  speedPenalty: number;
  description: string;
}

export const COMMODITY_PROFILES: Record<CommodityType, CommodityProfile> = {
  medical: {
    id: "medical",
    name: "Medicines & Vaccines",
    badge: "Cold-Chain / Life Saving",
    icon: "HeartPulse",
    priority: "CRITICAL",
    riskToleranceMult: 3.5, // Extremely high penalty for landslide/mud zones
    speedPenalty: 0.05,
    description: "Temperature-sensitive pharmaceuticals & blood bank units. Zero tolerance for multi-day road chokes.",
  },
  agro: {
    id: "agro",
    name: "Agricultural & Horticulture",
    badge: "Perishable Produce",
    icon: "Apple",
    priority: "HIGH",
    riskToleranceMult: 2.2,
    speedPenalty: 0.0,
    description: "Ginger, oranges, kiwi, and farm produce from hill farmers. Rapid delivery to prevent post-harvest rot.",
  },
  pds: {
    id: "pds",
    name: "PDS Food Supply / Grains",
    badge: "Essential Commodities",
    icon: "Wheat",
    priority: "HIGH",
    riskToleranceMult: 1.8,
    speedPenalty: 0.1,
    description: "FCI buffer grain stocks and pulses for remote sub-divisional godowns. Demands bridge-safe freight routes.",
  },
  fuel: {
    id: "fuel",
    name: "POL / Petroleum & LPG",
    badge: "Hazardous Flammable",
    icon: "Flame",
    priority: "CRITICAL",
    riskToleranceMult: 3.2,
    speedPenalty: 0.15,
    description: "Bulk road petroleum tankers and cylinders. Strictly restricted from severe hairpin ghat detours.",
  },
  construction: {
    id: "construction",
    name: "Infrastructure & Cement",
    badge: "Heavy Capital Cargo",
    icon: "Building2",
    priority: "STANDARD",
    riskToleranceMult: 1.0,
    speedPenalty: 0.18,
    description: "Steel rebars, bridge trusses, and aggregates for highway and border road engineering.",
  },
};

export interface LiveWeatherReport {
  condition: WeatherCondition;
  tempC: number;
  precipitationMm: number;
  visibilityKm: number;
  roadFriction: number;
  summary: string;
  advisory: string;
  stationName: string;
}

export function getAutomaticWeatherForLocation(originId: string, destId?: string): LiveWeatherReport {
  const o = CITY_MAP[originId];
  const d = destId ? CITY_MAP[destId] : undefined;

  const isSnowZone = (id?: string) => {
    if (!id) return false;
    return ["tawang", "dirang", "bomdila", "chungthang", "mangan", "lachung", "lachen"].includes(id);
  };

  const isRainZone = (id?: string) => {
    if (!id) return false;
    const c = CITY_MAP[id];
    if (!c) return false;
    return (
      ["cherrapunji", "shillong", "jowai", "silchar", "karimganj", "haflong", "lunglei", "aizawl", "imphal", "kohima", "tuensang", "mokokchung", "mon", "churachandpur"].includes(id) ||
      c.state === "Meghalaya" ||
      c.state === "Mizoram" ||
      c.state === "Nagaland" ||
      c.state === "Manipur"
    );
  };

  if (isSnowZone(originId) || isSnowZone(destId)) {
    return {
      condition: "snow",
      tempC: -3,
      precipitationMm: 4.5,
      visibilityKm: 2.5,
      roadFriction: 0.42,
      summary: "High Altitude Sub-Zero Freeze",
      advisory: "Black ice on mountain passes (Sela / Chungthang). Strict axle weight limits & snow chains advised.",
      stationName: isSnowZone(destId) ? `${d?.name || "Pass"} Alpine Station` : `${o?.name || "Pass"} Alpine Station`,
    };
  }

  if (isRainZone(originId) || isRainZone(destId)) {
    return {
      condition: "monsoon",
      tempC: 22,
      precipitationMm: 16.5,
      visibilityKm: 6.0,
      roadFriction: 0.64,
      summary: "Monsoon Downpour & Saturated Slopes",
      advisory: "Active rainfall in hill ghat sections (NH-6 / NH-2). Heightened mudslide and hydroplaning risk.",
      stationName: `${o?.name || "Corridor"} Regional Radar`,
    };
  }

  return {
    condition: "clear",
    tempC: 28,
    precipitationMm: 0.0,
    visibilityKm: 12.0,
    roadFriction: 0.94,
    summary: "Clear & Dry Corridor",
    advisory: "Fair weather conditions with nominal highway cruising speeds and optimal braking traction.",
    stationName: `${o?.name || "Valley"} Surface Met Post`,
  };
}

export function getIntermediateCities(path: string[]): City[] {
  if (path.length <= 2) return [];
  return path.slice(1, -1).map((id) => CITY_MAP[id]).filter(Boolean);
}


export interface StrategicCorridor {
  id: string;
  title: string;
  origin: string;
  destination: string;
  tag: string;
  description: string;
}

export const STRATEGIC_CORRIDORS: StrategicCorridor[] = [
  {
    id: "corridor-tawang",
    title: "Guwahati ➔ Tawang",
    origin: "guwahati",
    destination: "tawang",
    tag: "Defense & Border Lifeline",
    description: "Climbs Bomdila & Sela Pass (13,700 ft) into western Arunachal frontier.",
  },
  {
    id: "corridor-silchar",
    title: "Shillong ➔ Silchar",
    origin: "shillong",
    destination: "silchar",
    tag: "NH-6 Hill Lifeline",
    description: "Vital freight corridor via Jowai & Sonapur tunnel to southern Assam.",
  },
  {
    id: "corridor-imphal",
    title: "Dimapur ➔ Imphal",
    origin: "dimapur",
    destination: "imphal",
    tag: "NH-2 Mountain Ridge",
    description: "Crucial interstate transit link through Kohima, Senapati & Kangpokpi.",
  },
  {
    id: "corridor-agartala",
    title: "Silchar ➔ Agartala",
    origin: "silchar",
    destination: "agartala",
    tag: "Tripura Highway",
    description: "Connects Barak Valley to Agartala via Dharmanagar & Ambassa passes.",
  },
  {
    id: "corridor-sikkim",
    title: "Gangtok ➔ Chungthang",
    origin: "gangtok",
    destination: "chungthang",
    tag: "North Sikkim Frontier",
    description: "Teesta river gorge route traversing Mangan to northern valleys.",
  },
  {
    id: "corridor-moreh",
    title: "Guwahati ➔ Moreh",
    origin: "guwahati",
    destination: "moreh",
    tag: "Trans-Asian Trade",
    description: "Full trans-regional trunk line through Assam, Nagaland & Manipur border.",
  },
];

export interface RouteLeg {
  fromId: string;
  toId: string;
  fromCity: City;
  toCity: City;
  dist: number;
  hours: number;
  risk: number;
  note?: string;
  terrainType: "Plains" | "Foothills" | "High Mountain Pass";
}

export const CITIES: City[] = [
  // --- Sikkim (8) ---
  { id: "gangtok", name: "Gangtok", state: "Sikkim", lat: 27.3389, lon: 88.6065, x: 152, y: 143, tier: "major" },
  { id: "namchi", name: "Namchi", state: "Sikkim", lat: 27.1664, lon: 88.3639, x: 118, y: 172, tier: "town" },
  { id: "pelling", name: "Pelling", state: "Sikkim", lat: 27.3167, lon: 88.2333, x: 92, y: 150, tier: "town" },
  { id: "mangan", name: "Mangan", state: "Sikkim", lat: 27.5054, lon: 88.5334, x: 168, y: 108, tier: "town" },
  { id: "rangpo", name: "Rangpo", state: "Sikkim", lat: 27.1770, lon: 88.5310, x: 144, y: 165, tier: "small" },
  { id: "singtam", name: "Singtam", state: "Sikkim", lat: 27.2370, lon: 88.4980, x: 140, y: 156, tier: "small" },
  { id: "ravangla", name: "Ravangla", state: "Sikkim", lat: 27.3050, lon: 88.3630, x: 110, y: 152, tier: "small" },
  { id: "chungthang", name: "Chungthang", state: "Sikkim", lat: 27.6040, lon: 88.6470, x: 172, y: 88, tier: "small" },

  // --- Arunachal Pradesh (16) ---
  { id: "tawang", name: "Tawang", state: "Arunachal Pradesh", lat: 27.5861, lon: 91.8594, x: 548, y: 116, tier: "town" },
  { id: "dirang", name: "Dirang", state: "Arunachal Pradesh", lat: 27.3570, lon: 92.2350, x: 574, y: 128, tier: "small" },
  { id: "bomdila", name: "Bomdila", state: "Arunachal Pradesh", lat: 27.2645, lon: 92.4159, x: 600, y: 138, tier: "town" },
  { id: "bhalukpong", name: "Bhalukpong", state: "Arunachal Pradesh", lat: 27.0120, lon: 92.6480, x: 635, y: 172, tier: "small" },
  { id: "seppa", name: "Seppa", state: "Arunachal Pradesh", lat: 27.3600, lon: 93.0300, x: 685, y: 152, tier: "small" },
  { id: "itanagar", name: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lon: 93.6053, x: 752, y: 161, tier: "major" },
  { id: "naharlagun", name: "Naharlagun", state: "Arunachal Pradesh", lat: 27.1060, lon: 93.6930, x: 735, y: 178, tier: "town" },
  { id: "ziro", name: "Ziro", state: "Arunachal Pradesh", lat: 27.5450, lon: 93.8270, x: 715, y: 132, tier: "town" },
  { id: "basar", name: "Basar", state: "Arunachal Pradesh", lat: 27.9800, lon: 94.6700, x: 830, y: 135, tier: "small" },
  { id: "aalo", name: "Aalo", state: "Arunachal Pradesh", lat: 28.1690, lon: 94.8020, x: 812, y: 116, tier: "town" },
  { id: "pasighat", name: "Pasighat", state: "Arunachal Pradesh", lat: 28.0660, lon: 95.3260, x: 862, y: 140, tier: "town" },
  { id: "roing", name: "Roing", state: "Arunachal Pradesh", lat: 28.1400, lon: 95.8300, x: 892, y: 106, tier: "town" },
  { id: "tezu", name: "Tezu", state: "Arunachal Pradesh", lat: 27.9150, lon: 96.1630, x: 924, y: 96, tier: "town" },
  { id: "namsai", name: "Namsai", state: "Arunachal Pradesh", lat: 27.6710, lon: 95.8640, x: 928, y: 128, tier: "small" },
  { id: "changlang", name: "Changlang", state: "Arunachal Pradesh", lat: 27.1260, lon: 95.7360, x: 920, y: 190, tier: "small" },
  { id: "khonsa", name: "Khonsa", state: "Arunachal Pradesh", lat: 26.9980, lon: 95.5000, x: 898, y: 200, tier: "small" },

  // --- Assam (27) ---
  { id: "dhubri", name: "Dhubri", state: "Assam", lat: 26.0207, lon: 89.9744, x: 342, y: 272, tier: "town" },
  { id: "kokrajhar", name: "Kokrajhar", state: "Assam", lat: 26.4014, lon: 90.2716, x: 368, y: 242, tier: "town" },
  { id: "bongaigaon", name: "Bongaigaon", state: "Assam", lat: 26.5023, lon: 90.5534, x: 402, y: 246, tier: "major" },
  { id: "goalpara", name: "Goalpara", state: "Assam", lat: 26.1770, lon: 90.6250, x: 410, y: 265, tier: "town" },
  { id: "barpeta", name: "Barpeta", state: "Assam", lat: 26.3216, lon: 91.0066, x: 446, y: 242, tier: "town" },
  { id: "nalbari", name: "Nalbari", state: "Assam", lat: 26.4448, lon: 91.4420, x: 482, y: 238, tier: "town" },
  { id: "rangia", name: "Rangia", state: "Assam", lat: 26.4714, lon: 91.6212, x: 508, y: 236, tier: "small" },
  { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, x: 530, y: 247, tier: "major" },
  { id: "mangaldai", name: "Mangaldai", state: "Assam", lat: 26.4447, lon: 92.0392, x: 566, y: 232, tier: "small" },
  { id: "morigaon", name: "Morigaon", state: "Assam", lat: 26.2520, lon: 92.3420, x: 575, y: 254, tier: "small" },
  { id: "nagaon", name: "Nagaon", state: "Assam", lat: 26.3464, lon: 92.6840, x: 604, y: 248, tier: "major" },
  { id: "tezpur", name: "Tezpur", state: "Assam", lat: 26.6528, lon: 92.7926, x: 656, y: 206, tier: "major" },
  { id: "hojai", name: "Hojai", state: "Assam", lat: 26.0020, lon: 92.8620, x: 630, y: 268, tier: "small" },
  { id: "diphu", name: "Diphu", state: "Assam", lat: 25.8443, lon: 93.4338, x: 672, y: 290, tier: "town" },
  { id: "haflong", name: "Haflong", state: "Assam", lat: 25.1762, lon: 93.0180, x: 670, y: 334, tier: "town" },
  { id: "bokakhat", name: "Bokakhat", state: "Assam", lat: 26.6210, lon: 93.5930, x: 712, y: 228, tier: "small" },
  { id: "golaghat", name: "Golaghat", state: "Assam", lat: 26.5239, lon: 93.9664, x: 748, y: 230, tier: "town" },
  { id: "jorhat", name: "Jorhat", state: "Assam", lat: 26.7509, lon: 94.2037, x: 792, y: 208, tier: "major" },
  { id: "lakhimpur", name: "North Lakhimpur", state: "Assam", lat: 27.2365, lon: 94.1042, x: 800, y: 170, tier: "town" },
  { id: "dhemaji", name: "Dhemaji", state: "Assam", lat: 27.4810, lon: 94.5800, x: 840, y: 155, tier: "small" },
  { id: "sivasagar", name: "Sivasagar", state: "Assam", lat: 26.9826, lon: 94.6425, x: 838, y: 184, tier: "town" },
  { id: "dibrugarh", name: "Dibrugarh", state: "Assam", lat: 27.4728, lon: 94.9120, x: 908, y: 125, tier: "major" },
  { id: "tinsukia", name: "Tinsukia", state: "Assam", lat: 27.4922, lon: 95.3468, x: 890, y: 144, tier: "major" },
  { id: "margherita", name: "Margherita", state: "Assam", lat: 27.2880, lon: 95.6820, x: 925, y: 165, tier: "small" },
  { id: "karimganj", name: "Karimganj", state: "Assam", lat: 24.8690, lon: 92.3550, x: 605, y: 382, tier: "town" },
  { id: "hailakandi", name: "Hailakandi", state: "Assam", lat: 24.6840, lon: 92.5650, x: 632, y: 395, tier: "small" },
  { id: "silchar", name: "Silchar", state: "Assam", lat: 24.8333, lon: 92.7789, x: 656, y: 365, tier: "major" },

  // --- Meghalaya (13) ---
  { id: "byrnihat", name: "Byrnihat", state: "Meghalaya", lat: 26.0580, lon: 91.8590, x: 535, y: 262, tier: "small" },
  { id: "nongpoh", name: "Nongpoh", state: "Meghalaya", lat: 25.9036, lon: 91.8800, x: 536, y: 276, tier: "town" },
  { id: "shillong", name: "Shillong", state: "Meghalaya", lat: 25.5788, lon: 91.8933, x: 545, y: 299, tier: "major" },
  { id: "cherrapunji", name: "Cherrapunji", state: "Meghalaya", lat: 25.2702, lon: 91.7323, x: 542, y: 328, tier: "town" },
  { id: "mairang", name: "Mairang", state: "Meghalaya", lat: 25.5650, lon: 91.6370, x: 508, y: 304, tier: "small" },
  { id: "nongstoin", name: "Nongstoin", state: "Meghalaya", lat: 25.5186, lon: 91.2678, x: 468, y: 308, tier: "town" },
  { id: "resubelpara", name: "Resubelpara", state: "Meghalaya", lat: 25.9080, lon: 90.5890, x: 412, y: 288, tier: "small" },
  { id: "williamnagar", name: "Williamnagar", state: "Meghalaya", lat: 25.5890, lon: 90.6210, x: 418, y: 318, tier: "small" },
  { id: "tura", name: "Tura", state: "Meghalaya", lat: 25.5144, lon: 90.2030, x: 378, y: 304, tier: "major" },
  { id: "baghmara", name: "Baghmara", state: "Meghalaya", lat: 25.1956, lon: 90.6447, x: 400, y: 348, tier: "town" },
  { id: "dawki", name: "Dawki", state: "Meghalaya", lat: 25.1870, lon: 92.0190, x: 572, y: 345, tier: "small" },
  { id: "jowai", name: "Jowai", state: "Meghalaya", lat: 25.4527, lon: 92.2132, x: 596, y: 318, tier: "town" },
  { id: "khliehriat", name: "Khliehriat", state: "Meghalaya", lat: 25.3520, lon: 92.3680, x: 618, y: 332, tier: "small" },

  // --- Nagaland (12) ---
  { id: "dimapur", name: "Dimapur", state: "Nagaland", lat: 25.9064, lon: 93.7274, x: 766, y: 269, tier: "major" },
  { id: "chumukedima", name: "Chumukedima", state: "Nagaland", lat: 25.7920, lon: 93.7740, x: 778, y: 278, tier: "small" },
  { id: "jalukie", name: "Jalukie", state: "Nagaland", lat: 25.5840, lon: 93.7320, x: 768, y: 300, tier: "small" },
  { id: "kohima", name: "Kohima", state: "Nagaland", lat: 25.6751, lon: 94.1086, x: 812, y: 290, tier: "major" },
  { id: "tseminyu", name: "Tseminyu", state: "Nagaland", lat: 25.9220, lon: 94.2080, x: 808, y: 272, tier: "small" },
  { id: "wokha", name: "Wokha", state: "Nagaland", lat: 26.0988, lon: 94.2604, x: 796, y: 262, tier: "town" },
  { id: "mokokchung", name: "Mokokchung", state: "Nagaland", lat: 26.3256, lon: 94.5204, x: 812, y: 242, tier: "town" },
  { id: "zunheboto", name: "Zunheboto", state: "Nagaland", lat: 25.9712, lon: 94.5204, x: 848, y: 272, tier: "town" },
  { id: "phek", name: "Phek", state: "Nagaland", lat: 25.6667, lon: 94.5000, x: 852, y: 312, tier: "town" },
  { id: "kiphire", name: "Kiphire", state: "Nagaland", lat: 25.8670, lon: 94.7830, x: 872, y: 290, tier: "small" },
  { id: "tuensang", name: "Tuensang", state: "Nagaland", lat: 26.2800, lon: 94.8300, x: 884, y: 250, tier: "town" },
  { id: "mon", name: "Mon", state: "Nagaland", lat: 26.7444, lon: 95.0600, x: 886, y: 212, tier: "town" },

  // --- Manipur (13) ---
  { id: "senapati", name: "Senapati", state: "Manipur", lat: 25.2673, lon: 94.0167, x: 802, y: 332, tier: "town" },
  { id: "kangpokpi", name: "Kangpokpi", state: "Manipur", lat: 25.1480, lon: 93.9710, x: 798, y: 348, tier: "small" },
  { id: "tamenglong", name: "Tamenglong", state: "Manipur", lat: 24.9860, lon: 93.4940, x: 742, y: 352, tier: "town" },
  { id: "noney", name: "Noney", state: "Manipur", lat: 24.8180, lon: 93.5980, x: 755, y: 372, tier: "small" },
  { id: "jiribam", name: "Jiribam", state: "Manipur", lat: 24.8020, lon: 93.1250, x: 700, y: 370, tier: "small" },
  { id: "imphal", name: "Imphal", state: "Manipur", lat: 24.8170, lon: 93.9368, x: 793, y: 368, tier: "major" },
  { id: "ukhrul", name: "Ukhrul", state: "Manipur", lat: 25.1167, lon: 94.3667, x: 848, y: 360, tier: "town" },
  { id: "thoubal", name: "Thoubal", state: "Manipur", lat: 24.6382, lon: 93.9996, x: 818, y: 388, tier: "town" },
  { id: "bishnupur", name: "Bishnupur", state: "Manipur", lat: 24.6297, lon: 93.7617, x: 770, y: 392, tier: "town" },
  { id: "moirang", name: "Moirang", state: "Manipur", lat: 24.4980, lon: 93.7730, x: 772, y: 405, tier: "small" },
  { id: "churachandpur", name: "Churachandpur", state: "Manipur", lat: 24.3333, lon: 93.6700, x: 745, y: 414, tier: "town" },
  { id: "kakching", name: "Kakching", state: "Manipur", lat: 24.4840, lon: 93.9800, x: 812, y: 408, tier: "small" },
  { id: "moreh", name: "Moreh", state: "Manipur", lat: 24.2480, lon: 94.3050, x: 850, y: 432, tier: "town" },

  // --- Mizoram (11) ---
  { id: "vairengte", name: "Vairengte", state: "Mizoram", lat: 24.5050, lon: 92.7620, x: 652, y: 405, tier: "small" },
  { id: "kolasib", name: "Kolasib", state: "Mizoram", lat: 24.2248, lon: 92.6784, x: 642, y: 432, tier: "town" },
  { id: "mamit", name: "Mamit", state: "Mizoram", lat: 23.9290, lon: 92.4910, x: 618, y: 448, tier: "small" },
  { id: "aizawl", name: "Aizawl", state: "Mizoram", lat: 23.7271, lon: 92.7176, x: 646, y: 464, tier: "major" },
  { id: "saitual", name: "Saitual", state: "Mizoram", lat: 23.6840, lon: 92.9730, x: 678, y: 472, tier: "small" },
  { id: "champhai", name: "Champhai", state: "Mizoram", lat: 23.4560, lon: 93.3282, x: 722, y: 470, tier: "town" },
  { id: "serchhip", name: "Serchhip", state: "Mizoram", lat: 23.3411, lon: 92.8502, x: 688, y: 492, tier: "town" },
  { id: "hnahthial", name: "Hnahthial", state: "Mizoram", lat: 23.0980, lon: 92.9290, x: 680, y: 504, tier: "small" },
  { id: "lunglei", name: "Lunglei", state: "Mizoram", lat: 22.8878, lon: 92.7397, x: 662, y: 512, tier: "major" },
  { id: "lawngtlai", name: "Lawngtlai", state: "Mizoram", lat: 22.5280, lon: 92.8980, x: 678, y: 532, tier: "small" },
  { id: "saiha", name: "Saiha", state: "Mizoram", lat: 22.4897, lon: 92.9790, x: 692, y: 540, tier: "town" },

  // --- Tripura (11) ---
  { id: "dharmanagar", name: "Dharmanagar", state: "Tripura", lat: 24.3750, lon: 92.1648, x: 548, y: 414, tier: "town" },
  { id: "kailashahar", name: "Kailashahar", state: "Tripura", lat: 24.3312, lon: 92.0075, x: 562, y: 398, tier: "town" },
  { id: "khowai", name: "Khowai", state: "Tripura", lat: 24.0620, lon: 91.6030, x: 512, y: 432, tier: "small" },
  { id: "ambassa", name: "Ambassa", state: "Tripura", lat: 23.9248, lon: 91.8497, x: 522, y: 446, tier: "town" },
  { id: "teliamura", name: "Teliamura", state: "Tripura", lat: 23.8370, lon: 91.6320, x: 502, y: 454, tier: "small" },
  { id: "agartala", name: "Agartala", state: "Tripura", lat: 23.8315, lon: 91.2868, x: 474, y: 455, tier: "major" },
  { id: "bishalgarh", name: "Bishalgarh", state: "Tripura", lat: 23.6740, lon: 91.2720, x: 470, y: 472, tier: "small" },
  { id: "udaipur", name: "Udaipur", state: "Tripura", lat: 23.5337, lon: 91.4886, x: 490, y: 488, tier: "town" },
  { id: "santirbazar", name: "Santirbazar", state: "Tripura", lat: 23.3080, lon: 91.5620, x: 500, y: 506, tier: "small" },
  { id: "belonia", name: "Belonia", state: "Tripura", lat: 23.2530, lon: 91.4550, x: 486, y: 518, tier: "town" },
  { id: "sabroom", name: "Sabroom", state: "Tripura", lat: 23.0030, lon: 91.7160, x: 515, y: 534, tier: "small" },
];

export const EDGES: Edge[] = [
  // Sikkim
  { a: "gangtok", b: "namchi", dist: 78, risk: 0.5 },
  { a: "namchi", b: "pelling", dist: 55, risk: 0.6 },
  { a: "gangtok", b: "mangan", dist: 65, risk: 0.75, note: "North Sikkim road — landslide-prone" },
  { a: "gangtok", b: "singtam", dist: 28, risk: 0.35 },
  { a: "singtam", b: "rangpo", dist: 12, risk: 0.35, note: "NH-10 Teesta gorge — monsoon vulnerable" },
  { a: "singtam", b: "namchi", dist: 32, risk: 0.4 },
  { a: "namchi", b: "ravangla", dist: 26, risk: 0.45 },
  { a: "ravangla", b: "pelling", dist: 35, risk: 0.5 },
  { a: "mangan", b: "chungthang", dist: 30, risk: 0.8, note: "North Sikkim high mountain road — flash floods" },
  { a: "rangpo", b: "namchi", dist: 45, risk: 0.45 },
  { a: "rangpo", b: "guwahati", dist: 530, risk: 0.4 },
  { a: "gangtok", b: "guwahati", dist: 560, risk: 0.4 },

  // Assam Western & Central
  { a: "guwahati", b: "tezpur", dist: 180, risk: 0.2 },
  { a: "guwahati", b: "nagaon", dist: 120, risk: 0.2 },
  { a: "nagaon", b: "tezpur", dist: 110, risk: 0.25 },
  { a: "nagaon", b: "jorhat", dist: 175, risk: 0.25 },
  { a: "jorhat", b: "golaghat", dist: 55, risk: 0.2 },
  { a: "jorhat", b: "sivasagar", dist: 60, risk: 0.2 },
  { a: "jorhat", b: "dibrugarh", dist: 135, risk: 0.2 },
  { a: "sivasagar", b: "dibrugarh", dist: 80, risk: 0.2 },
  { a: "dibrugarh", b: "tinsukia", dist: 50, risk: 0.2 },
  { a: "tezpur", b: "dibrugarh", dist: 300, risk: 0.3 },
  { a: "guwahati", b: "rangia", dist: 40, risk: 0.18 },
  { a: "rangia", b: "nalbari", dist: 30, risk: 0.18 },
  { a: "guwahati", b: "nalbari", dist: 65, risk: 0.2 },
  { a: "nalbari", b: "barpeta", dist: 40, risk: 0.2 },
  { a: "barpeta", b: "bongaigaon", dist: 60, risk: 0.2 },
  { a: "bongaigaon", b: "kokrajhar", dist: 35, risk: 0.2 },
  { a: "kokrajhar", b: "dhubri", dist: 65, risk: 0.25 },
  { a: "bongaigaon", b: "dhubri", dist: 90, risk: 0.3 },
  { a: "bongaigaon", b: "goalpara", dist: 45, risk: 0.25, note: "Naranarayan Setu bridge crossing" },
  { a: "goalpara", b: "dhubri", dist: 60, risk: 0.25 },
  { a: "goalpara", b: "guwahati", dist: 130, risk: 0.2, note: "NH-17 South Bank route" },
  { a: "goalpara", b: "resubelpara", dist: 40, risk: 0.35 },
  { a: "rangia", b: "mangaldai", dist: 50, risk: 0.22 },
  { a: "guwahati", b: "mangaldai", dist: 65, risk: 0.2 },
  { a: "mangaldai", b: "tezpur", dist: 115, risk: 0.25, note: "NH-15 North Bank corridor" },
  { a: "guwahati", b: "morigaon", dist: 75, risk: 0.2 },
  { a: "morigaon", b: "nagaon", dist: 45, risk: 0.2 },
  { a: "nagaon", b: "hojai", dist: 55, risk: 0.22 },
  { a: "hojai", b: "diphu", dist: 50, risk: 0.3 },
  { a: "nagaon", b: "bokakhat", dist: 110, risk: 0.3, note: "Kaziranga animal corridor speed restrictions" },
  { a: "bokakhat", b: "golaghat", dist: 40, risk: 0.2 },
  { a: "bokakhat", b: "jorhat", dist: 65, risk: 0.2 },
  { a: "jorhat", b: "lakhimpur", dist: 90, risk: 0.45, note: "Brahmaputra crossing — monsoon delays" },
  { a: "lakhimpur", b: "dhemaji", dist: 45, risk: 0.4, note: "Subansiri basin — flood alert area" },
  { a: "dhemaji", b: "dibrugarh", dist: 70, risk: 0.35, note: "Bogibeel bridge rail-road crossing" },
  { a: "dhemaji", b: "pasighat", dist: 80, risk: 0.45 },
  { a: "tinsukia", b: "margherita", dist: 45, risk: 0.25 },
  { a: "margherita", b: "changlang", dist: 50, risk: 0.55 },
  { a: "margherita", b: "khonsa", dist: 55, risk: 0.6 },
  { a: "nagaon", b: "diphu", dist: 100, risk: 0.5 },
  { a: "diphu", b: "dimapur", dist: 100, risk: 0.5 },
  { a: "diphu", b: "haflong", dist: 120, risk: 0.65, note: "Barail hill range — monsoon landslips" },
  { a: "haflong", b: "silchar", dist: 95, risk: 0.6, note: "NH-27 Mahur-Jatinga hill stretch" },
  { a: "diphu", b: "silchar", dist: 200, risk: 0.65, note: "Karbi Anglong hills — closures" },
  { a: "guwahati", b: "silchar", dist: 300, risk: 0.68, note: "NH-6 Meghalaya stretch — closures" },
  { a: "karimganj", b: "silchar", dist: 50, risk: 0.25 },
  { a: "karimganj", b: "hailakandi", dist: 40, risk: 0.25 },
  { a: "hailakandi", b: "silchar", dist: 35, risk: 0.22 },
  { a: "karimganj", b: "dharmanagar", dist: 55, risk: 0.35 },

  // Arunachal Pradesh
  { a: "tezpur", b: "bhalukpong", dist: 60, risk: 0.35 },
  { a: "bhalukpong", b: "bomdila", dist: 100, risk: 0.65, note: "Tenga valley climb" },
  { a: "bomdila", b: "dirang", dist: 40, risk: 0.5 },
  { a: "dirang", b: "tawang", dist: 140, risk: 0.85, note: "Sela Pass summit (13,700 ft) — icy conditions" },
  { a: "bomdila", b: "tawang", dist: 180, risk: 0.85, note: "Sela Pass — snowfall & slides" },
  { a: "bhalukpong", b: "seppa", dist: 110, risk: 0.7, note: "Kameng river gorge" },
  { a: "seppa", b: "itanagar", dist: 120, risk: 0.65 },
  { a: "tezpur", b: "bomdila", dist: 160, risk: 0.7 },
  { a: "tezpur", b: "itanagar", dist: 90, risk: 0.5 },
  { a: "itanagar", b: "naharlagun", dist: 15, risk: 0.2 },
  { a: "lakhimpur", b: "itanagar", dist: 70, risk: 0.4 },
  { a: "itanagar", b: "ziro", dist: 110, risk: 0.7 },
  { a: "ziro", b: "aalo", dist: 190, risk: 0.75, note: "remote Arunachal hill track" },
  { a: "aalo", b: "basar", dist: 50, risk: 0.6 },
  { a: "basar", b: "lakhimpur", dist: 110, risk: 0.55 },
  { a: "aalo", b: "pasighat", dist: 100, risk: 0.6 },
  { a: "pasighat", b: "dibrugarh", dist: 150, risk: 0.5 },
  { a: "dibrugarh", b: "roing", dist: 100, risk: 0.5 },
  { a: "roing", b: "tezu", dist: 60, risk: 0.6 },
  { a: "roing", b: "namsai", dist: 75, risk: 0.45 },
  { a: "tezu", b: "namsai", dist: 45, risk: 0.4 },
  { a: "namsai", b: "tinsukia", dist: 70, risk: 0.35 },
  { a: "tinsukia", b: "tezu", dist: 80, risk: 0.5 },
  { a: "changlang", b: "khonsa", dist: 70, risk: 0.7, note: "Tirap frontier hill track" },
  { a: "khonsa", b: "sivasagar", dist: 85, risk: 0.65 },

  // Meghalaya
  { a: "guwahati", b: "byrnihat", dist: 25, risk: 0.2 },
  { a: "byrnihat", b: "nongpoh", dist: 30, risk: 0.25 },
  { a: "guwahati", b: "nongpoh", dist: 55, risk: 0.3 },
  { a: "nongpoh", b: "shillong", dist: 50, risk: 0.3 },
  { a: "guwahati", b: "shillong", dist: 100, risk: 0.25 },
  { a: "shillong", b: "mairang", dist: 40, risk: 0.3 },
  { a: "mairang", b: "nongstoin", dist: 45, risk: 0.35 },
  { a: "shillong", b: "nongstoin", dist: 80, risk: 0.4 },
  { a: "nongstoin", b: "williamnagar", dist: 95, risk: 0.55, note: "Central Garo-Khasi hills link" },
  { a: "williamnagar", b: "tura", dist: 70, risk: 0.4 },
  { a: "williamnagar", b: "resubelpara", dist: 60, risk: 0.4 },
  { a: "resubelpara", b: "tura", dist: 85, risk: 0.4 },
  { a: "williamnagar", b: "baghmara", dist: 75, risk: 0.5 },
  { a: "nongstoin", b: "tura", dist: 130, risk: 0.5 },
  { a: "guwahati", b: "tura", dist: 220, risk: 0.4 },
  { a: "tura", b: "baghmara", dist: 110, risk: 0.5 },
  { a: "shillong", b: "cherrapunji", dist: 55, risk: 0.4 },
  { a: "cherrapunji", b: "dawki", dist: 45, risk: 0.5, note: "Southern escarpment gorges" },
  { a: "shillong", b: "dawki", dist: 70, risk: 0.4 },
  { a: "dawki", b: "jowai", dist: 40, risk: 0.35 },
  { a: "shillong", b: "jowai", dist: 65, risk: 0.35 },
  { a: "jowai", b: "khliehriat", dist: 40, risk: 0.4 },
  { a: "khliehriat", b: "silchar", dist: 130, risk: 0.68, note: "NH-6 Sonapur tunnel — landslide prone" },
  { a: "jowai", b: "silchar", dist: 170, risk: 0.6 },
  { a: "shillong", b: "silchar", dist: 240, risk: 0.6 },

  // Nagaland
  { a: "guwahati", b: "dimapur", dist: 280, risk: 0.3 },
  { a: "golaghat", b: "dimapur", dist: 90, risk: 0.3 },
  { a: "dimapur", b: "chumukedima", dist: 15, risk: 0.2 },
  { a: "chumukedima", b: "kohima", dist: 60, risk: 0.6, note: "Chumukedima-Phesama rockfall zone" },
  { a: "dimapur", b: "kohima", dist: 75, risk: 0.6, note: "NH-2 hill section — frequent slips" },
  { a: "dimapur", b: "jalukie", dist: 55, risk: 0.4 },
  { a: "jalukie", b: "kohima", dist: 65, risk: 0.55 },
  { a: "kohima", b: "tseminyu", dist: 45, risk: 0.5 },
  { a: "tseminyu", b: "wokha", dist: 35, risk: 0.5 },
  { a: "kohima", b: "wokha", dist: 80, risk: 0.55 },
  { a: "wokha", b: "mokokchung", dist: 60, risk: 0.6 },
  { a: "dimapur", b: "mokokchung", dist: 130, risk: 0.6 },
  { a: "kohima", b: "zunheboto", dist: 150, risk: 0.7 },
  { a: "kohima", b: "phek", dist: 90, risk: 0.7 },
  { a: "phek", b: "kiphire", dist: 80, risk: 0.7 },
  { a: "kiphire", b: "tuensang", dist: 70, risk: 0.75, note: "Eastern ridge — heavy monsoon ruts" },
  { a: "mokokchung", b: "tuensang", dist: 120, risk: 0.75, note: "eastern Nagaland — rough terrain" },
  { a: "mokokchung", b: "mon", dist: 140, risk: 0.75, note: "remote hill roads" },
  { a: "tuensang", b: "mon", dist: 90, risk: 0.75 },

  // Manipur
  { a: "kohima", b: "senapati", dist: 60, risk: 0.7 },
  { a: "senapati", b: "kangpokpi", dist: 30, risk: 0.5 },
  { a: "kangpokpi", b: "imphal", dist: 45, risk: 0.4 },
  { a: "senapati", b: "imphal", dist: 60, risk: 0.5 },
  { a: "kohima", b: "imphal", dist: 130, risk: 0.9, note: "NH-2 — chronic landslide blockages" },
  { a: "dimapur", b: "imphal", dist: 240, risk: 0.35 },
  { a: "silchar", b: "jiribam", dist: 50, risk: 0.35 },
  { a: "jiribam", b: "noney", dist: 90, risk: 0.6, note: "Makru & Barak river hill bypass" },
  { a: "noney", b: "imphal", dist: 55, risk: 0.5, note: "NH-37 mountain corridor" },
  { a: "noney", b: "tamenglong", dist: 45, risk: 0.65 },
  { a: "tamenglong", b: "senapati", dist: 80, risk: 0.7 },
  { a: "silchar", b: "imphal", dist: 210, risk: 0.55 },
  { a: "imphal", b: "ukhrul", dist: 80, risk: 0.7 },
  { a: "imphal", b: "thoubal", dist: 25, risk: 0.3 },
  { a: "thoubal", b: "kakching", dist: 25, risk: 0.2 },
  { a: "kakching", b: "moreh", dist: 70, risk: 0.55, note: "Trans-Asian Highway to Myanmar border" },
  { a: "moreh", b: "thoubal", dist: 85, risk: 0.55 },
  { a: "imphal", b: "bishnupur", dist: 30, risk: 0.3 },
  { a: "bishnupur", b: "moirang", dist: 15, risk: 0.2 },
  { a: "moirang", b: "churachandpur", dist: 20, risk: 0.3 },
  { a: "bishnupur", b: "churachandpur", dist: 30, risk: 0.4 },

  // Mizoram
  { a: "silchar", b: "vairengte", dist: 45, risk: 0.35 },
  { a: "vairengte", b: "kolasib", dist: 65, risk: 0.45 },
  { a: "silchar", b: "kolasib", dist: 110, risk: 0.5 },
  { a: "kolasib", b: "aizawl", dist: 80, risk: 0.45 },
  { a: "vairengte", b: "mamit", dist: 80, risk: 0.55 },
  { a: "mamit", b: "aizawl", dist: 90, risk: 0.5 },
  { a: "silchar", b: "aizawl", dist: 180, risk: 0.5 },
  { a: "aizawl", b: "saitual", dist: 75, risk: 0.45 },
  { a: "saitual", b: "champhai", dist: 115, risk: 0.65 },
  { a: "aizawl", b: "champhai", dist: 190, risk: 0.7, note: "eastern hill frontier road" },
  { a: "aizawl", b: "serchhip", dist: 110, risk: 0.55 },
  { a: "serchhip", b: "champhai", dist: 90, risk: 0.6 },
  { a: "serchhip", b: "hnahthial", dist: 50, risk: 0.5 },
  { a: "hnahthial", b: "lunglei", dist: 45, risk: 0.5 },
  { a: "serchhip", b: "lunglei", dist: 60, risk: 0.5 },
  { a: "aizawl", b: "lunglei", dist: 165, risk: 0.6 },
  { a: "lunglei", b: "lawngtlai", dist: 70, risk: 0.6 },
  { a: "lawngtlai", b: "saiha", dist: 100, risk: 0.65, note: "Chhimtuipui river valley route" },
  { a: "lunglei", b: "saiha", dist: 170, risk: 0.7 },
  { a: "churachandpur", b: "aizawl", dist: 230, risk: 0.7, note: "inter-state hill border road" },

  // Tripura
  { a: "silchar", b: "agartala", dist: 260, risk: 0.45 },
  { a: "silchar", b: "dharmanagar", dist: 100, risk: 0.45 },
  { a: "dharmanagar", b: "kailashahar", dist: 40, risk: 0.4 },
  { a: "dharmanagar", b: "ambassa", dist: 80, risk: 0.4 },
  { a: "kailashahar", b: "khowai", dist: 75, risk: 0.4 },
  { a: "ambassa", b: "teliamura", dist: 40, risk: 0.35 },
  { a: "teliamura", b: "khowai", dist: 30, risk: 0.3 },
  { a: "teliamura", b: "agartala", dist: 45, risk: 0.25 },
  { a: "ambassa", b: "agartala", dist: 80, risk: 0.35 },
  { a: "agartala", b: "bishalgarh", dist: 22, risk: 0.2 },
  { a: "bishalgarh", b: "udaipur", dist: 33, risk: 0.2 },
  { a: "agartala", b: "udaipur", dist: 55, risk: 0.3 },
  { a: "udaipur", b: "santirbazar", dist: 30, risk: 0.25 },
  { a: "santirbazar", b: "belonia", dist: 25, risk: 0.25 },
  { a: "udaipur", b: "belonia", dist: 55, risk: 0.3 },
  { a: "santirbazar", b: "sabroom", dist: 40, risk: 0.25 },
  { a: "belonia", b: "sabroom", dist: 35, risk: 0.25 },
  { a: "aizawl", b: "agartala", dist: 250, risk: 0.5 },
];

export const CITY_MAP: Record<string, City> = Object.fromEntries(
  CITIES.map((c) => [c.id, c])
);

export const ADJACENCY: Record<string, Edge[]> = {};
for (const city of CITIES) ADJACENCY[city.id] = [];
for (const edge of EDGES) {
  ADJACENCY[edge.a].push(edge);
  ADJACENCY[edge.b].push(edge);
}

export function speed(
  baseRisk: number,
  vehicle: VehicleType = "standard",
  weather: WeatherCondition = "clear"
): number {
  const vProfile = VEHICLE_PROFILES[vehicle];
  const wProfile = WEATHER_PROFILES[weather];
  const adjustedRisk = Math.min(0.98, Math.max(0.05, baseRisk * wProfile.riskMult + vProfile.riskPenalty));
  const baseSpd = 55 - 14 * adjustedRisk;
  return Math.max(18, baseSpd * vProfile.speedMult * wProfile.speedMult);
}

export function getAdjustedEdgeRisk(
  edge: Edge,
  vehicle: VehicleType = "standard",
  weather: WeatherCondition = "clear"
): number {
  const vProfile = VEHICLE_PROFILES[vehicle];
  const wProfile = WEATHER_PROFILES[weather];
  let mult = wProfile.riskMult;

  // Extra weather penalties on mountain passes
  if (weather === "snow" && edge.note && (edge.note.includes("Sela Pass") || edge.note.includes("mountain"))) {
    mult *= 1.4;
  }
  if (weather === "monsoon" && edge.note && (edge.note.includes("landslide") || edge.note.includes("slips") || edge.note.includes("gorge"))) {
    mult *= 1.25;
  }

  const r = edge.risk * mult + vProfile.riskPenalty;
  return Math.min(0.99, Math.max(0.05, r));
}

export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestCity(
  lat: number,
  lon: number
): { city: City; distanceKm: number } {
  let nearest = CITIES[0];
  let minDistance = Infinity;

  for (const city of CITIES) {
    const d = haversineDistanceKm(lat, lon, city.lat, city.lon);
    if (d < minDistance) {
      minDistance = d;
      nearest = city;
    }
  }

  return { city: nearest, distanceKm: Math.round(minDistance * 10) / 10 };
}

export function projectGeoToSvg(lat: number, lon: number): { x: number; y: number } {
  // Calibrated projection for Northeast India SVG viewBox (1000 x 560)
  const x = Math.round(530 + (lon - 91.7362) * 121);
  const y = Math.round(247 + (26.1445 - lat) * 87);
  return {
    x: Math.max(20, Math.min(980, x)),
    y: Math.max(20, Math.min(540, y)),
  };
}

export function solvePath(
  start: string,
  end: string,
  costFn: (edge: Edge) => number
): string[] | null {
  const dist: Record<string, number> = {};
  const prev: Record<string, string> = {};
  const visited = new Set<string>();

  for (const city of CITIES) dist[city.id] = Infinity;
  dist[start] = 0;

  while (visited.size < CITIES.length) {
    let curr: string | null = null;
    let minCost = Infinity;

    for (const city of CITIES) {
      if (!visited.has(city.id) && dist[city.id] < minCost) {
        minCost = dist[city.id];
        curr = city.id;
      }
    }

    if (curr === null || (visited.add(curr), curr === end)) break;

    for (const edge of ADJACENCY[curr]) {
      const neighbor = edge.a === curr ? edge.b : edge.a;
      if (visited.has(neighbor)) continue;
      const alt = dist[curr] + costFn(edge);
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = curr;
      }
    }
  }

  if (dist[end] === Infinity) return null;

  const path: string[] = [];
  let u: string | undefined = end;
  while (u !== undefined && (path.unshift(u), u !== start)) {
    u = prev[u];
  }
  return path[0] === start ? path : null;
}

export function computeStats(
  path: string[],
  vehicle: VehicleType = "standard",
  weather: WeatherCondition = "clear"
): RouteStats {
  let distance = 0;
  let hours = 0;
  let weightedRisk = 0;
  const edges: Edge[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const edge = EDGES.find(
      (e) => (e.a === a && e.b === b) || (e.a === b && e.b === a)
    )!;
    edges.push(edge);
    distance += edge.dist;
    const effRisk = getAdjustedEdgeRisk(edge, vehicle, weather);
    const effSpeed = speed(edge.risk, vehicle, weather);
    hours += edge.dist / effSpeed;
    weightedRisk += effRisk * edge.dist;
  }

  const riskIndex = distance ? Math.round((weightedRisk / distance) * 100) : 0;
  return { path, distance, hours, riskIndex, edges };
}

export function getRouteLegs(
  path: string[],
  vehicle: VehicleType = "standard",
  weather: WeatherCondition = "clear"
): RouteLeg[] {
  const legs: RouteLeg[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const fromCity = CITY_MAP[a];
    const toCity = CITY_MAP[b];
    const edge = EDGES.find(
      (e) => (e.a === a && e.b === b) || (e.a === b && e.b === a)
    )!;
    const effRisk = getAdjustedEdgeRisk(edge, vehicle, weather);
    const effSpeed = speed(edge.risk, vehicle, weather);
    const legHours = edge.dist / effSpeed;

    let terrainType: "Plains" | "Foothills" | "High Mountain Pass" = "Plains";
    if (edge.note && (edge.note.includes("Pass") || edge.note.includes("high mountain") || edge.note.includes("13,700"))) {
      terrainType = "High Mountain Pass";
    } else if (
      edge.risk > 0.4 ||
      fromCity.state !== "Assam" ||
      toCity.state !== "Assam" ||
      fromCity.id === "haflong" ||
      toCity.id === "haflong"
    ) {
      terrainType = "Foothills";
    }

    legs.push({
      fromId: a,
      toId: b,
      fromCity,
      toCity,
      dist: edge.dist,
      hours: legHours,
      risk: Math.round(effRisk * 100),
      note: edge.note,
      terrainType,
    });
  }
  return legs;
}

export function formatHours(hours: number): string {
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export function toPolylinePoints(path: string[]): string {
  return path.map((id) => `${CITY_MAP[id].x},${CITY_MAP[id].y}`).join(" ");
}

export interface RegionalAlert {
  id: string;
  corridor: string;
  state: string;
  severity: "CRITICAL" | "HIGH" | "ADVISORY";
  category: "Landslide" | "Flood / Overflow" | "Snow / Ice" | "Bridge Structural" | "Ghat Slip";
  headline: string;
  detail: string;
  affectedNodes: string[];
  timestamp: string;
}

export const REGIONAL_ALERTS: RegionalAlert[] = [
  {
    id: "ALT-NH29-01",
    corridor: "NH-29 Dimapur – Kohima Stretch",
    state: "Nagaland",
    severity: "CRITICAL",
    category: "Landslide",
    headline: "Active Mudslide at Pagla Pahar – Single Lane Convoy Only",
    detail: "Heavy hill seepage triggered boulder displacement at km 124. Heavy multi-axle freight queued; light medical vehicles escorted on priority.",
    affectedNodes: ["dimapur", "kohima"],
    timestamp: "18 mins ago",
  },
  {
    id: "ALT-NH13-02",
    corridor: "NH-13 Bhalukpong – Bomdila – Sela Pass",
    state: "Arunachal Pradesh",
    severity: "HIGH",
    category: "Snow / Ice",
    headline: "Black Ice & Freezing Mist near Sela Pass (13,700 ft)",
    detail: "Sub-zero temperatures causing black ice between Baisakhi and Sela top. Anti-skid chains mandatory for 16T+ freight vehicles.",
    affectedNodes: ["bomdila", "dirang", "tawang"],
    timestamp: "42 mins ago",
  },
  {
    id: "ALT-NH10-03",
    corridor: "NH-10 Sevoke – Teesta Bazaar – Gangtok",
    state: "Sikkim",
    severity: "CRITICAL",
    category: "Ghat Slip",
    headline: "Teesta River Swell & Road Sinking at 29th Mile",
    detail: "Water levels breaching edge barrier. Freight transit redirected via Lava / Algarah alternate corridor.",
    affectedNodes: ["siliguri", "rangpo", "gangtok"],
    timestamp: "1 hour ago",
  },
  {
    id: "ALT-NH6-04",
    corridor: "NH-6 Jorabat – Nongpoh – Shillong",
    state: "Meghalaya",
    severity: "ADVISORY",
    category: "Flood / Overflow",
    headline: "Dense Monsoon Fog & Visibility Sub-50m at Umsning",
    detail: "Reduced cruising speed across Khasi Hills descent. Fog beacons activated at toll plazas.",
    affectedNodes: ["guwahati", "nongpoh", "shillong"],
    timestamp: "2 hours ago",
  },
  {
    id: "ALT-NH306-05",
    corridor: "NH-306 Silchar – Vairengte – Aizawl",
    state: "Mizoram",
    severity: "HIGH",
    category: "Ghat Slip",
    headline: "Cachar-Kolasib Border Hairpin Subsidence",
    detail: "Temporary Bailey bridge active with 18-tonne load ceiling. 28T heavy trucks instructed to stage at Dholai logistics depot.",
    affectedNodes: ["silchar", "kolasib", "aizawl"],
    timestamp: "3 hours ago",
  },
];

export interface DistrictStatus {
  district: string;
  state: string;
  status: "NORMAL" | "WATCH" | "RESTRICTED";
  primaryHighway: string;
  incidentCount: number;
  delayAvgMinutes: number;
  hubId: string;
}

export const DISTRICT_CONNECTIVITY: DistrictStatus[] = [
  { district: "Kamrup Metropolitan", state: "Assam", status: "NORMAL", primaryHighway: "NH-27 / NH-6", incidentCount: 0, delayAvgMinutes: 0, hubId: "guwahati" },
  { district: "Tawang & West Kameng", state: "Arunachal Pradesh", status: "RESTRICTED", primaryHighway: "NH-13 Trans-Arunachal", incidentCount: 2, delayAvgMinutes: 145, hubId: "tawang" },
  { district: "East Khasi Hills", state: "Meghalaya", status: "WATCH", primaryHighway: "NH-6 Shillong Corridor", incidentCount: 1, delayAvgMinutes: 35, hubId: "shillong" },
  { district: "Kohima & Dimapur", state: "Nagaland", status: "RESTRICTED", primaryHighway: "NH-29 Lifeline", incidentCount: 3, delayAvgMinutes: 210, hubId: "kohima" },
  { district: "Imphal West", state: "Manipur", status: "WATCH", primaryHighway: "NH-2 / NH-37", incidentCount: 1, delayAvgMinutes: 50, hubId: "imphal" },
  { district: "Aizawl & Kolasib", state: "Mizoram", status: "WATCH", primaryHighway: "NH-306", incidentCount: 1, delayAvgMinutes: 65, hubId: "aizawl" },
  { district: "West Tripura", state: "Tripura", status: "NORMAL", primaryHighway: "NH-8", incidentCount: 0, delayAvgMinutes: 10, hubId: "agartala" },
  { district: "East Sikkim", state: "Sikkim", status: "RESTRICTED", primaryHighway: "NH-10 Teesta Corridor", incidentCount: 2, delayAvgMinutes: 180, hubId: "gangtok" },
];

export type SupportedLanguage = "en" | "hi" | "as" | "bn";

export const UI_TRANSLATIONS: Record<SupportedLanguage, {
  tagline: string;
  heroBadge: string;
  plannerTitle: string;
  cargoTitle: string;
  vehicleTitle: string;
  safeRoute: string;
  fastestRoute: string;
  whyRoute: string;
  reportIncident: string;
  districtMatrix: string;
  earlyAlerts: string;
  offlineReady: string;
}> = {
  en: {
    tagline: "Explainable Logistics Routing for Northeast India",
    heroBadge: "AI-Powered Regional Logistics Intelligence",
    plannerTitle: "Northeast Multi-Modal Route Dispatch",
    cargoTitle: "Essential Commodity Cargo Priority",
    vehicleTitle: "Vehicle Dispatch Profile",
    safeRoute: "Safe Risk-Aware Route",
    fastestRoute: "Fastest Direct Corridor",
    whyRoute: "Why this route was selected",
    reportIncident: "Report Road Incident / Hazard",
    districtMatrix: "District Connectivity Status",
    earlyAlerts: "NER Early-Warning Disruption Feed",
    offlineReady: "Offline Resilient Network",
  },
  hi: {
    tagline: "पूर्वोत्तर भारत के लिए व्याख्यात्मक लॉजिस्टिक्स रूटिंग",
    heroBadge: "एआई-संचालित क्षेत्रीय लॉजिस्टिक्स इंटेलिजेंस",
    plannerTitle: "पूर्वोत्तर मल्टी-मॉडल रूट डिस्पैच",
    cargoTitle: "आवश्यक वस्तु कार्गो प्राथमिकता",
    vehicleTitle: "वाहन प्रेषण प्रोफ़ाइल",
    safeRoute: "सुरक्षित जोखिम-जागरूक मार्ग",
    fastestRoute: "सबसे तेज़ सीधा गलियारा",
    whyRoute: "यह मार्ग क्यों चुना गया",
    reportIncident: "सड़क दुर्घटना / भूस्खलन की रिपोर्ट करें",
    districtMatrix: "जिला-वार कनेक्टिविटी स्थिति",
    earlyAlerts: "पूर्वोत्तर पूर्व-चेतावनी व्यवधान फ़ीड",
    offlineReady: "ऑफ़लाइन सुरक्षित नेटवर्क",
  },
  as: {
    tagline: "উত্তৰ-পূব ভাৰতৰ বাবে ব্যাখ্যাযোগ্য লজিষ্টিক ৰুটিং ব্যৱস্থা",
    heroBadge: "কৃটিম বুদ্ধিমত্তা চালিত আঞ্চলিক লজিষ্টিক বুদ্ধিমত্তা",
    plannerTitle: "উত্তৰ-পূব মাল্টি-মডেল পথ পৰিকল্পনা",
    cargoTitle: "অত্যাৱশ্যকীয় সামগ্ৰীৰ অগ্ৰাধিকাৰ",
    vehicleTitle: "যান-বাহন প্রেৰণ প্ৰ’ফাইল",
    safeRoute: "সুৰক্ষিত বিপদ-সচেতন পথ",
    fastestRoute: "দ্ৰুততম পোনপটীয়া পথ",
    whyRoute: "এই পথটো কিয় নিৰ্বাচন কৰা হ'ল",
    reportIncident: "পথ অৱৰোধ / ভূমিস্খলন ৰিপৰ্ট কৰক",
    districtMatrix: "জিলা-ভিত্তিক সংযোগ স্থিতি",
    earlyAlerts: "উত্তৰ-পূব আগতীয়া সতৰ্কবাৰ্তা ফীড",
    offlineReady: "অফলাইন সুৰক্ষিত নেটৱৰ্ক",
  },
  bn: {
    tagline: "উত্তর-পূর্ব ভারতের জন্য ব্যাখ্যামূলক লজিস্টিক রাউটিং",
    heroBadge: "এআই-চালিত আঞ্চলিক লজিস্টিক ইন্টেলিজেন্স",
    plannerTitle: "উত্তর-পূর্ব মাল্টি-মোডাল রুট ডিসপ্যাচ",
    cargoTitle: "প্রয়োজনীয় পণ্য কার্গো অগ্রাধিকার",
    vehicleTitle: "যানবাহন ডিসপ্যাচ প্রোফাইল",
    safeRoute: "নিরাপদ ঝুঁকি-সচেতন রুট",
    fastestRoute: "দ্রুততম সরাসরি করিডোর",
    whyRoute: "এই রুটটি কেন নির্বাচিত হলো",
    reportIncident: "সড়ক দুর্ঘটনা / ধসের রিপোর্ট করুন",
    districtMatrix: "জেলা-ভিত্তিক সংযোগ অবস্থা",
    earlyAlerts: "উত্তর-পূর্ব প্রাথমিক সতর্কতা ফিড",
    offlineReady: "অফলাইন নির্ভরযোগ্য নেটওয়ার্ক",
  },
};
