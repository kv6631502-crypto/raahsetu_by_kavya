export type SupportedLanguage = "en" | "hi" | "as" | "bn";

export interface Translations {
  // Brand & Header
  brandName: string;
  brandSubtitle: string;
  navOverview: string;
  navDispatcher: string;
  navDistricts: string;
  navArchitecture: string;
  navSignIn: string;
  navAccount: string;
  navSignOut: string;
  emergencySos: string;
  autoDetected: string;
  selectLanguage: string;
  lightMode: string;
  darkMode: string;
  activeIncidentsBanner: string;
  inspect: string;
  dismiss: string;

  // Mobile Sub-nav
  tabProblem: string;
  tabDispatcher: string;
  tabDistricts: string;
  tabAdvisories: string;
  tabSystem: string;

  // Welcome / Intro Hero
  heroBadge: string;
  welcomeTo: string;
  heroSubtitle: string;
  heroDescription: string;
  getStarted: string;
  openDispatcher: string;
  driverLogin: string;
  statStates: string;
  statStatesSub: string;
  statHazards: string;
  statHazardsSub: string;
  statSolvers: string;
  statSolversSub: string;
  statBeacons: string;
  statBeaconsSub: string;

  // Road Advisories Section
  advisoriesTitle: string;
  advisoriesSubtitle: string;
  inspectInDispatcher: string;
  critical: string;
  high: string;
  avoidTraffic: string;
  recommendedDetour: string;
  liveHighwayAdvisory: string;

  // Problem & Solution
  whyRaahSetu: string;
  problemTitle: string;
  problemDesc: string;
  solutionTitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  strategicCorridorsTitle: string;
  strategicCorridorsSubtitle: string;
  readyToDispatch: string;
  readySubtitle: string;
  launchDispatcher: string;
  driverPortal: string;

  // Dispatcher Controls
  originHub: string;
  destinationHub: string;
  selectOriginPlaceholder: string;
  selectDestPlaceholder: string;
  searchCity: string;
  snapOriginLiveGps: string;
  voiceInput: string;
  listening: string;
  speakPrompt: string;
  swap: string;
  clear: string;
  cargoPriorityTitle: string;
  vehicleProfileTitle: string;
  weatherConditionTitle: string;
  calculateButton: string;
  calibratingRoute: string;
  compareRoutes: string;
  safeRiskRoute: string;
  fastestCorridor: string;
  estTime: string;
  distance: string;
  riskIndex: string;
  whySelectedTitle: string;
  whySelectedDesc: string;
  terrainElevation: string;
  turnDirections: string;
  startTransit: string;
  stopTransit: string;
  reportIncidentButton: string;
  locationsAvailable: string;
  nextHub: string;
  speed: string;

  // District Health
  districtHealthTitle: string;
  districtHealthSubtitle: string;
  searchDistrictPlaceholder: string;
  filterAllStates: string;
  colDistrictState: string;
  colHighway: string;
  colStatus: string;
  colDelay: string;
  colIncidents: string;
  colAction: string;
  inspectCorridorBtn: string;
  noDistricts: string;
  statusNormal: string;
  statusWatch: string;
  statusRestricted: string;

  // Data & Architecture
  dataPageTitle: string;
  dataPageSubtitle: string;
  monsoonLandslides: string;
  gsiRecorded: string;
  osmGraphs: string;
  extractedPyosmium: string;
  dualPathEngine: string;
  deterministicEngine: string;
  priorityQueue: string;
  howEngineComputes: string;
  step1: string;
  step1Text: string;
  step2: string;
  step2Text: string;
  step3: string;
  step3Text: string;
  disclaimerTitle: string;
  disclaimerText: string;
  footerCopyright: string;
  footerBrand: string;

  // Auth / Login Page
  authBadge: string;
  authTitle: string;
  authSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  trustedPersonLabel: string;
  trustedPersonPlaceholder: string;
  trustedPersonHelp: string;
  captchaLabel: string;
  captchaPlaceholder: string;
  captchaHelp: string;
  captchaError: string;
  signInBtn: string;
  signingIn: string;
  backToPlatform: string;

  // Email Verification System
  verificationTitle: string;
  verificationSubtitle: string;
  verificationCodeLabel: string;
  verificationCodePlaceholder: string;
  verifyAndSignInBtn: string;
  resendCodeBtn: string;
  resendIn: string;
  changeEmail: string;
  codeSentNotice: string;
  codeSentSuccess: string;
  invalidCode: string;
  codeExpired: string;
  simulatedEmailNotice: string;
  clickToFill: string;

  // Auth: Login vs Sign Up
  signUpTitle: string;
  signUpSubtitle: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  passwordMismatch: string;
  createAccountBtn: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  verifiedSigningIn: string;
  expiresInMins: string;
  copiedText: string;

  // IntroPage Section 3: Ground Reality
  groundRealityBadge: string;
  groundRealityTitle: string;
  groundRealityDesc: string;
  stat1Value: string;
  stat1Label: string;
  stat1Desc: string;
  stat1Source: string;
  stat2Value: string;
  stat2Label: string;
  stat2Desc: string;
  stat2Source: string;
  stat3Value: string;
  stat3Label: string;
  stat3Desc: string;
  stat3Source: string;
  stat4Value: string;
  stat4Label: string;
  stat4Desc: string;
  stat4Source: string;

  // IntroPage Section 4: Blind Spot
  conventionalNavTitle: string;
  conventionalNavBadge: string;
  conventionalNavBullet1: string;
  conventionalNavBullet2: string;
  conventionalNavBullet3: string;
  conventionalNavBullet4: string;
  raahSetuEngineBadge: string;

  // IntroPage Section 6
  explorePlatformModules: string;
  view3dTerrain: string;
  apiConnected: string;
  offlineFallback: string;
  calibratedGpsTelemetry: string;
  headingLabel: string;
  terminalAdvisoryLabel: string;

  // Modals & SOS
  reportIncidentTitle: string;
  incidentType: string;
  incidentLandslide: string;
  incidentMudflow: string;
  incidentSubsidence: string;
  incidentBridge: string;
  incidentWaterlog: string;
  incidentTree: string;
  incidentSeverity: string;
  severityLow: string;
  severityMedium: string;
  severityHigh: string;
  incidentDesc: string;
  incidentDescPlaceholder: string;
  submitReport: string;
  cancel: string;
  driverModalTitle: string;
  driverName: string;
  driverLicense: string;
  vehicleReg: string;
  saveProfile: string;
  sosTitle: string;
  sosDesc: string;
  triggerSos: string;
  sosTriggered: string;
  close: string;

  // Additional Destination Weather & Telemetry
  destinationWeatherTitle: string;
  terminalWeatherForecast: string;
  temperature: string;
  precipitation: string;
  visibility: string;
  roadGrip: string;
  terminalStation: string;

  // Additional Dispatcher & Callout fields
  step12SelectTitle: string;
  departureHubSelected: string;
  nowChooseDestination: string;
  destSelected: string;
  nowChooseDeparture: string;
  activeRoute: string;
  step12Prompt: string;
  step12Active: string;
  enterEndpointsBelow: string;
  routeReady: string;
  strategicCorridorsBar: string;
  clickPresets: string;
  himalayanGridTitle: string;
  osmGraphActive: string;
  keyCorridorsCount: string;
  dispatcherBannerTitle: string;
  dispatcherBannerDesc: string;
  activeDeparture: string;
  targetDestination: string;
  corridorElevation: string;
  weatherAdvisory: string;
  awaitingInput: string;
  awaitingRoute: string;
  standardNominal: string;
  clearTransit: string;
  departureHub: string;
  arrivalDestination: string;
  vehicleAxle: string;
  cargoPriority: string;
  microclimateIngestion: string;
  pathComparison: string;
  saferCorridor: string;
  fastestShortest: string;
  safeRiskAware: string;
  safeTrades: string;
  toAvoidSteep: string;
  elevationProfile: string;
  peak: string;
  downloadManifest: string;
  share: string;
  copied: string;
  reportHazard: string;
  satelliteView: string;
  roadNetwork: string;
  startNavigation: string;
  stopNavigation: string;
  expandFullscreen: string;
  exitFullscreen: string;
  routeWaypoints: string;
  highwayLegs: string;
  via: string;
  risk: string;

  // District Health additional
  normal: string;
  watch: string;
  restricted: string;
  all: string;
  searchDistrictRoad: string;
  activeIncidents: string;
  transitDelay: string;
  routeToHub: string;

  // Advisories additional
  activeClosuresTitle: string;
  activeClosuresSubtitle: string;
  reportRoadHazard: string;
  closureBadge: string;
  spot: string;
  cause: string;
  avoid: string;
  recommendedDetourLabel: string;
  applyDetour: string;

  // Platform architecture & documentation
  platformArchitecture: string;
  platformArchitectureSub: string;
  osmTopology: string;
  northeastMultiModal: string;
  northeastMultiModalDesc: string;
  graphEdgesCaption: string;
  annualFatalitiesNationwide: string;
  morthCensus: string;
  graphExtractionTitle: string;
  graphExtractionDesc: string;
  costWeightingTitle: string;
  costWeightingDesc: string;
  dualPathSolveTitle: string;
  dualPathSolveDesc: string;
  platformScopeTitle: string;
  platformScopeDesc: string;
  footerBrandText: string;
  footerSub: string;
  footerCopyrightText: string;

  // Modals
  driverProfileTitle: string;
  driverNameLabel: string;
  vehicleRegLabel: string;
  driverMobileLabel: string;
  trustedEmergencyContactLabel: string;
  cancelBtn: string;
  saveProfileBtn: string;
  emergencyDistressSos: string;
  vehicleLabel: string;
  driverLabel: string;
  corridorLabel: string;
  statusLabel: string;
  transmittingGps: string;
  dispatchedToAuthorities: string;
  readyToTransmit: string;
  callNdrf: string;
  callFleetBase: string;
  reportHighwayHazard: string;
  captureOrUpload: string;
  snapPhoto: string;
  startCamera: string;
  upload: string;
  submitHazardReport: string;
  hazardReportSuccess: string;

  // Commodities
  commodities: {
    medical: { name: string; badge: string; desc: string };
    agro: { name: string; badge: string; desc: string };
    pds: { name: string; badge: string; desc: string };
    fuel: { name: string; badge: string; desc: string };
    construction: { name: string; badge: string; desc: string };
  };

  // Vehicles
  vehicles: {
    heavy: { name: string; badge: string; desc: string };
    standard: { name: string; badge: string; desc: string };
    light: { name: string; badge: string; desc: string };
  };

  // Weather
  weather: {
    clear: { name: string; badge: string; desc: string };
    monsoon: { name: string; badge: string; desc: string };
    snow: { name: string; badge: string; desc: string };
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    brandName: "RaahSetu",
    brandSubtitle: "Mountain Logistics & Strategic Freight",
    navOverview: "Overview",
    navDispatcher: "Route Dispatcher",
    navDistricts: "District Health",
    navArchitecture: "Data & Architecture",
    navSignIn: "Sign In",
    navAccount: "Fleet Account",
    navSignOut: "Sign Out",
    emergencySos: "Emergency SOS",
    autoDetected: "Auto-Detected (System)",
    selectLanguage: "Select Language",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    activeIncidentsBanner: "Active Road Blockages (4 Corridors Restricted)",
    inspect: "Inspect",
    dismiss: "Dismiss",

    tabProblem: "Overview",
    tabDispatcher: "Dispatcher",
    tabDistricts: "Districts",
    tabAdvisories: "Advisories",
    tabSystem: "System & Data",

    heroBadge: "National Mountain Freight Logistics Grid · 8 Northeast States",
    welcomeTo: "Welcome to",
    heroSubtitle: "AI-Powered Climate-Resilient Logistics Grid",
    heroDescription: "Explainable, multi-criteria freight routing engineered for the Eastern Himalayas. Live landslide risk monitoring, bridge load restrictions, monsoon weather resilience, and offline-capable fleet dispatch across 8 Northeastern states.",
    getStarted: "Get Started",
    openDispatcher: "Open Dispatcher",
    driverLogin: "Driver Login",
    statStates: "8 States",
    statStatesSub: "Complete Northeast Coverage",
    statHazards: "400+ Monitored Hazards",
    statHazardsSub: "GSI Landslide Snapshots",
    statSolvers: "Dual A* Solvers",
    statSolversSub: "Deterministic Time & Safety",
    statBeacons: "24/7 Field Beacons",
    statBeaconsSub: "Zero-Signal Mesh Ready",

    advisoriesTitle: "Active Mountain Road Advisories",
    advisoriesSubtitle: "Real-time corridor closures, heavy axle limits, and monsoon landslide alerts across key Northeast highways",
    inspectInDispatcher: "Inspect in Dispatcher",
    critical: "CRITICAL",
    high: "HIGH",
    avoidTraffic: "Avoid / Caution",
    recommendedDetour: "Recommended Detour",
    liveHighwayAdvisory: "Live Highway Advisory",

    whyRaahSetu: "Why RaahSetu?",
    problemTitle: "The Northeast Mountain Dilemma",
    problemDesc: "Standard consumer navigation fails in the fragile Himalayas. They route multi-axle freight trucks into single-lane washed-out bypasses, under-capacity Bailey bridges, and active mudflows during torrential monsoon cloudbursts.",
    solutionTitle: "Our 3-Pillar Solution",
    pillar1Title: "Axle Load & Clearance Verification",
    pillar1Desc: "Validates vehicle gross tonnage against bridge carrying capacities and hairpin turning radii before dispatch.",
    pillar2Title: "Dual-Path Deterministic Routing",
    pillar2Desc: "Computes both the fastest direct route and a safe hazard-avoidance route using geological landslide susceptibility scores.",
    pillar3Title: "Zero-Network Offline Protocol",
    pillar3Desc: "Maintains route guidance and emergency SOS beacons even when cellular towers fail in remote high-altitude passes.",
    strategicCorridorsTitle: "Strategic Northeast Corridors",
    strategicCorridorsSubtitle: "Pre-indexed multi-state supply lifelines connecting remote capitals to the national logistics backbone",
    readyToDispatch: "Ready to Dispatch Mountain Freight?",
    readySubtitle: "Calculate explainable, risk-weighted freight routes across Assam, Sikkim, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, and Tripura.",
    launchDispatcher: "Launch Route Dispatcher",
    driverPortal: "Driver Portal",

    originHub: "Origin Hub",
    destinationHub: "Destination Hub",
    selectOriginPlaceholder: "Select Origin City / Hub",
    selectDestPlaceholder: "Select Destination City / Hub",
    searchCity: "Search city or state...",
    snapOriginLiveGps: "Snap Origin to Live GPS",
    voiceInput: "Voice Input",
    listening: "Listening...",
    speakPrompt: "Click mic to speak city (e.g. Guwahati to Gangtok)",
    swap: "Swap",
    clear: "Clear",
    cargoPriorityTitle: "Essential Commodity Priority",
    vehicleProfileTitle: "Vehicle Dispatch Profile",
    weatherConditionTitle: "Weather & Road Surface Condition",
    calculateButton: "Compute Multi-Criteria Routes",
    calibratingRoute: "Calibrating Route...",
    compareRoutes: "Compare Fastest vs Safest Route",
    safeRiskRoute: "Safe Risk-Aware Route",
    fastestCorridor: "Fastest Direct Corridor",
    estTime: "Est. Transit Time",
    distance: "Distance",
    riskIndex: "Risk Index",
    whySelectedTitle: "Why this route was selected",
    whySelectedDesc: "Detailed multi-criteria engineering rationale explaining terrain, bridge load, and landslide factors.",
    terrainElevation: "Elevation & Gradient Profile",
    turnDirections: "Turn-by-Turn Transit Directions",
    startTransit: "Start Navigation",
    stopTransit: "Stop Navigation",
    reportIncidentButton: "Report Incident / Hazard",
    locationsAvailable: "locations available",
    nextHub: "Next Hub",
    speed: "Speed",

    districtHealthTitle: "District-Wise Accessibility Health (8 Northeast States)",
    districtHealthSubtitle: "Real-time connectivity status, delay records, and active incident tracking (Northeast Mountain Logistics Mandate).",
    searchDistrictPlaceholder: "Search district or road...",
    filterAllStates: "All States",
    colDistrictState: "District & State",
    colHighway: "Primary Highway",
    colStatus: "Connectivity Status",
    colDelay: "Avg Delay",
    colIncidents: "Active Hazards",
    colAction: "Action",
    inspectCorridorBtn: "Inspect Corridor",
    noDistricts: "No matching districts found.",
    statusNormal: "Normal",
    statusWatch: "Watch",
    statusRestricted: "Restricted",

    dataPageTitle: "Logistics Data & Engine Architecture",
    dataPageSubtitle: "Deterministic dual-objective routing engine powered by OSM road graphs, GSI landslide telemetry, and IMD rainfall observations.",
    monsoonLandslides: "400+ Monsoon Landslides",
    gsiRecorded: "GSI recorded severe rockfall and mudflow blockages.",
    osmGraphs: "8 States OSM Road Graphs",
    extractedPyosmium: "Extracted via Pyosmium and OSMnx.",
    dualPathEngine: "Dual-Path A* Engine",
    deterministicEngine: "Deterministic Engine",
    priorityQueue: "Priority queue with admissible terrain heuristic.",
    howEngineComputes: "How the Engine Computes Routes",
    step1: "1. Graph Extraction",
    step1Text: "OSM highway ways converted into directed weighted edges with surface and gradient tags.",
    step2: "2. Edge Cost Weighting",
    step2Text: "Edges penalised based on vehicle axle limit, cargo sensitivity, and rainfall intensity.",
    step3: "3. Dual-Path Solve",
    step3Text: "Engine runs A* twice on identical graph: once for fastest time, once for minimal hazard exposure.",
    disclaimerTitle: "Platform Scope & Operational Boundaries",
    disclaimerText: "RaahSetu is an explainable operational system designed for national mountain freight corridors. Highway telemetry and hazard observations reflect validated geological surveys and offline snapshots. Official emergency transit conforms to regional disaster management and highway authority advisories.",
    footerCopyright: "OpenStreetMap data © OpenStreetMap contributors · RaahSetu Logistics Platform.",
    footerBrand: "RaahSetu · Northeast India Emergency Logistics Routing",

    authBadge: "Official Dispatcher Access",
    authTitle: "Fleet & Driver Authentication",
    authSubtitle: "Secure credentials for mountain logistics fleet drivers, emergency dispatchers, and state highway monitoring officers.",
    emailLabel: "Email ID",
    emailPlaceholder: "driver@raahsetu.in or fleet@logistics.gov.in",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your secure password",
    trustedPersonLabel: "Trusted Person Number (Emergency SOS Contact)",
    trustedPersonPlaceholder: "+91 94350 99881 (10-digit mobile number)",
    trustedPersonHelp: "Designated trusted contact for emergency distress coordination and SOS beacons in zero-network hill passes.",
    captchaLabel: "Security Code (CAPTCHA)",
    captchaPlaceholder: "Enter 5-character code above",
    captchaHelp: "Click refresh button if code is difficult to read.",
    captchaError: "Security code does not match. A new code has been generated.",
    signInBtn: "Sign In to Dispatcher →",
    signingIn: "Verifying Credentials...",
    backToPlatform: "Back to Platform",

    verificationTitle: "Verify Your Email",
    verificationSubtitle: "Enter the 6-digit verification code sent to",
    verificationCodeLabel: "Verification Code (OTP)",
    verificationCodePlaceholder: "Enter 6-digit code",
    verifyAndSignInBtn: "Verify & Complete Sign In",
    resendCodeBtn: "Resend Code",
    resendIn: "Resend code in",
    changeEmail: "Change Email",
    codeSentNotice: "A 6-digit security code has been sent to your email address.",
    codeSentSuccess: "New verification code sent!",
    invalidCode: "Incorrect verification code. Please check your inbox and try again.",
    codeExpired: "Code expired. Please request a new verification code.",
    simulatedEmailNotice: "Simulated Live Email Dispatch / Test Code:",
    clickToFill: "Click to Auto-fill",
    signUpTitle: "Create Fleet Account",
    signUpSubtitle: "Register as a mountain logistics fleet driver, emergency dispatcher, or state highway monitoring officer.",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your secure password",
    passwordMismatch: "Passwords do not match. Please re-enter.",
    createAccountBtn: "Create Account & Verify →",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    verifiedSigningIn: "Verified! Signing in...",
    expiresInMins: "Expires in 10 mins",
    copiedText: "Copied!",
    groundRealityBadge: "Ground Reality & MoRTH Accident Census",
    groundRealityTitle: "The Life-or-Death Reality of Mountain Highway Logistics",
    groundRealityDesc: "Official government data from the Ministry of Road Transport and Highways (MoRTH), National Crime Records Bureau (NCRB), and Geological Survey of India (GSI) document a severe regional logistics crisis.",
    stat1Value: "1,68,491",
    stat1Label: "Annual Fatalities Nationwide",
    stat1Desc: "Per MoRTH official census, mountain ghat sections have an accident fatality rate of 45.2%—nearly double plain highway crashes.",
    stat1Source: "Source: MoRTH Road Accidents Report",
    stat2Value: "400+",
    stat2Label: "Major Landslides Annually",
    stat2Desc: "GSI landslide databases record over 400 severe rockfall and debris slips each monsoon, completely severing lifelines like NH-6, NH-2, and NH-13 for weeks.",
    stat2Source: "Source: Geological Survey of India (GSI)",
    stat3Value: "6,200+",
    stat3Label: "Northeast Corridor Lives Lost",
    stat3Desc: "Truck drivers, co-drivers, and passengers have lost their lives across the Northeast mountain belt over the past decade due to brake fade, extreme slopes, and edge drop-offs.",
    stat3Source: "Source: Regional NCRB Police Records",
    stat4Value: "₹3,500 Cr",
    stat4Label: "Annual Economic Freight Delay",
    stat4Desc: "Convoys carrying life-saving pharmaceuticals, oxygen cylinders, food rations, and farm produce remain stranded at Sela Pass and Sonapur tunnel chokepoints.",
    stat4Source: "Source: Logistics Council Estimates",
    conventionalNavTitle: "Conventional Consumer Navigation",
    conventionalNavBadge: "Naive Distance",
    conventionalNavBullet1: "Minimizes pure linear distance (km), frequently choosing dangerous unpaved shortcut tracks.",
    conventionalNavBullet2: "Ignores hill slope gradients, causing fatal brake overheating and vehicle roll-aways on 14%+ inclines.",
    conventionalNavBullet3: "Unaware of multi-axle bridge weight restrictions, leading to freight strandings at narrow Bailey crossings.",
    conventionalNavBullet4: "No commodity prioritization: treats volatile petroleum tankers the same as light passenger cars.",
    raahSetuEngineBadge: "Terrain Dual-Solve",
    explorePlatformModules: "Explore Platform Modules",
    view3dTerrain: "3D Terrain View",
    apiConnected: "FastAPI A* Connected",
    offlineFallback: "Offline Solver Active",
    calibratedGpsTelemetry: "CALIBRATED GPS TELEMETRY",
    headingLabel: "Heading",
    terminalAdvisoryLabel: "Terminal Advisory",
    reportIncidentTitle: "Report Mountain Road Incident",
    incidentType: "Incident Type",
    incidentLandslide: "Landslide / Rockfall",
    incidentMudflow: "Mudflow / Debris Washout",
    incidentSubsidence: "Roadbed Subsidence / Cave-in",
    incidentBridge: "Bridge Weakened / Blocked",
    incidentWaterlog: "Severe Waterlogging / Overflow",
    incidentTree: "Fallen Trees / Power Lines",
    incidentSeverity: "Severity Level",
    severityLow: "Low (Passable with caution)",
    severityMedium: "Medium (Single lane only)",
    severityHigh: "High (Completely blocked)",
    incidentDesc: "Incident Details & Location Remarks",
    incidentDescPlaceholder: "Describe exact mile marker, vehicle restrictions, or landmark...",
    submitReport: "Submit Incident Report",
    cancel: "Cancel",
    driverModalTitle: "Fleet Driver & Vehicle Profile",
    driverName: "Driver Full Name",
    driverLicense: "Commercial Driving License (CDL)",
    vehicleReg: "Vehicle Registration Number",
    saveProfile: "Save Driver Profile",
    sosTitle: "Emergency Mountain SOS Beacon",
    sosDesc: "Transmit high-priority satellite / SMS emergency distress beacon to district disaster control and SDRF.",
    triggerSos: "Trigger SOS Emergency Beacon",
    sosTriggered: "Emergency Beacon Active",
    close: "Close",

    destinationWeatherTitle: "Destination Weather",
    terminalWeatherForecast: "Destination Terminal Microclimate & Live Forecast",
    temperature: "Temperature",
    precipitation: "Precipitation",
    visibility: "Visibility",
    roadGrip: "Road Surface Grip",
    terminalStation: "Terminal Met Station",
    step12SelectTitle: "Step 1 & 2: Select Departure Hub (Origin) & Target Destination",
    departureHubSelected: "Departure Hub selected",
    nowChooseDestination: "Now choose Destination.",
    destSelected: "Destination selected",
    nowChooseDeparture: "Now choose Departure Hub.",
    activeRoute: "Active Route",
    step12Prompt: "Please select or type your Origin and Destination to calculate the terrain-safe path, elevation gradient, and risk analysis.",
    step12Active: "Dual-path A* solve active. Distance, travel time, and hazard exposure calculated below.",
    enterEndpointsBelow: "Enter Endpoints Below ↓",
    routeReady: "Route Ready ✓",
    strategicCorridorsBar: "Strategic Mountain Freight Corridors",
    clickPresets: "1-click dispatch presets",
    himalayanGridTitle: "Eastern Himalayan Logistics Grid · 8 Northeast States",
    osmGraphActive: "OSM Real Graph Engine Active",
    keyCorridorsCount: "56 Key Corridors",
    dispatcherBannerTitle: "Risk-Aware Strategic Freight Routing & Accessibility",
    dispatcherBannerDesc: "Dynamic terrain dual-path solver balancing transit duration against monsoon rainfall, slope gradients, and multi-axle freight restrictions across Assam, Arunachal, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, and Tripura.",
    activeDeparture: "Active Departure",
    targetDestination: "Target Destination",
    corridorElevation: "Corridor Elevation",
    weatherAdvisory: "Weather Advisory",
    awaitingInput: "Awaiting input...",
    awaitingRoute: "Awaiting route...",
    standardNominal: "Standard Nominal",
    clearTransit: "Clear Transit",
    departureHub: "Departure Hub",
    arrivalDestination: "Arrival Destination",
    vehicleAxle: "Vehicle Axle",
    cargoPriority: "Cargo Priority",
    microclimateIngestion: "Microclimate Ingestion:",
    pathComparison: "A* Path Comparison",
    saferCorridor: "Safer Corridor",
    fastestShortest: "Fastest (Shortest)",
    safeRiskAware: "Safe (Risk-Aware)",
    safeTrades: "Safe path trades",
    toAvoidSteep: "to avoid steep erosion gorges and active landslide zones.",
    elevationProfile: "Elevation Profile",
    peak: "Peak:",
    downloadManifest: "Download Manifest (JSON)",
    share: "Share",
    copied: "Copied",
    reportHazard: "Report Hazard",
    satelliteView: "Satellite View",
    roadNetwork: "Road Network",
    startNavigation: "Start Navigation",
    stopNavigation: "Stop Navigation",
    expandFullscreen: "Expand Map Fullscreen",
    exitFullscreen: "Exit Fullscreen (ESC)",
    routeWaypoints: "Route Checkpoints & Waypoints",
    highwayLegs: "highway legs",
    via: "Via:",
    risk: "Risk",
    normal: "Normal",
    watch: "Watch",
    restricted: "Restricted",
    all: "ALL",
    searchDistrictRoad: "Search district or road...",
    activeIncidents: "Active Incidents:",
    transitDelay: "Transit Delay:",
    routeToHub: "Route to Hub",
    activeClosuresTitle: "Active Road Closures & Landslide Advisories",
    activeClosuresSubtitle: "Verified mountain pass blockages, geotechnical sensor alerts, and official detour recommendations.",
    reportRoadHazard: "Report Road Hazard",
    closureBadge: "CLOSURE",
    spot: "Spot:",
    cause: "Cause:",
    avoid: "Avoid:",
    recommendedDetourLabel: "Recommended Detour:",
    applyDetour: "Apply Detour",
    platformArchitecture: "Platform Architecture & Official Data Sources",
    platformArchitectureSub: "Transparency and explainability principles powering the RaahSetu routing engine.",
    osmTopology: "OSM Network Graph Topology",
    northeastMultiModal: "Northeast India Multi-Modal Road Graph",
    northeastMultiModalDesc: "Extracted from Geofabrik OpenStreetMap PBF extracts using Pyosmium and OSMnx. The runtime pilot comprises 5,814 road nodes and 13,681 directed highway edges spanning all 8 Northeastern states.",
    graphEdgesCaption: "13,681 Directed Edges · 8 States",
    annualFatalitiesNationwide: "Annual Fatalities Nationwide",
    morthCensus: "MoRTH census: Ghat fatality severity is 45.2%.",
    graphExtractionTitle: "1. Graph Extraction",
    graphExtractionDesc: "OSM highway ways converted into directed weighted edges with surface and gradient tags.",
    costWeightingTitle: "2. Edge Cost Weighting",
    costWeightingDesc: "Edges penalised based on vehicle axle limit, cargo sensitivity, and rainfall intensity.",
    dualPathSolveTitle: "3. Dual-Path Solve",
    dualPathSolveDesc: "Engine runs A* twice on identical graph: once for fastest time, once for minimal hazard exposure.",
    platformScopeTitle: "Platform Scope & Operational Boundaries",
    platformScopeDesc: "RaahSetu is an explainable operational system designed for national mountain freight corridors. Highway telemetry and hazard observations reflect validated geological surveys and offline snapshots. Official emergency transit conforms to regional disaster management and highway authority advisories.",
    footerBrandText: "RaahSetu",
    footerSub: "· Northeast India Emergency Logistics Routing",
    footerCopyrightText: "OpenStreetMap data © OpenStreetMap contributors · RaahSetu Logistics Platform.",
    driverProfileTitle: "Fleet Driver & Vehicle Profile",
    driverNameLabel: "Driver Name",
    vehicleRegLabel: "Vehicle Registration No",
    driverMobileLabel: "Driver Mobile",
    trustedEmergencyContactLabel: "Trusted Emergency Contact",
    cancelBtn: "Cancel",
    saveProfileBtn: "Save Profile",
    emergencyDistressSos: "Emergency Distress SOS",
    vehicleLabel: "Vehicle:",
    driverLabel: "Driver:",
    corridorLabel: "Corridor:",
    statusLabel: "Status:",
    transmittingGps: "Transmitting GPS...",
    dispatchedToAuthorities: "Dispatched to Authorities (Active)",
    readyToTransmit: "Ready to Transmit",
    callNdrf: "Call NDRF (1078)",
    callFleetBase: "Call Fleet Base",
    reportHighwayHazard: "Report Highway Hazard",
    captureOrUpload: "Capture or upload live road evidence",
    snapPhoto: "Snap Photo",
    startCamera: "Start Camera",
    upload: "Upload",
    submitHazardReport: "Submit Hazard Report",
    hazardReportSuccess: "Hazard report logged successfully.",

    commodities: {
      medical: {
        name: "Medicines & Vaccines",
        badge: "Cold-Chain / Life Saving",
        desc: "Temperature-sensitive pharmaceuticals & blood bank units. Zero tolerance for multi-day road chokes.",
      },
      agro: {
        name: "Agricultural & Horticulture",
        badge: "Perishable Produce",
        desc: "Ginger, oranges, kiwi, and farm produce from hill farmers. Rapid delivery to prevent post-harvest rot.",
      },
      pds: {
        name: "PDS Food Supply / Grains",
        badge: "Essential Commodities",
        desc: "FCI buffer grain stocks and pulses for remote sub-divisional godowns. Demands bridge-safe freight routes.",
      },
      fuel: {
        name: "POL / Petroleum & LPG",
        badge: "Hazardous Flammable",
        desc: "Bulk road petroleum tankers and cylinders. Strictly restricted from severe hairpin ghat detours.",
      },
      construction: {
        name: "Infrastructure & Cement",
        badge: "Heavy Capital Cargo",
        desc: "Steel rebars, bridge trusses, and aggregates for highway and border road engineering.",
      },
    },

    vehicles: {
      heavy: {
        name: "Heavy Freight (28T)",
        badge: "28T Multi-Axle",
        desc: "Multi-axle heavy transport. High caution on hairpin bends, steep ghats, and bridges.",
      },
      standard: {
        name: "Commercial Truck (16T)",
        badge: "16T Cargo",
        desc: "Standard logistics carrier. Balanced hill speed and highway cruising efficiency.",
      },
      light: {
        name: "Light 4x4 / Emergency",
        badge: "4x4 Utility",
        desc: "Light cargo or emergency dispatch vehicle. Highly agile on unpaved hill tracks.",
      },
    },

    weather: {
      clear: {
        name: "Clear / Dry",
        badge: "Optimal",
        desc: "Fair weather conditions with nominal transit speeds and baseline road safety.",
      },
      monsoon: {
        name: "Monsoon Downpour",
        badge: "High Hazard",
        desc: "Active monsoon rainfall. Heightened landslide susceptibility and river overflow risk.",
      },
      snow: {
        name: "Winter Freeze",
        badge: "Ice Warning",
        desc: "Sub-zero conditions on high-altitude passes with black ice and snowfall slowdowns.",
      },
    },
  },

