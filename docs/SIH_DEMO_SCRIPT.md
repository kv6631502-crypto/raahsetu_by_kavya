# RaahSetu — SIH 2026 Demo and Technical Jury Guide

## Claim discipline

RaahSetu is a working decision-support prototype for strategic Northeast corridors. The current `osm-northeast` snapshot is a curated benchmark graph with 111 hubs and 378 directed edges; it is not complete road-level Northeast coverage. The 24 hazard rows are synthetic benchmark observations structured around intended MoRTH, GSI, CWC and PWD source categories. Weather is fetched from Open-Meteo and is not a direct IMD feed. Desktop fleet movement and external-message delivery are explicitly simulations.

## Three-minute pitch

### 0:00–0:40 — Problem

> In Northeast India, a road disruption can isolate an entire supply corridor. Consumer navigation primarily optimizes travel time for general vehicles, while emergency and freight operations must also consider vehicle constraints, road accessibility, flood and landslide exposure, and the reliability of incident evidence.

### 0:40–1:25 — Solution

> RaahSetu is an explainable logistics decision-support platform. FastAPI runs our custom Risk-A* engine on a versioned corridor graph. It computes a fastest route and a risk-aware alternative, applies configured vehicle constraints, and reports the time-versus-exposure trade-off. React renders the route on OSM-backed 2D and optional 3D views. PostGIS is the production spatial store for reviewed hazards, field reports, fleet positions and alerts.

### 1:25–2:30 — Demonstration

1. Select a controlled SIH corridor and vehicle profile.
2. Point out the data badge: `Prototype corridor graph`.
3. Show Fastest and Risk-Aware responses, including dataset version and assumptions.
4. Show the Open-Meteo weather card. State whether it is `Fresh` or `Fallback`.
5. Start `Fleet Telemetry Simulator`; identify it as a simulator.
6. Select `Simulate Hazard Ahead` to send a request-scoped closed edge and recalculate the route.
7. Open the provider-ready broadcast simulator and preview a multilingual payload. Do not claim that an external SMS or WhatsApp was delivered.

### 2:30–3:00 — Readiness

> The routing engine, comparison API, offline report queue, reviewer-controlled event model and local fallback stores are implemented. Supabase/PostGIS, official datasets, mobile GPS streaming, offline map packages and external notification gateways require deployment-specific configuration and validation. The architecture keeps these integrations separate from the routing engine so they can be added without replacing the core algorithm.

## Technical terms

- **Hazard:** A potentially damaging condition such as a landslide, flood or damaged bridge.
- **Risk:** A scored combination of hazard exposure and operational impact. RaahSetu's `risk_exposure` is an index, not an accident probability.
- **OSM:** OpenStreetMap, an ODbL-licensed collaborative geographic database.
- **OSMnx:** Python tooling that converts OSM roads into routable node-edge graphs.
- **Node / edge:** A node is a junction or hub; a directed edge is a traversable road segment in one direction.
- **PostGIS:** PostgreSQL spatial extension used for points, lines, polygons, distance and intersection queries.
- **Spatial snapping:** Matching a hazard point to a plausible nearby road edge. Nearest does not automatically mean correct, so operational matches require review.
- **Risk-A*:** A* search using travel time plus risk-sensitive edge cost while retaining a lower-bound geographic heuristic.
- **Pruning:** Removing an edge when a known hard constraint, such as maximum bridge weight, makes it infeasible.
- **XAI baseline:** An interpretable logistic scoring formula. The current baseline is domain-informed and tested on synthetic distributions; it is not a field-trained probability model.
- **TTL / freshness:** The time window during which an observation remains operationally relevant. Different hazard types need different validity policies.
- **RBAC / RLS:** Role-Based Access Control governs application actions; Row Level Security restricts database rows.
- **JWT:** A signed access token used by the backend to verify a Supabase-authenticated identity.
- **PWA / Service Worker / IndexedDB:** Installable web-app foundation, request/cache handler, and browser-local structured storage used for the offline report queue.
- **Telemetry:** Timestamped position, speed, heading, accuracy and status received from a vehicle or simulated source.

## Twenty jury questions with defensible answers

### 1. How is this different from Google Maps or MapMyIndia?

> RaahSetu is a fleet decision-support layer, not a consumer-map replacement. Its custom graph cost includes configured vehicle constraints, reviewed accessibility events and risk scores, and it returns an explainable fastest-versus-risk-aware comparison. We cannot modify a proprietary provider's internal routing objective. The basemap is replaceable; the route engine is ours.

### 2. What if hazard data is stale?

> Every operational observation should carry source, observation time, validity and review status. Expired alerts are filtered by the backend. The current prototype does not yet implement a complete hazard-specific decay scheduler, so the UI distinguishes fresh API data, cached fallback and controlled scenarios.

### 3. Can a fake citizen report close a highway?

> No. A submitted report remains pending and does not affect routing. A reviewer must accept it against a specific dataset and edge before an accessibility event can affect later route requests. Production reviewer identity is enforced through Supabase authentication and roles.

### 4. Where did bridge capacities come from?

> Current capacity values are benchmark scenario inputs, not certified asset records. They prove that hard constraint pruning works. Operational deployment requires an official bridge asset ID, capacity source, inspection date and validity before the constraint is marked verified.

### 5. What was the ML model trained on?

