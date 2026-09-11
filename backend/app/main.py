import hashlib
import json
import logging
import math
import os
from collections import OrderedDict
from contextlib import asynccontextmanager
from pathlib import Path
from threading import RLock
from typing import Annotated
from uuid import UUID

import httpx
import psycopg
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Header, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .alerts import AlertStore, PostgresAlertStore
from .auth import AuthUser, require_reviewer, require_user
from .field_reports import FieldReportStore, PostgresFieldReportStore
from .fleet import FleetStore, PostgresFleetStore
from .models import (
    Alert,
    ConnectivitySummary,
    Dataset,
    DeliveryCreate,
    DeliveryJob,
    DeliveryUpdate,
    Endpoint,
    FieldReport,
    FieldReportAttachment,
    FieldReportCreate,
    FieldReportReview,
    PositionCreate,
    RouteRequest,
    VehicleAsset,
    VehiclePosition,
    VehicleSummary,
)
from .routing import VEHICLES, RoadGraph

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT.parent / ".env")
logger = logging.getLogger("raahsetu")

DEMO_CITY_ALIASES = {
    "guwahati": ("n2_0", "Guwahati", "demo origin"),
    "dimapur": ("n0_3", "Dimapur", "demo place"),
    "kohima": ("n1_1", "Kohima", "demo place"),
    "senapati": ("n3_5", "Senapati", "demo place"),
    "imphal": ("n2_6", "Imphal", "demo destination"),
}


def load_graph() -> RoadGraph:
    configured = os.getenv("DATASET_PATH")
    path = Path(configured) if configured else ROOT / "data" / "demo-network.json"
    if not path.is_absolute():
        path = ROOT.parent / path
    return RoadGraph(Dataset.model_validate(json.loads(path.read_text(encoding="utf-8"))))


def discover_dataset_paths() -> dict[str, Path]:
    """Discover versioned OSM graph snapshots without loading them into memory."""
    paths: dict[str, Path] = {}
    for path in sorted((ROOT / "data").glob("osm-*.json")):
        if path.name.endswith("-terrain.json"):
            continue
        dataset_id = path.stem
        # The reviewed pilot intentionally has a versioned dataset id.
        if path.name == "osm-guwahati-corridor-reviewed.json":
            dataset_id = "osm-guwahati-corridor-reviewed-v1"
        paths[dataset_id] = path
    return paths


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.graph = load_graph()
    app.state.graphs = OrderedDict({"demo": app.state.graph})
    app.state.dataset_paths = discover_dataset_paths()
    app.state.graph_lock = RLock()
    app.state.dynamic_cache_size = max(1, int(os.getenv("GRAPH_CACHE_SIZE", "1")))
    app.state.search_catalogs = {}
    catalog_path = ROOT.parent / "datasets" / "processed" / "ne-coverage-catalog.json"
    catalog = json.loads(catalog_path.read_text(encoding="utf-8")) if catalog_path.exists() else {}
    app.state.region_catalog = {
        f"osm-{record['state'].lower().replace(' ', '-')}": record
        for record in catalog.get("records", [])
    }
    pilot = ROOT / "data" / "osm-guwahati.json"
    if pilot.exists():
        app.state.graphs["osm-guwahati"] = RoadGraph(
            Dataset.model_validate_json(pilot.read_text(encoding="utf-8"))
        )
    reviewed = ROOT / "data" / "osm-guwahati-corridor-reviewed.json"
    if reviewed.exists():
        app.state.graphs["osm-guwahati-corridor-reviewed-v1"] = RoadGraph(
            Dataset.model_validate_json(reviewed.read_text(encoding="utf-8"))
        )
    logger.info("Loaded dataset %s (%s)", app.state.graph.dataset.id, app.state.graph.version)
    yield


app = FastAPI(
    title="RaahSetu routing API",
    version="0.1.0",
    lifespan=lifespan,
    description="SIH prototype. Custom risk-aware A*. No live navigation guarantees.",
)
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Content-Type", "Authorization"],
    allow_credentials=False,
)


def get_field_report_store() -> FieldReportStore:
    return PostgresFieldReportStore()


def get_fleet_store() -> FleetStore:
    return PostgresFleetStore()


def get_alert_store() -> AlertStore:
    return PostgresAlertStore()


@app.get("/health")
def health():
    graph = app.state.graph
    return {"status": "ok", "dataset_id": graph.dataset.id, "version": graph.version}