  hi: {
    brandName: "राहसेतु",
    brandSubtitle: "पर्वतीय लॉजिस्टिक्स एवं सामरिक माल ढुलाई",
    navOverview: "अवलोकन",
    navDispatcher: "रूट डिस्पैचर",
    navDistricts: "जिला स्वास्थ्य",
    navArchitecture: "डेटा एवं आर्किटेक्चर",
    navSignIn: "लॉग इन",
    navAccount: "फ्लीट खाता",
    navSignOut: "लॉग आउट",
    emergencySos: "आपातकालीन एसओएस",
    autoDetected: "स्वतः-पहचाना गया (सिस्टम)",
    selectLanguage: "भाषा चुनें",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    activeIncidentsBanner: "सक्रिय सड़क अवरोध (4 गलियारे प्रतिबंधित)",
    inspect: "जांचें",
    dismiss: "हटाएं",

    tabProblem: "अवलोकन",
    tabDispatcher: "डिस्पैचर",
    tabDistricts: "जिले",
    tabAdvisories: "परामर्श",
    tabSystem: "सिस्टम एवं डेटा",

    heroBadge: "राष्ट्रीय पर्वतीय माल ढुलाई लॉजिस्टिक्स ग्रिड · 8 पूर्वोत्तर राज्य",
    welcomeTo: "स्वागत है",
    heroSubtitle: "एआई-संचालित जलवायु-लचीला लॉजिस्टिक्स ग्रिड",
    heroDescription: "पूर्वी हिमालय के लिए निर्मित व्याख्यात्मक, बहु-मानदंड माल ढुलाई रूटिंग। 8 पूर्वोत्तर राज्यों में लाइव भूस्खलन जोखिम निगरानी, पुल भार सीमा, मानसून मौसम लचीलापन और ऑफ़लाइन बेड़ा प्रेषण।",
    getStarted: "शुरू करें",
    openDispatcher: "डिस्पैचर खोलें",
    driverLogin: "चालक लॉगिन",
    statStates: "8 राज्य",
    statStatesSub: "संपूर्ण पूर्वोत्तर कवरेज",
    statHazards: "400+ निगरानी खतरे",
    statHazardsSub: "जीएसआई भूस्खलन स्नैपशॉट",
    statSolvers: "द्वि-मार्गीय A* इंजन",
    statSolversSub: "निश्चित समय एवं सुरक्षा",
    statBeacons: "24/7 फील्ड बीकन",
    statBeaconsSub: "शून्य-नेटवर्क मेश सक्षम",

    advisoriesTitle: "सक्रिय पर्वतीय सड़क परामर्श",
    advisoriesSubtitle: "प्रमुख पूर्वोत्तर राजमार्गों पर वास्तविक समय में गलियारा बंद, भारी एक्सल सीमा और मानसून भूस्खलन अलर्ट",
    inspectInDispatcher: "डिस्पैचर में जांचें",
    critical: "अत्यंत गंभीर",
    high: "गंभीर",
    avoidTraffic: "बचें / सावधानी",
    recommendedDetour: "अनुशंसित वैकल्पिक मार्ग",
    liveHighwayAdvisory: "लाइव राजमार्ग परामर्श",

    whyRaahSetu: "राहसेतु क्यों?",
    problemTitle: "पूर्वोत्तर पर्वतीय चुनौती",
    problemDesc: "मानक उपभोक्ता नेविगेशन संवेदनशील हिमालय में विफल हो जाता है। वे बहु-धुरी माल ट्रकों को एकल-लेन कटे हुए रास्तों, कम क्षमता वाले बेली ब्रिजों और भारी मानसून के दौरान सक्रिय कीचड़ बहाव में भेज देते हैं।",
    solutionTitle: "हमारा 3-स्तंभीय समाधान",
    pillar1Title: "धुरी भार एवं ऊंचाई सत्यापन",
    pillar1Desc: "रवाना होने से पहले पुल की भार क्षमता और हेयरपिन मोड़ के अनुसार वाहन के कुल वजन का सत्यापन करता है।",
    pillar2Title: "द्वि-पथ निश्चित रूटिंग",
    pillar2Desc: "भूगर्भीय भूस्खलन संवेदनशीलता स्कोर का उपयोग करके सबसे तेज़ सीधा मार्ग और सुरक्षित खतरा-निवारक मार्ग दोनों की गणना करता है।",
    pillar3Title: "शून्य-नेटवर्क ऑफ़लाइन प्रोटोकॉल",
    pillar3Desc: "दूरदराज के उच्च-ऊंचाई वाले दर्रों में मोबाइल टावर विफल होने पर भी मार्ग मार्गदर्शन और आपातकालीन एसओएस बीकन बनाए रखता है।",
    strategicCorridorsTitle: "सामरिक पूर्वोत्तर गलियारे",
    strategicCorridorsSubtitle: "पूर्वोत्तर की राजधानियों को राष्ट्रीय लॉजिस्टिक्स से जोड़ने वाली पूर्व-सूचीबद्ध बहु-राज्यीय जीवन रेखाएं",
    readyToDispatch: "पर्वतीय माल ढुलाई प्रेषित करने के लिए तैयार?",
    readySubtitle: "असम, सिक्किम, अरुणाचल प्रदेश, मेघालय, मणिपुर, मिजोरम, नागालैंड और त्रिपुरा में व्याख्यात्मक, जोखिम-भारित मार्गों की गणना करें।",
    launchDispatcher: "रूट डिस्पैचर शुरू करें",
    driverPortal: "चालक पोर्टल",

    originHub: "प्रस्थान केंद्र (स्रोत)",
    destinationHub: "गंतव्य केंद्र",
    selectOriginPlaceholder: "प्रस्थान शहर / केंद्र चुनें",
    selectDestPlaceholder: "गंतव्य शहर / केंद्र चुनें",
    searchCity: "शहर या राज्य खोजें...",
    snapOriginLiveGps: "वर्तमान जीपीएस स्थान जोड़ें",
    voiceInput: "बोलकर खोजें",
    listening: "सुन रहा हूँ...",
    speakPrompt: "माइक पर क्लिक करके शहर का नाम बोलें (उदा. गुवाहाटी से गंगटोक)",
    swap: "बदलें",
    clear: "साफ़ करें",
    cargoPriorityTitle: "आवश्यक वस्तु कार्गो प्राथमिकता",
    vehicleProfileTitle: "वाहन प्रेषण प्रोफ़ाइल",
    weatherConditionTitle: "मौसम एवं सड़क सतह की स्थिति",
    calculateButton: "बहु-मानदंड मार्गों की गणना करें",
    calibratingRoute: "मार्ग गणना हो रही है...",
    compareRoutes: "सबसे तेज़ बनाम सबसे सुरक्षित मार्ग तुलना",
    safeRiskRoute: "सुरक्षित जोखिम-जागरूक मार्ग",
    fastestCorridor: "सबसे तेज़ सीधा गलियारा",
    estTime: "अनुमानित समय",
    distance: "दूरी",
    riskIndex: "जोखिम सूचकांक",
    whySelectedTitle: "यह मार्ग क्यों चुना गया",
    whySelectedDesc: "भू-भाग, पुल भार और भूस्खलन कारकों की व्याख्या करने वाला विस्तृत बहु-मानदंड इंजीनियरिंग तर्क।",
    terrainElevation: "ऊंचाई एवं ढलान प्रोफ़ाइल",
    turnDirections: "मोड़-दर-मोड़ पारगमन निर्देश",
    startTransit: "नेविगेशन शुरू करें",
    stopTransit: "नेविगेशन समाप्त करें",
    reportIncidentButton: "दुर्घटना / खतरा रिपोर्ट करें",
    locationsAvailable: "स्थान उपलब्ध",
    nextHub: "अगला पड़ाव",
    speed: "गति",

    districtHealthTitle: "जिला-वार कनेक्टिविटी स्थिति (8 पूर्वोत्तर राज्य)",
    districtHealthSubtitle: "वास्तविक समय कनेक्टिविटी स्थिति, विलंब रिकॉर्ड और सक्रिय घटना ट्रैकिंग (पूर्वोत्तर पर्वतीय लॉजिस्टिक्स अधिदेश)।",
    searchDistrictPlaceholder: "ज़िला या सड़क खोजें...",
    filterAllStates: "सभी राज्य",
    colDistrictState: "ज़िला एवं राज्य",
    colHighway: "प्रमुख राजमार्ग",
    colStatus: "कनेक्टिविटी स्थिति",
    colDelay: "औसत विलंब",
    colIncidents: "सक्रिय खतरे",
    colAction: "कार्रवाई",
    inspectCorridorBtn: "गलियारा देखें",
    noDistricts: "कोई मेल खाने वाला ज़िला नहीं मिला।",
    statusNormal: "सामान्य",
    statusWatch: "निगरानी",
    statusRestricted: "प्रतिबंधित",

    dataPageTitle: "लॉजिस्टिक्स डेटा एवं इंजन आर्किटेक्चर",
    dataPageSubtitle: "ओएसएम सड़क ग्राफ़, जीएसआई भूस्खलन टेलीमेट्री और आईएमडी वर्षा अवलोकनों द्वारा संचालित निश्चित द्वि-उद्देश्यीय रूटिंग इंजन।",
    monsoonLandslides: "400+ मानसून भूस्खलन",
    gsiRecorded: "जीएसआई ने गंभीर चट्टान गिरने और कीचड़ बहाव के अवरोध दर्ज किए।",
    osmGraphs: "8 राज्य ओएसएम सड़क ग्राफ़",
    extractedPyosmium: "पायोस्मियम और ओएसएमएनएक्स द्वारा निकाला गया।",
    dualPathEngine: "द्वि-पथ A* इंजन",
    deterministicEngine: "निश्चित इंजन",
    priorityQueue: "स्वीकार्य इलाके के अनुमान के साथ प्राथमिकता कतार।",
    howEngineComputes: "इंजन मार्गों की गणना कैसे करता है",
    step1: "1. ग्राफ़ निष्कर्षण",
    step1Text: "ओएसएम राजमार्ग को सतह और ढलान टैग के साथ निर्देशित भारित किनारों में बदला गया।",
    step2: "2. किनारे की लागत का भारण",
    step2Text: "वाहन की धुरी सीमा, कार्गो संवेदनशीलता और वर्षा की तीव्रता के आधार पर किनारों को दंडित किया गया।",
    step3: "3. द्वि-पथ समाधान",
    step3Text: "इंजन एक ही ग्राफ़ पर A* को दो बार चलाता है: एक बार सबसे तेज़ समय के लिए, एक बार न्यूनतम खतरे के लिए।",
    disclaimerTitle: "प्लेटफ़ॉर्म का दायरा एवं परिचालन सीमाएं",
    disclaimerText: "राहसेतु राष्ट्रीय पर्वतीय माल ढुलाई गलियारों के लिए डिज़ाइन की गई एक व्याख्यात्मक परिचालन प्रणाली है। राजमार्ग टेलीमेट्री और खतरे के अवलोकन मान्य भूगर्भीय सर्वेक्षणों और ऑफ़लाइन स्नैपशॉट को दर्शाते हैं। आधिकारिक आपातकालीन पारगमन क्षेत्रीय आपदा प्रबंधन और राजमार्ग प्राधिकरण की सलाह के अनुरूप है।",
    footerCopyright: "ओपनस्ट्रीटमैप डेटा © ओपनस्ट्रीटमैप योगदानकर्ता · राहसेतु लॉजिस्टिक्स प्लेटफ़ॉर्म।",
    footerBrand: "राहसेतु · पूर्वोत्तर भारत आपातकालीन लॉजिस्टिक्स रूटिंग",

    authBadge: "आधिकारिक डिस्पैचर पहुंच",
    authTitle: "फ्लीट एवं चालक प्रमाणीकरण",
    authSubtitle: "पर्वतीय लॉजिस्टिक्स फ्लीट चालकों, आपातकालीन प्रेषकों और राज्य राजमार्ग निगरानी अधिकारियों के लिए सुरक्षित क्रेडेंशियल।",
    emailLabel: "ईमेल आईडी",
    emailPlaceholder: "driver@raahsetu.in या fleet@logistics.gov.in",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना सुरक्षित पासवर्ड दर्ज करें",
    trustedPersonLabel: "विश्वसनीय व्यक्ति का नंबर (आपातकालीन एसओएस संपर्क)",
    trustedPersonPlaceholder: "+91 94350 99881 (10-अंकीय मोबाइल नंबर)",
    trustedPersonHelp: "शून्य-नेटवर्क पहाड़ी दर्रों में आपातकालीन संकट समन्वय और एसओएस बीकन के लिए नामित विश्वसनीय संपर्क।",
    captchaLabel: "सुरक्षा कोड (कैप्चा)",
    captchaPlaceholder: "ऊपर दिया गया 5-अक्षर कोड दर्ज करें",
    captchaHelp: "यदि कोड पढ़ने में कठिनाई हो तो ताज़ा करें बटन पर क्लिक करें।",
    captchaError: "सुरक्षा कोड मेल नहीं खाता। एक नया कोड उत्पन्न किया गया है।",
    signInBtn: "डिस्पैचर में लॉग इन करें →",
    signingIn: "प्रमाणपत्र सत्यापित किए जा रहे हैं...",
    backToPlatform: "प्लेटफ़ॉर्म पर वापस जाएं",

    verificationTitle: "ईमेल सत्यापित करें",
    verificationSubtitle: "पर भेजा गया 6-अंकीय सत्यापन कोड दर्ज करें",
    verificationCodeLabel: "सत्यापन कोड (OTP)",
    verificationCodePlaceholder: "6-अंकीय कोड दर्ज करें",
    verifyAndSignInBtn: "सत्यापित करें और साइन इन करें",
    resendCodeBtn: "कोड पुनः भेजें",
    resendIn: "पुनः भेजने का समय",
    changeEmail: "ईमेल बदलें",
    codeSentNotice: "आपकी ईमेल पर 6-अंकीय सुरक्षा कोड भेज दिया गया है।",
    codeSentSuccess: "नया सत्यापन कोड भेज दिया गया!",
    invalidCode: "गलत सत्यापन कोड। कृपया अपना इनबॉक्स जांचें और पुनः प्रयास करें।",
    codeExpired: "कोड समाप्त हो गया। कृपया नया कोड मंगवाएं।",
    simulatedEmailNotice: "लाइव ईमेल डिस्पैच सिमुलेशन / परीक्षण कोड:",
    clickToFill: "ऑटो-फिल करने के लिए क्लिक करें",
    signUpTitle: "फ्लीट खाता बनाएं",
    signUpSubtitle: "पर्वतीय लॉजिस्टिक्स फ्लीट चालक, आपातकालीन प्रेषक या राज्य राजमार्ग निगरानी अधिकारी के रूप में पंजीकरण करें।",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "अपना सुरक्षित पासवर्ड पुनः दर्ज करें",
    passwordMismatch: "पासवर्ड मेल नहीं खाते। कृपया पुनः दर्ज करें।",
    createAccountBtn: "खाता बनाएं एवं सत्यापित करें →",
    alreadyHaveAccount: "पहले से खाता है?",
    dontHaveAccount: "खाता नहीं है?",
    verifiedSigningIn: "सत्यापित! लॉग इन हो रहा है...",
    expiresInMins: "10 मिनट में समाप्त",
    copiedText: "कॉपी हो गया!",
    groundRealityBadge: "जमीनी हकीकत एवं MoRTH दुर्घटना जनगणना",
    groundRealityTitle: "पर्वतीय राजमार्ग लॉजिस्टिक्स की जीवन-मरण की वास्तविकता",
    groundRealityDesc: "सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH), राष्ट्रीय अपराध रिकॉर्ड ब्यूरो (NCRB) और भारतीय भूवैज्ञानिक सर्वेक्षण (GSI) के आधिकारिक सरकारी आंकड़े एक गंभीर क्षेत्रीय लॉजिस्टिक्स संकट दर्शाते हैं।",
    stat1Value: "1,68,491",
    stat1Label: "वार्षिक राष्ट्रीय मृत्यु संख्या",
    stat1Desc: "MoRTH की आधिकारिक जनगणना के अनुसार, पर्वतीय घाट खंडों में दुर्घटना मृत्यु दर 45.2% है—मैदानी राजमार्ग दुर्घटनाओं से लगभग दोगुनी।",
    stat1Source: "स्रोत: MoRTH सड़क दुर्घटना रिपोर्ट",
    stat2Value: "400+",
    stat2Label: "वार्षिक प्रमुख भूस्खलन",
    stat2Desc: "GSI भूस्खलन डेटाबेस प्रत्येक मानसून में 400 से अधिक गंभीर चट्टान गिरने और मलबा बहाव को दर्ज करता है, जो NH-6, NH-2 और NH-13 जैसी जीवन रेखाओं को हफ्तों के लिए पूरी तरह से काट देता है।",
    stat2Source: "स्रोत: भारतीय भूवैज्ञानिक सर्वेक्षण (GSI)",
    stat3Value: "6,200+",
    stat3Label: "पूर्वोत्तर गलियारे में जानें गईं",
    stat3Desc: "ट्रक चालक, सह-चालक और यात्री ब्रेक फेड, अत्यधिक ढलान और किनारे की खाई के कारण पिछले दशक में पूर्वोत्तर पर्वतीय क्षेत्र में अपनी जान गंवा चुके हैं।",
    stat3Source: "स्रोत: क्षेत्रीय NCRB पुलिस रिकॉर्ड",
    stat4Value: "₹3,500 करोड़",
    stat4Label: "वार्षिक आर्थिक माल ढुलाई विलंब",
    stat4Desc: "जीवन रक्षक दवाइयां, ऑक्सीजन सिलेंडर, खाद्य राशन और कृषि उपज ले जाने वाले काफिले सेला दर्रा और सोनापुर सुरंग की अड़चनों पर फंसे रहते हैं।",
    stat4Source: "स्रोत: लॉजिस्टिक्स परिषद अनुमान",
    conventionalNavTitle: "पारंपरिक उपभोक्ता नेविगेशन",
    conventionalNavBadge: "केवल दूरी आधारित",
    conventionalNavBullet1: "केवल रैखिक दूरी (किमी) को कम करता है, अक्सर खतरनाक कच्चे शॉर्टकट ट्रैक चुनता है।",
    conventionalNavBullet2: "पहाड़ी ढलान प्रवणता को अनदेखा करता है, जिससे 14%+ ढलानों पर ब्रेक अधिक गर्म होकर घातक दुर्घटनाएं होती हैं।",
    conventionalNavBullet3: "बहु-एक्सल पुल भार सीमा से अनजान, संकीर्ण बेली पुलों पर माल ट्रक फंस जाते हैं।",
    conventionalNavBullet4: "कोई माल प्राथमिकता नहीं: अस्थिर पेट्रोलियम टैंकरों को हल्की यात्री कारों के समान मानता है।",
    raahSetuEngineBadge: "भू-भाग दोहरा-समाधान",
    explorePlatformModules: "प्लेटफ़ॉर्म मॉड्यूल देखें",
    view3dTerrain: "3D भू-भाग दृश्य",
    apiConnected: "फास्ट-एपीआई A* कनेक्टेड",
    offlineFallback: "ऑफ़लाइन सॉल्वर सक्रिय",
    calibratedGpsTelemetry: "कैलिब्रेटेड जीपीएस टेलीमेट्री",
    headingLabel: "दिशा",
    terminalAdvisoryLabel: "टर्मिनल सलाह",
    reportIncidentTitle: "पर्वतीय सड़क दुर्घटना / खतरा रिपोर्ट करें",
    incidentType: "घटना का प्रकार",
    incidentLandslide: "भूस्खलन / चट्टान गिरना",
    incidentMudflow: "कीचड़ का बहाव / मलबा",
    incidentSubsidence: "सड़क धंसना / कटाव",
    incidentBridge: "पुल कमजोर / अवरुद्ध",
    incidentWaterlog: "गंभीर जलभराव / बाढ़",
    incidentTree: "गिरे हुए पेड़ / बिजली के तार",
    incidentSeverity: "गंभीरता का स्तर",
    severityLow: "कम (सावधानीपूर्वक गुजरने योग्य)",
    severityMedium: "मध्यम (केवल एकल लेन)",
    severityHigh: "उच्च (पूरी तरह से बंद)",
    incidentDesc: "घटना का विवरण एवं स्थान टिप्पणी",
    incidentDescPlaceholder: "सटीक मील का पत्थर, वाहन प्रतिबंध या पहचान चिह्न लिखें...",
    submitReport: "घटना रिपोर्ट सबमिट करें",
    cancel: "रद्द करें",
    driverModalTitle: "फ्लीट चालक एवं वाहन प्रोफ़ाइल",
    driverName: "चालक का पूरा नाम",
    driverLicense: "वाणिज्यिक ड्राइविंग लाइसेंस (सीडीएल)",
    vehicleReg: "वाहन पंजीकरण संख्या",
    saveProfile: "चालक प्रोफ़ाइल सहेजें",
    sosTitle: "आपातकालीन पर्वतीय एसओएस बीकन",
    sosDesc: "ज़िला आपदा नियंत्रण और एसडीआरएफ को उच्च प्राथमिकता वाला उपग्रह / एसएमएस आपातकालीन संकट बीकन भेजें।",
    triggerSos: "एसओएस आपातकालीन बीकन सक्रिय करें",
    sosTriggered: "आपातकालीन बीकन सक्रिय है",
    close: "बंद करें",

    destinationWeatherTitle: "गंतव्य का मौसम",
    terminalWeatherForecast: "गंतव्य टर्मिनल सूक्ष्म-जलवायु एवं लाइव पूर्वानुमान",
    temperature: "तापमान",
    precipitation: "वर्षा / हिमपात",
    visibility: "दृश्यता (विजिबिलिटी)",
    roadGrip: "सड़क घर्षण ग्रिप",
    terminalStation: "टर्मिनल मौसम केंद्र",
    step12SelectTitle: "चरण 1 एवं 2: प्रस्थान केंद्र (आरंभ) एवं लक्ष्य गंतव्य चुनें",
    departureHubSelected: "प्रस्थान केंद्र चुना गया",
    nowChooseDestination: "अब गंतव्य चुनें।",
    destSelected: "गंतव्य चुना गया",
    nowChooseDeparture: "अब प्रस्थान केंद्र चुनें।",
    activeRoute: "सक्रिय मार्ग",
    step12Prompt: "भूभाग-सुरक्षित मार्ग, ऊंचाई प्रवणता एवं जोखिम विश्लेषण हेतु कृपया आरंभ एवं गंतव्य का चयन करें।",
    step12Active: "दोहरा A* मार्ग समाधान सक्रिय। दूरी, यात्रा समय एवं भूस्खलन जोखिम की गणना नीचे देखें।",
    enterEndpointsBelow: "नीचे स्थान चुनें ↓",
    routeReady: "मार्ग तैयार ✓",
    strategicCorridorsBar: "सामरिक पर्वतीय माल ढुलाई गलियारे",
    clickPresets: "1-क्लिक त्वरित डिस्पैच प्रीसेट",
    himalayanGridTitle: "पूर्वी हिमालयी लॉजिस्टिक्स ग्रिड · 8 पूर्वोत्तर राज्य",
    osmGraphActive: "ओएसएम वास्तविक ग्राफ इंजन सक्रिय",
    keyCorridorsCount: "56 प्रमुख गलियारे",
    dispatcherBannerTitle: "जोखिम-जागरूक सामरिक माल ढुलाई रूटिंग एवं सुगमता",
    dispatcherBannerDesc: "असम, अरुणाचल, मेघालय, मणिपुर, मिज़ोरम, नागालैंड, सिक्किम और त्रिपुरा में मानसून, तीव्र ढलानों एवं मल्टी-एक्सल सीमाओं को संतुलित करने वाला गतिशील रूट सॉल्वर।",
    activeDeparture: "सक्रिय प्रस्थान",
    targetDestination: "लक्ष्य गंतव्य",
    corridorElevation: "गलियारा ऊंचाई",
    weatherAdvisory: "मौसम सलाह",
    awaitingInput: "स्थान चयन की प्रतीक्षा...",
    awaitingRoute: "मार्ग गणना की प्रतीक्षा...",
    standardNominal: "सामान्य मौसम",
    clearTransit: "साफ मार्ग",
    departureHub: "प्रस्थान केंद्र",
    arrivalDestination: "आगमन गंतव्य",
    vehicleAxle: "वाहन एक्सल भार",
    cargoPriority: "सामग्री प्राथमिकता",
    microclimateIngestion: "सूक्ष्म जलवायु डेटा:",
    pathComparison: "A* मार्ग तुलना",
    saferCorridor: "अधिक सुरक्षित गलियारा",
    fastestShortest: "सबसे तेज़ (छोटा मार्ग)",
    safeRiskAware: "सुरक्षित (जोखिम-मुक्त)",
    safeTrades: "सुरक्षित मार्ग अतिरिक्त",
    toAvoidSteep: "दूरी तय करता है ताकि खतरनाक भूस्खलन क्षेत्रों और गहरी घाटियों से बचा जा सके।",
    elevationProfile: "ऊंचाई प्रोफ़ाइल",
    peak: "शिखर:",
    downloadManifest: "मैनिफेस्ट डाउनलोड करें (JSON)",
    share: "साझा करें",
    copied: "कॉपी हो गया",
    reportHazard: "खतरे की रिपोर्ट करें",
    satelliteView: "सैटेलाइट दृश्य",
    roadNetwork: "सड़क नेटवर्क",
    startNavigation: "नेविगेशन शुरू करें",
    stopNavigation: "नेविगेशन रोकें",
    expandFullscreen: "फ़ुलस्क्रीन करें",
    exitFullscreen: "फ़ुलस्क्रीन से बाहर निकलें (ESC)",
    routeWaypoints: "मार्ग चेकपॉइंट एवं पड़ाव",
    highwayLegs: "राजमार्ग खंड",
    via: "होकर:",
    risk: "जोखिम",
    normal: "सामान्य",
    watch: "निगरानी",
    restricted: "प्रतिबंधित",
    all: "सभी",
    searchDistrictRoad: "जिला या सड़क खोजें...",
    activeIncidents: "सक्रिय घटनाएं:",
    transitDelay: "पारगमन विलंब:",
    routeToHub: "हब हेतु मार्ग बनाएं",
    activeClosuresTitle: "सक्रिय सड़क रुकावटें एवं भूस्खलन सलाह",
    activeClosuresSubtitle: "सत्यापित पर्वतीय दर्रा रुकावटें, भू-सेंसर चेतावनी एवं आधिकारिक वैकल्पिक चक्कर मार्ग।",
    reportRoadHazard: "सड़क खतरे की रिपोर्ट करें",
    closureBadge: "बंद",
    spot: "स्थान:",
    cause: "कारण:",
    avoid: "बचें:",
    recommendedDetourLabel: "अनुशंसित चक्कर मार्ग:",
    applyDetour: "चक्कर मार्ग लागू करें",
    platformArchitecture: "प्लेटफ़ॉर्म वास्तुकला एवं आधिकारिक डेटा स्रोत",
    platformArchitectureSub: "राहसेतु रूटिंग इंजन को संचालित करने वाले पारदर्शिता और व्याख्यात्मक सिद्धांत।",
    osmTopology: "ओएसएम नेटवर्क ग्राफ टोपोलॉजी",
    northeastMultiModal: "पूर्वोत्तर भारत मल्टी-मोडल रोड ग्राफ",
    northeastMultiModalDesc: "पायोस्मियम एवं ओएसएमएनएक्स द्वारा जियोफैब्रिक ओपनस्ट्रीटमैप पीबीएफ से निकाला गया। इसमें 8 पूर्वोत्तर राज्यों में 5,814 नोड और 13,681 निर्देशित किनारे शामिल हैं।",
    graphEdgesCaption: "13,681 निर्देशित किनारे · 8 राज्य",
    annualFatalitiesNationwide: "देशभर में वार्षिक मौतें",
    morthCensus: "MoRTH रिपोर्ट: पर्वतीय घाटों पर दुर्घटना गंभीरता 45.2% है।",
    graphExtractionTitle: "1. ग्राफ निष्कर्षण",
    graphExtractionDesc: "ओपनस्ट्रीटमैप सड़क मार्गों को सतह और ढलान टैग वाले भारित किनारों में बदला गया।",
    costWeightingTitle: "2. किनारा लागत भारण",
    costWeightingDesc: "वाहन एक्सल सीमा, माल संवेदनशीलता एवं वर्षा की तीव्रता के आधार पर जोखिम भार निर्धारित।",
    dualPathSolveTitle: "3. दोहरा मार्ग समाधान",
    dualPathSolveDesc: "इंजन एक ही ग्राफ पर दो बार A* चलाता है: सबसे तेज़ समय और न्यूनतम जोखिम के लिए।",
    platformScopeTitle: "प्लेटफ़ॉर्म दायरा एवं संचालन सीमाएं",
    platformScopeDesc: "राहसेतु पर्वतीय माल ढुलाई के लिए एक व्याख्यात्मक प्रणाली है। टेलीमेट्री डेटा भूवैज्ञानिक सर्वेक्षणों पर आधारित है। आधिकारिक आपातकालीन यात्रा आपदा प्रबंधन सलाहों के अनुरूप है।",
    footerBrandText: "राहसेतु",
    footerSub: "· पूर्वोत्तर भारत आपातकालीन लॉजिस्टिक्स रूटिंग",
    footerCopyrightText: "ओपनस्ट्रीटमैप डेटा © ओपनस्ट्रीटमैप योगदानकर्ता · राहसेतु लॉजिस्टिक्स प्लेटफ़ॉर्म।",
    driverProfileTitle: "फ्लीट ड्राइवर एवं वाहन प्रोफ़ाइल",
    driverNameLabel: "चालक का नाम",
    vehicleRegLabel: "वाहन पंजीकरण संख्या",
    driverMobileLabel: "चालक का मोबाइल नंबर",
    trustedEmergencyContactLabel: "विश्वसनीय आपातकालीन संपर्क",
    cancelBtn: "रद्द करें",
    saveProfileBtn: "प्रोफ़ाइल सहेजें",
    emergencyDistressSos: "आपातकालीन संकट एसओएस (SOS)",
    vehicleLabel: "वाहन:",
    driverLabel: "चालक:",
    corridorLabel: "गलियारा:",
    statusLabel: "स्थिति:",
    transmittingGps: "जीपीएस प्रसारित हो रहा है...",
    dispatchedToAuthorities: "अधिकारियों को भेजा गया (सक्रिय)",
    readyToTransmit: "प्रसारण हेतु तैयार",
    callNdrf: "एनडीआरएफ को कॉल करें (1078)",
    callFleetBase: "फ्लीट बेस को कॉल करें",
    reportHighwayHazard: "राजमार्ग खतरे की रिपोर्ट करें",
    captureOrUpload: "लाइव सड़क साक्ष्य कैप्चर या अपलोड करें",
    snapPhoto: "फोटो लें",
    startCamera: "कैमरा चालू करें",
    upload: "अपलोड करें",
    submitHazardReport: "खतरा रिपोर्ट सबमिट करें",
    hazardReportSuccess: "खतरे की रिपोर्ट सफलतापूर्वक दर्ज की गई।",

    commodities: {
      medical: {
        name: "दवाएं एवं टीके",
        badge: "कोल्ड-चेन / जीवन रक्षक",
        desc: "तापमान-संवेदनशील दवाएं एवं रक्त बैंक इकाइयां। कई दिनों के सड़क जाम के लिए शून्य सहनशीलता।",
      },
      agro: {
        name: "कृषि एवं बागवानी उपज",
        badge: "जल्दी खराब होने वाला सामान",
        desc: "पहाड़ी किसानों का अदरक, संतरा, कीवी और कृषि उत्पाद। फसल कटाई के बाद खराब होने से बचाने के लिए त्वरित वितरण।",
      },
      pds: {
        name: "पीडीएस खाद्य आपूर्ति / अनाज",
        badge: "आवश्यक वस्तुएं",
        desc: "दूरदराज के उप-मंडलीय गोदामों के लिए एफसीआई बफर अनाज भंडार और दालें। पुल-सुरक्षित माल मार्गों की मांग।",
      },
      fuel: {
        name: "पीओएल / पेट्रोलियम एवं एलपीजी",
        badge: "खतरनाक ज्वलनशील",
        desc: "थोक सड़क पेट्रोलियम टैंकर और सिलेंडर। तीव्र हेयरपिन मोड़ वाले वैकल्पिक रास्तों से पूरी तरह प्रतिबंधित।",
      },
      construction: {
        name: "बुनियादी ढांचा एवं सीमेंट",
        badge: "भारी पूंजीगत माल",
        desc: "राजमार्ग और सीमा सड़क इंजीनियरिंग के लिए स्टील सरिया, पुल ट्रस और गिट्टी।",
      },
    },

    vehicles: {
      heavy: {
        name: "भारी मालवाहक (28 टन)",
        badge: "28 टन मल्टी-एक्सल",
        desc: "बहु-धुरी भारी परिवहन। हेयरपिन मोड़, खड़ी चढ़ाई और पुलों पर अत्यधिक सावधानी।",
      },
      standard: {
        name: "वाणिज्यिक ट्रक (16 टन)",
        badge: "16 टन कार्गो",
        desc: "मानक लॉजिस्टिक्स वाहक। संतुलित पहाड़ी गति और राजमार्ग दक्षता।",
      },
      light: {
        name: "लाइट 4x4 / आपातकालीन",
        badge: "4x4 उपयोगिता",
        desc: "हल्का माल या आपातकालीन वाहन। कच्ची पहाड़ी पगडंडियों पर अत्यधिक चुस्त।",
      },
    },

    weather: {
      clear: {
        name: "साफ़ / सूखा",
        badge: "उत्कृष्ट",
        desc: "सामान्य पारगमन गति और सुरक्षित सड़क स्थिति के साथ अनुकूल मौसम।",
      },
      monsoon: {
        name: "मानसून की मूसलाधार बारिश",
        badge: "उच्च खतरा",
        desc: "सक्रिय मानसूनी वर्षा। भूस्खलन की अत्यधिक संभावना और नदी उफान का जोखिम।",
      },
      snow: {
        name: "शीतकालीन बर्फबारी",
        badge: "बर्फ चेतावनी",
        desc: "ऊंचे दर्रों पर शून्य से नीचे तापमान, काली बर्फ और बर्फबारी के कारण धीमी गति।",
      },
    },
  },