> The current component is a domain-informed logistic baseline, not a field-trained model. It maps rainfall, slope, incident count, surface condition and elevation into an interpretable score. Verified labelled eDAR, PWD and disaster-event data would be required for empirical training and calibration.

### 6. What accuracy do you claim?

> We do not claim field prediction accuracy yet. The synthetic test checks consistency of the scoring formulation. Separately, the controlled routing benchmark solved 56 of 56 connected journeys, and 34 journeys produced a lower-exposure alternative. That is a route-engine benchmark, not a safety-outcome study.

### 7. What is the live weather source?

> The backend fetches Open-Meteo's forecast API and caches a response for 60 minutes. The response includes source, timestamp and fresh/fallback state. It is not a direct IMD feed. A government deployment can add an approved IMD adapter without changing the route API.

### 8. Is GPS real or simulated?

> Desktop evaluation uses a deterministic waypoint simulator so the demonstration is repeatable. The UI can read a device position using the browser Geolocation API and send it only with an authenticated session. Continuous real-phone streaming still requires a field test.

### 9. Does SMS or WhatsApp actually send?

> The current module is a provider-ready simulator. It prepares multilingual payloads and previews the workflow, but no external delivery is claimed. A backend gateway, credentials, consent policy, webhook receipts and audit trail are required for production delivery.

### 10. What works without internet?

> The PWA shell can be cached and field reports can be queued in IndexedDB for retry after reconnection. Complete offline map-tile coverage and operating-system background sync are not yet claimed. Previously loaded route data may remain available depending on the cache state.

### 11. What happens if Supabase is unavailable?

> Core routing remains independent. With no database configuration, local in-memory stores support a zero-setup demonstration, but their contents disappear on process restart. Production resilience requires durable local queuing, health indicators and reconciliation after recovery.

### 12. Can government legally use OSM?

> OSM permits government and commercial use under ODbL 1.0 subject to attribution and share-alike obligations for covered derived databases. RaahSetu shows OpenStreetMap attribution. Any government dataset added later must be reviewed under its own licence.

### 13. Is all of Northeast covered?

> The benchmark represents all eight states through 111 strategic hubs and 378 directed corridor edges. It demonstrates regional routing architecture and selected arterial connectivity. It does not represent every road, village or bridge in Northeast India.

### 14. What if a road is new or missing?

> A missing road cannot be safely routed until it is added to a versioned graph and validated. A washed-out known edge can be supplied as a closure for recalculation. The existing import scripts demonstrate graph creation, but a complete automatic new-road GeoJSON ingestion workflow is future work.

### 15. What if the safer route is much slower?

> The platform shows both alternatives and their measurable trade-off. Risk sensitivity can reflect cargo policy, but verified hard constraints cannot be treated as optional. The authorized dispatcher makes the final operational decision under agency policy.

### 16. Who authorizes an air-drop?

> RaahSetu does not authorize an air-drop. An unreachable route can support an isolation alert, but the District/State Emergency Operations Centre and the competent aviation or defence authority make the decision. Automated notification to that chain is not currently implemented.

### 17. What will deployment cost?

> The software stack has no proprietary routing licence fee. Actual operating cost depends on graph size, traffic, retention, storage, notification volume, availability target and the selected government/cloud environment. We will provide a measured capacity plan after load testing rather than an unsupported fixed monthly figure.

### 18. How is unauthorized route manipulation prevented?

> Supabase JWT validation and backend role checks protect report review. PostgreSQL/PostGIS migrations enable RLS and keep application writes behind FastAPI. Demo-token authentication is disabled by default; it can be explicitly enabled only for local development. A production security review and real Supabase policy test remain mandatory.

### 19. Who keeps the data updated?

> Open-Meteo is fetched on demand and cached for 60 minutes; there is no 15-minute background ingestion worker today. In production, automated feeds need monitored ingestion jobs, while DDMA/PWD reviewers own operational incident verification. Fleet-derived congestion requires a sufficient, consented vehicle sample.

### 20. Who bears the cost of a false diversion?

> Pending citizen reports do not close roads. Reviewed evidence, freshness, graph version and route assumptions must be retained for audit. The platform presents the trade-off and supports agency decision-making; legal accountability and override policy must be defined by the deploying authority. A `Force Primary Route` control is not currently implemented.

## Evidence map

| Capability | Actual implementation |
|---|---|
| Risk-A* and vehicle filtering | `backend/app/routing.py` |
| Dataset models and route request | `backend/app/models.py` |
| Field-report review and events | `backend/app/field_reports.py`, `backend/app/main.py` |
| Supabase token and role validation | `backend/app/auth.py` |
| Weather source and freshness | `backend/app/weather.py`, `GET /api/v1/weather/live` |
| In-memory operational stores | `backend/app/field_reports.py`, `backend/app/fleet.py`, `backend/app/alerts.py` |
| Offline report queue | `frontend/src/offlineQueue.ts`, `frontend/src/App.tsx` |
| PWA foundation | `frontend/public/sw.js`, `frontend/public/manifest.webmanifest` |
| Controlled route evaluation | `backend/scripts/evaluate.py` |
| Synthetic baseline evaluation | `backend/scripts/train_ml_disruption.py` |

## Safe fallback sentence

> I do not want to give an unsupported operational claim. The current prototype proves this workflow on a versioned benchmark; production validation requires the corresponding official source, credentials and field test.