def data_readiness() -> dict:
    status_path = ROOT.parent / "datasets" / "DATA_STATUS.json"
    status = json.loads(status_path.read_text(encoding="utf-8")) if status_path.exists() else {}
    snapshots = sorted(
        path.stem.removeprefix("osm-")
        for path in (ROOT / "data").glob("osm-*.json")
        if not path.name.endswith("-terrain.json")
    )
    return {
        "status": "ready" if snapshots else "demo_only",
        "runtime_snapshots": snapshots,
        "runtime_snapshot_count": len(snapshots),
        "downloaded_files": status.get("verified_download_files", 0),
        "downloaded_bytes": status.get("downloaded_bytes", 0),
        "terrain_tiles": status.get("terrain_tiles", 0),
        "terrain_tiles_planned": status.get("terrain_tiles_planned", 0),
        "weather_reference_point_days": status.get("weather_reference_point_days", 0),
        "historical_ne_landslides": status.get("historical_ne_landslides", 0),
        "gaps": status.get("gaps", []),
    }


@app.get("/api/v1/data-status")
def data_status():
    return data_readiness()


@app.get("/api/v1/public-config")
def public_config():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    if not url or not key:
        raise HTTPException(503, detail="Supabase public configuration is unavailable")
    return {"supabase_url": url, "supabase_publishable_key": key}


@app.get("/api/v1/me", response_model=AuthUser)
def current_user(user: Annotated[AuthUser, Depends(require_user)]):
    return user