  as: {
    brandName: "ৰাহসেতু",
    brandSubtitle: "পাৰ্বত্য লজিষ্টিক আৰু কৌশলগত সামগ্ৰী পৰিবহণ",
    navOverview: "অৱলোকন",
    navDispatcher: "ৰুট ডিচপেচাৰ",
    navDistricts: "জিলা স্থিতি",
    navArchitecture: "তথ্য আৰু স্থাপত্য",
    navSignIn: "লগ ইন",
    navAccount: "ফ্লিট একাউণ্ট",
    navSignOut: "লগ আউট",
    emergencySos: "জৰুৰীকালীন SOS",
    autoDetected: "স্বয়ংক্রিয়ভাৱে চিনাক্ত (ছিষ্টেম)",
    selectLanguage: "ভাষা নিৰ্বাচন কৰক",
    lightMode: "লাইট ম'ড",
    darkMode: "ডাৰ্ক ম'ড",
    activeIncidentsBanner: "সক্ৰিয় পথ অৱৰোধ (৪টা কৰিডৰ সীমিত)",
    inspect: "পৰীক্ষা কৰক",
    dismiss: "বাতিল কৰক",

    tabProblem: "অৱলোকন",
    tabDispatcher: "ডিচপেচাৰ",
    tabDistricts: "জিলাসমূহ",
    tabAdvisories: "সতৰ্কবাৰ্তা",
    tabSystem: "ছিষ্টেম আৰু তথ্য",

    heroBadge: "ৰাষ্ট্ৰীয় পাৰ্বত্য পণ্য লজিষ্টিক গ্ৰিড · ৮ উত্তৰ-পূব ৰাজ্য",
    welcomeTo: "স্বাগতম",
    heroSubtitle: "কৃটিম বুদ্ধিমত্তা চালিত জলবায়ু-সহনশীল লজিষ্টিক গ্ৰিড",
    heroDescription: "পূব হিমালয়ৰ বাবে নিৰ্মিত ব্যাখ্যাযোগ্য, বহুমুখী পণ্য পৰিবহণ ব্যৱস্থা। ৮খন উত্তৰ-পূব ৰাজ্যত লাইভ ভূমিস্খলন নিৰীক্ষণ, দলং ক্ষমতা নিৰ্ধাৰণ, বাৰিষাৰ সতৰ্কতা আৰু অফলাইন ফ্লিট ডিচপেচ।",
    getStarted: "আৰম্ভ কৰক",
    openDispatcher: "ডিচপেচাৰ খোলক",
    driverLogin: "চালকৰ প্ৰৱেশ",
    statStates: "৮ খন ৰাজ্য",
    statStatesSub: "সম্পূৰ্ণ উত্তৰ-পূব কভাৰেজ",
    statHazards: "৪০০+ নিৰীক্ষিত বিপদ",
    statHazardsSub: "জিএছআই ভূমিস্খলন তথ্য",
    statSolvers: "দ্বৈত A* ইঞ্জিন",
    statSolversSub: "নিৰ্ধাৰিত সময় আৰু সুৰক্ষা",
    statBeacons: "২৪/৭ ফিল্ড বীকন",
    statBeaconsSub: "শূন্য-সংকেত মেছ সক্ষম",

    advisoriesTitle: "সক্ৰিয় পাৰ্বত্য পথ সতৰ্কবাৰ্তা",
    advisoriesSubtitle: "মুখ্য উত্তৰ-পূব ৰাজপথসমূহত বাস্তৱ সময়ৰ পথ অৱৰোধ, গধুৰ এক্সল সীমাবদ্ধতা আৰু বাৰিষাৰ সতৰ্কবাৰ্তা",
    inspectInDispatcher: "ডিচপেচাৰত পৰীক্ষা কৰক",
    critical: "অতি সংকটজনক",
    high: "উচ্চ বিপদ",
    avoidTraffic: "সাৱধান হওক / এৰাই চলক",
    recommendedDetour: "অনুমোদিত বিকল্প পথ",
    liveHighwayAdvisory: "পোনপটীয়া ৰাজপথ সতৰ্কবাৰ্তা",

    whyRaahSetu: "ৰাহসেতু কিয়?",
    problemTitle: "উত্তৰ-পূবৰ পাৰ্বত্য প্ৰত্যাহ্বান",
    problemDesc: "পাৰ্বত্য হিমালয় অঞ্চলত সাধাৰণ নেভিগেশ্বনে সঠিক বাট দেখুৱাব নোৱাৰে। এইবোৰে গধুৰ ট্ৰাকসমূহক ঠেক ভগা পথ, দুৰ্বল বেইলি দলং আৰু বাৰিষাৰ বোকা-পানীৰ মাজলৈ পঠিয়াই দিয়ে।",
    solutionTitle: "আমাৰ ৩-স্তম্ভযুক্ত সমাধান",
    pillar1Title: "এক্সল ওজন আৰু ক্লিয়াৰেন্স পৰীক্ষা",
    pillar1Desc: "যাত্ৰাৰ পূৰ্বে দলঙৰ বহন ক্ষমতা আৰু তীব্ৰ কেঁকুৰীৰ বিপৰীতে গাড়ীৰ ওজন পৰীক্ষা কৰে।",
    pillar2Title: "দ্বৈত-পথ নিৰ্ধাৰিত পথ পৰিকল্পনা",
    pillar2Desc: "ভূ-তাত্বিক ভূমিস্খলন সূচক ব্যৱহাৰ কৰি দ্ৰুততম পোনপটীয়া পথ আৰু সুৰক্ষিত বিকল্প পথ দুয়োটা গণনা কৰে।",
    pillar3Title: "শূন্য-নেটৱৰ্ক অফলাইন ব্যৱস্থা",
    pillar3Desc: "উচ্চ পৰ্বতীয়া অঞ্চলত নেটৱৰ্ক নথকা অৱস্থাতো পথ নিৰ্দেশনা আৰু জৰুৰীকালীন SOS সংযোগ বাহাল ৰাখে।",
    strategicCorridorsTitle: "কৌশলগত উত্তৰ-পূব পথসমূহ",
    strategicCorridorsSubtitle: "উত্তৰ-পূবৰ ৰাজধানীসমূহক ৰাষ্ট্ৰীয় লজিষ্টিকৰ সৈতে সংযোগ কৰা জীৱনৰেখাসমূহ",
    readyToDispatch: "পাৰ্বত্য পণ্য প্ৰেৰণ কৰিবলৈ সাজুনে?",
    readySubtitle: "অসম, ছিকিম, অৰুণাচল, মেঘালয়, মণিপুৰ, মিজোৰাম, নাগালেণ্ড আৰু ত্ৰিপুৰাত সুৰক্ষিত পণ্য পথ গণনা কৰক।",
    launchDispatcher: "ৰুট ডিচপেচাৰ আৰম্ভ কৰক",
    driverPortal: "চালকৰ প'ৰ্টেল",

    originHub: "উৎস কেন্দ্ৰ",
    destinationHub: "গন্তব্য কেন্দ্ৰ",
    selectOriginPlaceholder: "উৎস চহৰ বাছক",
    selectDestPlaceholder: "গন্তব্য চহৰ বাছক",
    searchCity: "চহৰ বা ৰাজ্য বিচাৰক...",
    snapOriginLiveGps: "বৰ্তমান জিপিএছ স্থান সংলগ্ন কৰক",
    voiceInput: "কণ্ঠেৰে কওক",
    listening: "শুনি আছোঁ...",
    speakPrompt: "মাইক টিপি চহৰৰ নাম কওক (যেনে গুৱাহাটীৰ পৰা গেংটক)",
    swap: "সলনি কৰক",
    clear: "মচি পেলাওক",
    cargoPriorityTitle: "অত্যাৱশ্যকীয় সামগ্ৰী অগ্ৰাধিকাৰ",
    vehicleProfileTitle: "যান-বাহন প্রেৰণ প্ৰ’ফাইল",
    weatherConditionTitle: "বতৰ আৰু পথৰ অৱস্থা",
    calculateButton: "বহুমুখী পথ গণনা কৰক",
    calibratingRoute: "পথ গণনা কৰা হৈছে...",
    compareRoutes: "দ্ৰুততম বনাম আটাইতকৈ সুৰক্ষিত পথ তুলনা",
    safeRiskRoute: "সুৰক্ষিত বিপদ-সচেতন পথ",
    fastestCorridor: "দ্ৰুততম পোনপটীয়া পথ",
    estTime: "আনুমানিক সময়",
    distance: "দূৰত্ব",
    riskIndex: "বিপদ সূচক",
    whySelectedTitle: "এই পথটো কিয় নিৰ্বাচন কৰা হ'ল",
    whySelectedDesc: "ভৌগোলিক অৱস্থা, দলঙৰ ক্ষমতা আৰু ভূমিস্খলনৰ সম্ভাৱনা বিশ্লেষণ কৰা বিশদ তথ্য।",
    terrainElevation: "উচ্চতা আৰু ঢালৰ খতিয়ান",
    turnDirections: "ধাপে ধাপে পথ নিৰ্দেশনা",
    startTransit: "নেভিগেশ্বন আৰম্ভ কৰক",
    stopTransit: "নেভিগেশ্বন বন্ধ কৰক",
    reportIncidentButton: "বিপদ বা অৱৰোধ ৰিপৰ্ট কৰক",
    locationsAvailable: "স্থান উপলব্ধ",
    nextHub: "পৰৱৰ্তী কেন্দ্ৰ",
    speed: "গতি",

    districtHealthTitle: "জিলা-ভিত্তিক সংযোগ স্থিতি (৮ উত্তৰ-পূব ৰাজ্য)",
    districtHealthSubtitle: "বাস্তৱ সময়ৰ সংযোগ স্থিতি, বিলম্বৰ তথ্য আৰু সক্ৰিয় ঘটনা নিৰীক্ষণ (উত্তৰ-পূব পাৰ্বত্য লজিষ্টিক নিৰ্দেশনা)।",
    searchDistrictPlaceholder: "জিলা নাইবা পথ বিচাৰক...",
    filterAllStates: "সকলো ৰাজ্য",
    colDistrictState: "জিলা আৰু ৰাজ্য",
    colHighway: "প্ৰাথমিক ৰাজপথ",
    colStatus: "সংযোগৰ স্থিতি",
    colDelay: "গড় বিলম্ব",
    colIncidents: "সক্ৰিয় বিপদ",
    colAction: "পদক্ষেপ",
    inspectCorridorBtn: "কৰিডৰ চাওক",
    noDistricts: "কোনো মিল থকা জিলা পোৱা নগ'ল।",
    statusNormal: "স্বাভাৱিক",
    statusWatch: "সতৰ্কতা",
    statusRestricted: "সীমাবদ্ধ",

    dataPageTitle: "লজিষ্টিক তথ্য আৰু ইঞ্জিন স্থাপত্য",
    dataPageSubtitle: "অ'এছএম পথ তথ্য, জিএছআই ভূমিস্খলন নিৰীক্ষণ আৰু বতৰ বিজ্ঞান বিভাগৰ তথ্যৰে চালিত নিৰ্ধাৰিত দ্বৈত পথ ইঞ্জিন।",
    monsoonLandslides: "৪০০+ বাৰিষাৰ ভূমিস্খলন",
    gsiRecorded: "জিএছআইৰ দ্বাৰা নথিভুক্ত ভয়ংকৰ শিলাবৃষ্টি আৰু বোকাৰ অৱৰোধ।",
    osmGraphs: "৮ ৰাজ্যৰ অ'এছএম পথ তথ্য",
    extractedPyosmium: "পাইয়োছমিয়াম আৰু অ'এছএমএনএক্সৰ জৰিয়তে প্ৰস্তুত।",
    dualPathEngine: "দ্বৈত-পথ A* ইঞ্জিন",
    deterministicEngine: "নিৰ্ধাৰিত ইঞ্জিন",
    priorityQueue: "পৰ্বতীয়া ভৌগোলিক তথ্যৰ সৈতে অগ্ৰাধিকাৰ কিউ।",
    howEngineComputes: "ইঞ্জিনে কেনেদৰে পথ নিৰ্ণয় কৰে",
    step1: "১. পথ তথ্য আহৰণ",
    step1Text: "ৰাজপথসমূহক পৃষ্ঠ আৰু ঢালৰ তথ্যসহ নিৰ্দেশিত পথলৈ ৰূপান্তৰ কৰা হৈছে।",
    step2: "২. পথৰ ক্ষতিপূৰণ নিৰ্ধাৰণ",
    step2Text: "গাড়ীৰ এক্সল সীমা, সামগ্ৰীৰ প্ৰকৃতি আৰু বৰষুণৰ পৰিমাণ অনুসৰি পথৰ বিপদ নিৰ্ধাৰণ কৰা হয়।",
    step3: "৩. দ্বৈত-পথ সমাধান",
    step3Text: "ইঞ্জিনে একেখন তথ্যৰ ওপৰতে দুবাৰ A* চলায়: এবাৰ কম সময়ৰ বাবে আৰু এবাৰ নূন্যতম বিপদৰ বাবে।",
    disclaimerTitle: "প্লেটফৰ্মৰ পৰিসীমা আৰু কাৰ্যকৰী সীমাবদ্ধতা",
    disclaimerText: "ৰাহসেতু হৈছে পাৰ্বত্য অঞ্চলৰ পণ্য পৰিবহণৰ বাবে নিৰ্মিত এক ব্যৱস্থা। ইয়াত সন্নিৱিষ্ট তথ্যসমূহ ভূ-তাত্বিক জৰীপ আৰু অফলাইন নিৰীক্ষণৰ ওপৰত আধাৰিত। চৰকাৰী জৰুৰীকালীন পৰিবহণে সংশ্লিষ্ট বিভাগৰ নিৰ্দেশনা মানি চলে।",
    footerCopyright: "অ'পেনষ্ট্ৰীটমেপ তথ্য © অ'পেনষ্ট্ৰীটমেপ অৱদানকাৰী · ৰাহসেতু লজিষ্টিক প্লেটফৰ্ম।",
    footerBrand: "ৰাহসেতু · উত্তৰ-পূব ভাৰত জৰুৰীকালীন লজিষ্টিক পথ নিৰ্ণয়",

    authBadge: "চৰকাৰী ডিচপেচাৰ প্ৰৱেশ",
    authTitle: "ফ্লিট আৰু চালকৰ প্ৰমাণীকৰণ",
    authSubtitle: "পাৰ্বত্য লজিষ্টিক ফ্লিটৰ চালক, জৰুৰীকালীন বিষয়া আৰু ৰাজপথ নিৰীক্ষকসকলৰ বাবে সুৰক্ষিত প্ৰৱেশ।",
    emailLabel: "ইমেইল আই ডি",
    emailPlaceholder: "driver@raahsetu.in নাইবা fleet@logistics.gov.in",
    passwordLabel: "পাছৱৰ্ড",
    passwordPlaceholder: "আপোনাৰ পাছৱৰ্ড লিখক",
    trustedPersonLabel: "বিশ্বস্ত ব্যক্তিৰ নম্বৰ (জৰুৰীকালীন SOS যোগাযোগ)",
    trustedPersonPlaceholder: "+91 94350 99881 (১০-অংকৰ ম'বাইল নম্বৰ)",
    trustedPersonHelp: "নেটৱৰ্কহীন পাহাৰীয়া অঞ্চলত জৰুৰীকালীন সংকট আৰু SOS বাৰ্তা প্ৰেৰণৰ বাবে নিৰ্দিষ্ট বিশ্বস্ত ব্যক্তি।",
    captchaLabel: "সুৰক্ষা ক'ড (কেপচা)",
    captchaPlaceholder: "ওপৰৰ ৫-অক্ষৰৰ ক'ডটো লিখক",
    captchaHelp: "ক'ডটো পঢ়াত অসুবিধা হ'লে সতেজ কৰক বুটামত টিপক।",
    captchaError: "সুৰক্ষা ক'ডটো মিল খোৱা নাই। এটা নতুন ক'ড সৃষ্টি কৰা হৈছে।",
    signInBtn: "ডিচপেচাৰত প্ৰৱেশ কৰক →",
    signingIn: "তথ্য পৰীক্ষা কৰা হৈছে...",
    backToPlatform: "প্লেটফৰ্মলৈ উভতি যাওক",

    verificationTitle: "ইমেইল পৰীক্ষা কৰক",
    verificationSubtitle: "লৈ প্ৰেৰণ কৰা ৬-অংকৰ পৰীক্ষণ ক'ড প্ৰৱিষ্ট কৰক",
    verificationCodeLabel: "পৰীক্ষণ ক'ড (OTP)",
    verificationCodePlaceholder: "৬-অংকৰ ক'ড দিয়ক",
    verifyAndSignInBtn: "পৰীক্ষা কৰক আৰু ছাইন ইন কৰক",
    resendCodeBtn: "ক'ড পুনৰ প্ৰেৰণ কৰক",
    resendIn: "পুনৰ প্ৰেৰণৰ সময়",
    changeEmail: "ইমেইল সলনি কৰক",
    codeSentNotice: "আপোনাৰ ইমেইলত ৬-অংকৰ সুৰক্ষা ক'ড প্ৰেৰণ কৰা হৈছে।",
    codeSentSuccess: "নতুন পৰীক্ষণ ক'ড প্ৰেৰণ কৰা হ'ল!",
    invalidCode: "ভুল পৰীক্ষণ ক'ড। অনুগ্ৰহ কৰি আপোনাৰ ইনবক্স চাওক।",
    codeExpired: "ক'ডৰ ম্যাদ উকলিল। অনুগ্ৰহ কৰি নতুন ক'ড অনুৰোধ কৰক।",
    simulatedEmailNotice: "লাইভ ইমেইল প্ৰেৰণ অনুকৰণ / পৰীক্ষামূলক ক'ড:",
    clickToFill: "স্বয়ংক্রিয়ভাৱে পূৰণ কৰিবলৈ ক্লিক কৰক",
    signUpTitle: "ফ্লীট একাউণ্ট সৃষ্টি কৰক",
    signUpSubtitle: "পৰ্বতীয় লজিষ্টিক্স ফ্লীট চালক, জৰুৰীকালীন প্ৰেৰক বা ৰাজ্যিক ৰাজপথ নিৰীক্ষণ বিষয়া হিচাপে পঞ্জীয়ন কৰক।",
    confirmPasswordLabel: "পাছৱৰ্ড নিশ্চিত কৰক",
    confirmPasswordPlaceholder: "আপোনাৰ সুৰক্ষিত পাছৱৰ্ড পুনৰ দিয়ক",
    passwordMismatch: "পাছৱৰ্ড মিলা নাই। অনুগ্ৰহ কৰি পুনৰ দিয়ক।",
    createAccountBtn: "একাউণ্ট সৃষ্টি কৰক আৰু সত্যাপন কৰক →",
    alreadyHaveAccount: "ইতিমধ্যে একাউণ্ট আছে?",
    dontHaveAccount: "একাউণ্ট নাই?",
    verifiedSigningIn: "সত্যাপিত! লগ ইন হৈ আছে...",
    expiresInMins: "10 মিনিটত সমাপ্ত হ'ব",
    copiedText: "কপি হৈছে!",
    groundRealityBadge: "মাটিৰ বাস্তৱতা আৰু MoRTH দুৰ্ঘটনা লেখা",
    groundRealityTitle: "পৰ্বতীয় ৰাজপথ লজিষ্টিক্সৰ জীৱন-মৰণৰ বাস্তৱতা",
    groundRealityDesc: "পথ পৰিবহন আৰু ৰাজপথ মন্ত্ৰালয় (MoRTH), ৰাষ্ট্ৰীয় অপৰাধ ৰেকৰ্ড বিউৰো (NCRB) আৰু ভাৰতীয় ভূতাত্ত্বিক সৰ্বেক্ষণ (GSI)ৰ চৰকাৰী তথ্যই এক গুৰুতৰ আঞ্চলিক লজিষ্টিক্স সংকট নথিভুক্ত কৰে।",
    stat1Value: "১,৬৮,৪৯১",
    stat1Label: "বাৰ্ষিক ৰাষ্ট্ৰীয় মৃত্যু সংখ্যা",
    stat1Desc: "MoRTH-ৰ চৰকাৰী লেখা অনুসৰি, পৰ্বতীয় ঘাট অংশত দুৰ্ঘটনাত মৃত্যুৰ হাৰ ৪৫.২%—সমতল ৰাজপথৰ দুৰ্ঘটনাতকৈ প্ৰায় দুগুণ।",
    stat1Source: "উৎস: MoRTH পথ দুৰ্ঘটনা প্ৰতিবেদন",
    stat2Value: "৪০০+",
    stat2Label: "বাৰ্ষিক প্ৰধান ভূমিস্খলন",
    stat2Desc: "GSI ভূমিস্খলন ডেটাবেছে প্ৰতি বাৰিষাত ৪০০-ৰো অধিক গুৰুতৰ শিলাপাত আৰু ধ্বংসাৱশেষ স্খলন নথিভুক্ত কৰে, যিয়ে NH-6, NH-2 আৰু NH-13-ৰ দৰে জীৱনৰেখা সপ্তাহৰ বাবে সম্পূৰ্ণৰূপে বিচ্ছিন্ন কৰে।",
    stat2Source: "উৎস: ভাৰতীয় ভূতাত্ত্বিক সৰ্বেক্ষণ (GSI)",
    stat3Value: "৬,২০০+",
    stat3Label: "উত্তৰ-পূবৰ গলিত প্ৰাণ",
    stat3Desc: "ব্ৰেক বিকল, অত্যধিক ঢাল আৰু কিনাৰৰ খাদৰ বাবে যোৱা দশকত উত্তৰ-পূব পৰ্বতীয় অঞ্চলত ট্ৰাক চালক, সহ-চালক আৰু যাত্ৰীয়ে প্ৰাণ হেৰুৱাইছে।",
    stat3Source: "উৎস: আঞ্চলিক NCRB আৰক্ষী অভিলেখ",
    stat4Value: "₹৩,৫০০ কোটি",
    stat4Label: "বাৰ্ষিক অৰ্থনৈতিক মালবাহী পলম",
    stat4Desc: "জীৱনদায়ক ঔষধ, অক্সিজেন চিলিণ্ডাৰ, খাদ্য ৰেচন আৰু কৃষি সামগ্ৰী বহন কৰা কনভয়সমূহ ছেলা পাছ আৰু সোণাপুৰ টানেলৰ বাধাত আবদ্ধ হৈ থাকে।",
    stat4Source: "উৎস: লজিষ্টিক্স পৰিষদ অনুমান",
    conventionalNavTitle: "পৰম্পৰাগত উপভোক্তা নেভিগেশ্বন",
    conventionalNavBadge: "কেৱল দূৰত্ব ভিত্তিক",
    conventionalNavBullet1: "কেৱল ৰৈখিক দূৰত্ব (কিমি) হ্ৰাস কৰে, প্ৰায়ে বিপজ্জনক কেঁচা শ্বৰ্টকাট ট্ৰেক বাছি লয়।",
    conventionalNavBullet2: "পাহাৰৰ ঢালৰ প্ৰৱণতা অৱহেলা কৰে, যাৰ ফলত ১৪%+ ঢালত ব্ৰেক অতিৰিক্ত গৰম হৈ মাৰাত্মক দুৰ্ঘটনা ঘটে।",
    conventionalNavBullet3: "বহু-এক্সল দলঙৰ ভাৰ সীমাৰ বিষয়ে অজ্ঞাত, সংকীৰ্ণ বেইলি দলঙত মালবাহী ট্ৰাক আবদ্ধ হয়।",
    conventionalNavBullet4: "কোনো পণ্য অগ্ৰাধিকাৰ নাই: অস্থিৰ পেট্ৰ'লিয়াম টেংকাৰক পাতল যাত্ৰী গাড়ীৰ সৈতে একে ব্যৱহাৰ কৰে।",
    raahSetuEngineBadge: "ভূ-ভাগ দ্বৈত-সমাধান",
    explorePlatformModules: "প্লেটফৰ্ম মডিউল অন্বেষণ কৰক",
    view3dTerrain: "3D ভূ-ভাগ দৃশ্য",
    apiConnected: "ফাষ্ট-এপিআই A* সংযুক্ত",
    offlineFallback: "অফলাইন সলভাৰ সক্ৰিয়",
    calibratedGpsTelemetry: "কেলিব্ৰেটেড জিপিএছ টেলিমেট্ৰি",
    headingLabel: "দিশ",
    terminalAdvisoryLabel: "টাৰ্মিনেল পৰামৰ্শ",
    reportIncidentTitle: "পাৰ্বত্য পথ দুৰ্ঘটনা / বিপদ ৰিপৰ্ট কৰক",
    incidentType: "ঘটনাৰ প্ৰকাৰ",
    incidentLandslide: "ভূমিস্খলন / শিলাবৃষ্টি",
    incidentMudflow: "বোকাৰ প্ৰৱাহ / ধ্বংসাৱশেষ",
    incidentSubsidence: "পথ তললৈ বহি যোৱা / খহনীয়া",
    incidentBridge: "দলং দুৰ্বল / বন্ধ",
    incidentWaterlog: "পানী জমা হোৱা / বানপানী",
    incidentTree: "গছ বাগৰি পৰা / বিজুলীৰ তাঁৰ",
    incidentSeverity: "বিপদৰ মাত্ৰা",
    severityLow: "কম (সাৱধানে পাৰ হ'ব পাৰি)",
    severityMedium: "মধ্যম (কেৱল এটা লেন খোলা)",
    severityHigh: "উচ্চ (সম্পূৰ্ণৰূপে বন্ধ)",
    incidentDesc: "ঘটনাৰ সবিশেষ আৰু স্থানৰ বিৱৰণ",
    incidentDescPlaceholder: "সঠিক মাইল খুটি, বাহনৰ সীমাবদ্ধতা বা চিনাক্ত স্থান উল্লেখ কৰক...",
    submitReport: "ৰিপৰ্ট জমা দিয়ক",
    cancel: "বাতিল কৰক",
    driverModalTitle: "ফ্লিট চালক আৰু বাহনৰ প্ৰ'ফাইল",
    driverName: "চালকৰ সম্পূৰ্ণ নাম",
    driverLicense: "বাণিজ্যিক চালকৰ অনুজ্ঞাপত্ৰ (CDL)",
    vehicleReg: "বাহন পঞ্জীয়ন নম্বৰ",
    saveProfile: "প্ৰ'ফাইল সংৰক্ষণ কৰক",
    sosTitle: "জৰুৰীকালীন পাৰ্বত্য SOS বীকন",
    sosDesc: "জিলা দুৰ্যোগ ব্যৱস্থাপনা আৰু SDRF লৈ উচ্চ অগ্ৰাধিকাৰযুক্ত উপগ্ৰহ / SMS জৰুৰীকালীন সংকেত প্ৰেৰণ কৰক।",
    triggerSos: "SOS জৰুৰীকালীন সংকেত আৰম্ভ কৰক",
    sosTriggered: "জৰুৰীকালীন সংকেত সক্ৰিয়",
    close: "বন্ধ কৰক",

    destinationWeatherTitle: "গন্তব্যৰ বতৰ",
    terminalWeatherForecast: "গন্তব্য টাৰ্মিনেলৰ স্থানীয় জলবায়ু আৰু লাইভ বতৰৰ আগজাননী",
    temperature: "তাপমাত্ৰা",
    precipitation: "বৰষুণ / তুষাৰপাত",
    visibility: "দৃশ্যমানতা",
    roadGrip: "পথৰ ঘৰ্ষণ গ্ৰিপ",
    terminalStation: "টাৰ্মিনেল বতৰ বিজ্ঞান কেন্দ্ৰ",
    step12SelectTitle: "পদক্ষেপ ১ আৰু ২: প্ৰস্থান কেন্দ্ৰ (আৰম্ভণি) আৰু লক্ষ্য গন্তব্য নিৰ্বাচন কৰক",
    departureHubSelected: "প্ৰস্থান কেন্দ্ৰ নিৰ্বাচিত",
    nowChooseDestination: "এতিয়া গন্তব্য বাছক।",
    destSelected: "গন্তব্য নিৰ্বাচিত",
    nowChooseDeparture: "এতিয়া প্ৰস্থান কেন্দ্ৰ বাছক।",
    activeRoute: "সক্ৰিয় পথ",
    step12Prompt: "পাহাৰীয়া নিৰাপদ পথ, উচ্চতাৰ ঢাল আৰু বিপদ বিশ্লেষণ গণনা কৰিবলৈ প্ৰস্থান আৰু গন্তব্য নিৰ্বাচন কৰক।",
    step12Active: "দ্বৈত A* পথ বিশ্লেষণ সক্ৰিয়। দূৰত্ব, সময় আৰু ভূমিস্খলনৰ সম্ভাৱনা তলত দিয়া হৈছে।",
    enterEndpointsBelow: "তলত স্থান বাছক ↓",
    routeReady: "পথ প্ৰস্তুত ✓",
    strategicCorridorsBar: "ৰণনীতিমূলক পৰ্বতীয়া মালবাহী কৰিড'ৰ",
    clickPresets: "১-ক্লিক দ্ৰুত প্ৰেৰণ প্ৰিছেট",
    himalayanGridTitle: "পূব হিমালয়ৰ লজিষ্টিক গ্ৰিড · ৮ উত্তৰ-পূব ৰাজ্য",
    osmGraphActive: "অ'এছএম বাস্তৱ গ্ৰাফ ইঞ্জিন সক্ৰিয়",
    keyCorridorsCount: "৫৬ টা মুখ্য কৰিড'ৰ",
    dispatcherBannerTitle: "বিপদ-সচেতন ৰণনীতিমূলক মাল পৰিবহণ আৰু সংযোগ",
    dispatcherBannerDesc: "অসম, অৰুণাচল, মেঘালয়, মণিপুৰ, মিজোৰাম, নাগালেণ্ড, ছিকিম আৰু ত্ৰিপুৰাত বাৰিষা, থিয় ঢাল আৰু এক্সেল ওজনৰ সীমা পৰীক্ষা কৰি নিৰাপদ পথ নিৰ্ধাৰণ।",
    activeDeparture: "সক্ৰিয় প্ৰস্থান",
    targetDestination: "লক্ষ্য গন্তব্য",
    corridorElevation: "কৰিড'ৰৰ উচ্চতা",
    weatherAdvisory: "বতৰৰ সতৰ্কবাৰ্তা",
    awaitingInput: "স্থান নিৰ্বাচনৰ অপেক্ষা...",
    awaitingRoute: "পথ নিৰ্ধাৰণৰ অপেক্ষা...",
    standardNominal: "স্বাভাৱিক বতৰ",
    clearTransit: "পৰিষ্কাৰ পথ",
    departureHub: "প্ৰস্থান কেন্দ্ৰ",
    arrivalDestination: "আগমন গন্তব্য",
    vehicleAxle: "বাহনৰ এক্সেল ক্ষমতা",
    cargoPriority: "সামগ্ৰীৰ অগ্ৰাধিকাৰ",
    microclimateIngestion: "স্থানীয় জলবায়ু তথ্য:",
    pathComparison: "A* পথ তুলনা",
    saferCorridor: "অধিক নিৰাপদ কৰিড'ৰ",
    fastestShortest: "দ্ৰুততম (চমু পথ)",
    safeRiskAware: "নিৰাপদ (বিপদ-মুক্ত)",
    safeTrades: "নিৰাপদ পথত অতিৰিক্ত",
    toAvoidSteep: "দূৰত্ব লয় যাতে বিপজ্জনক ভূমিস্খলন আৰু খহি পৰা পাহাৰৰ অংশ এৰাই চলিব পৰা যায়।",
    elevationProfile: "উচ্চতাৰ প্ৰ'ফাইল",
    peak: "শীৰ্ষ:",
    downloadManifest: "মেনিফেষ্ট ডাউনলোড কৰক (JSON)",
    share: "শ্বেয়াৰ কৰক",
    copied: "কপি কৰা হ'ল",
    reportHazard: "বিপদৰ প্ৰতিবেদন দিয়ক",
    satelliteView: "ছেটেলাইট দৃশ্য",
    roadNetwork: "পথ নেটৱৰ্ক",
    startNavigation: "নেভিগেচন আৰম্ভ কৰক",
    stopNavigation: "নেভিগেচন বন্ধ কৰক",
    expandFullscreen: "সম্পূৰ্ণ পৰ্দাত চাওক",
    exitFullscreen: "সম্পূৰ্ণ পৰ্দা বন্ধ কৰক (ESC)",
    routeWaypoints: "পথৰ চেকপইণ্ট আৰু চহৰ",
    highwayLegs: "ঘাইপথৰ অংশ",
    via: "হৈ:",
    risk: "বিপদ",
    normal: "স্বাভাৱিক",
    watch: "নজৰদাৰী",
    restricted: "সীমাবদ্ধ",
    all: "সকলো",
    searchDistrictRoad: "জিলা বা পথ সন্ধান কৰক...",
    activeIncidents: "সক্ৰিয় ঘটনা:",
    transitDelay: "যাতায়তৰ বিলম্ব:",
    routeToHub: "কেন্দ্ৰলৈ পথ নিৰ্ধাৰণ",
    activeClosuresTitle: "সক্ৰিয় বন্ধ পথ আৰু ভূমিস্খলনৰ সতৰ্কবাৰ্তা",
    activeClosuresSubtitle: "পৰীক্ষিত পাহাৰীয়া পথ বন্ধৰ তথ্য, ভূ-চেন্চৰ সতৰ্কবাৰ্তা আৰু চৰকাৰী বিকল্প পথৰ পৰামৰ্শ।",
    reportRoadHazard: "পথৰ বিপদৰ প্ৰতিবেদন দিয়ক",
    closureBadge: "বন্ধ",
    spot: "স্থান:",
    cause: "কাৰণ:",
    avoid: "এৰাই চলক:",
    recommendedDetourLabel: "পৰামৰ্শ দিয়া বিকল্প পথ:",
    applyDetour: "বিকল্প পথ প্ৰয়োগ কৰক",
    platformArchitecture: "প্লেটফৰ্ম স্থাপত্য আৰু চৰকাৰী তথ্য উৎস",
    platformArchitectureSub: "ৰাহসেতু পথ নিৰ্ধাৰণ ইঞ্জিনৰ স্বচ্ছতা আৰু ব্যাখ্যাযোগ্য নীতিসমূহ।",
    osmTopology: "অ'এছএম নেটৱৰ্ক গ্ৰাফ টপ'লজি",
    northeastMultiModal: "উত্তৰ-পূব ভাৰতৰ বহু-মাধ্যম পথ গ্ৰাফ",
    northeastMultiModalDesc: "পায়োস্মিয়াম আৰু ওএছএমএনএক্স ব্যৱহাৰ কৰি নিষ্কাষণ কৰা হৈছে। ৮খন ৰাজ্যৰ ৫,৮১৪টা নোড আৰু ১৩,৬৮১টা পথ সংযোগ ইয়াত অন্তৰ্ভুক্ত।",
    graphEdgesCaption: "১৩,৬৮১টা পথ সংযোগ · ৮খন ৰাজ্য",
    annualFatalitiesNationwide: "দেশজুৰি বাৰ্ষিক দুৰ্ঘটনাজনিত মৃত্যু",
    morthCensus: "মৰ্থ প্ৰতিবেদন: পাহাৰীয়া ঘাট পথত দুৰ্ঘটনাৰ মাত্ৰা ৪৫.২%।",
    graphExtractionTitle: "১. গ্ৰাফ নিষ্কাষণ",
    graphExtractionDesc: "ঘাইপথসমূহক পৃষ্ঠ আৰু ঢালৰ তথ্যৰে ওজনযুক্ত পথলৈ ৰূপান্তৰ কৰা হৈছে।",
    costWeightingTitle: "২. পথৰ বিপদ নিৰ্ণয়",
    costWeightingDesc: "বাহনৰ ওজন, সামগ্ৰীৰ প্ৰকাৰ আৰু বৰষুণৰ মাত্ৰা অনুসৰি বিপদ নিৰ্ধাৰণ কৰা হয়।",
    dualPathSolveTitle: "৩. দ্বৈত পথ সমাধান",
    dualPathSolveDesc: "ইঞ্জিনে একে গ্ৰাফতে দুবাৰ A* চলায়: দ্ৰুততম আৰু আটাইতকৈ নিৰাপদ পথৰ বাবে।",
    platformScopeTitle: "প্লেটফৰ্মৰ পৰিসীমা আৰু কাৰ্য্যকৰী দিশ",
    platformScopeDesc: "ৰাহসেতু পাহাৰীয়া মাল পৰিবহণৰ বাবে এক ব্যাখ্যাযোগ্য ব্যৱস্থা। তথ্যসমূহ ভূতাত্ত্বিক জৰীপৰ ওপৰত আধাৰিত। জৰুৰীকালীন যাতায়ত দুৰ্যোগ ব্যৱস্থাপনাৰ নিৰ্দেশনা অনুসৰি হয়।",
    footerBrandText: "ৰাহসেতু",
    footerSub: "· উত্তৰ-পূব ভাৰত জৰুৰীকালীন লজিষ্টিক পথ",
    footerCopyrightText: "অ'পেনষ্ট্ৰীটমেপ তথ্য © অ'পেনষ্ট্ৰীটমেপ অৱদানকাৰী · ৰাহসেতু লজিষ্টিক প্লেটফৰ্ম।",
    driverProfileTitle: "চালক আৰু বাহনৰ তথ্য",
    driverNameLabel: "চালকৰ নাম",
    vehicleRegLabel: "বাহন পঞ্জীয়ন নম্বৰ",
    driverMobileLabel: "চালকৰ মোবাইল নম্বৰ",
    trustedEmergencyContactLabel: "বিশ্বস্ত জৰুৰীকালীন যোগাযোগ",
    cancelBtn: "বাতিল কৰক",
    saveProfileBtn: "তথ্য সংৰক্ষণ কৰক",
    emergencyDistressSos: "জৰুৰীকালীন সংকট এছঅ'এছ (SOS)",
    vehicleLabel: "বাহন:",
    driverLabel: "চালক:",
    corridorLabel: "কৰিড'ৰ:",
    statusLabel: "অৱস্থা:",
    transmittingGps: "জিপিএছ প্ৰেৰণ কৰা হৈছে...",
    dispatchedToAuthorities: "কৰ্তৃপক্ষলৈ প্ৰেৰণ কৰা হ'ল (সক্ৰিয়)",
    readyToTransmit: "প্ৰেৰণৰ বাবে সাজু",
    callNdrf: "এনডিআৰএফক কল কৰক (১০৭৮)",
    callFleetBase: "ফ্লিট বেছলৈ কল কৰক",
    reportHighwayHazard: "ঘাইপথৰ বিপদৰ প্ৰতিবেদন দিয়ক",
    captureOrUpload: "লাইভ পথৰ ফটো তোলক বা আপল'ড কৰক",
    snapPhoto: "ফটো তোলক",
    startCamera: "কেমেৰা আৰম্ভ কৰক",
    upload: "আপল'ড কৰক",
    submitHazardReport: "প্ৰতিবেদন জমা দিয়ক",
    hazardReportSuccess: "বিপদৰ প্ৰতিবেদন সফলতাৰে জমা দিয়া হ'ল।",

    commodities: {
      medical: {
        name: "ঔষধ আৰু ভেকচিন",
        badge: "ক'ল্ড-চেইন / জীৱন ৰক্ষাকাৰী",
        desc: "উত্তাপ সংবেদনশীল ঔষধ আৰু তেজ। বহু দিনীয়া পথ বন্ধৰ বাবে শূন্য সহনশীলতা।",
      },
      agro: {
        name: "কৃষি আৰু উদ্যানশস্য উৎপাদন",
        badge: "পচনশীল সামগ্ৰী",
        desc: "আদা, কমলাটেঙা, কিউই আদি পাহাৰীয়া কৃষকৰ শস্য। পচন ৰোধ কৰিবলৈ দ্ৰুত যোগান।",
      },
      pds: {
        name: "PDS খাদ্য যোগান / খাদ্যশস্য",
        badge: "অত্যাৱশ্যকীয় সামগ্ৰী",
        desc: "দূৰৱৰ্তী গুদামসমূহৰ বাবে এফ চি আইৰ মজুত শস্য আৰু দাইল। দলং-সুৰক্ষিত পথৰ প্ৰয়োজন।",
      },
      fuel: {
        name: "POL / পেট্ৰ'লিয়াম আৰু এল পি জি",
        badge: "বিপদজনক দাহ্য পদাৰ্থ",
        desc: "ট্ৰাক টেংকাৰ আৰু ছিলিণ্ডাৰ। বিপদজনক কেঁকুৰী পথৰ পৰা সম্পূৰ্ণ নিষিদ্ধ।",
      },
      construction: {
        name: "আন্তঃগাঁথনি আৰু চিমেণ্ট",
        badge: "গধুৰ মূলধনী সামগ্ৰী",
        desc: "ৰাজপথ আৰু সীমান্ত পথ নিৰ্মাণৰ বাবে ৰড, দলঙৰ গাৰ্ডাৰ আৰু শিল-বালি।",
      },
    },

    vehicles: {
      heavy: {
        name: "গধুৰ মালবাহী (২৮ টন)",
        badge: "২৮ টন মাল্টি-এক্সল",
        desc: "বহু-এক্সলযুক্ত গধুৰ বাহন। তীব্ৰ কেঁকুৰী, থিয় পাহাৰ আৰু দলঙত বিশেষ সাৱধানতা।",
      },
      standard: {
        name: "বাণিজ্যিক ট্ৰাক (১৬ টন)",
        badge: "১৬ টন কাৰ্গ'",
        desc: "মানক লজিষ্টিক বাহন। পাহাৰত সন্তুলিত গতি আৰু ৰাজপথত দক্ষতা।",
      },
      light: {
        name: "লাইট ৪x৪ / জৰুৰীকালীন",
        badge: "৪x৪ উপযোগী বাহন",
        desc: "পাতল মালবাহী বা জৰুৰীকালীন বাহন। কেঁচা পাহাৰীয়া পথত অত্যন্ত ক্ষিপ্ৰ।",
      },
    },

    weather: {
      clear: {
        name: "ফৰকাল / শুকান",
        badge: "উৎকৃষ্ট",
        desc: "স্বাভাৱিক গতি আৰু সুৰক্ষিত পথৰ সৈতে অনুকূল বতৰ।",
      },
      monsoon: {
        name: "বাৰিষাৰ ধাৰাষাৰ বৰষুণ",
        badge: "উচ্চ বিপদ",
        desc: "প্ৰৱল বাৰিষাৰ বৰষুণ। ভূমিস্খলনৰ তীব্ৰ আশংকা আৰু নদীৰ পানী ওফন্দি পৰাৰ সম্ভাৱনা।",
      },
      snow: {
        name: "শীতকালীন বৰফপাত",
        badge: "বৰফৰ সতৰ্কবাৰ্তা",
        desc: "উচ্চ পাছসমূহত শূন্যৰ তলৰ উত্তাপ, পিছল বৰফ আৰু বৰফপাতৰ বাবে গতি মন্থৰ।",
      },
    },
  },

