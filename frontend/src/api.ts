import type {
  Bootstrap,
  DataStatus,
  AuthSession,
  AccessibilityEvent,
  Alert,
  ConnectivitySummary,
  VehicleAsset,
  VehiclePosition,
  DeliveryJob,
  Comparison,
  ElevationGrid,
  FieldReport,
  FieldReportInput,
  FieldReportAttachment,
  RoadCandidate,
  Network,
  RouteInput,
  SearchResult,
  Weather,
} from "./types";

const API = import.meta.env.VITE_API_BASE_URL ?? "";
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : `Request failed (${response.status}).`,
    );
  }
  return response.json() as Promise<T>;
}
export const getBootstrap = (dataset = "demo") =>
  request<Bootstrap>(
    `/api/v1/bootstrap?dataset=${encodeURIComponent(dataset)}`,
  );
export const getDataStatus = () => request<DataStatus>("/api/v1/data-status");
export const getTerrain = (dataset = "demo") =>
  request<ElevationGrid | null>(
    `/api/v1/terrain?dataset=${encodeURIComponent(dataset)}`,
  );
export const getNetwork = (
  weather: Weather = "normal",
  dataset = "demo",
  focusNode?: string,
) =>
  request<Network>(
    `/api/v1/network?weather=${weather}&dataset=${encodeURIComponent(dataset)}${focusNode ? `&focus_node=${encodeURIComponent(focusNode)}` : ""}`,
  );
export const compareRoutes = (input: RouteInput, signal: AbortSignal) =>
  request<Comparison>("/api/v1/routes/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
export const searchPlaces = (query: string, dataset?: string) =>
  request<{ results: SearchResult[] }>(
    `/api/v1/search?q=${encodeURIComponent(query)}${dataset ? `&dataset=${encodeURIComponent(dataset)}` : ""}`,
  );
export const createFieldReport = (input: FieldReportInput, token: string) =>
  request<FieldReport>("/api/v1/field-reports", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
export const uploadFieldReportAttachment = (token: string, reportId: string, file: File) => {
  const body = new FormData();
  body.append("file", file);
  return request<FieldReportAttachment>(`/api/v1/field-reports/${encodeURIComponent(reportId)}/attachments`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
};
export const getFieldReports = (token: string, regionCode?: string) =>
  request<FieldReport[]>(
    `/api/v1/field-reports${regionCode ? `?region_code=${encodeURIComponent(regionCode)}` : ""}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
export const getAccessibilityEvents = (regionCode?: string) =>
  request<{ events: AccessibilityEvent[] }>(
    `/api/v1/accessibility-events${regionCode ? `?region_code=${encodeURIComponent(regionCode)}` : ""}`,
  );
export const getAlerts = (token: string) => request<Alert[]>("/api/v1/alerts", { headers: { Authorization: `Bearer ${token}` } });
export const getConnectivity = (token: string) => request<ConnectivitySummary[]>("/api/v1/connectivity", { headers: { Authorization: `Bearer ${token}` } });
export const getFleetVehicles = (token: string) => request<VehicleAsset[]>("/api/v1/fleet/vehicles", { headers: { Authorization: `Bearer ${token}` } });
export const sendFleetPosition = (token: string, payload: { vehicle_id: string; recorded_at: string; lon: number; lat: number; accuracy_m?: number | null }) => request<VehiclePosition>("/api/v1/fleet/positions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
export const getDeliveries = (token: string) => request<DeliveryJob[]>("/api/v1/deliveries", { headers: { Authorization: `Bearer ${token}` } });
export const updateDelivery = (token: string, deliveryId: string, payload: Pick<DeliveryJob, "status"> & { eta_at?: string | null }) => request<DeliveryJob>(`/api/v1/deliveries/${encodeURIComponent(deliveryId)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });

type PublicConfig = { supabase_url: string; supabase_publishable_key: string };
export class AuthError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
let publicConfig: Promise<PublicConfig> | undefined;
const getPublicConfig = () =>
  (publicConfig ??= request<PublicConfig>("/api/v1/public-config").catch((error) => {
    publicConfig = undefined;
    throw error;
  }));

async function authRequest(path: string, body: Record<string, unknown>) {
  const config = await getPublicConfig();
  const response = await fetch(`${config.supabase_url}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.supabase_publishable_key,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new AuthError(payload.msg || payload.error_description || "Authentication failed.", response.status);
  if (payload.access_token && !payload.expires_at) {
    payload.expires_at = Math.floor(Date.now() / 1000) + payload.expires_in;
  }
  return payload as AuthSession;
}

export const signIn = (email: string, password: string) =>
  authRequest("token?grant_type=password", { email, password });
export const signUp = (email: string, password: string, displayName: string) =>
  authRequest("signup", { email, password, data: { display_name: displayName } });

export const consumeOAuthCallback = async (): Promise<AuthSession | null> => {
  if (!window.location.hash.includes("access_token=")) return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) throw new AuthError("The Google sign-in response was incomplete.", 400);
  const config = await getPublicConfig();
  const response = await fetch(`${config.supabase_url}/auth/v1/user`, {
    headers: { apikey: config.supabase_publishable_key, Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(15000),
  });
  const user = await response.json().catch(() => ({}));
  if (!response.ok || !user.id) throw new AuthError("Google sign-in could not verify this account.", response.status);
  const expiresIn = Number(params.get("expires_in") || 3600);
  const session: AuthSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    user: { id: user.id, email: user.email },
  };
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  return session;
};

export const refreshSession = (refreshToken: string) =>
  authRequest("token?grant_type=refresh_token", { refresh_token: refreshToken });

export const getProfile = (token: string) =>
  request<{ id: string; role: string; region_code: string | null }>("/api/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const reviewFieldReport = (
  token: string, id: string, decision: "accepted" | "rejected", reviewNote: string,
  datasetId?: string, edgeId?: string,
) => request<FieldReport>(`/api/v1/field-reports/${encodeURIComponent(id)}/review`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ decision, review_note: reviewNote, dataset_id: datasetId, edge_id: edgeId }),
});
export const getRoadCandidates = (token: string, id: string, datasetId: string) =>
  request<{ candidates: RoadCandidate[] }>(
    `/api/v1/field-reports/${encodeURIComponent(id)}/road-candidates?dataset_id=${encodeURIComponent(datasetId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
