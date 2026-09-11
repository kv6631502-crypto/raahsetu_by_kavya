"""Custom A*: directed parallel edges, admissible heuristic, request-scoped costs."""

import hashlib
import heapq
import itertools
import json
import math
import time
from dataclasses import dataclass

from .ml_prediction import predict_disruption
from .models import Dataset, Edge, Endpoint, RouteRequest


def distance_m(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    lat1, lat2 = math.radians(lat1), math.radians(lat2)
    dlat, dlon = lat2 - lat1, math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371009 * 2 * math.asin(math.sqrt(min(1, max(0, a))))


VEHICLES = {
    "heavy": {
        "label": "Heavy logistics",
        "height_m": 4.0,
        "weight_t": 18.0,
        "width_m": 2.5,
        "speed_kph": 60,
    },
    "emergency": {
        "label": "Emergency van",
        "height_m": 2.8,
        "weight_t": 3.5,
        "width_m": 2.1,
        "speed_kph": 70,
    },
    "light": {
        "label": "Light delivery",
        "height_m": 2.2,
        "weight_t": 2.5,
        "width_m": 1.9,
        "speed_kph": 70,
    },
}


@dataclass(frozen=True)
class SearchResult:
    edge_ids: list[str]
    cost: float
    expanded: int
    compute_ms: float


class RoadGraph:
    def __init__(self, dataset: Dataset):
        self.dataset = dataset
        self.nodes = {n.id: n for n in dataset.nodes}
        self.edges = {e.id: e for e in dataset.edges}
        self.adjacency: dict[str, list[Edge]] = {n: [] for n in self.nodes}
        self.spatial_index: dict[tuple[int, int], list[str]] = {}
        for node in dataset.nodes:
            key = (math.floor(node.lon / 0.05), math.floor(node.lat / 0.05))
            self.spatial_index.setdefault(key, []).append(node.id)
        lower_bounds = []
        for edge in dataset.edges:
            self.adjacency[edge.u].append(edge)
            u, v = self.nodes[edge.u], self.nodes[edge.v]
            span = distance_m(u.lon, u.lat, v.lon, v.lat)
            if span > 0:
                lower_bounds.append((edge.length_m / (edge.speed_kph / 3.6)) / span)
        # Each base edge cost >= this factor * endpoint geodesic distance.
        # Triangle inequality gives a consistent heuristic even if imported lengths are rounded.
        self.seconds_per_metre = min(lower_bounds, default=0) * (1 - 1e-12)
        # A dataset version identifies graph content, independent of JSON/DB row order.
        canonical = dataset.model_dump(mode="json")
        canonical["nodes"] = sorted(canonical["nodes"], key=lambda node: node["id"])
        canonical["edges"] = sorted(canonical["edges"], key=lambda edge: edge["id"])
        canonical_json = json.dumps(
            self._normalise_version_values(canonical), sort_keys=True, separators=(",", ":")
        )
        self.version = hashlib.sha256(canonical_json.encode()).hexdigest()[:12]

    @staticmethod
    def _normalise_version_values(value):
        """Remove harmless floating-point serialization noise from graph versions."""
        if isinstance(value, float):
            return round(value, 9)
        if isinstance(value, list):
            return [RoadGraph._normalise_version_values(item) for item in value]
        if isinstance(value, dict):
            return {
                key: RoadGraph._normalise_version_values(item) for key, item in value.items()
            }
        return value

    def resolve(self, endpoint: Endpoint) -> tuple[str, float]:
        if endpoint.node_id is not None:
            if endpoint.node_id not in self.nodes:
                raise ValueError(f"Unknown node: {endpoint.node_id}")
            return endpoint.node_id, 0
        assert endpoint.lon is not None and endpoint.lat is not None
        key = (math.floor(endpoint.lon / 0.05), math.floor(endpoint.lat / 0.05))
        nearby_ids = [
            node_id
            for dx in (-1, 0, 1)
            for dy in (-1, 0, 1)
            for node_id in self.spatial_index.get((key[0] + dx, key[1] + dy), [])
        ]
        pool = (
            (self.nodes[node_id] for node_id in nearby_ids) if nearby_ids else self.nodes.values()
        )
        candidates = (
            (distance_m(endpoint.lon, endpoint.lat, node.lon, node.lat), node.id) for node in pool
        )
        distance, node_id = min(candidates)
        if distance > 2000:
            raise ValueError("Location is more than 2 km from the loaded network")
        return node_id, round(distance, 1)

    @staticmethod
    def risk(edge: Edge, weather: str) -> float:
        weather_score = edge.weather_score
        if weather == "heavy_rain":
            weather_score = min(1, weather_score + 0.8 * edge.flood_susceptibility)
        return 0.5 * edge.accident_score + 0.3 * edge.surface_score + 0.2 * weather_score

    @staticmethod
    def missing_restrictions(edge: Edge, vehicle: str) -> bool:
        return any(v is None for v in (edge.max_height_m, edge.max_weight_t, edge.max_width_m)) or (
            vehicle == "heavy" and edge.hgv_allowed is None
        )

    @staticmethod
    def allowed(edge: Edge, request: RouteRequest, closed: set[str]) -> bool:
        if edge.closed or edge.id in closed:
            return False
        vehicle = VEHICLES[request.vehicle]
        if request.vehicle == "heavy" and edge.hgv_allowed is False:
            return False
        for limit, size in (
            (edge.max_height_m, vehicle["height_m"]),
            (edge.max_weight_t, vehicle["weight_t"]),
            (edge.max_width_m, vehicle["width_m"]),
        ):
            if limit is not None and size > limit:
                return False
        return not (
            request.strict_vehicle and RoadGraph.missing_restrictions(edge, request.vehicle)
        )

    def travel_seconds(self, edge: Edge, request: RouteRequest) -> float:
        speed = min(edge.speed_kph, VEHICLES[request.vehicle]["speed_kph"])
        weather_delay = 1 + (
            0.3 * edge.flood_susceptibility if request.weather == "heavy_rain" else 0
        )
        return edge.length_m / (speed / 3.6) * weather_delay

    def edge_cost(self, edge: Edge, request: RouteRequest, mode: str) -> float:
        seconds = self.travel_seconds(edge, request)
        if mode == "fastest":
            return seconds
        return seconds * (1 + 4 * request.risk_aversion * self.risk(edge, request.weather))

    def search(
        self,
        source: str,
        target: str,
        request: RouteRequest,
        mode: str = "risk_aware",
        use_heuristic: bool = True,
    ) -> SearchResult | None:
        if source not in self.nodes or target not in self.nodes:
            raise ValueError("Unknown route endpoint")
        start = time.perf_counter()
        target_node = self.nodes[target]
        closed = set(request.closed_edge_ids)

        def heuristic(node_id: str) -> float:
            node = self.nodes[node_id]
            return (
                distance_m(node.lon, node.lat, target_node.lon, target_node.lat)
                * self.seconds_per_metre
                if use_heuristic
                else 0
            )

        counter = itertools.count()
        queue = [(heuristic(source), next(counter), 0.0, source)]
        best = {source: 0.0}
        parent: dict[str, str] = {}
        expanded = 0
        while queue:
            _, _, cost, current = heapq.heappop(queue)
            if cost > best.get(current, math.inf):
                continue
            expanded += 1
            if current == target:
                path = []
                while current != source:
                    edge_id = parent[current]
                    path.append(edge_id)
                    current = self.edges[edge_id].u
                return SearchResult(
                    path[::-1], cost, expanded, (time.perf_counter() - start) * 1000
                )
            for edge in self.adjacency[current]:
                if not self.allowed(edge, request, closed):
                    continue
                candidate = cost + self.edge_cost(edge, request, mode)
                if candidate < best.get(edge.v, math.inf):
                    best[edge.v] = candidate
                    parent[edge.v] = edge.id
                    heapq.heappush(
                        queue, (candidate + heuristic(edge.v), next(counter), candidate, edge.v)
                    )
        return None

    def describe(
        self, result: SearchResult | None, mode: str, request: RouteRequest, source: str
    ) -> dict:
        if result is None:
            return {
                "id": mode,
                "status": "unreachable",
                "reason": "No feasible route under the current closures and vehicle constraints.",
            }
        edges = [self.edges[e] for e in result.edge_ids]
        coordinates = []
        for edge in edges:
            points = list(edge.geometry)
            u = self.nodes[edge.u]
            if distance_m(*points[-1], u.lon, u.lat) < distance_m(*points[0], u.lon, u.lat):
                points.reverse()
            coordinates.extend(points if not coordinates else points[1:])
        if not coordinates:
            node = self.nodes[source]
            coordinates = [(node.lon, node.lat), (node.lon, node.lat)]
        length = sum(e.length_m for e in edges)
        exposure = sum(e.length_m / 1000 * self.risk(e, request.weather) for e in edges)
        unknown = sum(self.missing_restrictions(e, request.vehicle) for e in edges)
        unknown_risk = sum(not e.risk_data_known for e in edges)
        high_risk = [e for e in edges if self.risk(e, request.weather) >= 0.45]
        return {
            "id": mode,
            "status": "available",
            "edge_ids": result.edge_ids,
            "geometry": {"type": "LineString", "coordinates": coordinates},
            "distance_km": round(length / 1000, 3),
            "duration_min": round(sum(self.travel_seconds(e, request) for e in edges) / 60, 2),
            "risk_exposure": round(exposure, 4),
            "mean_risk_score": round(exposure / (length / 1000), 3) if length else 0,
            "high_risk_segments": len(high_risk),
            "unknown_restriction_segments": unknown,
            "unknown_risk_segments": unknown_risk,
            "objective_cost": round(result.cost, 6),
            "expanded_nodes": result.expanded,
            "compute_ms": round(result.compute_ms, 3),
            "roads": list(dict.fromkeys(e.name for e in edges)),
            "warnings": (
                [f"Vehicle restrictions are incomplete on {unknown} directed segments."]
                if unknown
                else []
            )
            + (
                [
                    f"Risk data is missing on {unknown_risk} segments; zero penalty means unknown, not safe."
                ]
                if unknown_risk
                else []
            ),
        }

    def compare(self, request: RouteRequest) -> dict:
        unknown = set(request.closed_edge_ids) - self.edges.keys()
        if unknown:
            raise ValueError("Unknown closed edge IDs: " + ", ".join(sorted(unknown)[:5]))
        source, source_snap = self.resolve(request.origin)
        target, target_snap = self.resolve(request.destination)
        routes = [
            self.describe(self.search(source, target, request, mode), mode, request, source)
            for mode in ("fastest", "risk_aware")
        ]
        baseline, recommended = routes
        comparison = None
        explanations = []
        if all(r["status"] == "available" for r in routes):
            reduction = baseline["risk_exposure"] - recommended["risk_exposure"]
            comparison = {
                "extra_minutes": round(recommended["duration_min"] - baseline["duration_min"], 2),
                "exposure_reduction_pct": round(100 * reduction / baseline["risk_exposure"], 1)
                if baseline["risk_exposure"]
                else None,
                "same_route": baseline["edge_ids"] == recommended["edge_ids"],
            }
            avoided = set(baseline["edge_ids"]) - set(recommended["edge_ids"])
            for edge_id in sorted(
                avoided, key=lambda x: self.risk(self.edges[x], request.weather), reverse=True
            ):
                edge = self.edges[edge_id]
                if self.risk(edge, request.weather) >= 0.3:
                    drivers = {
                        "accident history": edge.accident_score,
                        "road condition": edge.surface_score,
                        "weather exposure": edge.weather_score
                        + (edge.flood_susceptibility if request.weather == "heavy_rain" else 0),
                    }
                    pred = predict_disruption(
                        rainfall_mm_24h=80.0 if request.weather == "heavy_rain" else 15.0,
                        slope_deg=35.0 if any(k in edge.name.lower() for k in ("ghat", "hill", "pass", "mountain", "gorge")) else 12.0,
                        historical_incidents=1 if edge.accident_score >= 0.4 else 0,
                        surface_score=edge.surface_score,
                    )
                    explanations.append(
                        {
                            "edge_id": edge.id,
                            "road": edge.name,
                            "reason": max(drivers, key=drivers.get),
                            "score": round(self.risk(edge, request.weather), 3),
                            "evidence": edge.evidence,
                            "ml_disruption_probability": pred.disruption_probability,
                            "ml_primary_factor": pred.primary_factors[0]["factor"] if pred.primary_factors else "Baseline",
                        }
                    )
        return {
            "dataset_id": self.dataset.id,
            "dataset_version": self.version,
            "routes": routes,
            "comparison": comparison,
            "explanations": explanations[:6],
            "snapped": {
                "origin": source,
                "destination": target,
                "origin_distance_m": source_snap,
                "destination_distance_m": target_snap,
            },
            "assumptions": [
                "Travel times are estimates; no live traffic feed.",
                "Risk exposure is an index in risk-km, not accident probability.",
                "Weather and request closures are scenario inputs.",
            ],
        }