  bn: {
    brandName: "রাহসেতু",
    brandSubtitle: "পার্বত্য লজিস্টিক ও কৌশলগত পণ্য পরিবহন",
    navOverview: "সংক্ষিপ্ত বিবরণ",
    navDispatcher: "রুট ডিসপ্যাচার",
    navDistricts: "জেলা স্বাস্থ্য",
    navArchitecture: "ডেটা ও আর্কিটেকচার",
    navSignIn: "সাইন ইন",
    navAccount: "ফ্লিট অ্যাকাউন্ট",
    navSignOut: "লগ আউট",
    emergencySos: "জরুরি এসওএস",
    autoDetected: "স্বয়ংক্রিয়ভাবে শনাক্ত (সিস্টেম)",
    selectLanguage: "ভাষা নির্বাচন করুন",
    lightMode: "লাইট মোড",
    darkMode: "ডার্ক মোড",
    activeIncidentsBanner: "সক্রিয় সড়ক অবরোধ (৪টি করিডোর সীমিত)",
    inspect: "পরিদর্শন করুন",
    dismiss: "বন্ধ করুন",

    tabProblem: "সংক্ষিপ্ত বিবরণ",
    tabDispatcher: "ডিসপ্যাচার",
    tabDistricts: "জেলাসমূহ",
    tabAdvisories: "পরামর্শ",
    tabSystem: "সিস্টেম ও ডেটা",

    heroBadge: "জাতীয় পার্বত্য মালবাহী লজিস্টিক গ্রিড · ৮টি উত্তর-পূর্ব রাজ্য",
    welcomeTo: "স্বাগতম",
    heroSubtitle: "এআই-চালিত জলবায়ু-সহনশীল লজিস্টিক গ্রিড",
    heroDescription: "পূর্ব হিমালয়ের জন্য তৈরি ব্যাখ্যামূলক, বহু-মানদণ্ড মালবাহী রাউটিং। ৮টি উত্তর-পূর্ব রাজ্য জুড়ে লাইভ ধস ঝুঁকি পর্যবেক্ষণ, সেতুর ওজন সীমা, বর্ষা সহনশীলতা এবং অফলাইন ফ্লিট ডিসপ্যাচ।",
    getStarted: "শুরু করুন",
    openDispatcher: "ডিসপ্যাচার খুলুন",
    driverLogin: "ড্রাইভার লগইন",
    statStates: "৮টি রাজ্য",
    statStatesSub: "সম্পূর্ণ উত্তর-পূর্ব কভারেজ",
    statHazards: "৪০০+ পর্যবেক্ষণকৃত বিপদ",
    statHazardsSub: "জিএসআই ধস স্ন্যাপশট",
    statSolvers: "দ্বৈত A* ইঞ্জিন",
    statSolversSub: "সুনির্দিষ্ট সময় ও নিরাপত্তা",
    statBeacons: "২৪/৭ ফিল্ড বীকন",
    statBeaconsSub: "শূন্য-নেটওয়ার্ক মেশ প্রস্তুত",

    advisoriesTitle: "সক্রিয় পার্বত্য সড়ক সতর্কতা",
    advisoriesSubtitle: "প্রধান উত্তর-পূর্ব মহাসড়কগুলিতে রিয়েল-টাইম করিডোর বন্ধ, ভারী এক্সেল সীমা এবং বর্ষার ধস সতর্কতা",
    inspectInDispatcher: "ডিসপ্যাচারে দেখুন",
    critical: "সংকটজনক",
    high: "উচ্চ ঝুঁকি",
    avoidTraffic: "সতর্ক থাকুন / এড়িয়ে চলুন",
    recommendedDetour: "পরামর্শকৃত বিকল্প রুট",
    liveHighwayAdvisory: "লাইভ হাইওয়ে সতর্কতা",

    whyRaahSetu: "কেন রাহসেতু?",
    problemTitle: "উত্তর-পূর্বের পার্বত্য সংকট",
    problemDesc: "সাধারণ ভোক্তা নেভিগেশন ভঙ্গুর হিমালয়ে ব্যর্থ হয়। এগুলি বহু-এক্সেল মালবাহী ট্রাকগুলিকে এক লেনের ভাঙা রাস্তা, দুর্বল বেইলি ব্রিজ এবং ভারী বর্ষায় সক্রিয় কাদার স্রোতে নিয়ে যায়।",
    solutionTitle: "আমাদের ৩-স্তম্ভবিশিষ্ট সমাধান",
    pillar1Title: "এক্সেল লোড ও ক্লিয়ারেন্স যাচাই",
    pillar1Desc: "যাত্রার পূর্বে সেতুর ভারবহন ক্ষমতা এবং হেয়ারপিন বাঁকের বিপরীতে গাড়ির মোট ওজন যাচাই করে।",
    pillar2Title: "দ্বৈত-পাথ সুনির্দিষ্ট রাউটিং",
    pillar2Desc: "ভূতাত্ত্বিক ধস সংবেদনশীলতা সূচক ব্যবহার করে দ্রুততম সরাসরি পথ এবং নিরাপদ বিকল্প পথ উভয়ই গণনা করে।",
    pillar3Title: "জিরো-নেটওয়ার্ক অফলাইন প্রোটোকল",
    pillar3Desc: "উঁচু পার্বত্য পাসে সেলুলার টাওয়ার ব্যর্থ হলেও রুট নির্দেশনা এবং জরুরি এসওএস সংকেত সক্রিয় রাখে।",
    strategicCorridorsTitle: "কৌশলগত উত্তর-পূর্ব করিডোর",
    strategicCorridorsSubtitle: "উত্তর-পূর্বের রাজধানীগুলিকে জাতীয় লজিস্টিকের সাথে সংযুক্তকারী পূর্ব-তালিকাভুক্ত আন্তঃরাজ্য করিডোর",
    readyToDispatch: "পার্বত্য পণ্য পরিবহনের জন্য প্রস্তুত?",
    readySubtitle: "আসাম, সিকিম, অরুণাচল, মেঘালয়, মণিপুর, মিজোরাম, নাগাল্যান্ড এবং ত্রিপুরায় ঝুঁকি-বিবেচিত রুট গণনা করুন।",
    launchDispatcher: "রুট ডিসপ্যাচার শুরু করুন",
    driverPortal: "ড্রাইভার পোর্টাল",

    originHub: "উৎস কেন্দ্র",
    destinationHub: "গন্তব্য কেন্দ্র",
    selectOriginPlaceholder: "উৎস শহর নির্বাচন করুন",
    selectDestPlaceholder: "গন্তব্য শহর নির্বাচন করুন",
    searchCity: "শহর বা রাজ্য খুঁজুন...",
    snapOriginLiveGps: "লাইভ জিপিএস অবস্থান যুক্ত করুন",
    voiceInput: "কণ্ঠে বলুন",
    listening: "শুনছি...",
    speakPrompt: "মাইকে ক্লিক করে শহরের নাম বলুন (যেমন গুয়াহাটি থেকে গ্যাংটক)",
    swap: "বদলান",
    clear: "পরিষ্কার করুন",
    cargoPriorityTitle: "প্রয়োজনীয় পণ্য অগ্রাধিকার",
    vehicleProfileTitle: "যানবাহন ডিসপ্যাচ প্রোফাইল",
    weatherConditionTitle: "আবহাওয়া ও রাস্তার পৃষ্ঠের অবস্থা",
    calculateButton: "বহু-মানদণ্ড রুট গণনা করুন",
    calibratingRoute: "রুট গণনা করা হচ্ছে...",
    compareRoutes: "দ্রুততম বনাম সবচেয়ে নিরাপদ রুট তুলনা",
    safeRiskRoute: "নিরাপদ ঝুঁকি-সচেতন রুট",
    fastestCorridor: "দ্রুততম সরাসরি করিডোর",
    estTime: "আনুমানিক সময়",
    distance: "দূরত্ব",
    riskIndex: "ঝুঁকি সূচক",
    whySelectedTitle: "এই রুটটি কেন নির্বাচিত হলো",
    whySelectedDesc: "ভূ-প্রকৃতি, সেতুর ভার ও ধসের কারণগুলি ব্যাখ্যা করে বিস্তারিত বহু-মানদণ্ড ইঞ্জিনিয়ারিং যুক্তি।",
    terrainElevation: "উচ্চতা ও ঢালের প্রোফাইল",
    turnDirections: "ধাপে ধাপে যাত্রা নির্দেশিকা",
    startTransit: "নেভিগেশন শুরু করুন",
    stopTransit: "নেভিগেশন বন্ধ করুন",
    reportIncidentButton: "দুর্ঘটনা / ঝুঁকি রিপোর্ট করুন",
    locationsAvailable: "স্থান উপলব্ধ",
    nextHub: "পরবর্তী কেন্দ্র",
    speed: "গতি",

    districtHealthTitle: "জেলা-ভিত্তিক সংযোগ অবস্থা (৮টি উত্তর-পূর্ব রাজ্য)",
    districtHealthSubtitle: "রিয়েল-টাইম সংযোগ স্থিতি, বিলম্ব রেকর্ড এবং সক্রিয় ঘটনা ট্র্যাকিং (উত্তর-পূর্ব পার্বত্য লজিস্টিক ম্যান্ডেট)।",
    searchDistrictPlaceholder: "জেলা বা রাস্তা খুঁজুন...",
    filterAllStates: "সমস্ত রাজ্য",
    colDistrictState: "জেলা ও রাজ্য",
    colHighway: "প্রধান মহাসড়ক",
    colStatus: "সংযোগ অবস্থা",
    colDelay: "গড় বিলম্ব",
    colIncidents: "সক্রিয় বিপদ",
    colAction: "পদক্ষেপ",
    inspectCorridorBtn: "করিডোর দেখুন",
    noDistricts: "কোনো মিলে যাওয়া জেলা পাওয়া যায়নি।",
    statusNormal: "স্বাভাবিক",
    statusWatch: "নজরদারি",
    statusRestricted: "সীমাবদ্ধ",

    dataPageTitle: "লজিস্টিক ডেটা ও ইঞ্জিন আর্কিটেকচার",
    dataPageSubtitle: "ওএসএম রোড গ্রাফ, জিএসআই ধস টেলিমেট্রি এবং আবহাওয়া পর্যবেক্ষণ দ্বারা চালিত সুনির্দিষ্ট দ্বৈত-উদ্দেশ্য রাউটিং ইঞ্জিন।",
    monsoonLandslides: "৪০০+ বর্ষার ধস",
    gsiRecorded: "জিএসআই কর্তৃক নথিভুক্ত তীব্র পাথর পতন ও কাদার স্রোত অবরোধ।",
    osmGraphs: "৮ রাজ্যের ওএসএম রোড গ্রাফ",
    extractedPyosmium: "পায়োসমিয়াম এবং ওএসএমএনএক্স দ্বারা নিষ্কাশিত।",
    dualPathEngine: "দ্বৈত-পাথ A* ইঞ্জিন",
    deterministicEngine: "সুনির্দিষ্ট ইঞ্জিন",
    priorityQueue: "ভূ-প্রাকৃতিক হিউরিস্টিক সহ প্রায়োরিটি কিউ।",
    howEngineComputes: "ইঞ্জিন কীভাবে রুট গণনা করে",
    step1: "১. গ্রাফ নিষ্কাশন",
    step1Text: "ওএসএম হাইওয়েগুলিকে পৃষ্ঠ ও ঢাল ট্যাগ সহ নির্দেশিত ওয়েটেড এজে রূপান্তরিত করা হয়েছে।",
    step2: "২. এজ খরচের ওয়েটিং",
    step2Text: "গাড়ির এক্সেল সীমা, পণ্যের সংবেদনশীলতা এবং বৃষ্টিপাতের তীব্রতার ভিত্তিতে এজ পেনাল্টি নির্ধারিত হয়।",
    step3: "৩. দ্বৈত-পাথ সমাধান",
    step3Text: "ইঞ্জিন অভিন্ন গ্রাফে দুবার A* চালায়: একবার দ্রুততম সময়ের জন্য, একবার সর্বনিম্ন ঝুঁকির জন্য।",
    disclaimerTitle: "প্ল্যাটফর্মের পরিধি ও কার্যকরী সীমানা",
    disclaimerText: "রাহসেতু হলো জাতীয় পার্বত্য মালবাহী করিডোরের জন্য ডিজাইন করা একটি ব্যাখ্যামূলক অপারেশনাল সিস্টেম। হাইওয়ে টেলিমেট্রি এবং বিপদের তথ্য ভূতাত্ত্বিক জরিপ এবং অফলাইন স্ন্যাপশট প্রতিফলিত করে। সরকারি জরুরি ট্রানজিট আঞ্চলিক দুর্যোগ ব্যবস্থাপনা ও মহাসড়ক কর্তৃপক্ষের নির্দেশিকা মেনে চলে।",
    footerCopyright: "ওপেনস্ট্রিটম্যাপ ডেটা © ওপেনস্ট্রিটম্যাপ অবদানকারী · রাহসেতু লজিস্টিক প্ল্যাটফর্ম।",
    footerBrand: "রাহসেতু · উত্তর-পূর্ব ভারত জরুরি লজিস্টিক রাউটিং",

    authBadge: "অফিসিয়াল ডিসপ্যাচার অ্যাক্সেস",
    authTitle: "ফ্লিট ও ড্রাইভার প্রমাণীকরণ",
    authSubtitle: "পার্বত্য লজিস্টিক ফ্লিট চালক, জরুরি ডিসপ্যাচার এবং হাইওয়ে পর্যবেক্ষণ কর্মকর্তাদের জন্য সুরক্ষিত প্রমাণপত্র।",
    emailLabel: "ইমেল আইডি",
    emailPlaceholder: "driver@raahsetu.in অথবা fleet@logistics.gov.in",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "আপনার সুরক্ষিত পাসওয়ার্ড লিখুন",
    trustedPersonLabel: "বিশ্বস্ত ব্যক্তির নম্বর (জরুরি এসওএস যোগাযোগ)",
    trustedPersonPlaceholder: "+91 94350 99881 (১০-সংখ্যার মোবাইল নম্বর)",
    trustedPersonHelp: "জিরো-নেটওয়ার্ক পাহাড়ি পাসে জরুরি সংকট সমন্বয় এবং এসওএস সংকেতের জন্য মনোনীত বিশ্বস্ত যোগাযোগ।",
    captchaLabel: "নিরাপত্তা কোড (ক্যাপচা)",
    captchaPlaceholder: "উপরের ৫-অক্ষরের কোডটি লিখুন",
    captchaHelp: "কোড পড়তে অসুবিধা হলে রিফ্রেশ বাটনে ক্লিক করুন।",
    captchaError: "নিরাপত্তা কোড মেলেনি। একটি নতুন কোড তৈরি করা হয়েছে।",
    signInBtn: "ডিসপ্যাচারে সাইন ইন করুন →",
    signingIn: "যাচাই করা হচ্ছে...",
    backToPlatform: "প্ল্যাটফর্মে ফিরে যান",

    verificationTitle: "ইমেল যাচাই করুন",
    verificationSubtitle: "এ পাঠানো ৬-সংখ্যার যাচাইকরণ কোড লিখুন",
    verificationCodeLabel: "যাচাইকরণ কোড (OTP)",
    verificationCodePlaceholder: "৬-সংখ্যার কোড লিখুন",
    verifyAndSignInBtn: "যাচাই করুন ও সাইন ইন করুন",
    resendCodeBtn: "কোড পুনরায় পাঠান",
    resendIn: "পুনরায় পাঠানোর সময়",
    changeEmail: "ইমেল পরিবর্তন করুন",
    codeSentNotice: "আপনার ইমেলে ৬-সংখ্যার সুরক্ষা কোড পাঠানো হয়েছে।",
    codeSentSuccess: "নতুন যাচাইকরণ কোড পাঠানো হয়েছে!",
    invalidCode: "ভুল যাচাইকরণ কোড। অনুগ্রহ করে আপনার ইনবক্স চেক করে আবার চেষ্টা করুন।",
    codeExpired: "কোডের মেয়াদ শেষ। অনুগ্রহ করে নতুন কোড অনুরোধ করুন।",
    simulatedEmailNotice: "লাইভ ইমেল ডিসপ্যাচ সিমুলেশন / পরীক্ষামূলক কোড:",
    clickToFill: "অটো-ফিল করতে ক্লিক করুন",
    signUpTitle: "ফ্লিট অ্যাকাউন্ট তৈরি করুন",
    signUpSubtitle: "পর্বতীয় লজিস্টিক্স ফ্লিট চালক, জরুরি প্রেরক বা রাজ্য রাজপথ পর্যবেক্ষণ কর্মকর্তা হিসেবে নিবন্ধন করুন।",
    confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
    confirmPasswordPlaceholder: "আপনার সুরক্ষিত পাসওয়ার্ড পুনরায় দিন",
    passwordMismatch: "পাসওয়ার্ড মিলছে না। অনুগ্রহ করে পুনরায় দিন।",
    createAccountBtn: "অ্যাকাউন্ট তৈরি করুন ও যাচাই করুন →",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    dontHaveAccount: "অ্যাকাউন্ট নেই?",
    verifiedSigningIn: "যাচাই সম্পন্ন! লগ ইন হচ্ছে...",
    expiresInMins: "১০ মিনিটে মেয়াদ শেষ",
    copiedText: "কপি হয়েছে!",
    groundRealityBadge: "মাঠ পর্যায়ের বাস্তবতা ও MoRTH দুর্ঘটনা শুমারি",
    groundRealityTitle: "পর্বতীয় রাজপথ লজিস্টিক্সের জীবন-মরণ বাস্তবতা",
    groundRealityDesc: "সড়ক পরিবহন ও মহাসড়ক মন্ত্রণালয় (MoRTH), জাতীয় অপরাধ রেকর্ড ব্যুরো (NCRB) এবং ভারতীয় ভূতাত্ত্বিক জরিপ (GSI)-এর সরকারি তথ্য একটি গুরুতর আঞ্চলিক লজিস্টিক্স সংকট নথিভুক্ত করে।",
    stat1Value: "১,৬৮,৪৯১",
    stat1Label: "বার্ষিক জাতীয় মৃত্যু সংখ্যা",
    stat1Desc: "MoRTH-এর সরকারি শুমারি অনুসারে, পর্বতীয় ঘাট অংশে দুর্ঘটনায় মৃত্যুর হার ৪৫.২%—সমতল মহাসড়ক দুর্ঘটনার প্রায় দ্বিগুণ।",
    stat1Source: "উৎস: MoRTH সড়ক দুর্ঘটনা প্রতিবেদন",
    stat2Value: "৪০০+",
    stat2Label: "বার্ষিক প্রধান ভূমিধস",
    stat2Desc: "GSI ভূমিধস ডেটাবেস প্রতি বর্ষায় ৪০০-এর বেশি গুরুতর পাথর পতন ও ধ্বংসাবশেষ স্খলন নথিভুক্ত করে, যা NH-6, NH-2 এবং NH-13-এর মতো জীবনরেখাকে সপ্তাহের জন্য সম্পূর্ণ বিচ্ছিন্ন করে।",
    stat2Source: "উৎস: ভারতীয় ভূতাত্ত্বিক জরিপ (GSI)",
    stat3Value: "৬,২০০+",
    stat3Label: "উত্তর-পূর্ব করিডোরে হারানো প্রাণ",
    stat3Desc: "ব্রেক বিকল, চরম ঢাল এবং কিনারার খাদের কারণে গত দশকে উত্তর-পূর্ব পর্বতমালায় ট্রাক চালক, সহ-চালক এবং যাত্রীরা প্রাণ হারিয়েছেন।",
    stat3Source: "উৎস: আঞ্চলিক NCRB পুলিশ রেকর্ড",
    stat4Value: "₹৩,৫০০ কোটি",
    stat4Label: "বার্ষিক অর্থনৈতিক মালবাহী বিলম্ব",
    stat4Desc: "জীবন রক্ষাকারী ওষুধ, অক্সিজেন সিলিন্ডার, খাদ্য রেশন এবং কৃষি পণ্য বহনকারী কনভয়গুলি সেলা পাস এবং সোনাপুর টানেলের বাধায় আটকে থাকে।",
    stat4Source: "উৎস: লজিস্টিক্স কাউন্সিল অনুমান",
    conventionalNavTitle: "প্রচলিত ভোক্তা নেভিগেশন",
    conventionalNavBadge: "শুধু দূরত্ব ভিত্তিক",
    conventionalNavBullet1: "শুধুমাত্র রৈখিক দূরত্ব (কিমি) কমায়, প্রায়ই বিপজ্জনক কাঁচা শর্টকাট ট্র্যাক বেছে নেয়।",
    conventionalNavBullet2: "পাহাড়ের ঢালের প্রবণতা উপেক্ষা করে, যার ফলে ১৪%+ ঢালে ব্রেক অতিরিক্ত গরম হয়ে মারাত্মক দুর্ঘটনা ঘটে।",
    conventionalNavBullet3: "বহু-অক্ষ সেতুর ভার সীমা সম্পর্কে অজ্ঞাত, সংকীর্ণ বেইলি সেতুতে মালবাহী ট্রাক আটকে যায়।",
    conventionalNavBullet4: "কোনো পণ্য অগ্রাধিকার নেই: অস্থিতিশীল পেট্রোলিয়াম ট্যাঙ্কারকে হালকা যাত্রী গাড়ির মতো গণ্য করে।",
    raahSetuEngineBadge: "ভূ-ভাগ দ্বৈত-সমাধান",
    explorePlatformModules: "প্ল্যাটফর্ম মডিউল অন্বেষণ করুন",
    view3dTerrain: "3D ভূ-ভাগ দৃশ্য",
    apiConnected: "ফাস্ট-এপিআই A* সংযুক্ত",
    offlineFallback: "অফলাইন সলভার সক্রিয়",
    calibratedGpsTelemetry: "ক্যালিব্রেটেড জিপিএস টেলিমেট্রি",
    headingLabel: "দিক",
    terminalAdvisoryLabel: "টার্মিনাল পরামর্শ",
    reportIncidentTitle: "পার্বত্য সড়ক দুর্ঘটনা / ঝুঁকি রিপোর্ট করুন",
    incidentType: "ঘটনার ধরন",
    incidentLandslide: "ধস / পাথর পতন",
    incidentMudflow: "কাদার স্রোত / ধ্বংসাবশেষ",
    incidentSubsidence: "রাস্তা বসে যাওয়া / ভাঙন",
    incidentBridge: "সেতু দুর্বল / অবরুদ্ধ",
    incidentWaterlog: "তীব্র জলাবদ্ধতা / বন্যা",
    incidentTree: "গাছ ভেঙে পড়া / বিদ্যুতের তার",
    incidentSeverity: "তীব্রতার মাত্রা",
    severityLow: "কম (সাবধানে চলাচলযোগ্য)",
    severityMedium: "মাঝারি (কেবল একটি লেন খোলা)",
    severityHigh: "উচ্চ (সম্পূর্ণ অবরুদ্ধ)",
    incidentDesc: "ঘটনার বিবরণ ও অবস্থানের মন্তব্য",
    incidentDescPlaceholder: "সঠিক মাইল মার্কার, গাড়ির সীমাবদ্ধতা বা ল্যান্ডমার্ক উল্লেখ করুন...",
    submitReport: "রিপোর্ট জমা দিন",
    cancel: "বাতিল করুন",
    driverModalTitle: "ফ্লিট চালক ও গাড়ির প্রোফাইল",
    driverName: "চালকের পুরো নাম",
    driverLicense: "বাণিজ্যিক ড্রাইভিং লাইসেন্স (সিডিএল)",
    vehicleReg: "গাড়ির নিবন্ধন নম্বর",
    saveProfile: "প্রোফাইল সংরক্ষণ করুন",
    sosTitle: "জরুরি পার্বত্য এসওএস বীকন",
    sosDesc: "জেলা দুর্যোগ নিয়ন্ত্রণ এবং এসডিআরএফ-এ উচ্চ অগ্রাধিকারযুক্ত স্যাটেলাইট / এসএমএস জরুরি সংকেত পাঠান।",
    triggerSos: "জরুরি এসওএস সংকেত সক্রিয় করুন",
    sosTriggered: "জরুরি সংকেত সক্রিয় আছে",
    close: "বন্ধ করুন",

    destinationWeatherTitle: "গন্তব্যের আবহাওয়া",
    terminalWeatherForecast: "গন্তব্য টার্মিনালের স্থানীয় জলবায়ু ও লাইভ আবহাওয়া পূর্বাভাস",
    temperature: "তাপমাত্রা",
    precipitation: "বৃষ্টিপাত / তুষারপাত",
    visibility: "দৃশ্যমানতা",
    roadGrip: "সড়কের ঘর্ষণ গ্রিপ",
    terminalStation: "টার্মিনাল আবহাওয়া কেন্দ্র",
    step12SelectTitle: "ধাপ ১ এবং ২: প্রস্থান কেন্দ্র (উৎস) এবং লক্ষ্য গন্তব্য নির্বাচন করুন",
    departureHubSelected: "প্রস্থান কেন্দ্র নির্বাচিত",
    nowChooseDestination: "এখন গন্তব্য নির্বাচন করুন।",
    destSelected: "গন্তব্য নির্বাচিত",
    nowChooseDeparture: "এখন প্রস্থান কেন্দ্র নির্বাচন করুন।",
    activeRoute: "সক্রিয় রুট",
    step12Prompt: "পাহাড়ের নিরাপদ রুট, উচ্চতা ও ভূমিধসের ঝুঁকি বিশ্লেষণ করতে দয়া করে উৎস ও গন্তব্য নির্বাচন করুন।",
    step12Active: "দ্বৈত A* রুট গণনা সক্রিয়। দূরত্ব, ভ্রমণের সময় এবং ঝুঁকি নিচে প্রদর্শিত হচ্ছে।",
    enterEndpointsBelow: "নিচে স্থান নির্বাচন করুন ↓",
    routeReady: "রুট প্রস্তুত ✓",
    strategicCorridorsBar: "কৌশলগত পার্বত্য মালবাহী করিডোর",
    clickPresets: "১-ক্লিক দ্রুত প্রেরণের প্রিসেট",
    himalayanGridTitle: "পূর্ব হিমালয় লজিস্টিক গ্রিড · ৮ উত্তর-পূর্ব রাজ্য",
    osmGraphActive: "ওএসএম বাস্তব গ্রাফ ইঞ্জিন সক্রিয়",
    keyCorridorsCount: "৫৬ টি প্রধান করিডোর",
    dispatcherBannerTitle: "ঝুঁকি-সচেতন কৌশলগত পণ্য পরিবহন ও সুগম্যতা",
    dispatcherBannerDesc: "আসাম, অরুণাচল, মেঘালয়, মণিপুর, মিজোরাম, নাগাল্যান্ড, সিকিম এবং ত্রিপুরায় বর্ষা, খাড়া ঢাল এবং এক্সেল লোড সীমা বিশ্লেষণ করে নিরাপদ রুট নির্ধারণ।",
    activeDeparture: "সক্রিয় প্রস্থান",
    targetDestination: "লক্ষ্য গন্তব্য",
    corridorElevation: "করিডোরের উচ্চতা",
    weatherAdvisory: "আবহাওয়া পরামর্শ",
    awaitingInput: "স্থান নির্বাচনের অপেক্ষায়...",
    awaitingRoute: "রুট নির্ধারণের অপেক্ষায়...",
    standardNominal: "স্বাভাবিক আবহাওয়া",
    clearTransit: "পরিষ্কার রুট",
    departureHub: "প্রস্থান কেন্দ্র",
    arrivalDestination: "আগমন গন্তব্য",
    vehicleAxle: "যানবাহনের এক্সেল ক্ষমতা",
    cargoPriority: "পণ্যের অগ্রাধিকার",
    microclimateIngestion: "স্থানীয় আবহাওয়া তথ্য:",
    pathComparison: "A* রুট তুলনা",
    saferCorridor: "অধিক নিরাপদ করিডোর",
    fastestShortest: "দ্রুততম (ক্ষুদ্রতম রুট)",
    safeRiskAware: "নিরাপদ (ঝুঁকি-মুক্ত)",
    safeTrades: "নিরাপদ রুটে অতিরিক্ত",
    toAvoidSteep: "দূরত্ব অতিক্রম করে যাতে বিপজ্জনক ভূমিধস ও ভাঙন প্রবণ এলাকা এড়ানো যায়।",
    elevationProfile: "উচ্চতা প্রোফাইল",
    peak: "শীর্ষ:",
    downloadManifest: "ম্যানিফেস্ট ডাউনলোড করুন (JSON)",
    share: "শেয়ার করুন",
    copied: "কপি হয়েছে",
    reportHazard: "বিপদের রিপোর্ট করুন",
    satelliteView: "স্যাটেলাইট ভিউ",
    roadNetwork: "সড়ক নেটওয়ার্ক",
    startNavigation: "নেভিগেশন শুরু করুন",
    stopNavigation: "নেভিগেশন বন্ধ করুন",
    expandFullscreen: "ফুলস্ক্রিন করুন",
    exitFullscreen: "ফুলস্ক্রিন বন্ধ করুন (ESC)",
    routeWaypoints: "রুটের চেকপয়েন্ট ও থামার জায়গা",
    highwayLegs: "মহাসড়ক খণ্ড",
    via: "দিয়ে:",
    risk: "ঝুঁকি",
    normal: "স্বাভাবিক",
    watch: "নজরদারি",
    restricted: "সীমাবদ্ধ",
    all: "সব",
    searchDistrictRoad: "জেলা বা রাস্তা অনুসন্ধান করুন...",
    activeIncidents: "সক্রিয় ঘটনা:",
    transitDelay: "যাতায়াত বিলম্ব:",
    routeToHub: "হাবে রুট তৈরি করুন",
    activeClosuresTitle: "সক্রিয় বন্ধ রাস্তা ও ভূমিধসের সতর্কতা",
    activeClosuresSubtitle: "যাচাইকৃত পাহাড়ি পথ বন্ধের তথ্য, ভূ-সেন্সর সতর্কতা ও সরকারি বিকল্প রুটের পরামর্শ।",
    reportRoadHazard: "সড়ক বিপদের রিপোর্ট করুন",
    closureBadge: "বন্ধ",
    spot: "স্থান:",
    cause: "কারণ:",
    avoid: "এড়িয়ে চলুন:",
    recommendedDetourLabel: "প্রস্তাবিত বিকল্প রুট:",
    applyDetour: "বিকল্প রুট প্রয়োগ করুন",
    platformArchitecture: "প্ল্যাটফর্ম স্থাপত্য ও অফিসিয়াল তথ্য উৎস",
    platformArchitectureSub: "রাহসেতু রুট ইঞ্জিনের স্বচ্ছতা ও ব্যাখ্যাযোগ্য নীতিমালা।",
    osmTopology: "ওএসএম নেটওয়ার্ক গ্রাফ টপোলজি",
    northeastMultiModal: "উত্তর-পূর্ব ভারতের মাল্টি-মোডাল সড়ক গ্রাফ",
    northeastMultiModalDesc: "পায়োসমিয়াম ও ওএসএমএনএক্স দ্বারা সংগৃহীত। ৮টি উত্তর-পূর্ব রাজ্যে ৫,৮১৪টি নোড এবং ১৩,৬৮১টি সড়ক সংযোগ অন্তর্ভুক্ত।",
    graphEdgesCaption: "১৩,৬৮১টি সড়ক সংযোগ · ৮টি রাজ্য",
    annualFatalitiesNationwide: "দেশব্যাপী বার্ষিক প্রাণহানি",
    morthCensus: "মরথ রিপোর্ট: পার্বত্য পথে দুর্ঘটনার তীব্রতা ৪৫.২%।",
    graphExtractionTitle: "১. গ্রাফ নিষ্কাশন",
    graphExtractionDesc: "সড়কগুলোকে পৃষ্ঠ এবং ঢালের তথ্যসহ ওজনযুক্ত প্রান্তে রূপান্তরিত করা হয়েছে।",
    costWeightingTitle: "২. প্রান্তিক ব্যয় ঝুঁকি",
    costWeightingDesc: "যানবাহনের ওজন, পণ্যের ধরন এবং বৃষ্টিপাতের মাত্রা অনুযায়ী ঝুঁকি মূল্যায়ন করা হয়।",
    dualPathSolveTitle: "৩. দ্বৈত রুট সমাধান",
    dualPathSolveDesc: "ইঞ্জিন একই গ্রাফে দুবার A* চালায়: দ্রুততম এবং সবচেয়ে নিরাপদ পথের জন্য।",
    platformScopeTitle: "প্ল্যাটফর্মের পরিধি ও পরিচালনা সীমা",
    platformScopeDesc: "রাহসেতু পার্বত্য পণ্য পরিবহনের জন্য একটি ব্যাখ্যাযোগ্য ব্যবস্থা। তথ্যগুলো ভূতাত্ত্বিক জরিপের ওপর ভিত্তি করে তৈরি। জরুরি যাতায়াত দুর্যোগ ব্যবস্থাপনা নির্দেশিকা মেনে চলে।",
    footerBrandText: "রাহসেতু",
    footerSub: "· উত্তর-পূর্ব ভারত জরুরি লজিস্টিক রুট",
    footerCopyrightText: "ওপেনস্ট্রিটম্যাপ তথ্য © ওপেনস্ট্রিটম্যাপ অবদানকারী · রাহসেতু লজিস্টিক প্ল্যাটফর্ম।",
    driverProfileTitle: "ফ্লিট ড্রাইভার ও যানবাহনের তথ্য",
    driverNameLabel: "চালকের নাম",
    vehicleRegLabel: "গাড়ি রেজিস্ট্রেশন নম্বর",
    driverMobileLabel: "চালকের মোবাইল নম্বর",
    trustedEmergencyContactLabel: "বিশ্বস্ত জরুরি যোগাযোগ",
    cancelBtn: "বাতিল করুন",
    saveProfileBtn: "তথ্য সংরক্ষণ করুন",
    emergencyDistressSos: "জরুরি সংকট এসওএস (SOS)",
    vehicleLabel: "যানবাহন:",
    driverLabel: "চালক:",
    corridorLabel: "করিডোর:",
    statusLabel: "অবস্থা:",
    transmittingGps: "জিপিএস প্রেরিত হচ্ছে...",
    dispatchedToAuthorities: "কর্তৃপক্ষকে পাঠানো হয়েছে (সক্রিয়)",
    readyToTransmit: "প্রেরণের জন্য প্রস্তুত",
    callNdrf: "এনডিআরএফ-কে কল করুন (১০৭৮)",
    callFleetBase: "ফ্লিট বেসে কল করুন",
    reportHighwayHazard: "মহাসড়ক বিপদের রিপোর্ট করুন",
    captureOrUpload: "লাইভ রাস্তার ছবি তুলুন বা আপলোড করুন",
    snapPhoto: "ছবি তুলুন",
    startCamera: "ক্যামেরা চালু করুন",
    upload: "আপলোড করুন",
    submitHazardReport: "রিপোর্ট জমা দিন",
    hazardReportSuccess: "বিপদের রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে।",

    commodities: {
      medical: {
        name: "ওষুধ ও ভ্যাকসিন",
        badge: "কোল্ড-চেইন / জীবন রক্ষাকারী",
        desc: "তাপমাত্রা সংবেদনশীল ওষুধ ও রক্তের ব্যাগ। বহু দিন রাস্তা বন্ধ থাকার ক্ষেত্রে শূন্য সহনশীলতা।",
      },
      agro: {
        name: "কৃষি ও উদ্যানজাত পণ্য",
        badge: "পচনশীল পণ্য",
        desc: "আদা, কমলা, কিউই ইত্যাদি পাহাড়ি কৃষকদের ফসল। পচন রোধে দ্রুত ডেলিভারি।",
      },
      pds: {
        name: "পিডিএস খাদ্য সরবরাহ / খাদ্যশস্য",
        badge: "প্রয়োজনীয় পণ্য",
        desc: "দূরবর্তী গুদামগুলির জন্য এফসিআই-এর খাদ্যশস্য ও ডাল। সেতু-নিরাপদ মালবাহী রুটের প্রয়োজন।",
      },
      fuel: {
        name: "পিওএল / পেট্রোলিয়াম ও এলপিজি",
        badge: "বিপজ্জনক দাহ্য পদার্থ",
        desc: "বাল্ক রোড পেট্রোলিয়াম ট্যাঙ্কার ও সিলিন্ডার। বিপজ্জনক বাঁকের রাস্তা থেকে কঠোরভাবে নিষিদ্ধ।",
      },
      construction: {
        name: "অবকাঠামো ও সিমেন্ট",
        badge: "ভারী মূলধনী পণ্য",
        desc: "মহাসড়ক ও সীমান্ত সড়ক নির্মাণের জন্য স্টিল রড, সেতুর গার্ডার ও পাথর।",
      },
    },

    vehicles: {
      heavy: {
        name: "ভারী মালবাহী (২৮ টন)",
        badge: "২৮ টন মাল্টি-এক্সেল",
        desc: "বহু-এক্সেল বিশিষ্ট ভারী পরিবহন। তীব্র বাঁক, খাড়া ঢাল এবং সেতুতে অত্যন্ত সতর্কতা।",
      },
      standard: {
        name: "বাণিজ্যিক ট্রাক (১৬ টন)",
        badge: "১৬ টন কার্গো",
        desc: "মানক লজিস্টিক যান। পাহাড়ে ভারসাম্যপূর্ণ গতি ও হাইওয়েতে চমৎকার কর্মক্ষমতা।",
      },
      light: {
        name: "লাইট ৪x৪ / জরুরি",
        badge: "৪x৪ উপযোগী গাড়ি",
        desc: "হালকা পণ্য বা জরুরি পরিবহন। কাঁচা পাহাড়ি রাস্তায় অত্যন্ত দ্রুতগতির।",
      },
    },

    weather: {
      clear: {
        name: "পরিষ্কার / শুষ্ক",
        badge: "অনুকূল",
        desc: "স্বাভাবিক গতি এবং নিরাপদ রাস্তার অবস্থা সহ অনুকূল আবহাওয়া।",
      },
      monsoon: {
        name: "বর্ষার ভারী বৃষ্টিপাত",
        badge: "উচ্চ ঝুঁকি",
        desc: "সক্রিয় বর্ষার বৃষ্টি। ধসের তীব্র ঝুঁকি এবং নদী উপচে পড়ার আশঙ্কা।",
      },
      snow: {
        name: "শীতকালীন তুষারপাত",
        badge: "তুষার সতর্কতা",
        desc: "উঁচু পাসে শূন্যের নিচের তাপমাত্রা, পিচ্ছিল বরফ ও তুষারপাতের কারণে ধীর গতি।",
      },
    },
  },
};