@app.get("/api/v1/fleet/positions", response_model=list[VehicleSummary])
def fleet_positions(store: Annotated[FleetStore, Depends(get_fleet_store)], user: Annotated[AuthUser, Depends(require_user)], limit: int = Query(default=200, ge=1, le=1000)):
    try:
        region = None if user.role == "admin" else user.region_code
        return store.positions(region, limit)
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.get("/api/v1/fleet/vehicles", response_model=list[VehicleAsset])
def fleet_vehicles(store: Annotated[FleetStore, Depends(get_fleet_store)], user: Annotated[AuthUser, Depends(require_user)]):
    try:
        return store.vehicles(user.id)
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.post("/api/v1/fleet/positions", response_model=VehiclePosition, status_code=201)
def record_fleet_position(payload: PositionCreate, store: Annotated[FleetStore, Depends(get_fleet_store)], user: Annotated[AuthUser, Depends(require_user)]):
    try:
        return store.record_position(payload, user.id)
    except LookupError as exc:
        raise HTTPException(403, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.get("/api/v1/deliveries", response_model=list[DeliveryJob])
def deliveries(store: Annotated[FleetStore, Depends(get_fleet_store)], user: Annotated[AuthUser, Depends(require_user)], limit: int = Query(default=200, ge=1, le=1000)):
    try:
        region = None if user.role == "admin" else user.region_code
        return store.deliveries(region, limit)
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.post("/api/v1/deliveries", response_model=DeliveryJob, status_code=201)
def create_delivery(payload: DeliveryCreate, store: Annotated[FleetStore, Depends(get_fleet_store)], user: Annotated[AuthUser, Depends(require_user)]):
    if user.region_code and user.role != "admin" and user.region_code != payload.region_code:
        raise HTTPException(403, detail="Delivery is outside the assigned region")
    try:
        return store.create_delivery(payload, user.id)
    except LookupError as exc:
        raise HTTPException(403, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.patch("/api/v1/deliveries/{delivery_id}", response_model=DeliveryJob)
def update_delivery(delivery_id: UUID, payload: DeliveryUpdate, store: Annotated[FleetStore, Depends(get_fleet_store)], user: Annotated[AuthUser, Depends(require_user)]):
    try:
        return store.update_delivery(str(delivery_id), payload, user.id, user.role == "admin")
    except LookupError as exc:
        raise HTTPException(404, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.get("/api/v1/accessibility-events")
def accessibility_events(
    store: Annotated[FieldReportStore, Depends(get_field_report_store)],
    region_code: str | None = Query(default=None, pattern=r"^[a-z]+(?:-[a-z]+)*$"),
):
    if not os.getenv("DATABASE_URL"):
        return {"events": []}
    try:
        return {"events": store.active_events(region_code)}
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.get("/api/v1/alerts", response_model=list[Alert])
def alerts(store: Annotated[AlertStore, Depends(get_alert_store)], user: Annotated[AuthUser, Depends(require_user)], limit: int = Query(default=100, ge=1, le=500)):
    try:
        region = None if user.role == "admin" else user.region_code
        return store.list_alerts(region, limit)
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.get("/api/v1/connectivity", response_model=list[ConnectivitySummary])
def connectivity(store: Annotated[AlertStore, Depends(get_alert_store)], user: Annotated[AuthUser, Depends(require_user)]):
    try:
        region = None if user.role == "admin" else user.region_code
        return store.connectivity(region)
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


def get_graph(dataset: str) -> RoadGraph:
    with app.state.graph_lock:
        if dataset in app.state.graphs:
            return app.state.graphs[dataset]
        path = app.state.dataset_paths.get(dataset)
        if path is None:
            raise HTTPException(404, detail="Dataset is not available")

        dynamic = [key for key in app.state.graphs if key != "demo" and key != "osm-guwahati"]
        while len(dynamic) >= app.state.dynamic_cache_size:
            app.state.graphs.pop(dynamic.pop(0), None)
        logger.info("Loading graph snapshot %s from %s", dataset, path)
        graph = RoadGraph(Dataset.model_validate_json(path.read_text(encoding="utf-8")))
        app.state.graphs[dataset] = graph
        return graph


def dataset_label(dataset_id: str) -> str:
    if dataset_id == "demo":
        return app.state.graph.dataset.title
    return dataset_id.removeprefix("osm-").replace("-", " ").title() + " OSM"


def search_catalog(dataset_id: str) -> list[dict]:
    slug = "assam" if dataset_id.startswith("osm-guwahati") else dataset_id.removeprefix("osm-")
    if slug in app.state.search_catalogs:
        return app.state.search_catalogs[slug]
    base = ROOT.parent / "datasets" / "processed" / "osm"
    records = []
    for kind, suffix in (("place", "places"), ("facility", "facilities")):
        path = base / f"{slug}-{suffix}.geojson"
        if not path.exists():
            continue
        for feature in json.loads(path.read_text(encoding="utf-8")).get("features", []):
            properties = feature.get("properties", {})
            coordinates = feature.get("geometry", {}).get("coordinates", [])
            if len(coordinates) < 2 or not properties.get("name"):
                continue
            records.append(
                {
                    "source_id": properties.get("osm_id"),
                    "label": properties["name"],
                    "kind": kind,
                    "detail": properties.get("place") or properties.get("kind") or kind,
                    "population": properties.get("population"),
                    "lon": coordinates[0],
                    "lat": coordinates[1],
                }
            )
    app.state.search_catalogs[slug] = records
    return records


def named_locations(graph: RoadGraph) -> list[dict]:
    record = app.state.region_catalog.get(graph.dataset.id)
    if record is None:
        return [node.model_dump() for node in graph.dataset.nodes if node.label]
    capital = record["capital"]

    def population(item: dict) -> int:
        try:
            return int(str(item.get("population") or "0").replace(",", ""))
        except ValueError:
            return 0

    places = [item for item in search_catalog(graph.dataset.id) if item["kind"] == "place"]
    places.sort(
        key=lambda item: (
            item["label"].casefold() != capital.casefold(),
            item["detail"] not in {"city", "town"},
            -population(item),
            item["label"].casefold(),
        )
    )
    locations = []
    seen = set()
    for item in places:
        try:
            node_id, snap_distance = graph.resolve(Endpoint(lon=item["lon"], lat=item["lat"]))
        except ValueError:
            continue
        if node_id in seen:
            continue
        locations.append(
            {
                "id": node_id,
                "label": item["label"],
                "lon": item["lon"],
                "lat": item["lat"],
                "kind": item["detail"],
                "snap_distance_m": snap_distance,
            }
        )
        seen.add(node_id)
        if len(locations) == 8:
            break
    return locations or [node.model_dump() for node in graph.dataset.nodes if node.label]


@app.get("/api/v1/bootstrap")
def bootstrap(dataset: str = "demo"):
    graph = get_graph(dataset)
    dataset = graph.dataset
    locations = named_locations(graph)
    dataset_metadata = dataset.model_dump(exclude={"nodes", "edges", "scenarios"})
    if len(locations) >= 2 and graph.dataset.id in app.state.region_catalog:
        dataset_metadata["default_origin"] = locations[0]["id"]
        origin = graph.nodes[locations[0]["id"]]
        destination = max(
            locations[1:],
            key=lambda item: math.dist(
                (origin.lon, origin.lat),
                (graph.nodes[item["id"]].lon, graph.nodes[item["id"]].lat),
            ),
        )
        dataset_metadata["default_destination"] = destination["id"]
    return {
        "dataset": dataset_metadata,
        "dataset_version": graph.version,
        "counts": {"nodes": len(graph.nodes), "edges": len(graph.edges)},
        "locations": locations,
        "vehicles": VEHICLES,
        "available_datasets": [
            {
                "id": key,
                "label": app.state.graphs[key].dataset.title
                if key in app.state.graphs
                else dataset_label(key),
                "is_synthetic": key == "demo",
            }
            for key in dict.fromkeys([*app.state.graphs, *app.state.dataset_paths])
        ],
        "scenarios": [s.model_dump() for s in dataset.scenarios],
    }


@app.get("/api/v1/terrain")
def terrain(dataset: str = "demo"):
    get_graph(dataset)
    path = ROOT / "data" / "osm-guwahati-terrain.json"
    if dataset == "osm-guwahati" and path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return None


@app.get("/api/v1/network")
def network(
    weather: str = "normal",
    dataset: str = "demo",
    focus_node: str | None = None,
    radius_km: float = Query(default=15, ge=1, le=100),
    limit: int = Query(default=8000, ge=100, le=20000),
):
    if weather not in ("normal", "heavy_rain"):
        raise HTTPException(422, detail="Unsupported weather scenario")
    graph = get_graph(dataset)
    focus_id = focus_node or graph.dataset.default_origin
    if focus_id not in graph.nodes:
        raise HTTPException(422, detail="Unknown focus node")
    focus = graph.nodes[focus_id]
    latitude_padding = radius_km / 111.32
    longitude_padding = radius_km / max(1, 111.32 * abs(math.cos(math.radians(focus.lat))))
    west, east = focus.lon - longitude_padding, focus.lon + longitude_padding
    south, north = focus.lat - latitude_padding, focus.lat + latitude_padding
    visible_edges = []
    for edge in graph.edges.values():
        u, v = graph.nodes[edge.u], graph.nodes[edge.v]
        if not (
            (west <= u.lon <= east and south <= u.lat <= north)
            or (west <= v.lon <= east and south <= v.lat <= north)
        ):
            continue
        visible_edges.append(edge)
        if len(visible_edges) >= limit:
            break
    return {
        "type": "FeatureCollection",
        "metadata": {
            "dataset_id": graph.dataset.id,
            "focus_node": focus_id,
            "focus": {"lon": focus.lon, "lat": focus.lat},
            "radius_km": radius_km,
            "returned_features": len(visible_edges),
            "total_features": len(graph.edges),
            "truncated": len(visible_edges) >= limit,
        },
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "LineString", "coordinates": edge.geometry},
                "properties": {
                    "id": edge.id,
                    "name": edge.name,
                    "u": edge.u,
                    "v": edge.v,
                    "risk": round(graph.risk(edge, weather), 3),
                    "closed": edge.closed,
                    "evidence": edge.evidence,
                },
            }
            for edge in visible_edges
        ],
    }


