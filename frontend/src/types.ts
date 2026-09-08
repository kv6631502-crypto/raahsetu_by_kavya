export type Coordinates = [number, number];
export type ElevationGrid = {
  west: number;
  east: number;
  south: number;
  north: number;
  rows: number;
  cols: number;
  values: (number | null)[][];
  vertical_exaggeration: number;
  source: string;
  void_samples: number;
};
export type Location = { id: string; lon: number; lat: number; label: string };
export type SearchResult = Location & {
  dataset_id: string;
  kind: "road" | "place" | "facility";
  detail?: string;
  snap_distance_m?: number;
};
export type Vehicle = "heavy" | "emergency" | "light";
export type Weather = "normal" | "heavy_rain";
export type Bootstrap = {
  dataset: {
    id: string;
    title: string;
    region: string;
    source: string;
    generated_at: string;
    is_synthetic: boolean;
    hazard_source: string;
    terrain_source: string;
    limitations: string[];
    default_origin: string;
    default_destination: string;
  };
  dataset_version: string;
  available_datasets: { id: string; label: string; is_synthetic: boolean }[];
  counts: { nodes: number; edges: number };
  locations: Location[];
  vehicles: Record<
    Vehicle,
    {
      label: string;
      height_m: number;
      weight_t: number;
      width_m: number;
      speed_kph: number;
    }
  >;
  scenarios: {
    id: string;
    label: string;
    description: string;
    closed_edge_ids: string[];
  }[];
};
export type DataStatus = {
  status: "demo_only" | "ready";
  runtime_snapshots: string[];
  runtime_snapshot_count: number;
  downloaded_files: number;
  downloaded_bytes: number;
  terrain_tiles: number;
  terrain_tiles_planned: number;
  weather_reference_point_days: number;
  historical_ne_landslides: number;
  gaps: string[];
};
export type Network = {
  type: "FeatureCollection";
  metadata: {
    dataset_id: string;
    focus_node: string;
    focus: { lon: number; lat: number };
    radius_km: number;
    returned_features: number;
    total_features: number;
    truncated: boolean;
  };
  features: {
    type: "Feature";
    geometry: { type: "LineString"; coordinates: Coordinates[] };
    properties: {
      id: string;
      name: string;
      u: string;
      v: string;
      risk: number;
      closed: boolean;
      evidence: string;
    };
  }[];
};
export type AvailableRoute = {
  id: "fastest" | "risk_aware";
  status: "available";
  edge_ids: string[];
  geometry: { type: "LineString"; coordinates: Coordinates[] };
  distance_km: number;
  duration_min: number;
  risk_exposure: number;
  mean_risk_score: number;
  high_risk_segments: number;
  unknown_restriction_segments: number;
  unknown_risk_segments: number;
  objective_cost: number;
  expanded_nodes: number;
  compute_ms: number;
  roads: string[];
  warnings: string[];
};
export type Route =
  | AvailableRoute
  | { id: "fastest" | "risk_aware"; status: "unreachable"; reason: string };
export type Comparison = {
  dataset_id: string;
  dataset_version: string;
  routes: Route[];
  comparison: {
    extra_minutes: number;
    exposure_reduction_pct: number | null;
    same_route: boolean;
  } | null;
  explanations: {
    edge_id: string;
    road: string;
    reason: string;
    score: number;
    evidence: string;
  }[];
  assumptions: string[];
};
export type RouteInput = {
  dataset_id: string;
  origin: { node_id: string };
  destination: { node_id: string };
  vehicle: Vehicle;
  risk_aversion: number;
  weather: Weather;
  closed_edge_ids: string[];
  strict_vehicle: boolean;
};

export type FieldReportInput = {
  client_report_id: string;
  region_code: string;
  district?: string;
  place_name?: string;
  kind:
    | "road_blocked"
    | "road_damage"
    | "bridge_damage"
    | "landslide"
    | "flood"
    | "heavy_rain"
    | "traffic_congestion"
    | "other";
  accessibility_status: "open" | "restricted" | "blocked" | "unknown";
  severity: number;
  lon: number;
  lat: number;
  description: string;
  observed_at: string;
  offline_created_at?: string;
  details?: Record<string, unknown>;
};

export type FieldReport = FieldReportInput & {
  id: string;
  submitted_at: string;
  review_status: "pending" | "accepted" | "rejected" | "expired";
  valid_until: string | null;
};
export type FieldReportAttachment = {
  id: string;
  report_id: string;
  storage_path: string;
  mime_type: string;
  byte_size: number;
  sha256: string;
  captured_at: string | null;
};
export type AccessibilityEvent = {
  id: string;
  region_code: string;
  dataset_id: string | null;
  edge_id: string | null;
  kind: string;
  accessibility_status: "open" | "restricted" | "blocked";
  severity: number;
  lon: number;
  lat: number;
  starts_at: string;
  ends_at: string | null;
  source: string;
  details: Record<string, unknown>;
};
export type Alert = {
  id: string;
  event_id: string;
  region_code: string;
  alert_type: "blocked_route" | "high_risk" | "delay" | "reopened";
  severity: number;
  title: string;
  message_key: string;
  message_params: Record<string, unknown>;
  created_at: string;
  expires_at: string | null;
};
export type ConnectivitySummary = {
  region_code: string;
  state_name: string;
  active_events: number;
  blocked_events: number;
  restricted_events: number;
  status: "open" | "restricted" | "blocked";
  last_event_at: string | null;
};
export type VehicleAsset = { id: string; region_code: string; registration: string; vehicle_type: Vehicle; active: boolean; metadata: Record<string, unknown> };
export type VehiclePosition = { id: string; vehicle_id: string; recorded_at: string; lon: number; lat: number; speed_kph: number | null; heading: number | null; status: string; accuracy_m: number | null; metadata: Record<string, unknown> };
export type DeliveryJob = { id: string; vehicle_id: string; region_code: string; commodity: string; origin_name: string; destination_name: string; status: "planned" | "en_route" | "delayed" | "delivered" | "cancelled"; eta_at: string | null; delivered_at: string | null; created_at: string; metadata: Record<string, unknown> };
export type RoadCandidate = { edge_id: string; name: string; distance_m: number };

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  user: { id: string; email?: string };
};