export const CITIES_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    gangtok: "Gangtok",
    bokakhat: "Bokakhat",
    margherita: "Margherita",
    byrnihat: "Byrnihat",
    mairang: "Mairang",
    nongstoin: "Nongstoin",
    chumukedima: "Chumukedima",
    jalukie: "Jalukie",
    tseminyu: "Tseminyu",
    kiphire: "Kiphire",
    kangpokpi: "Kangpokpi",
    noney: "Noney",
    moirang: "Moirang",
    vairengte: "Vairengte",
    saitual: "Saitual",
    hnahthial: "Hnahthial",
    bishalgarh: "Bishalgarh",
    udaipur: "Udaipur",
    santirbazar: "Santirbazar",
    sabroom: "Sabroom",
    lakhimpur: "North Lakhimpur",
    namchi: "Namchi",
    pelling: "Pelling",
    mangan: "Mangan",
    rangpo: "Rangpo",
    singtam: "Singtam",
    ravangla: "Ravangla",
    chungthang: "Chungthang",
    tawang: "Tawang",
    dirang: "Dirang",
    bomdila: "Bomdila",
    bhalukpong: "Bhalukpong",
    seppa: "Seppa",
    itanagar: "Itanagar",
    naharlagun: "Naharlagun",
    ziro: "Ziro",
    basar: "Basar",
    aalo: "Aalo",
    pasighat: "Pasighat",
    roing: "Roing",
    tezu: "Tezu",
    namsai: "Namsai",
    changlang: "Changlang",
    khonsa: "Khonsa",
    dhubri: "Dhubri",
    kokrajhar: "Kokrajhar",
    bongaigaon: "Bongaigaon",
    goalpara: "Goalpara",
    barpeta: "Barpeta",
    nalbari: "Nalbari",
    rangia: "Rangia",
    guwahati: "Guwahati",
    mangaldai: "Mangaldai",
    morigaon: "Morigaon",
    nagaon: "Nagaon",
    tezpur: "Tezpur",
    biswanath_chariali: "Biswanath Chariali",
    hojai: "Hojai",
    lanka: "Lanka",
    lumding: "Lumding",
    diphu: "Diphu",
    bokajan: "Bokajan",
    golaghat: "Golaghat",
    jorhat: "Jorhat",
    sivasagar: "Sivasagar",
    dibrugarh: "Dibrugarh",
    tinsukia: "Tinsukia",
    north_lakhimpur: "North Lakhimpur",
    dhemaji: "Dhemaji",
    silchar: "Silchar",
    karimganj: "Karimganj",
    hailakandi: "Hailakandi",
    haflong: "Haflong",
    shillong: "Shillong",
    cherrapunji: "Cherrapunji",
    dawki: "Dawki",
    jowai: "Jowai",
    nongpoh: "Nongpoh",
    tura: "Tura",
    williamnagar: "Williamnagar",
    baghmara: "Baghmara",
    resubelpara: "Resubelpara",
    khliehriat: "Khliehriat",
    dimapur: "Dimapur",
    kohima: "Kohima",
    mokokchung: "Mokokchung",
    tuensang: "Tuensang",
    wokha: "Wokha",
    zunheboto: "Zunheboto",
    phek: "Phek",
    mon: "Mon",
    imphal: "Imphal",
    churachandpur: "Churachandpur",
    thoubal: "Thoubal",
    bishnupur: "Bishnupur",
    kakching: "Kakching",
    ukhrul: "Ukhrul",
    senapati: "Senapati",
    tamenglong: "Tamenglong",
    chandel: "Chandel",
    moreh: "Moreh",
    jiribam: "Jiribam",
    aizawl: "Aizawl",
    lunglei: "Lunglei",
    champhai: "Champhai",
    serchhip: "Serchhip",
    kolasib: "Kolasib",
    lawngtlai: "Lawngtlai",
    saiha: "Saiha",
    mamit: "Mamit",
    agartala: "Agartala",
    dharmanagar: "Dharmanagar",
    kailashahar: "Kailashahar",
    udaipur_tr: "Udaipur",
    ambassa: "Ambassa",
    belonia: "Belonia",
    teliamura: "Teliamura",
    khowai: "Khowai",
    siliguri: "Siliguri",
  },
  hi: {
    gangtok: "गंगटोक",
    bokakhat: "बोकाखात",
    margherita: "मार्गेरीटा",
    byrnihat: "बर्नीहाट",
    mairang: "मायरांग",
    nongstoin: "नोंगस्टोइन",
    chumukedima: "चुमुकेदिमा",
    jalukie: "जलुकी",
    tseminyu: "त्सेमिन्यु",
    kiphire: "किफिरे",
    kangpokpi: "कांगपोकपी",
    noney: "नोने",
    moirang: "मोइरांग",
    vairengte: "वैरेन्गते",
    saitual: "सैतुल",
    hnahthial: "ह्नाहथियाल",
    bishalgarh: "विशालगढ़",
    udaipur: "उदयपुर",
    santirbazar: "शांतिरबाज़ार",
    sabroom: "सबरूम",
    lakhimpur: "उत्तर लखीमपुर",
    namchi: "नामची",
    pelling: "पेलिंग",
    mangan: "मंगन",
    rangpo: "रंगपो",
    singtam: "सिंगतम",
    ravangla: "रावांगला",
    chungthang: "चुंगथांग",
    tawang: "तवांग",
    dirang: "दिरांग",
    bomdila: "बोमडिला",
    bhalukpong: "भालुकपोंग",
    seppa: "सेप्पा",
    itanagar: "ईटानगर",
    naharlagun: "नाहरलागुन",
    ziro: "ज़ीरो",
    basar: "बासर",
    aalo: "आलो",
    pasighat: "पासीघाट",
    roing: "रोइंग",
    tezu: "तेज़ू",
    namsai: "नामसाई",
    changlang: "चांगलांग",
    khonsa: "खोंसा",
    dhubri: "धुबरी",
    kokrajhar: "कोकराझार",
    bongaigaon: "बोंगाईगांव",
    goalpara: "गोलपारा",
    barpeta: "बरपेटा",
    nalbari: "नलबाड़ी",
    rangia: "रंगिया",
    guwahati: "गुवाहाटी",
    mangaldai: "मंगलदै",
    morigaon: "मोरीगांव",
    nagaon: "नगांव",
    tezpur: "तेज़पुर",
    biswanath_chariali: "विश्वनाथ चारिआली",
    hojai: "होजाई",
    lanka: "लंका",
    lumding: "लमडिंग",
    diphu: "दिफू",
    bokajan: "बोकाजान",
    golaghat: "गोलाघाट",
    jorhat: "जोरहाट",
    sivasagar: "शिवसागर",
    dibrugarh: "डिब्रूगढ़",
    tinsukia: "तिनसुकिया",
    north_lakhimpur: "उत्तर लखीमपुर",
    dhemaji: "धेमाजी",
    silchar: "सिलचर",
    karimganj: "करीमगंज",
    hailakandi: "हैलाकांडी",
    haflong: "हाफलोंग",
    shillong: "शिलांग",
    cherrapunji: "चेरापूंजी",
    dawki: "डाउकी",
    jowai: "जोवाई",
    nongpoh: "नोंगपोह",
    tura: "तुरा",
    williamnagar: "विलियमनगर",
    baghmara: "बाघमारा",
    resubelpara: "रेसुबेलपारा",
    khliehriat: "खलीहरियात",
    dimapur: "दीमापुर",
    kohima: "कोहिमा",
    mokokchung: "मोकोकचुंग",
    tuensang: "तुएनसांग",
    wokha: "वोखा",
    zunheboto: "जुन्हेबोतो",
    phek: "फेक",
    mon: "मोन",
    imphal: "इम्फाल",
    churachandpur: "चुराचांदपुर",
    thoubal: "थौबल",
    bishnupur: "बिष्णुपुर",
    kakching: "काकचिंग",
    ukhrul: "उखरुल",
    senapati: "सेनापति",
    tamenglong: "तामेंगलोंग",
    chandel: "चंदेल",
    moreh: "मोरेह",
    jiribam: "जिरीबाम",
    aizawl: "आइजोल",
    lunglei: "लुंगलेई",
    champhai: "चम्फाई",
    serchhip: "सेरछिप",
    kolasib: "कोलासिब",
    lawngtlai: "लॉन्गत्लाई",
    saiha: "साइहा",
    mamit: "मामित",
    agartala: "अगरतला",
    dharmanagar: "धर्मनगर",
    kailashahar: "कैलाशहर",
    udaipur_tr: "उदयपुर",
    ambassa: "अम्बासा",
    belonia: "बेलोनीया",
    teliamura: "तेलियामुरा",
    khowai: "खोवाई",
    siliguri: "सिलीगुड़ी",
  },
  as: {
    gangtok: "গেংটক",
    bokakhat: "বোকাখাত",
    margherita: "মাৰ্ঘেৰিটা",
    byrnihat: "বাৰ্নিহাট",
    mairang: "মাইৰাং",
    nongstoin: "নংস্টোইন",
    chumukedima: "চুমুকেদিমা",
    jalukie: "জালুকী",
    tseminyu: "চেখমিন্যু",
    kiphire: "কিফিৰে",
    kangpokpi: "কাংপকপী",
    noney: "নোনে",
    moirang: "মইৰাং",
    vairengte: "ভাইৰেংতে",
    saitual: "চাইতুৱাল",
    hnahthial: "হ্নাহথিয়াল",
    bishalgarh: "বিশালগড়",
    udaipur: "উদয়পুৰ",
    santirbazar: "শান্তিৰবজাৰ",
    sabroom: "সবৰুম",
    lakhimpur: "উত্তৰ লখিমপুৰ",
    namchi: "নামচি",
    pelling: "পেলিং",
    mangan: "মংগন",
    rangpo: "ৰংপো",
    singtam: "চিংটাম",
    ravangla: "ৰাভাংলা",
    chungthang: "চুংথাং",
    tawang: "তাৱাং",
    dirang: "দিৰাং",
    bomdila: "বোমডিলা",
    bhalukpong: "ভালুকপুং",
    seppa: "চেপ্পা",
    itanagar: "ইটানগৰ",
    naharlagun: "নাহৰলগুন",
    ziro: "জিৰো",
    basar: "বাচাৰ",
    aalo: "আল'অ'",
    pasighat: "পাচিঘাট",
    roing: "ৰ'ইং",
    tezu: "তেজু",
    namsai: "নামচাই",
    changlang: "চাংলাং",
    khonsa: "খোন্সা",
    dhubri: "ধুবুৰী",
    kokrajhar: "কোকৰাঝাৰ",
    bongaigaon: "বঙাইগাঁও",
    goalpara: "গোৱালপাৰা",
    barpeta: "বৰপেটা",
    nalbari: "নলবাৰী",
    rangia: "ৰঙিয়া",
    guwahati: "গুৱাহাটী",
    mangaldai: "মঙ্গলদৈ",
    morigaon: "মৰিগাঁও",
    nagaon: "নগাঁও",
    tezpur: "তেজপুৰ",
    biswanath_chariali: "বিশ্বনাথ চাৰিআলি",
    hojai: "হোজাই",
    lanka: "লংকা",
    lumding: "লামডিং",
    diphu: "ডিফু",
    bokajan: "বোকাজান",
    golaghat: "গোলাঘাট",
    jorhat: "যোৰহাট",
    sivasagar: "শিৱসাগৰ",
    dibrugarh: "ডিব্ৰুগড়",
    tinsukia: "তিনিচুকীয়া",
    north_lakhimpur: "উত্তৰ লখিমপুৰ",
    dhemaji: "ধেমাজি",
    silchar: "শিলচৰ",
    karimganj: "কৰিমগঞ্জ",
    hailakandi: "হাইলাকান্দি",
    haflong: "হাফলং",
    shillong: "শ্বিলং",
    cherrapunji: "চেৰাপুঞ্জী",
    dawki: "ডাউকি",
    jowai: "জোৱাই",
    nongpoh: "নংপোহ",
    tura: "তুৰা",
    williamnagar: "উইলিয়ামনগৰ",
    baghmara: "বাঘমাৰা",
    resubelpara: "ৰেচুবেলপাৰা",
    khliehriat: "খ্লিহৰিয়াত",
    dimapur: "ডিমাপুৰ",
    kohima: "কহিমা",
    mokokchung: "মককচাং",
    tuensang: "টুৱেনচাং",
    wokha: "ৱখা",
    zunheboto: "ঝুনহেব'ট'",
    phek: "ফেক",
    mon: "মন",
    imphal: "ইম্ফল",
    churachandpur: "চুৰাচান্দপুৰ",
    thoubal: "থৌবাল",
    bishnupur: "বিষ্ণুপুৰ",
    kakching: "কাকচিং",
    ukhrul: "উখৰুল",
    senapati: "সেনাপতি",
    tamenglong: "তামেংলং",
    chandel: "চান্দেল",
    moreh: "ম'ৰেহ",
    jiribam: "জিৰিবাম",
    aizawl: "আইজল",
    lunglei: "লুংলেঈ",
    champhai: "চাম্ফাই",
    serchhip: "চেৰছিপ",
    kolasib: "কোলাশিব",
    lawngtlai: "লংতলাই",
    saiha: "ছাইহা",
    mamit: "মামিত",
    agartala: "আগৰতলা",
    dharmanagar: "ধৰ্মনগৰ",
    kailashahar: "কৈলাসহৰ",
    udaipur_tr: "উদয়পুৰ",
    ambassa: "আম্বাচা",
    belonia: "বেল'নিয়া",
    teliamura: "তেলিয়ামুৰা",
    khowai: "খোৱাই",
    siliguri: "শিলিগুড়ি",
  },
  bn: {
    gangtok: "গ্যাংটক",
    bokakhat: "বোকাখাত",
    margherita: "মার্ঘেরিটা",
    byrnihat: "বার্নিহাট",
    mairang: "মাইরাং",
    nongstoin: "নংস্টোইন",
    chumukedima: "চুমুকেদিমা",
    jalukie: "জালুকি",
    tseminyu: "ৎসেমিনু",
    kiphire: "কিফিরে",
    kangpokpi: "কাংপোকপী",
    noney: "নোনি",
    moirang: "মোইরাং",
    vairengte: "ভাইরেংতে",
    saitual: "সাইতুয়াল",
    hnahthial: "হ্নাহথিয়াল",
    bishalgarh: "বিশালগড়",
    udaipur: "উদয়পুর",
    santirbazar: "শান্তিরবাজার",
    sabroom: "সক্রুম",
    lakhimpur: "উত্তর লখিমপুর",
    namchi: "নামচি",
    pelling: "পেলিং",
    mangan: "মাঙ্গান",
    rangpo: "রংপো",
    singtam: "সিংতাম",
    ravangla: "রাভাংলা",
    chungthang: "চুংথাং",
    tawang: "তাওয়াং",
    dirang: "দিরাং",
    bomdila: "বোমডিলা",
    bhalukpong: "ভালুকপং",
    seppa: "সেপ্পা",
    itanagar: "ইটানগর",
    naharlagun: "নাহরলাগুন",
    ziro: "জিরো",
    basar: "বাসার",
    aalo: "আলো",
    pasighat: "পাসিঘাট",
    roing: "রোয়িং",
    tezu: "তেজু",
    namsai: "নামসাই",
    changlang: "চাংলাং",
    khonsa: "খোন্সা",
    dhubri: "ধুবড়ী",
    kokrajhar: "কোকরাঝাড়",
    bongaigaon: "বঙাইগাঁও",
    goalpara: "গোয়ালপাড়া",
    barpeta: "বরপেটা",
    nalbari: "নলবাড়ি",
    rangia: "রঙ্গিয়া",
    guwahati: "গুয়াহাটি",
    mangaldai: "মঙ্গলদৈ",
    morigaon: "মরিগাঁও",
    nagaon: "নগাঁও",
    tezpur: "তেজপুর",
    biswanath_chariali: "বিশ্বনাথ চারিআলি",
    hojai: "হোজাই",
    lanka: "লঙ্কা",
    lumding: "লামডিং",
    diphu: "দিফু",
    bokajan: "বোকাজান",
    golaghat: "গোলাঘাট",
    jorhat: "যোরহাট",
    sivasagar: "শিবসাগর",
    dibrugarh: "ডিব্রুগড়",
    tinsukia: "তিনসুকিয়া",
    north_lakhimpur: "উত্তর লখিমপুর",
    dhemaji: "ধেমাজি",
    silchar: "শিলচর",
    karimganj: "করিমগঞ্জ",
    hailakandi: "হাইলাকান্দি",
    haflong: "হাফলং",
    shillong: "শিলং",
    cherrapunji: "চেরাপুঞ্জি",
    dawki: "ডাউকি",
    jowai: "জোয়াই",
    nongpoh: "নংপোহ",
    tura: "তুরা",
    williamnagar: "উইলিয়ামনগর",
    baghmara: "বাঘমারা",
    resubelpara: "রেসুবেলপাড়া",
    khliehriat: "খ্লিহরিয়াত",
    dimapur: "দিমাপুর",
    kohima: "কোহিমা",
    mokokchung: "মককচাং",
    tuensang: "টুয়েনসাং",
    wokha: "ভোখা",
    zunheboto: "ঝুনহেবোতো",
    phek: "ফেক",
    mon: "মন",
    imphal: "ইম্ফল",
    churachandpur: "চূড়াচাঁদপুর",
    thoubal: "থৌবাল",
    bishnupur: "বিষ্ণুপুর",
    kakching: "কাকচিং",
    ukhrul: "উখরুল",
    senapati: "সেনাপতি",
    tamenglong: "তামেংলং",
    chandel: "চান্দেল",
    moreh: "মোরেহ",
    jiribam: "জিরিবাম",
    aizawl: "আইজল",
    lunglei: "লুংলেই",
    champhai: "চাম্ফাই",
    serchhip: "সেরছিপ",
    kolasib: "কোলাশিব",
    lawngtlai: "লংতলাই",
    saiha: "সাইহা",
    mamit: "মামিত",
    agartala: "আগরতলা",
    dharmanagar: "ধর্মনগর",
    kailashahar: "কৈলাসহর",
    udaipur_tr: "উদয়পুর",
    ambassa: "আম্বাসা",
    belonia: "বেলোনিয়া",
    teliamura: "তেলিয়ামুড়া",
    khowai: "খোয়াই",
    siliguri: "শিলিগুড়ি",
  },
};