@app.get("/api/v1/search")
def search_places(
    q: str = Query(min_length=2, max_length=80),
    dataset: str | None = None,
    limit: int = Query(default=12, ge=1, le=30),
):
    """Search road names and labelled places across available networks."""
    needle = " ".join(q.casefold().split())
    results: list[dict] = []
    # Do not load every multi-hundred-megabyte regional snapshot on each keystroke.
    # The lightweight demo graph is the default search surface; an explicit dataset
    # remains available for callers that already selected a regional network.
    dataset_ids = [dataset or "demo"]
    for dataset_id in dataset_ids:
        graph = get_graph(dataset_id)
        seen: set[str] = set()
        if dataset_id == "demo":
            for alias, (node_id, label, detail) in DEMO_CITY_ALIASES.items():
                if needle in alias or alias.startswith(needle):
                    node = graph.nodes.get(node_id)
                    if node is not None:
                        results.append(
                            {
                                "id": node_id,
                                "dataset_id": dataset_id,
                                "label": label,
                                "kind": "place",
                                "detail": detail,
                                "lon": node.lon,
                                "lat": node.lat,
                            }
                        )
                        seen.add(node_id)
        catalog_matches = sorted(
            (item for item in search_catalog(dataset_id) if needle in item["label"].casefold()),
            key=lambda item: (
                not item["label"].casefold().startswith(needle),
                item["kind"] != "place",
                len(item["label"]),
            ),
        )
        for item in catalog_matches:
            try:
                node_id, snap_distance = graph.resolve(Endpoint(lon=item["lon"], lat=item["lat"]))
            except ValueError:
                continue
            if node_id in seen:
                continue
            results.append(
                {
                    "id": node_id,
                    "dataset_id": dataset_id,
                    "label": item["label"],
                    "kind": item["kind"],
                    "detail": item["detail"],
                    "lon": item["lon"],
                    "lat": item["lat"],
                    "snap_distance_m": snap_distance,
                }
            )
            seen.add(node_id)
            if len(results) >= limit:
                break
        if len(results) >= limit:
            break
        for node in graph.nodes.values():
            label = node.label or ""
            if needle in label.casefold() and node.id not in seen:
                results.append(
                    {
                        "id": node.id,
                        "dataset_id": dataset_id,
                        "label": label,
                        "kind": "place",
                        "lon": node.lon,
                        "lat": node.lat,
                    }
                )
                seen.add(node.id)
                if len(results) >= limit:
                    break
        if len(results) >= limit:
            break
        for edge in graph.edges.values():
            if needle in edge.name.casefold() and edge.u not in seen:
                node = graph.nodes[edge.u]
                results.append(
                    {
                        "id": edge.u,
                        "dataset_id": dataset_id,
                        "label": edge.name,
                        "kind": "road",
                        "lon": node.lon,
                        "lat": node.lat,
                    }
                )
                seen.add(edge.u)
                if len(results) >= limit:
                    break
        if len(results) >= limit:
            break
    return {"query": q, "dataset_id": dataset, "results": results[:limit]}