export const STATES_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    Assam: "Assam",
    Sikkim: "Sikkim",
    "Arunachal Pradesh": "Arunachal Pradesh",
    Meghalaya: "Meghalaya",
    Manipur: "Manipur",
    Mizoram: "Mizoram",
    Nagaland: "Nagaland",
    Tripura: "Tripura",
    "West Bengal": "West Bengal",
  },
  hi: {
    Assam: "असम",
    Sikkim: "सिक्किम",
    "Arunachal Pradesh": "अरुणाचल प्रदेश",
    Meghalaya: "मेघालय",
    Manipur: "मणिपुर",
    Mizoram: "मिजोरम",
    Nagaland: "नागालैंड",
    Tripura: "त्रिपुरा",
    "West Bengal": "पश्चिम बंगाल",
  },
  as: {
    Assam: "অসম",
    Sikkim: "ছিকিম",
    "Arunachal Pradesh": "অৰুণাচল প্ৰদেশ",
    Meghalaya: "মেঘালয়",
    Manipur: "মণিপুৰ",
    Mizoram: "মিজোৰাম",
    Nagaland: "নাগালেণ্ড",
    Tripura: "ত্ৰিপুৰা",
    "West Bengal": "পশ্চিম বংগ",
  },
  bn: {
    Assam: "আসাম",
    Sikkim: "সিকিম",
    "Arunachal Pradesh": "অরুণাচল প্রদেশ",
    Meghalaya: "মেঘালয়",
    Manipur: "মণিপুর",
    Mizoram: "মিজোরাম",
    Nagaland: "নাগাল্যান্ড",
    Tripura: "ত্রিপুরা",
    "West Bengal": "পশ্চিমবঙ্গ",
  },
};

export function getCityName(cityId: string, lang: SupportedLanguage, defaultName?: string): string {
  return CITIES_TRANSLATIONS[lang]?.[cityId] || defaultName || cityId;
}

export function getStateName(stateName: string, lang: SupportedLanguage): string {
  return STATES_TRANSLATIONS[lang]?.[stateName] || stateName;
}



export interface BlockageTranslation {
  road: string;
  exactSpot: string;
  cause: string;
  avoidInfo: string;
  detourRoute: string;
  updatedTime?: string;
}

export const BLOCKAGE_TRANSLATIONS: Record<SupportedLanguage, Record<string, BlockageTranslation>> = {
  en: {
    "BLK-NH10-SIKKIM": {
      road: "NH-10 National Highway",
      exactSpot: "29th Mile & Teesta Bazaar (km 42)",
      cause: "Severe Monsoon Hill Landslide & Road Bed Subsidence",
      avoidInfo: "NH-10 Teesta River Corridor closed to heavy freight",
      detourRoute: "Divert via Lava – Algarah – Kalimpong Bypass Corridor",
      updatedTime: "BRO & PWD Telemetry",
    },
    "BLK-NH29-NAGALAND": {
      road: "NH-29 Lifeline Corridor",
      exactSpot: "Pagla Pahar Gorge (km 124)",
      cause: "Active Mudslide, Heavy Hill Seepage & Boulder Collapse",
      avoidInfo: "Main gorge corridor obstructed; multi-axle freight queued",
      detourRoute: "Divert via Niuland – Kohima Alternate Bypass Highway",
      updatedTime: "GSI Slope Sensor Alert",
    },
    "BLK-NH13-ARUNACHAL": {
      road: "NH-13 Trans-Arunachal Highway",
      exactSpot: "Sela Pass Summit (13,700 ft)",
      cause: "Rockfall, Snow Avalanche & Freezing Black Ice",
      avoidInfo: "High Sela Ridge Top hazardous without anti-skid tire chains",
      detourRoute: "Use Sela Tunnel Lower Bypass with BRO Convoy escort",
      updatedTime: "High-Altitude Weather Alert",
    },
    "BLK-NH306-MIZORAM": {
      road: "NH-306 Lifeline",
      exactSpot: "Cachar-Kolasib Hairpin Border",
      cause: "Ghat Road Subsidence & 18-Tonne Bailey Bridge Load Limit",
      avoidInfo: "Direct Cachar Hairpin capped at 18 tonnes",
      detourRoute: "Stage at Dholai Depot & Route via Bhairabi Railhead Bypass",
      updatedTime: "Weight Enforcement Alert",
    },
  },
  hi: {
    "BLK-NH10-SIKKIM": {
      road: "एनएच-10 राष्ट्रीय राजमार्ग",
      exactSpot: "29वां मील एवं तीस्ता बाजार (किमी 42)",
      cause: "भीषण मानसूनी भूस्खलन एवं सड़क धंसाव",
      avoidInfo: "एनएच-10 तीस्ता नदी गलियारा भारी मालवाहकों हेतु बंद",
      detourRoute: "लावा – अल्गराह – कलिम्पोंग बाईपास होकर जाएं",
      updatedTime: "बीआरओ एवं पीडब्ल्यूडी टेलीमेट्री",
    },
    "BLK-NH29-NAGALAND": {
      road: "एनएच-29 जीवनरेखा गलियारा",
      exactSpot: "पगला पहाड़ दर्रा (किमी 124)",
      cause: "सक्रिय मडस्लाइड, तीव्र जल रिसाव एवं भारी चट्टान गिराव",
      avoidInfo: "मुख्य दर्रा मार्ग अवरुद्ध; भारी मालवाहक फंसे",
      detourRoute: "निउलैंड – कोहिमा वैकल्पिक बाईपास राजमार्ग से जाएं",
      updatedTime: "जीएसआई ढलान सेंसर अलर्ट",
    },
    "BLK-NH13-ARUNACHAL": {
      road: "एनएच-13 ट्रांस-अरुणाचल राजमार्ग",
      exactSpot: "सेला दर्रा शिखर (13,700 फीट)",
      cause: "चट्टान गिराव, हिमस्खलन एवं खतरनाक ब्लैक आइस",
      avoidInfo: "एंटी-स्किड चेन के बिना सेला रिज टॉप अत्यधिक खतरनाक",
      detourRoute: "बीआरओ काफिले के साथ सेला सुरंग निचले बाईपास का उपयोग करें",
      updatedTime: "उच्च पर्वतीय मौसम अलर्ट",
    },
    "BLK-NH306-MIZORAM": {
      road: "एनएच-306 जीवनरेखा",
      exactSpot: "कछार-कोलासिब हेयरपिन सीमा",
      cause: "घाट सड़क धंसाव एवं 18 टन बेली ब्रिज भार सीमा",
      avoidInfo: "प्रत्यक्ष कछार हेयरपिन 18 टन तक सीमित",
      detourRoute: "धोलाई डिपो पर रुकें एवं भैरबी रेलहेड बाईपास से जाएं",
      updatedTime: "वजन प्रवर्तन अलर्ट",
    },
  },
  as: {
    "BLK-NH10-SIKKIM": {
      road: "এনএইচ-১০ ৰাষ্ট্ৰীয় ঘাইপথ",
      exactSpot: "২৯ মাইল আৰু তিস্তা বজাৰ (কিমি ৪২)",
      cause: "তীব্ৰ বাৰিষাৰ ভূমিস্খলন আৰু পথ খহি পৰা",
      avoidInfo: "এনএইচ-১০ তিস্তা নদী কৰিড'ৰ গধুৰ সামগ্ৰীৰ বাবে বন্ধ",
      detourRoute: "লাভা – আলগৰাহ – কালিম্পং বাইপাছ হৈ ঘুৰি যাওক",
      updatedTime: "বিআৰঅ' আৰু পিডব্লিউডি টেলিমেট্ৰি",
    },
    "BLK-NH29-NAGALAND": {
      road: "এনএইচ-২৯ লাইফলাইন কৰিড'ৰ",
      exactSpot: "পাগলা পাহাৰ গিৰিখাত (কিমি ১২৪)",
      cause: "সক্ৰিয় পলসুৱা ভূমিস্খলন আৰু শিল খহি পৰা",
      avoidInfo: "মূল গিৰিখাত পথ বাধাপ্ৰাপ্ত; মালবাহী বাহনৰ দীঘলীয়া শাৰী",
      detourRoute: "নিউল্যাণ্ড – কোহিমা বিকল্প বাইপাছ ঘাইপথেৰে যাওক",
      updatedTime: "জিএছআই ঢাল ছেন্সৰ সতৰ্কবাৰ্তা",
    },
    "BLK-NH13-ARUNACHAL": {
      road: "এনএইচ-১৩ ট্ৰান্স-অৰুণাচল ঘাইপথ",
      exactSpot: "চেলা পাছ শিখৰ (১৩,৭০০ ফুট)",
      cause: "শিল খহি পৰা, তুষাৰপাত আৰু পিছল বৰফ",
      avoidInfo: "এণ্টি-স্কিড চেইন অবিহনে চেলা শিখৰ বিপদজনক",
      detourRoute: "বিআৰঅ' কনভয়ৰ সৈতে চেলা সুৰংগ বাইপাছ ব্যৱহাৰ কৰক",
      updatedTime: "উচ্চ পৰ্বতীয়া বতৰ সতৰ্কবাৰ্তা",
    },
    "BLK-NH306-MIZORAM": {
      road: "এনএইচ-৩০৬ লাইফলাইন",
      exactSpot: "কাছাৰ-কোলাশিব হেয়াৰপিন সীমা",
      cause: "ঘাট পথ খহি পৰা আৰু ১৮ টন বেইলী দলং ক্ষমতা সীমা",
      avoidInfo: "পোনপটীয়া কাছাৰ ঘাট ১৮ টনলৈ সীমিত",
      detourRoute: "ধোলাই ডিপো হৈ ভৈৰৱী ৰেলহেড বাইপাছেৰে যাওক",
      updatedTime: "ওজন নিয়ন্ত্ৰণ সতৰ্কবাৰ্তা",
    },
  },
  bn: {
    "BLK-NH10-SIKKIM": {
      road: "এনএইচ-১০ জাতীয় সড়ক",
      exactSpot: "২৯তম মাইল ও তিস্তা বাজার (কিমি ৪২)",
      cause: "তীব্র বর্ষার ভূমিধস ও সড়ক দেবে যাওয়া",
      avoidInfo: "এনএইচ-১০ তিস্তা নদী করিডোর ভারী পণ্যবাহীর জন্য বন্ধ",
      detourRoute: "লাভা – আলগাড়া – কালিম্পং বাইপাস হয়ে যান",
      updatedTime: "বিআরও ও পিডব্লিউডি টেলিমেট্রি",
    },
    "BLK-NH29-NAGALAND": {
      road: "এনএইচ-২৯ লাইফলাইন করিডোর",
      exactSpot: "পাগলা পাহাড় গিরিখাত (কিমি ১২৪)",
      cause: "সক্রিয় মাটির ধস, তীব্র জল নিঃসরণ ও বোল্ডার পতন",
      avoidInfo: "প্রধান গিরিপথ অবরুদ্ধ; মালবাহী ট্রাকের দীর্ঘ লাইন",
      detourRoute: "নিউল্যান্ড – কোহিমা বিকল্প বাইপাস মহাসড়ক দিয়ে যান",
      updatedTime: "জিএসআই ঢাল সেন্সর সতর্কতা",
    },
    "BLK-NH13-ARUNACHAL": {
      road: "এনএইচ-১৩ ট্রান্স-অরুণাচল মহাসড়ক",
      exactSpot: "সেলা পাস শীর্ষ (১৩,৭০০ ফুট)",
      cause: "পাথর খসে পড়া, তুষারধস ও বিপজ্জনক ব্ল্যাক আইস",
      avoidInfo: "অ্যান্টি-স্কিড চেইন ছাড়া সেলা শীর্ষ অত্যন্ত বিপজ্জনক",
      detourRoute: "বিআরও কনভয় সহ সেলা টানেল লোয়ার বাইপাস ব্যবহার করুন",
      updatedTime: "উচ্চ পার্বত্য আবহাওয়া সতর্কতা",
    },
    "BLK-NH306-MIZORAM": {
      road: "এনএইচ-৩০৬ লাইফলাইন",
      exactSpot: "কাছাড়-কোলাশিব হেয়ারপিন সীমানা",
      cause: "ঘাট সড়ক দেবে যাওয়া ও ১৮ টন বেইলি ব্রিজ ভার সীমা",
      avoidInfo: "সরাসরি কাছাড় হেয়ারপিন ১৮ টনে সীমাবদ্ধ",
      detourRoute: "ধোলাই ডিপোয় থামুন এবং ভৈরবী রেলহেড বাইপাস দিয়ে যান",
      updatedTime: "ওজন প্রয়োগ সতর্কতা",
    },
  },
};