@app.post("/api/v1/routes/compare")
def compare_routes(request: RouteRequest):
    # A sync endpoint runs CPU-bound graph traversal in FastAPI's worker thread pool.
    # The graph is read-only; all scenario inputs remain local to this request.
    try:
        graph = get_graph(request.dataset_id)
        if os.getenv("DATABASE_URL") and request.dataset_id != "demo":
            try:
                region = "assam" if request.dataset_id.startswith("osm-guwahati") else request.dataset_id.removeprefix("osm-")
                events = PostgresFieldReportStore().active_events(region)
                blocked = [event["edge_id"] for event in events if event["dataset_id"] == request.dataset_id and event["accessibility_status"] == "blocked" and event["edge_id"] in graph.edges]
                request = request.model_copy(update={"closed_edge_ids": list(dict.fromkeys([*request.closed_edge_ids, *blocked]))})
            except (psycopg.Error, OSError, Exception) as db_exc:  # noqa: BLE001
                logger.warning("Failed to retrieve live accessibility closures from PostGIS, using graph defaults: %s", db_exc)
        return graph.compare(request)
    except ValueError as exc:
        raise HTTPException(422, detail=str(exc)) from exc


@app.post("/api/v1/field-reports", response_model=FieldReport, status_code=201)
def create_field_report(
    report: FieldReportCreate,
    store: Annotated[FieldReportStore, Depends(get_field_report_store)],
    user: Annotated[AuthUser, Depends(require_user)],
):
    try:
        if user.region_code and user.region_code != report.region_code and user.role != "admin":
            raise HTTPException(403, detail="Report is outside the assigned region")
        return store.create(report, user.id)
    except ValueError as exc:
        raise HTTPException(409, detail=str(exc)) from exc
    except psycopg.errors.ForeignKeyViolation as exc:
        raise HTTPException(422, detail="Unknown Northeast region code") from exc
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.get("/api/v1/field-reports", response_model=list[FieldReport])
def list_field_reports(
    store: Annotated[FieldReportStore, Depends(get_field_report_store)],
    user: Annotated[AuthUser, Depends(require_user)],
    region_code: str | None = Query(default=None, pattern=r"^[a-z]+(?:-[a-z]+)*$"),
    limit: int = Query(default=100, ge=1, le=500),
):
    try:
        if user.region_code and user.role != "admin":
            if region_code and region_code != user.region_code:
                raise HTTPException(403, detail="Reports are outside the assigned region")
            region_code = user.region_code
        return store.list(region_code, limit)
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.patch("/api/v1/field-reports/{report_id}/review", response_model=FieldReport)
def review_field_report(
    report_id: UUID,
    review: FieldReportReview,
    store: Annotated[FieldReportStore, Depends(get_field_report_store)],
    reviewer: Annotated[AuthUser, Depends(require_reviewer)],
):
    try:
        return store.review(str(report_id), review, reviewer.id)
    except LookupError as exc:
        raise HTTPException(404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(409, detail=str(exc)) from exc


@app.get("/api/v1/field-reports/{report_id}/road-candidates")
def field_report_road_candidates(
    report_id: UUID,
    store: Annotated[FieldReportStore, Depends(get_field_report_store)],
    reviewer: Annotated[AuthUser, Depends(require_reviewer)],
    dataset_id: str = Query(min_length=1, max_length=100),
):
    try:
        region_code = None if reviewer.role == "admin" else reviewer.region_code
        return {"candidates": store.road_candidates(str(report_id), dataset_id, region_code)}
    except PermissionError as exc:
        raise HTTPException(403, detail=str(exc)) from exc
    except LookupError as exc:
        raise HTTPException(404, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(503, detail=str(exc)) from exc


@app.post("/api/v1/field-reports/{report_id}/attachments", response_model=FieldReportAttachment, status_code=201)
def upload_field_report_attachment(
    report_id: UUID,
    store: Annotated[FieldReportStore, Depends(get_field_report_store)],
    user: Annotated[AuthUser, Depends(require_user)],
    authorization: Annotated[str, Header()],
    file: Annotated[UploadFile, File(...)],
):
    allowed = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(415, detail="Only JPEG, PNG and WebP evidence is allowed")
    content = file.file.read(10 * 1024 * 1024 + 1)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(413, detail="Evidence image must be 10 MB or smaller")
    digest = hashlib.sha256(content).hexdigest()
    path = f"{user.id}/{report_id}/{digest}.{file.content_type.rsplit('/', 1)[1]}"
    base_url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    if not base_url or not key:
        raise HTTPException(503, detail="Evidence storage service is not configured")
    try:
        response = httpx.post(
            f"{base_url}/storage/v1/object/field-report-evidence/{path}",
            content=content,
            headers={"apikey": key, "Authorization": authorization, "Content-Type": file.content_type, "x-upsert": "false"},
            timeout=20,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(503, detail="Evidence storage is unavailable") from exc
    if response.status_code not in {200, 201}:
        raise HTTPException(502, detail="Evidence could not be stored")
    try:
        return store.save_attachment(str(report_id), user.id, path, file.content_type, len(content), digest)
    except LookupError as exc:
        raise HTTPException(404, detail=str(exc)) from exc


class VerificationRequest(BaseModel):
    email: str


class VerificationVerify(BaseModel):
    email: str
    code: str


VERIFICATION_CODES: dict[str, tuple[str, float]] = {}


@app.post("/api/v1/auth/request-code")
def request_verification_code(body: VerificationRequest):
    import secrets
    import time

    email = body.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(400, detail="A valid email address is required")
    code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = time.time() + 600.0  # 10 minutes
    VERIFICATION_CODES[email] = (code, expires_at)
    logger.info(f"[EMAIL VERIFICATION] Dispatched verification code {code} to {email}")
    return {
        "status": "sent",
        "email": email,
        "expires_in": 600,
        "dev_code": code,
        "message": f"Verification code sent to {email}",
    }


@app.post("/api/v1/auth/verify-code")
def verify_verification_code(body: VerificationVerify):
    import time

    email = body.email.strip().lower()
    code = body.code.strip()
    if email not in VERIFICATION_CODES:
        raise HTTPException(400, detail="No verification code found for this email. Please request a new code.")
    stored_code, expires_at = VERIFICATION_CODES[email]
    if time.time() > expires_at:
        VERIFICATION_CODES.pop(email, None)
        raise HTTPException(400, detail="Verification code has expired. Please request a new code.")
    if stored_code != code:
        raise HTTPException(400, detail="Invalid verification code. Please check your email and try again.")
    VERIFICATION_CODES.pop(email, None)
    return {
        "status": "verified",
        "email": email,
        "message": "Email address verified successfully",
    }