export function getBlockageDetails(blkId: string, lang: SupportedLanguage, fallback: BlockageTranslation): BlockageTranslation {
  return BLOCKAGE_TRANSLATIONS[lang]?.[blkId] || fallback;
}

export const DISTRICT_NAMES: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    "Kamrup Metropolitan": "Kamrup Metropolitan",
    "Tawang & West Kameng": "Tawang & West Kameng",
    "East Khasi Hills": "East Khasi Hills",
    "Kohima & Dimapur": "Kohima & Dimapur",
    "Imphal West": "Imphal West",
    "Aizawl & Kolasib": "Aizawl & Kolasib",
    "West Tripura": "West Tripura",
    "East Sikkim": "East Sikkim",
  },
  hi: {
    "Kamrup Metropolitan": "कामरूप मेट्रोपॉलिटन",
    "Tawang & West Kameng": "तवांग एवं पश्चिम कामेंग",
    "East Khasi Hills": "पूर्वी खासी हिल्स",
    "Kohima & Dimapur": "कोहिमा एवं दीमापुर",
    "Imphal West": "इम्फाल पश्चिम",
    "Aizawl & Kolasib": "आइजोल एवं कोलासिब",
    "West Tripura": "पश्चिम त्रिपुरा",
    "East Sikkim": "पूर्वी सिक्किम",
  },
  as: {
    "Kamrup Metropolitan": "কামৰূপ মহানগৰ",
    "Tawang & West Kameng": "টাৱাং আৰু পশ্চিম কামেং",
    "East Khasi Hills": "পূব খাছি পাহাৰ",
    "Kohima & Dimapur": "কোহিমা আৰু ডিমাপুৰ",
    "Imphal West": "পশ্চিম ইম্ফল",
    "Aizawl & Kolasib": "আইজল আৰু কোলাশিব",
    "West Tripura": "পশ্চিম ত্ৰিপুৰা",
    "East Sikkim": "পূব ছিকিম",
  },
  bn: {
    "Kamrup Metropolitan": "কামরূপ মেট্রোপলিটন",
    "Tawang & West Kameng": "তাওয়াং ও পশ্চিম কামেং",
    "East Khasi Hills": "পূর্ব খাসি পাহাড়",
    "Kohima & Dimapur": "কোহিমা ও ডিমাপুর",
    "Imphal West": "পশ্চিম ইম্ফল",
    "Aizawl & Kolasib": "আইজল ও কোলাশিব",
    "West Tripura": "পশ্চিম ত্রিপুরা",
    "East Sikkim": "পূর্ব সিকিম",
  },
};

export function getDistrictName(name: string, lang: SupportedLanguage): string {
  return DISTRICT_NAMES[lang]?.[name] || name;
}

export function getLocalizedWeatherSummary(summary: string, lang: SupportedLanguage): string {
  const map: Record<SupportedLanguage, Record<string, string>> = {
    en: {},
    hi: {
      "Freezing Snow & Black Ice": "बर्फबारी एवं ब्लैक आइस",
      "Cold Mountain Frost & Mist": "पर्वतीय पाला एवं कोहरा",
      "High-Altitude Chilling Fog": "अत्यधिक ऊंचाई का घना कोहरा",
      "Sub-Zero Alpine Freeze": "शून्य से नीचे अल्पाइन ठंड",
      "Chilly Mountain Rain": "शीतल पर्वतीय वर्षा",
      "Heavy Snowfall & Avalanche Alert": "भारी हिमपात एवं हिमस्खलन अलर्ट",
      "Heavy Snowfall & Freezing Roads": "भारी बर्फबारी एवं बर्फीली सड़कें",
      "Extreme Torrential Rainfall": "अत्यधिक मूसलाधार बारिश",
      "Dense Monsoon Fog & Rain": "घना मानसूनी कोहरा एवं वर्षा",
      "Monsoon Downpour & Hill Mist": "मानसूनी बारिश एवं पहाड़ी धुंध",
      "Tropical Heavy Rain & Flash Ponding": "उष्णकटिबंधीय भारी बारिश एवं जलभराव",
      "Heavy Monsoon Showers": "भारी मानसूनी बौछारें",
      "Dima Hasao Hill Landslide Rain": "दीमा हसाओ पर्वतीय भूस्खलन वर्षा",
      "Monsoon Showers & Valley Mist": "मानसूनी बौछारें एवं घाटी धुंध",
      "Moderate Monsoon Showers": "मध्यम मानसूनी बौछारें",
      "Slippery Hill Rain & Mudflow Risk": "फिसलन भरी बारिश एवं कीचड़ बहाव का खतरा",
      "Monsoon Overcast & Showers": "मानसूनी बादल एवं बौछारें",
      "Humid Overcast & Light Rain": "आर्द्र बादल एवं हल्की वर्षा",
      "Clear & Dry Weather": "साफ एवं शुष्क मौसम",
      "Clear & Dry Corridor": "साफ एवं शुष्क गलियारा",
      "High Altitude Sub-Zero Freeze": "उच्च पर्वतीय शून्य से नीचे ठंड",
      "Monsoon Downpour & Saturated Slopes": "मानसूनी बारिश एवं संतृप्त ढलान",
    },
    as: {
      "Freezing Snow & Black Ice": "তুষাৰপাত আৰু পিছল বৰফ",
      "Cold Mountain Frost & Mist": "পৰ্বতীয়া কুঁৱলী আৰু ঠাণ্ডা",
      "High-Altitude Chilling Fog": "উচ্চ পাহাৰৰ ডাঠ কুঁৱলী",
      "Sub-Zero Alpine Freeze": "শূন্যতকৈ তলৰ পাহাৰীয়া শীত",
      "Chilly Mountain Rain": "ঠাণ্ডা পৰ্বতীয়া বৰষুণ",
      "Heavy Snowfall & Avalanche Alert": "প্ৰবল তুষাৰপাত আৰু হিমস্খলন সতৰ্কবাৰ্তা",
      "Heavy Snowfall & Freezing Roads": "প্ৰবল বৰফ আৰু পিছল পথ",
      "Extreme Torrential Rainfall": "অত্যধিক ধাৰাসাৰ বৰষুণ",
      "Dense Monsoon Fog & Rain": "ডাঠ বাৰিষাৰ কুঁৱলী আৰু বৰষুণ",
      "Monsoon Downpour & Hill Mist": "বাৰিষাৰ বৰষুণ আৰু পাহাৰীয়া ধোঁৱা",
      "Tropical Heavy Rain & Flash Ponding": "ক্ৰান্তীয় প্ৰবল বৰষুণ আৰু পানী জমা হোৱা",
      "Heavy Monsoon Showers": "প্ৰবল বাৰিষাৰ জাক",
      "Dima Hasao Hill Landslide Rain": "ডিমা হাছাও ভূমিস্খলনৰ বৰষুণ",
      "Monsoon Showers & Valley Mist": "বাৰিষাৰ বৰষুণ আৰু উপত্যকাৰ কুঁৱলী",
      "Moderate Monsoon Showers": "মধ্যমীয়া বাৰিষাৰ বৰষুণ",
      "Slippery Hill Rain & Mudflow Risk": "পিচল পাহাৰীয়া বৰষুণ আৰু বোকাৰ বিপদ",
      "Monsoon Overcast & Showers": "মেঘাচ্ছন্ন আকাশ আৰু বৰষুণ",
      "Humid Overcast & Light Rain": "সেমেকা বতৰ আৰু পাতল বৰষুণ",
      "Clear & Dry Weather": "পৰিষ্কাৰ আৰু শুকান বতৰ",
      "Clear & Dry Corridor": "পৰিষ্কাৰ আৰু শুকান কৰিড'ৰ",
      "High Altitude Sub-Zero Freeze": "উচ্চ পৰ্বতীয়া প্ৰচণ্ড শীত",
      "Monsoon Downpour & Saturated Slopes": "বাৰিষাৰ বৰষুণ আৰু পাহাৰ খহি পৰাৰ সম্ভাৱনা",
    },
    bn: {
      "Freezing Snow & Black Ice": "তুষারপাত ও বিপজ্জনক ব্ল্যাক আইস",
      "Cold Mountain Frost & Mist": "পার্বত্য কুয়াশা ও শৈত্যপ্রবাহ",
      "High-Altitude Chilling Fog": "উচ্চ পার্বত্য ঘন কুয়াশা",
      "Sub-Zero Alpine Freeze": "হিমাঙ্কের নিচে তীব্র শীত",
      "Chilly Mountain Rain": "ঠান্ডা পার্বত্য বৃষ্টি",
      "Heavy Snowfall & Avalanche Alert": "ভারী তুষারপাত ও তুষারধসের সতর্কতা",
      "Heavy Snowfall & Freezing Roads": "ভারী বরফ ও বরফাচ্ছন্ন রাস্তা",
      "Extreme Torrential Rainfall": "চরম মুষলধারে বৃষ্টি",
      "Dense Monsoon Fog & Rain": "ঘন বর্ষার কুয়াশা ও বৃষ্টি",
      "Monsoon Downpour & Hill Mist": "বর্ষার বৃষ্টি ও পাহাড়ের ধোঁয়াশা",
      "Tropical Heavy Rain & Flash Ponding": "গ্রীষ্মমণ্ডলীয় ভারী বৃষ্টি ও জলাবদ্ধতা",
      "Heavy Monsoon Showers": "ভারী বর্ষার বৃষ্টি",
      "Dima Hasao Hill Landslide Rain": "ডিমা হাসাও ভূমিধসের বৃষ্টি",
      "Monsoon Showers & Valley Mist": "বর্ষার বৃষ্টি ও উপত্যকার কুয়াশা",
      "Moderate Monsoon Showers": "মাঝারি বর্ষার বৃষ্টি",
      "Slippery Hill Rain & Mudflow Risk": "পিচ্ছিল পাহাড়ি বৃষ্টি ও কাদার ধস",
      "Monsoon Overcast & Showers": "মেঘলা আকাশ ও বৃষ্টিপাত",
      "Humid Overcast & Light Rain": "আর্দ্র আবহাওয়া ও হালকা বৃষ্টি",
      "Clear & Dry Weather": "পরিষ্কার ও শুষ্ক আবহাওয়া",
      "Clear & Dry Corridor": "পরিষ্কার ও শুষ্ক করিডোর",
      "High Altitude Sub-Zero Freeze": "উচ্চ পার্বত্য হিমাঙ্কের নিচের শীত",
      "Monsoon Downpour & Saturated Slopes": "বর্ষার বৃষ্টি ও খাড়া ঢালের ঝুঁকি",
    },
  };
  return map[lang]?.[summary] || summary;
}

export function getLocalizedWeatherAdvisory(advisory: string, lang: SupportedLanguage): string {
  if (lang === "en" || !advisory) return advisory;
  const map: Record<SupportedLanguage, Record<string, string>> = {
    en: {},
    hi: {
      "Sub-zero frost on Sela Pass approaches. Anti-skid tire chains required for heavy transport.": "सेला दर्रे के पहुंच मार्ग पर शून्य से नीचे पाला। भारी वाहनों के लिए एंटी-स्किड टायर चेन अनिवार्य।",
      "Cold valley fog reducing morning visibility; drive with low-beam fog lamps.": "घाटी का ठंडा कोहरा दृश्यता कम कर रहा है; लो-बीम फॉग लैंप जलाकर वाहन चलाएं।",
      "Slippery ridge curves; extreme caution for multi-axle freight.": "फिसलन भरे मोड़; बहु-धुरी मालवाहकों के लिए अत्यधिक सावधानी आवश्यक।",
      "Icy patches on Teesta river bridges. Reduced speed limit 25 km/h.": "तीस्ता नदी के पुलों पर बर्फीले हिस्से। गति सीमा 25 किमी/घंटे तक सीमित।",
      "Black ice on mountain passes (Sela / Chungthang). Strict axle weight limits & snow chains advised.": "पर्वतीय दर्रों (सेला / चुंगथांग) पर ब्लैक आइस। सख्त एक्सल वजन सीमा एवं स्नो चेन की सलाह।",
      "Active rainfall in hill ghat sections (NH-6 / NH-2). Heightened mudslide and hydroplaning risk.": "पहाड़ी घाट अनुभागों (NH-6 / NH-2) में सक्रिय वर्षा। भूस्खलन एवं हाइड्रोप्लेनिंग का बढ़ा खतरा।",
      "Fair weather conditions with nominal highway cruising speeds and optimal braking traction.": "अनुकूल मौसम की स्थिति, सामान्य गति और इष्टतम ब्रेकिंग कर्षण।",
      "Fair conditions across terminal approaches.": "टर्मिनल पहुंच मार्गों पर अनुकूल स्थिति।",
    },
    as: {
      "Sub-zero frost on Sela Pass approaches. Anti-skid tire chains required for heavy transport.": "চেলা পাছৰ ওচৰত তুষাৰপাত। গধূৰ যান-বাহনৰ বাবে পিছল-ৰোধী টায়াৰ চেইন প্ৰয়োজন।",
      "Cold valley fog reducing morning visibility; drive with low-beam fog lamps.": "উপত্যকাৰ ঘন কুঁৱলীৰ বাবে দৃশ্যমানতা কম; ল'-বীম ফগ লেম্প ব্যৱহাৰ কৰক।",
      "Slippery ridge curves; extreme caution for multi-axle freight.": "পিচল পাহাৰীয়া কেঁকুৰী; মালবাহী গাড়ীৰ বাবে অত্যন্ত সাৱধানতাৰ প্ৰয়োজন।",
      "Icy patches on Teesta river bridges. Reduced speed limit 25 km/h.": "তিস্তা দলঙৰ ওপৰত বৰফৰ আৱৰণ। গতিসীমা ২৫ কিমি/ঘণ্টালৈ সীমিত।",
      "Black ice on mountain passes (Sela / Chungthang). Strict axle weight limits & snow chains advised.": "পৰ্বতীয়া পথত (চেলা / চুংথাং) পিছল বৰফ। ওজন সীমা আৰু চেইন ব্যৱহাৰৰ পৰামৰ্শ।",
      "Active rainfall in hill ghat sections (NH-6 / NH-2). Heightened mudslide and hydroplaning risk.": "পাহাৰীয়া অঞ্চলত (NH-6 / NH-2) বৰষুণ। ভূমিস্খলনৰ আশংকা।",
      "Fair weather conditions with nominal highway cruising speeds and optimal braking traction.": "অনুকূল বতৰ, স্বাভাৱিক গতি আৰু নিৰাপদ ব্ৰেকিং ব্যৱস্থা।",
      "Fair conditions across terminal approaches.": "টাৰ্মিনেল পথত অনুকূল অৱস্থা।",
    },
    bn: {
      "Sub-zero frost on Sela Pass approaches. Anti-skid tire chains required for heavy transport.": "সেলা পাসের রাস্তায় হিমাঙ্কের নিচে তাপমাত্রা। ভারী পরিবহনের জন্য অ্যান্টি-স্কিড চেইন আবশ্যক।",
      "Cold valley fog reducing morning visibility; drive with low-beam fog lamps.": "উপত্যকার ঠান্ডা কুয়াশায় দৃশ্যমানতা কম; লো-বিম ফগ ল্যাম্প ব্যবহার করুন।",
      "Slippery ridge curves; extreme caution for multi-axle freight.": "পিচ্ছিল পাহাড়ি বাঁক; মালবাহী ট্রাকের জন্য সর্বোচ্চ সতর্কতা প্রয়োজন।",
      "Icy patches on Teesta river bridges. Reduced speed limit 25 km/h.": "তিস্তা সেতুর ওপর বরফাচ্ছন্ন অংশ। গতিসীমা ২৫ কিমি/ঘন্টায় সীমাবদ্ধ।",
      "Black ice on mountain passes (Sela / Chungthang). Strict axle weight limits & snow chains advised.": "পাহাড়ি গিরিপথে (সেলা / চুংথাং) ব্ল্যাক আইস। ওজন সীমা ও চেইন ব্যবহারের পরামর্শ।",
      "Active rainfall in hill ghat sections (NH-6 / NH-2). Heightened mudslide and hydroplaning risk.": "পাহাড়ি ঘাট অংশে (NH-6 / NH-2) বৃষ্টিপাত। ভূমিধস ও চাকা পিছলে যাওয়ার ঝুঁকি।",
      "Fair weather conditions with nominal highway cruising speeds and optimal braking traction.": "অনুকূল আবহাওয়া, স্বাভাবিক গতি ও সর্বোত্তম ব্রেকিং ট্র্যাকশন।",
      "Fair conditions across terminal approaches.": "টার্মিনাল সংযোগ সড়কে অনুকূল অবস্থা।",
    },
  };
  return map[lang]?.[advisory] || advisory;
}

export function getLocalizedNote(note: string, lang: SupportedLanguage): string {
  if (lang === "en" || !note) return note;
  const map: Record<SupportedLanguage, Record<string, string>> = {
    en: {},
    hi: {
      "North Sikkim road — landslide-prone": "उत्तर सिक्किम मार्ग — भूस्खलन संभावित",
      "NH-10 Teesta gorge — monsoon vulnerable": "एनएच-10 तीस्ता घाटी — मानसून संवेदनशील",
      "North Sikkim high mountain road — flash floods": "उत्तर सिक्किम उच्च पर्वतीय मार्ग — आकस्मिक बाढ़",
    },
    as: {
      "North Sikkim road — landslide-prone": "উত্তৰ ছিকিম পথ — ভূমিস্খলন প্ৰৱণ",
      "NH-10 Teesta gorge — monsoon vulnerable": "এনএইচ-১০ তিস্তা গিৰিখাত — বাৰিষাত সংবেদনশীল",
      "North Sikkim high mountain road — flash floods": "উত্তৰ ছিকিম উচ্চ পাহাৰীয়া পথ — হঠাৎ বানপানী",
    },
    bn: {
      "North Sikkim road — landslide-prone": "উত্তর সিকিম রাস্তা — ভূমিধস প্রবণ",
      "NH-10 Teesta gorge — monsoon vulnerable": "এনএইচ-১০ তিস্তা গিরিখাত — বর্ষায় ঝুঁকিপূর্ণ",
      "North Sikkim high mountain road — flash floods": "উত্তর সিকিম উচ্চ পাহাড়ি রাস্তা — আকস্মিক বন্যা",
    },
  };
  return map[lang]?.[note] || note;
}

export function getCorridorDetails(
  corridor: { id: string; origin: string; destination: string; tag: string; description: string },
  lang: SupportedLanguage
): { title: string; tag: string; description: string } {
  const title = `${getCityName(corridor.origin, lang)} ➔ ${getCityName(corridor.destination, lang)}`;
  if (lang === "en") {
    return { title, tag: corridor.tag, description: corridor.description };
  }

  const tagMap: Record<SupportedLanguage, Record<string, string>> = {
    en: {},
    hi: {
      "Defense & Border Lifeline": "रक्षा एवं सीमा जीवनरेखा",
      "NH-6 Hill Lifeline": "एनएच-6 पर्वतीय जीवनरेखा",
      "NH-2 Mountain Ridge": "एनएच-2 पर्वत श्रृंखला",
      "Tripura Highway": "त्रिपुरा राष्ट्रीय राजमार्ग",
      "North Sikkim Frontier": "उत्तरी सिक्किम सीमांत",
      "Trans-Asian Trade": "ट्रांस-एशियाई व्यापार",
    },
    as: {
      "Defense & Border Lifeline": "প্ৰতিৰক্ষা আৰু সীমান্তৰ জীৱনৰেখা",
      "NH-6 Hill Lifeline": "এনএইচ-৬ পাহাৰীয়া জীৱনৰেখা",
      "NH-2 Mountain Ridge": "এনএইচ-২ পৰ্বত শৃংখলা",
      "Tripura Highway": "ত্ৰিপুৰা ৰাষ্ট্ৰীয় ঘাইপথ",
      "North Sikkim Frontier": "উত্তৰ ছিকিম সীমান্ত",
      "Trans-Asian Trade": "ট্ৰান্স-এছিয়ান বাণিজ্যিক",
    },
    bn: {
      "Defense & Border Lifeline": "প্রতিরক্ষা ও সীমান্ত লাইফলাইন",
      "NH-6 Hill Lifeline": "এনএইচ-৬ পাহাড়ি লাইফলাইন",
      "NH-2 Mountain Ridge": "এনএইচ-২ পর্বত শৈলশিরা",
      "Tripura Highway": "ত্রিপুরা জাতীয় মহাসড়ক",
      "North Sikkim Frontier": "উত্তর সিকিম সীমান্ত",
      "Trans-Asian Trade": "ট্রান্স-এশীয় বাণিজ্য",
    },
  };

  const descMap: Record<SupportedLanguage, Record<string, string>> = {
    en: {},
    hi: {
      "Climbs Bomdila & Sela Pass (13,700 ft) into western Arunachal frontier.": "बोमडिला और सेला दर्रा (13,700 फीट) चढ़कर पश्चिमी अरुणाचल सीमांत में प्रवेश।",
      "Vital freight corridor via Jowai & Sonapur tunnel to southern Assam.": "जोवाई और सोनापुर सुरंग के माध्यम से दक्षिणी असम के लिए महत्वपूर्ण माल ढुलाई गलियारा।",
      "Crucial interstate transit link through Kohima, Senapati & Kangpokpi.": "कोहिमा, सेनापति और कांगपोकपी के रास्ते महत्वपूर्ण अंतर्राज्यीय पारगमन संपर्क।",
      "Connects Barak Valley to Agartala via Dharmanagar & Ambassa passes.": "धर्मनगर और अम्बासा दर्रों के माध्यम से बराक घाटी को अगरतला से जोड़ता है।",
      "Teesta river gorge route traversing Mangan to northern valleys.": "तीस्ता नदी घाटी मार्ग जो मंगन से होकर उत्तरी घाटियों तक जाता है।",
      "Full trans-regional trunk line through Assam, Nagaland & Manipur border.": "असम, नागालैंड और मणिपुर सीमा से होकर गुजरने वाली संपूर्ण अंतर-क्षेत्रीय ट्रंक लाइन।",
    },
    as: {
      "Climbs Bomdila & Sela Pass (13,700 ft) into western Arunachal frontier.": "বোমডিলা আৰু চেলা পাছ (১৩,৭০০ ফুট) অতিক্ৰম কৰি পশ্চিম অৰুণাচল সীমান্তলৈ।",
      "Vital freight corridor via Jowai & Sonapur tunnel to southern Assam.": "জোৱাই আৰু সোণাপুৰ সুৰংগৰে দক্ষিণ অসমলৈ গুৰুত্বপূৰ্ণ মালবাহী পথ।",
      "Crucial interstate transit link through Kohima, Senapati & Kangpokpi.": "কহিমা, সেনাপতি আৰু কাংপকপী হৈ গুৰুত্বপূৰ্ণ আন্তঃৰাজ্যিক পৰিবহণ সংযোগ।",
      "Connects Barak Valley to Agartala via Dharmanagar & Ambassa passes.": "ধৰ্মনগৰ আৰু আম্বাচা পাছ হৈ বৰাক উপত্যকাক আগৰতলাৰ সৈতে সংযোগ কৰে।",
      "Teesta river gorge route traversing Mangan to northern valleys.": "মংগন হৈ উত্তৰ উপত্যকালৈ যোৱা তিস্তা নদীৰ গিৰিখাত পথ।",
      "Full trans-regional trunk line through Assam, Nagaland & Manipur border.": "অসম, নাগালেণ্ড আৰু মণিপুৰ সীমান্তৰে যোৱা আন্তঃআঞ্চলিক মুখ্য পথ।",
    },
    bn: {
      "Climbs Bomdila & Sela Pass (13,700 ft) into western Arunachal frontier.": "বোমডিলা ও সেলা পাস (১৩,৭০০ ফুট) অতিক্রম করে পশ্চিম অরুণাচল সীমান্তে।",
      "Vital freight corridor via Jowai & Sonapur tunnel to southern Assam.": "জোয়াই ও সোনাপুর সুড়ঙ্গের মাধ্যমে দক্ষিণ আসামের গুরুত্বপূর্ণ মালবাহী পথ।",
      "Crucial interstate transit link through Kohima, Senapati & Kangpokpi.": "কোহিমা, সেনাপতি ও কাংপোকপী হয়ে গুরুত্বপূর্ণ আন্তঃরাজ্য ট্রানজিট সংযোগ।",
      "Connects Barak Valley to Agartala via Dharmanagar & Ambassa passes.": "ধর্মনগর ও আম্বাসা গিরিপথ হয়ে বরাক উপত্যকাকে আগরতলার সাথে যুক্ত করে।",
      "Teesta river gorge route traversing Mangan to northern valleys.": "মঙ্গন হয়ে উত্তর উপত্যকা পর্যন্ত তিস্তা নদীর গিরিখাত পথ।",
      "Full trans-regional trunk line through Assam, Nagaland & Manipur border.": "আসাম, নাগাল্যান্ড ও মণিপুর সীমান্ত হয়ে সম্পূর্ণ আন্তঃআঞ্চলিক ট্রাঙ্ক লাইন।",
    },
  };

  return {
    title,
    tag: tagMap[lang]?.[corridor.tag] || corridor.tag,
    description: descMap[lang]?.[corridor.description] || corridor.description,
  };
}

